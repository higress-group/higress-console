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

import java.util.ArrayList;
import java.util.List;

import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRoute;
import com.alibaba.higress.sdk.service.strategy.route.HttpRouteStrategy;
import com.alibaba.higress.sdk.service.strategy.route.IngressRouteStrategy;
import com.alibaba.higress.sdk.service.strategy.route.RouteContext;
import com.alibaba.higress.sdk.service.strategy.route.RouteStrategy;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class RouteServiceImpl implements RouteService {

    private static final RoutePageQuery DEFAULT_QUERY = new RoutePageQuery();

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final WasmPluginInstanceService wasmPluginInstanceService;

    public RouteServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public PaginatedResult<Route> list(RoutePageQuery query) {
        if (query == null) {
            query = DEFAULT_QUERY;
        }

        List<V1Ingress> ingresses = listIngresses(query);
        List<Route> ingressListRoutes = ingresses.stream()
                .map(kubernetesModelConverter::ingress2Route)
                .toList();

        List<V1HTTPRoute> httpRoutes = listHttpRoutes(query);
        List<Route> httpListRoutes = httpRoutes.stream()
                .map(kubernetesModelConverter::httpRoute2Route)
                .toList();

        List<Route> combinedRoutes = new ArrayList<>();
        if (!CollectionUtils.isEmpty(ingressListRoutes)) {
            combinedRoutes.addAll(ingressListRoutes);
        }
        if (!CollectionUtils.isEmpty(httpRoutes)) {
            combinedRoutes.addAll(httpListRoutes);
        }

        return PaginatedResult.createFromFullList(combinedRoutes, query);
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

    private List<V1HTTPRoute> listHttpRoutes(RoutePageQuery query) {
        if (query == null) {
            query = DEFAULT_QUERY;
        }

        if (StringUtils.isNotEmpty(query.getDomainName())) {
            if (Boolean.TRUE.equals(query.getAll())) {
                throw new ValidationException(
                        "The query parameter 'all' is not supported when querying by domain.");
            }
            return kubernetesClientService.listHttpRouteByDomain(query.getDomainName());
        } else {
            return kubernetesClientService.listHttpRoute();
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
        if (ingress != null) {
            return kubernetesModelConverter.ingress2Route(ingress);
        }
        V1HTTPRoute httpRoute;
        try {
            httpRoute = kubernetesClientService.readHttpRoute(routeName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the HttpRoute with name: " + routeName, e);
        }
        if (httpRoute != null) {
            return kubernetesModelConverter.httpRoute2Route(httpRoute);
        }
        return null;
    }

    @Override
    public Route add(Route route) {
        RouteStrategy strategy = getStrategy(route);
        return new RouteContext(strategy).add(route);
    }

    @Override
    public Route update(Route route) {
        String name = route.getName();
        if (StringUtils.isEmpty(name)) {
            throw new IllegalArgumentException("Route name must not be null");
        }
        RouteStrategy strategy = getStrategy(route);
        return new RouteContext(strategy).update(route);
    }

    @Override
    public void delete(String name) {
        Boolean isIngress = Boolean.TRUE;
        try {
            V1Ingress ingress = kubernetesClientService.readIngress(name);
            if (ingress == null) {
                isIngress = Boolean.FALSE;
            }
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading ingress"+" with name: " + name, e);
        }

        RouteStrategy strategy = isIngress ?
                new IngressRouteStrategy(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService) :
                new HttpRouteStrategy(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService);
        new RouteContext(strategy).delete(name);
    }
    private RouteStrategy getStrategy(Route route) {
        return route.getIsIngressMode() ?
                new IngressRouteStrategy(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService) :
                new HttpRouteStrategy(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService);
    }
}
