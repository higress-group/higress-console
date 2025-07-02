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
import com.alibaba.higress.sdk.service.ai.LlmProviderService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerService;

/**
 * @author CH3CHO
 */
public interface HigressServiceProvider {

    static HigressServiceProvider create(HigressServiceConfig config) throws IOException {
        return new HigressServiceProviderImpl(config);
    }

    KubernetesClientService kubernetesClientService();

    KubernetesModelConverter kubernetesModelConverter();

    DomainService domainService();

    RouteService routeService();

    ServiceService serviceService();

    ServiceSourceService serviceSourceService();

    TlsCertificateService tlsCertificateService();

    WasmPluginService wasmPluginService();

    WasmPluginInstanceService wasmPluginInstanceService();

    ConsumerService consumerService();

    AiRouteService aiRouteService();

    LlmProviderService llmProviderService();

    McpServerService mcpServerService();

}
