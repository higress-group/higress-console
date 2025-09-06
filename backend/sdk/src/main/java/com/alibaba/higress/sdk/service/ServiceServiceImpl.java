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
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Service;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;
import com.alibaba.higress.sdk.service.kubernetes.model.IstioEndpoint;
import com.alibaba.higress.sdk.service.kubernetes.model.IstioEndpointShard;
import com.alibaba.higress.sdk.service.kubernetes.model.Port;
import com.alibaba.higress.sdk.service.kubernetes.model.RegistryzService;
import com.alibaba.higress.sdk.service.kubernetes.model.RegistryzServiceAttributes;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import lombok.extern.slf4j.Slf4j;

@Slf4j
class ServiceServiceImpl implements ServiceService {

    private static final boolean SHOW_MCP_SERVICE_PORTS = true;

    private final KubernetesClientService kubernetesClientService;

    public ServiceServiceImpl(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public PaginatedResult<Service> list(CommonPageQuery query) {
        try {
            List<RegistryzService> registryzServices = kubernetesClientService.gatewayServiceList();
            if (!CollectionUtils.isNotEmpty(registryzServices)) {
                return PaginatedResult.createFromFullList(Collections.emptyList(), query);
            }

            Map<String, Map<String, IstioEndpointShard>> serviceEndpoint =
                kubernetesClientService.gatewayServiceEndpoint();

            Map<String, String> mcpBridgeDomain = getMcpBridgeDnsDomain();

            List<Service> services = new ArrayList<>(registryzServices.size());
            for (RegistryzService registryzService : registryzServices) {
                String namespace = registryzService.getAttributes().getNamespace();

                if (kubernetesClientService.isNamespaceProtected(namespace)) {
                    continue;
                }

                String name = registryzService.getHostname();

                List<String> endpoints = getServiceEndpoints(serviceEndpoint, namespace, name);
                if (CollectionUtils.isEmpty(endpoints)) {
                    endpoints = completeMcpDnsEndpoints(registryzService, mcpBridgeDomain);
                }
                if (CollectionUtils.isEmpty(registryzService.getPorts())
                    || !SHOW_MCP_SERVICE_PORTS && CommonKey.MCP_NAMESPACE.equals(namespace)) {
                    Service service = new Service();
                    service.setName(name);
                    service.setNamespace(namespace);
                    service.setEndpoints(endpoints);
                    services.add(service);
                } else {
                    Set<Integer> ports = new HashSet<>(registryzService.getPorts().size());
                    for (Port port : registryzService.getPorts()) {
                        if (!ports.add(port.getPort())) {
                            log.warn("Duplicate port found in service {}/{}: {}", namespace, name, port.getPort());
                            continue;
                        }
                        Service service = new Service();
                        service.setName(name);
                        service.setPort(port.getPort());
                        service.setNamespace(namespace);
                        service.setEndpoints(endpoints);
                        service.setProtocol(port.getProtocol());
                        services.add(service);
                    }
                }
            }

            services.sort(Comparator.comparing(Service::getNamespace).thenComparing(Service::getName)
                .thenComparing(Service::getPort));

            return PaginatedResult.createFromFullList(services, query);
        } catch (Exception e) {
            throw new BusinessException("Error occurs when listing services.", e);
        }
    }

    private Map<String/*serviceName*/, String/*domain*/> getMcpBridgeDnsDomain() {
        List<V1McpBridge> v1McpBridges = kubernetesClientService.listMcpBridge();
        if (CollectionUtils.isEmpty(v1McpBridges)) {
            return Maps.newHashMap();
        }

        return v1McpBridges.stream().map(i -> {
            if (Objects.isNull(i) || Objects.isNull(i.getSpec())) {
                return null;
            }
            return i.getSpec().getRegistries();
        }).filter(CollectionUtils::isNotEmpty).flatMap(Collection::stream)
            .filter(i -> StringUtils.endsWithIgnoreCase(i.getType(), V1McpBridge.REGISTRY_TYPE_DNS))
            .collect(Collectors.toMap(i -> StringUtils.join(i.getName(), Separators.DOT, i.getType()),
                V1RegistryConfig::getDomain, (k1, k2) -> k1));
    }

    private List<String> completeMcpDnsEndpoints(RegistryzService registryzService,
        Map<String, String> mcpBridgeDomain) {
        RegistryzServiceAttributes attributes = registryzService.getAttributes();
        if (Objects.isNull(attributes)) {
            return null;
        }
        String namespace = attributes.getNamespace();
        if (StringUtils.equalsIgnoreCase(CommonKey.MCP_NAMESPACE, namespace)
            && StringUtils.endsWith(attributes.getName(), Separators.DOT + V1McpBridge.REGISTRY_TYPE_DNS)) {
            String domain = mcpBridgeDomain.get(attributes.getName());
            if (StringUtils.isNotBlank(domain)) {
                return Lists.newArrayList(domain);
            }
        }
        return null;
    }

    private static List<String> getServiceEndpoints(Map<String, Map<String, IstioEndpointShard>> serviceEndpoint,
        String serviceNamespace, String serviceName) {
        if (serviceEndpoint == null) {
            return null;
        }

        Map<String, IstioEndpointShard> namespace2Endpoints = serviceEndpoint.get(serviceName);
        if (namespace2Endpoints == null) {
            return null;
        }

        IstioEndpointShard endpointShard = namespace2Endpoints.get(serviceNamespace);
        if (endpointShard == null || endpointShard.getShards() == null) {
            return null;
        }

        List<String> endpoints = new ArrayList<>();
        Map<String, List<IstioEndpoint>> shards = endpointShard.getShards();
        shards.keySet().forEach(s -> {
            List<IstioEndpoint> istioEndpoints = shards.get(s);
            endpoints
                .addAll(istioEndpoints.stream().map(IstioEndpoint::getAddress).distinct().collect(Collectors.toList()));
        });
        return endpoints;
    }
}
