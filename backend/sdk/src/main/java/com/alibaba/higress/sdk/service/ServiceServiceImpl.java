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
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Service;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.model.IstioEndpoint;
import com.alibaba.higress.sdk.service.kubernetes.model.IstioEndpointShard;
import com.alibaba.higress.sdk.service.kubernetes.model.Port;
import com.alibaba.higress.sdk.service.kubernetes.model.RegistryzService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Resource
    private KubernetesClientService kubernetesClientService;

    @Override
    public PaginatedResult<Service> list(CommonPageQuery query) {
        try {
            List<RegistryzService> registryzServices = kubernetesClientService.gatewayServiceList();
            if (!CollectionUtils.isNotEmpty(registryzServices)) {
                return PaginatedResult.createFromFullList(Collections.emptyList(), query);
            }

            Map<String, Map<String, IstioEndpointShard>> serviceEndpoint =
                kubernetesClientService.gatewayServiceEndpoint();
            List<Service> services = new ArrayList<>(registryzServices.size());
            for (RegistryzService registryzService : registryzServices) {
                String namespace = registryzService.getAttributes().getNamespace();

                if (kubernetesClientService.isNamespaceProtected(namespace)) {
                    continue;
                }

                String name = registryzService.getHostname();

                List<String> endpoints = getServiceEndpoints(serviceEndpoint, namespace, name);
                if (CommonKey.MCP_NAMESPACE.equals(namespace) || CollectionUtils.isEmpty(registryzService.getPorts())) {
                    // We don't care about the port number of services got from McpBridge.
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
                        services.add(service);
                    }
                }
            }

            services.sort(Comparator.comparing(Service::getNamespace).thenComparing(Service::getName).thenComparing(Service::getPort));

            return PaginatedResult.createFromFullList(services, query);
        } catch (Exception e) {
            throw new BusinessException("Error occurs when listing services.", e);
        }
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
            endpoints.addAll(istioEndpoints.stream().map(IstioEndpoint::getAddress).distinct().toList());
        });
        return endpoints;
    }
}
