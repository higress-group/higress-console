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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.alibaba.higress.sdk.service.strategy.domain.DomainContext;
import com.alibaba.higress.sdk.service.strategy.domain.DomainStrategy;
import com.alibaba.higress.sdk.service.strategy.domain.GatewayDomainStrategy;
import com.alibaba.higress.sdk.service.strategy.domain.IngressDomainStrategy;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class DomainServiceImpl implements DomainService {

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final RouteService routeService;
    private final WasmPluginInstanceService wasmPluginInstanceService;

    public DomainServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, RouteService routeService,
        WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.routeService = routeService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public Domain add(Domain domain) {
        DomainStrategy strategy = getStrategy(domain);
        return new DomainContext(strategy).add(domain);
    }

    @Override
    public PaginatedResult<Domain> list(CommonPageQuery query) {
        List<V1ConfigMap> configMaps;
        try {
            configMaps = kubernetesClientService.listConfigMap();
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing ConfigMap.", e);
        }
        List<V1ConfigMap> domainConfigMaps = configMaps.stream()
            .filter(cm -> StringUtils.startsWith(KubernetesUtil.getObjectName(cm), CommonKey.DOMAIN_PREFIX)).toList();
        return PaginatedResult.createFromFullList(domainConfigMaps, query, kubernetesModelConverter::configMap2Domain);
    }

    @Override
    public Domain query(String domainName) {
        V1ConfigMap configMap;
        String normalizedDomainName = kubernetesModelConverter.domainName2ConfigMapName(domainName);
        try {
            configMap = kubernetesClientService.readConfigMap(normalizedDomainName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the ConfigMap with name: " + normalizedDomainName,
                e);
        }
        return Optional.ofNullable(configMap).map(kubernetesModelConverter::configMap2Domain).orElse(null);
    }

    @Override
    public void delete(String domainName) {
        Domain domain = query(domainName);
        RoutePageQuery query = new RoutePageQuery();
        query.setDomainName(domainName);
        PaginatedResult<Route> routes = routeService.list(query);
        if (CollectionUtils.isNotEmpty(routes.getData())) {
            throw new IllegalArgumentException("The domain has routes. Please delete them first.");
        }
        DomainStrategy strategy = getStrategy(domain);
        new DomainContext(strategy).delete(domainName);
        wasmPluginInstanceService.deleteAll(WasmPluginInstanceScope.DOMAIN, domainName);
    }

    @Override
    public Domain put(Domain domain) {
        List<Route> routes;
        if (HigressConstants.DEFAULT_DOMAIN.equals(domain.getName())) {
            PaginatedResult<Route> routeQueryResult = routeService.list(null);
            routes = routeQueryResult.getData().stream().filter(r -> CollectionUtils.isEmpty(r.getDomains()))
                    .collect(Collectors.toList());
        } else {
            RoutePageQuery query = new RoutePageQuery();
            query.setDomainName(domain.getName());
            PaginatedResult<Route> routeQueryResult = routeService.list(query);
            routes = routeQueryResult.getData();
        }
        checkUpdatedDomainValid(domain, routes);

        DomainStrategy strategy = getStrategy(domain);
        Domain newDomain = new DomainContext(strategy).put(domain);


        // TODO: Switch to the new logic after 2025/03/31
        // String domainName = domain.getName();
        // if (HigressConstants.DEFAULT_DOMAIN.equals(domainName)) {
        // domainName = HigressConstants.DEFAULT_DOMAIN;
        // }
        // RoutePageQuery query = new RoutePageQuery();
        // query.setDomainName(domainName);
        // PaginatedResult<Route> routeQueryResult = routeService.list(query);
        // routes = routeQueryResult.getData();

        if (CollectionUtils.isNotEmpty(routes)) {
            routes.forEach(routeService::update);
        }

        return newDomain;
    }

    public void checkUpdatedDomainValid(Domain domain, List<Route> routes) {
        if(domain.getPortAndCertMap() == null) {
            throw new BusinessException("Port and certificate map is missing for the domain.");
        }
        boolean port80EnabledForHttp = StringUtils.EMPTY.equals(domain.getPortAndCertMap().get(80));
        if (domain.getIsIngressMode() || port80EnabledForHttp) {
            return;
        }
        for (Route route: routes) {
            if (route.getIsIngressMode()) {
                throw new BusinessException("The domain has ingress bindings and must keep port 80 open for HTTP.");
            }
        }
    }

    @Override
    public Domain addOrUpdate(Domain domain){
        if (domain == null) {
            throw new BusinessException("Domain cannot be null");
        }
        Domain existingDomain = query(domain.getName());
        if (existingDomain == null) {
            return add(domain);
        } else {
            domain.setVersion(existingDomain.getVersion());
            return put(domain);
        }
    }

    private DomainStrategy getStrategy(Domain domain) {
        if (domain.getIsIngressMode()) {
            return new IngressDomainStrategy(kubernetesClientService, kubernetesModelConverter);
        } else {
            return new GatewayDomainStrategy(kubernetesClientService, kubernetesModelConverter);
        }
    }
}