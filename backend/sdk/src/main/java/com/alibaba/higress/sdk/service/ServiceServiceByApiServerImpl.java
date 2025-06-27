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

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Service;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import io.kubernetes.client.openapi.models.V1EndpointAddress;
import io.kubernetes.client.openapi.models.V1Endpoints;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Service;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

/**
 * @author lvshui
 */
@Slf4j
public class ServiceServiceByApiServerImpl implements ServiceService {
    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;

    public ServiceServiceByApiServerImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @SneakyThrows
    @Override
    public PaginatedResult<Service> list(CommonPageQuery query) {
        List<Service> resultList = Lists.newArrayList();

        List<V1Service> v1Services = kubernetesClientService.listAllServiceList();
        List<V1Endpoints> v1Endpoints = kubernetesClientService.listAllEndPointsList();
        final Map<String, V1Endpoints> v1EndpointsMap = Maps.newHashMap();
        if (CollectionUtils.isNotEmpty(v1Endpoints)) {
            Map<String, V1Endpoints> v1EndpointsMap1 = v1Endpoints.stream().collect(
                Collectors.toMap(i -> buildMetaUniqueKey(i.getMetadata()), Function.identity(), (k1, k2) -> k1));
            v1EndpointsMap.putAll(v1EndpointsMap1);
        }

        if (CollectionUtils.isNotEmpty(v1Services)) {
            for (V1Service v1Service : v1Services) {
                try {
                    Service service = kubernetesModelConverter.v1Service2Service(v1Service);
                    String metaUniqueKey = buildMetaUniqueKey(v1Service.getMetadata());
                    V1Endpoints v1Endpoints1 = null;
                    if (v1EndpointsMap.containsKey(metaUniqueKey)) {
                        v1Endpoints1 = v1EndpointsMap.get(metaUniqueKey);
                    }
                    if (Objects.nonNull(v1Endpoints1) && CollectionUtils.isNotEmpty(v1Endpoints1.getSubsets())) {
                        try {
                            List<String> ipList =
                                v1Endpoints1.getSubsets().stream().filter(Objects::nonNull).map(v1Subset -> {
                                    if (v1Subset.getAddresses() != null) {
                                        return v1Subset.getAddresses().stream().map(V1EndpointAddress::getIp)
                                            .collect(Collectors.toList());
                                    }
                                    return null;
                                }).filter(CollectionUtils::isNotEmpty).flatMap(List::stream)
                                    .collect(Collectors.toList());
                            service.setEndpoints(ipList);
                        } catch (Exception e) {
                            log.error("deal service endpoints appear error. ", e);
                        }
                    }
                    resultList.add(service);
                } catch (Exception e) {
                    log.error("deal service appear error. ", e);
                }
            }
        }

        List<V1McpBridge> v1McpBridges = kubernetesClientService.listMcpBridge();
        if (CollectionUtils.isNotEmpty(v1McpBridges)) {
            List<Service> externalServiceList = v1McpBridges.stream().map(i -> {
                List<V1RegistryConfig> registries = i.getSpec().getRegistries();
                if (CollectionUtils.isEmpty(registries)) {
                    return null;
                }
                return registries.stream().map(r -> {
                    Service service = new Service();
                    service.setNamespace(CommonKey.MCP_NAMESPACE);
                    service.setName(StringUtils.join(r.getName(), Separators.DOT, r.getType()));
                    service.setProtocol(r.getProtocol());
                    String[] endPoints = new String[] {};
                    if (StringUtils.isNotBlank(r.getDomain())) {
                        endPoints = StringUtils.split(r.getDomain(), V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR);
                    }
                    service.setEndpoints(Arrays.asList(endPoints));
                    switch (r.getType()) {
                        case V1McpBridge.REGISTRY_TYPE_DNS:
                            service.setPort(r.getPort());
                            return service;
                        case V1McpBridge.REGISTRY_TYPE_STATIC:
                            service.setPort(V1McpBridge.STATIC_PORT);
                            return service;
                        default:
                            return null;
                    }
                }).filter(Objects::nonNull).collect(Collectors.toList());
            }).filter(CollectionUtils::isNotEmpty).flatMap(List::stream).collect(Collectors.toList());

            if (CollectionUtils.isNotEmpty(externalServiceList)) {
                resultList.addAll(externalServiceList);
            }

        }
        resultList.sort(Comparator.comparing(Service::getNamespace).thenComparing(Service::getName)
            .thenComparing(Service::getPort));

        return PaginatedResult.createFromFullList(resultList, query);
    }

    private String buildMetaUniqueKey(V1ObjectMeta metadata) {
        return StringUtils.join(metadata.getNamespace(), ".", metadata.getName());
    }
}
