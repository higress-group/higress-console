/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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

import java.io.IOException;

import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.service.ai.AiRouteService;
import com.alibaba.higress.sdk.service.ai.AiRouteServiceImpl;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;
import com.alibaba.higress.sdk.service.ai.LlmProviderServiceImpl;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.consumer.ConsumerServiceImpl;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import org.apache.commons.lang3.BooleanUtils;

/**
 * @author CH3CHO
 */
class HigressServiceProviderImpl implements HigressServiceProvider {

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final DomainService domainService;
    private final RouteService routeService;
    private final ServiceService serviceService;
    private final ServiceSourceService serviceSourceService;
    private final TlsCertificateService tlsCertificateService;
    private final WasmPluginService wasmPluginService;
    private final WasmPluginInstanceService wasmPluginInstanceService;
    private final ConsumerService consumerService;
    private final AiRouteService aiRouteService;
    private final LlmProviderService llmProviderService;

    HigressServiceProviderImpl(HigressServiceConfig config) throws IOException {
        kubernetesClientService = new KubernetesClientService(config);
        kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);
        if (BooleanUtils.isTrue(config.getDependControllerApi())) {
            serviceService = new ServiceServiceImpl(kubernetesClientService);
        } else {
            serviceService = new ServiceServiceByApiServerImpl(kubernetesClientService, kubernetesModelConverter);
        }
        serviceSourceService = new ServiceSourceServiceImpl(kubernetesClientService, kubernetesModelConverter);
        tlsCertificateService = new TlsCertificateServiceImpl(kubernetesClientService, kubernetesModelConverter);
        wasmPluginService = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter);
        wasmPluginInstanceService =
            new WasmPluginInstanceServiceImpl(wasmPluginService, kubernetesClientService, kubernetesModelConverter);
        consumerService = new ConsumerServiceImpl(wasmPluginInstanceService);
        routeService = new RouteServiceImpl(kubernetesClientService, kubernetesModelConverter,
            wasmPluginInstanceService, consumerService);
        domainService = new DomainServiceImpl(kubernetesClientService, kubernetesModelConverter, routeService,
            wasmPluginInstanceService);
        llmProviderService = new LlmProviderServiceImpl(serviceSourceService, wasmPluginInstanceService);
        aiRouteService = new AiRouteServiceImpl(kubernetesModelConverter, kubernetesClientService, routeService,
            llmProviderService, wasmPluginInstanceService);
    }

    @Override
    public KubernetesClientService kubernetesClientService() {
        return kubernetesClientService;
    }

    @Override
    public KubernetesModelConverter kubernetesModelConverter() {
        return kubernetesModelConverter;
    }

    @Override
    public DomainService domainService() {
        return domainService;
    }

    @Override
    public RouteService routeService() {
        return routeService;
    }

    @Override
    public ServiceService serviceService() {
        return serviceService;
    }

    @Override
    public ServiceSourceService serviceSourceService() {
        return serviceSourceService;
    }

    @Override
    public TlsCertificateService tlsCertificateService() {
        return tlsCertificateService;
    }

    @Override
    public WasmPluginService wasmPluginService() {
        return wasmPluginService;
    }

    @Override
    public WasmPluginInstanceService wasmPluginInstanceService() {
        return wasmPluginInstanceService;
    }

    @Override
    public ConsumerService consumerService() {
        return consumerService;
    }

    @Override
    public AiRouteService aiRouteService() {
        return aiRouteService;
    }

    @Override
    public LlmProviderService llmProviderService() {
        return llmProviderService;
    }
}
