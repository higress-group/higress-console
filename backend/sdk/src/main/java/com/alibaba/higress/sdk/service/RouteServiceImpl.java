/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.sdk.service;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RouteAuthConfig;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.AllowList;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
class RouteServiceImpl implements RouteService {

    private static final RoutePageQuery DEFAULT_QUERY = new RoutePageQuery();

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final WasmPluginInstanceService wasmPluginInstanceService;
    private final ConsumerService consumerService;

    public RouteServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        ConsumerService consumerService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        this.consumerService = consumerService;
    }

    @Override
    public PaginatedResult<Route> list(RoutePageQuery query) {
        List<V1Ingress> ingresses = listIngresses(query);

        if (CollectionUtils.isEmpty(ingresses)) {
            return PaginatedResult.createFromFullList(Collections.emptyList(), query);
        }

        List<AllowList> allowLists = consumerService.listAllowLists();

        return PaginatedResult.createFromFullList(ingresses, query, i -> {
            String routeName = Objects.requireNonNull(i.getMetadata()).getName();
            AllowList allowList = allowLists.stream()
                .filter(a -> a.getTargets().size() == 1
                    && Objects.equals(routeName, a.getTargets().get(WasmPluginInstanceScope.ROUTE)))
                .findFirst().orElse(null);
            return this.ingress2Route(i, allowList);
        });
    }

    private List<V1Ingress> listIngresses(RoutePageQuery query) {
        try {
            if (query == null) {
                query = DEFAULT_QUERY;
            }

            if (StringUtils.isNotEmpty(query.getDomainName())) {
                if (Boolean.TRUE.equals(query.getAll())) {
                    throw new ValidationException(
                        "The query parameter 'all' is not supported when querying by domain.");
                }
                return kubernetesClientService.listIngressByDomain(query.getDomainName());
            }

            if (Boolean.TRUE.equals(query.getAll())) {
                return kubernetesClientService.listAllIngresses();
            } else {
                return kubernetesClientService.listIngress();
            }
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing Ingresses.", e);
        }
    }

    @Override
    public Route query(String routeName) {
        V1Ingress ingress;
        try {
            ingress = kubernetesClientService.readIngress(routeName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the Ingress with name: " + routeName, e);
        }
        if (ingress == null) {
            return null;
        }
        AllowList allowList = consumerService.getAllowList(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName));
        return this.ingress2Route(ingress, allowList);
    }

    @Override
    public Route add(Route route) {
        V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);
        V1Ingress newIngress;
        try {
            newIngress = kubernetesClientService.createIngress(ingress);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when updating the ingress generated by route with name: " + route.getName(), e);
        }
        writeAuthConfigResources(route.getName(), route.getAuthConfig());
        return kubernetesModelConverter.ingress2Route(newIngress);
    }

    @Override
    public Route update(Route route) {
        V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);

        V1Ingress updatedIngress;
        try {
            updatedIngress = kubernetesClientService.replaceIngress(ingress);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when updating the ingress generated by route with name: " + route.getName(), e);
        }
        writeAuthConfigResources(route.getName(), route.getAuthConfig());
        return kubernetesModelConverter.ingress2Route(updatedIngress);
    }

    @Override
    public void delete(String name) {
        try {
            kubernetesClientService.deleteIngress(name);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting ingress with name: " + name, e);
        }

        wasmPluginInstanceService.deleteAll(WasmPluginInstanceScope.ROUTE, name);
    }

    private void writeAuthConfigResources(String routeName, RouteAuthConfig authConfig) {
        List<String> allowedConsumers = authConfig != null && Boolean.TRUE.equals(authConfig.getEnabled())
            ? authConfig.getAllowedConsumers() : Lists.newArrayList();
        AllowList allowList = new AllowList(WasmPluginInstanceScope.ROUTE, routeName, allowedConsumers);
        consumerService.updateAllowList(allowList);
    }

    private Route ingress2Route(V1Ingress ingress, AllowList allowList) {
        Route route = kubernetesModelConverter.ingress2Route(ingress);
        RouteAuthConfig authConfig = new RouteAuthConfig();
        if (allowList == null) {
            authConfig.setEnabled(false);
        } else {
            authConfig.setEnabled(true);
            authConfig.setAllowedConsumers(allowList.getConsumerNames());
        }
        route.setAuthConfig(authConfig);
        return route;
    }
}
