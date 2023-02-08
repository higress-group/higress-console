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
package com.alibaba.higress.console.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Service;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpoint;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpointShard;
import com.alibaba.higress.console.controller.dto.istio.RegistryzService;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;

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
                Service service = new Service();
                services.add(service);

                String name = registryzService.getHostname();
                String namespace = registryzService.getAttributes().getNamespace();
                service.setName(name);
                service.setNamespace(namespace);

                if (serviceEndpoint == null) {
                    continue;
                }
                Map<String, IstioEndpointShard> namespace2Endpoints = serviceEndpoint.get(name);
                if (namespace2Endpoints == null) {
                    continue;
                }

                IstioEndpointShard endpointShard = namespace2Endpoints.get(namespace);
                if (endpointShard == null || endpointShard.getShards() == null) {
                    continue;
                }
                List<String> endpoints = new ArrayList<>();
                Map<String, List<IstioEndpoint>> shards = endpointShard.getShards();
                shards.keySet().forEach(s -> {
                    List<IstioEndpoint> istioEndpoints = shards.get(s);
                    endpoints.addAll(istioEndpoints.stream().map(IstioEndpoint::getAddress).distinct().toList());
                });
                service.setEndpoints(endpoints);
            }

            services.sort(Comparator.comparing(Service::getNamespace).thenComparing(Service::getName));

            return PaginatedResult.createFromFullList(services, query);
        } catch (Exception e) {
            throw new BusinessException("Error occurs when listing services.", e);
        }
    }
}
