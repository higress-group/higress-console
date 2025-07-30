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

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;

/**
 * open api mcp server
 *
 * @author HecarimV
 */
@Slf4j
public class OpenApiSaveStrategy extends AbstractMcpServerSaveStrategy {

    private static final String REDIS_PLACEHOLDER_ADDRESS = "your.redis.host:6379";

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
        // 验证 Redis 配置
        validateRedisConfiguration();

        WasmPluginInstance wasmPluginInstanceRequest = buildWasmPluginInstanceRequest(mcpInstance);
        wasmPluginInstanceService.addOrUpdate(wasmPluginInstanceRequest);
    }

    /**
     * 验证 higress-config 中的 Redis 配置
     * 如果 Redis 地址仍为占位符，则提示用户配置正确的 Redis 地址
     */
    private void validateRedisConfiguration() {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG);
            if (configMap == null || configMap.getData() == null) {
                throw new ValidationException("无法读取 higress-config ConfigMap，请确保配置正确");
            }

            String higressConfigYaml = configMap.getData().get("higress");
            if (StringUtils.isBlank(higressConfigYaml)) {
                throw new ValidationException("higress-config 中缺少 higress 配置项");
            }

            ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory()
                    .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE)
                    .disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));
            yamlMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            Map<String, Object> higressConfig = yamlMapper.readValue(higressConfigYaml, Map.class);
            Object mcpServerObj = higressConfig.get("mcpServer");

            if (mcpServerObj == null) {
                throw new ValidationException("higress-config 中缺少 mcpServer 配置项");
            }

            McpServerConfigMap mcpConfig = yamlMapper.readValue(
                    yamlMapper.writeValueAsString(mcpServerObj), McpServerConfigMap.class);

            if (mcpConfig.getRedis() == null) {
                throw new ValidationException(
                        "MCP 功能需要配置 Redis，但 higress-config 中缺少 Redis 配置。请先配置正确的 Redis 地址，否则 MCP 功能将不可用。");
            }

            McpServerConfigMap.RedisConfig redisConfig = mcpConfig.getRedis();
            String address = redisConfig.getAddress();

            // 只检查地址是否为占位符
            if (StringUtils.isBlank(address) || REDIS_PLACEHOLDER_ADDRESS.equals(address)) {
                throw new ValidationException("Redis 配置仍为占位符，请配置正确的 Redis 地址。当前配置：address=" +
                        (StringUtils.isBlank(address) ? "未配置" : address) +
                        "。请修改 higress-config 中的 Redis 配置，否则 MCP 功能将不可用。");
            }

        } catch (ValidationException e) {
            throw e;
        } catch (Exception e) {
            log.error("验证 Redis 配置时发生错误", e);
            throw new ValidationException("验证 Redis 配置时发生错误: " + e.getMessage());
        }
    }

    private WasmPluginInstance buildWasmPluginInstanceRequest(McpServer mcpInstance) {
        WasmPluginInstance pluginInstance = WasmPluginInstance.builder().pluginName(DEFAULT_MCP_PLUGIN).internal(true)
                .build();
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
