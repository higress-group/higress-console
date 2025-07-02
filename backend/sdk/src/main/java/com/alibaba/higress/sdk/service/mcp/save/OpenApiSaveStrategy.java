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
package com.alibaba.higress.sdk.service.mcp.save;

import static com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName.DEFAULT_MCP_PLUGIN;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.extern.slf4j.Slf4j;

/**
 * open api mcp server
 *
 * @author HecarimV
 */
@Slf4j
public class OpenApiSaveStrategy extends AbstractMcpServerSaveStrategy {

    public OpenApiSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.OPEN_API.equals(mcpServer.getType());
    }

    @Override
    protected void saveMcpServerConfig(McpServer mcpInstance) {
        WasmPluginInstance wasmPluginInstanceRequest = buildWasmPluginInstanceRequest(mcpInstance);
        wasmPluginInstanceService.addOrUpdate(wasmPluginInstanceRequest);
    }

    private WasmPluginInstance buildWasmPluginInstanceRequest(McpServer mcpInstance) {
        WasmPluginInstance pluginInstance =
            WasmPluginInstance.builder().pluginName(DEFAULT_MCP_PLUGIN).internal(true).build();
        String routeName = McpServerHelper.mcpServerName2RouteName(mcpInstance.getName());
        pluginInstance.setTargets(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName));
        if (StringUtils.isNotBlank(mcpInstance.getRawConfigurations())) {
            pluginInstance.setRawConfigurations(mcpInstance.getRawConfigurations());
            pluginInstance.setEnabled(StringUtils.contains(mcpInstance.getRawConfigurations(), "tools:"));
        } else {
            Map<String, Object> serverMap = new HashMap<>();
            serverMap.put("name", mcpInstance.getName());
            serverMap.put("description", Optional.ofNullable(mcpInstance.getDescription()).orElse("Nothing"));
            Map<String, Object> rootMap = new HashMap<>();
            rootMap.put("server", serverMap);
            try {
                String yamlString = YAML.writeValueAsString(rootMap);
                pluginInstance.setRawConfigurations(yamlString);
                pluginInstance.setEnabled(false);
            } catch (JsonProcessingException e) {
                throw new BusinessException("Error occurs when init mcp config.", e);
            }
        }
        return pluginInstance;
    }

}
