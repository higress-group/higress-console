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
package com.alibaba.higress.sdk.service.mcp.detail;

import java.util.List;

import org.apache.commons.compress.utils.Lists;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

/**
 * @author lvshui
 */
public class McpServerDetailStrategyFactory {

    private final List<McpServerDetailStrategy> strategies = Lists.newArrayList();

    public McpServerDetailStrategyFactory(KubernetesClientService kubernetesClientService,
        WasmPluginInstanceService wasmPluginInstanceService, ConsumerService consumerService,
        RouteService routeService) {
        strategies.add(new OpenApiDetailStrategy(kubernetesClientService, consumerService, wasmPluginInstanceService,
            routeService));
        strategies.add(new DatabaseDetailStrategy(kubernetesClientService, consumerService, routeService));
        strategies.add(new DirectRoutingDetailStrategy(kubernetesClientService, consumerService, routeService));
    }

    public McpServerDetailStrategy getService(McpServerTypeEnum type) {
        for (McpServerDetailStrategy strategy : strategies) {
            if (strategy.support(type)) {
                return strategy;
            }
        }
        throw new BusinessException("No McpServerDetailStrategy implementation found to support mcp type: " + type);
    }
}
