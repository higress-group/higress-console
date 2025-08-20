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
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import lombok.extern.slf4j.Slf4j;

/**
 * open api mcp server
 *
 * @author HecarimV
 */
@Slf4j
public class OpenApiSaveStrategy extends AbstractMcpServerSaveStrategy {

    private static final String REDIS_PLACEHOLDER_ADDRESS = "your.redis.host:6379";

    private static final ObjectMapper YAML_MAPPER = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    static {
        YAML_MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private final WasmPluginInstanceService wasmPluginInstanceService;

    public OpenApiSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        ConsumerService consumerService, RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, consumerService, routeService);
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.OPEN_API.equals(mcpServer.getType());
    }

    @Override
    protected void doSaveMcpServerConfig(McpServer mcpInstance) {
        // validate Redis config
        validateRedisConfiguration();
        WasmPluginInstance wasmPluginInstanceRequest = buildWasmPluginInstanceRequest(mcpInstance);
        wasmPluginInstanceService.addOrUpdate(wasmPluginInstanceRequest);
    }

    /**
     * Validate Redis configuration in higress-config If Redis address is still a placeholder, prompt user to configure
     * correct Redis address
     */
    private void validateRedisConfiguration() {
        try {

            McpServerConfigMap.RedisConfig redisConfig = mcpServerConfigMapHelper.getRedisConfig();
            if (redisConfig == null) {
                throw new ValidationException(
                    "MCP functionality requires Redis configuration, but Redis configuration is missing in higress-config. Please configure correct Redis address first, otherwise MCP functionality will be unavailable.");
            }
            String address = redisConfig.getAddress();

            // Only check if address is a placeholder
            if (StringUtils.isBlank(address) || REDIS_PLACEHOLDER_ADDRESS.equals(address)) {
                throw new ValidationException(
                    "Redis configuration is still a placeholder, please configure correct Redis address. Current configuration: address="
                        + (StringUtils.isBlank(address) ? "not configured" : address)
                        + ". Please modify Redis configuration in higress-config, otherwise MCP functionality will be unavailable.");
            }

        } catch (ValidationException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error occurred while validating Redis configuration", e);
            throw new ValidationException("Error occurred while validating Redis configuration: ", e);
        }
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
                String yamlString = YAML_MAPPER.writeValueAsString(rootMap);
                pluginInstance.setRawConfigurations(yamlString);
                pluginInstance.setEnabled(false);
            } catch (JsonProcessingException e) {
                throw new BusinessException("Error occurs when init mcp config.", e);
            }
        }
        return pluginInstance;
    }

}
