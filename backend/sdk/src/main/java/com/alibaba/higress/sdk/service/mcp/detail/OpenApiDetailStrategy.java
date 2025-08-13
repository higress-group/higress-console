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

import static com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName.DEFAULT_MCP_PLUGIN;

import java.util.Objects;

import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

/**
 * @author lvshui
 */
public class OpenApiDetailStrategy extends AbstractMcpServerDetailStrategy {

    private final WasmPluginInstanceService wasmPluginInstanceService;

    public OpenApiDetailStrategy(KubernetesClientService kubernetesClientService, ConsumerService consumerService,
        WasmPluginInstanceService wasmPluginInstanceService, RouteService routeService) {
        super(kubernetesClientService, consumerService, routeService);
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public boolean support(McpServerTypeEnum type) {
        return McpServerTypeEnum.OPEN_API.equals(type);
    }

    @Override
    protected void completeInfo(Route route, McpServer result) {
        completeWasmPluginInfo(route.getName(), result);
    }

    private void completeWasmPluginInfo(String name, McpServer result) {
        WasmPluginInstance wasmPluginInstance =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.ROUTE, name, DEFAULT_MCP_PLUGIN);
        if (Objects.isNull(wasmPluginInstance)) {
            // No tools related content is configured, return directly
            return;
        }
        result.setRawConfigurations(wasmPluginInstance.getRawConfigurations());
    }
}
