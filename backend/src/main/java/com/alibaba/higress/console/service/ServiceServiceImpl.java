package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.Service;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpoint;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpointShard;
import com.alibaba.higress.console.controller.dto.istio.RegistryzService;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import io.kubernetes.client.openapi.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Resource
    private KubernetesClientService kubernetesClientService;

    @Override
    public List<Service> getAll() {

        List<Service> data = new ArrayList<>();

        try {
            List<RegistryzService> serviceList = kubernetesClientService.gatewayServiceList();
            if (CollectionUtils.isNotEmpty(serviceList)) {
                Map<String, Map<String, IstioEndpointShard>> serviceEndpoint = kubernetesClientService.gatewayServiceEndpoint();

                for (RegistryzService registryzService : serviceList) {
                    Service mock = new Service();
                    String name = registryzService.getHostname();
                    String namespace = registryzService.getAttributes().getNamespace();
                    mock.setName(name);
                    mock.setNamespace(namespace);

                    List<String> endpoints = new ArrayList<>();
                    if (serviceEndpoint != null) {
                        Map<String, IstioEndpointShard> namespace2Endpoints = serviceEndpoint.get(name);
                        if (namespace2Endpoints != null) {
                            IstioEndpointShard endpointShard = namespace2Endpoints.get(namespace);
                            if (endpointShard != null && endpointShard.getShards() != null) {
                                Map<String, List<IstioEndpoint>> shards = endpointShard.getShards();
                                Set<String> strings = shards.keySet();
                                strings.forEach(s -> {
                                    List<IstioEndpoint> istioEndpoints = shards.get(s);
                                    endpoints.addAll(istioEndpoints.stream().map(IstioEndpoint::getAddress).collect(Collectors.toList()));
                                });
                            }
                        }
                    }
                    mock.setEndpoints(endpoints);
                    data.add(mock);
                }
            }
        } catch (ApiException e) {
            log.error("getAll Service ApiException ", e);
        } catch (IOException e) {
            log.error("getAll Service IOException ", e);
        }
        return data;
    }

}
