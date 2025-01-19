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
package com.alibaba.higress.sdk.service.ai;

import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_FAILURE_THRESHOLD;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_INTERVAL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_MODEL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_TIMEOUT;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_SUCCESS_THRESHOLD;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROTOCOL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_API_TOKENS;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_ID;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_TYPE;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ON_FAILURE;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.TokenFailoverConfig;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

abstract class AbstractLlmProviderHandler implements LlmProviderHandler {

    @Override
    public abstract String getType();

    @Override
    @SuppressWarnings("unchecked")
    public boolean loadConfig(LlmProvider provider, Map<String, Object> configurations) {
        String id = MapUtils.getString(configurations, PROVIDER_ID);
        if (StringUtils.isBlank(id)) {
            return false;
        }

        Object tokensObj = configurations.get(PROVIDER_API_TOKENS);
        List<String> tokens = null;
        if (tokensObj instanceof List<?> tokensList) {
            tokens = new ArrayList<>(tokensList.size());
            for (Object tokenObj : tokensList) {
                if (tokenObj instanceof String token) {
                    tokens.add(token);
                }
            }
        }

        TokenFailoverConfig failoverConfig = null;
        Object failoverObj = configurations.get(FAILOVER);
        if (failoverObj instanceof Map<?, ?> failoverMap) {
            failoverConfig = buildTokenFailoverConfig((Map<String, Object>)failoverMap);
        }

        LlmProviderProtocol protocol =
            LlmProviderProtocol.fromPluginValue(MapUtils.getString(configurations, PROTOCOL));
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT;
        }
        provider.setProtocol(protocol.getValue());

        provider.setName(id);
        provider.setType(getType());
        provider.setTokens(tokens);
        provider.setTokenFailoverConfig(failoverConfig);
        provider.setRawConfigs(new HashMap<>(configurations));
        return true;
    }

    @Override
    public void saveConfig(LlmProvider provider, Map<String, Object> configurations) {
        configurations.put(PROVIDER_ID, provider.getName());
        configurations.put(PROVIDER_TYPE, getType());

        LlmProviderProtocol protocol = LlmProviderProtocol.fromValue(provider.getProtocol());
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT;
            configurations.put(PROTOCOL, protocol.getPluginValue());
        }

        List<String> tokens = provider.getTokens();
        if (CollectionUtils.isNotEmpty(tokens)) {
            configurations.put(PROVIDER_API_TOKENS, tokens);
        } else {
            configurations.remove(PROVIDER_API_TOKENS);
        }

        TokenFailoverConfig failoverConfig = provider.getTokenFailoverConfig();
        if (failoverConfig == null) {
            configurations.remove(FAILOVER);
            configurations.remove(RETRY_ON_FAILURE);
        } else {
            Map<String, Object> failoverMap = new HashMap<>();
            saveTokenFailoverConfig(failoverConfig, failoverMap);
            configurations.put(FAILOVER, failoverMap);
            Map<String, Object> retryOnFailureMap = Map.of(RETRY_ENABLED, failoverConfig.getEnabled());
            configurations.put(RETRY_ON_FAILURE, retryOnFailureMap);
        }
    }

    @Override
    public void validateConfig(Map<String, Object> configurations) {}

    @Override
    public ServiceSource buildServiceSource(String providerName, Map<String, Object> providerConfig) {
        ServiceSource serviceSource = new ServiceSource();
        serviceSource.setName(generateServiceProviderName(providerName));
        serviceSource.setType(getServiceRegistryType(providerConfig));
        serviceSource.setProtocol(getServiceProtocol(providerConfig));

        String domain = getServiceDomain(providerConfig);
        int port = getServicePort(providerConfig);
        if (V1McpBridge.REGISTRY_TYPE_STATIC.equals(serviceSource.getType())) {
            serviceSource.setDomain(domain + Separators.COLON + port);
            serviceSource.setPort(V1McpBridge.STATIC_PORT);
        } else {
            serviceSource.setDomain(domain);
            serviceSource.setPort(port);
        }

        return serviceSource;
    }

    @Override
    public UpstreamService buildUpstreamService(String providerName, Map<String, Object> providerConfig) {
        UpstreamService service = new UpstreamService();
        String registryType = getServiceRegistryType(providerConfig);
        service.setName(generateServiceProviderName(providerName) + Separators.DOT + registryType);
        if (V1McpBridge.REGISTRY_TYPE_STATIC.equals(registryType)) {
            service.setPort(V1McpBridge.STATIC_PORT);
        } else {
            service.setPort(getServicePort(providerConfig));
        }
        service.setWeight(100);
        return service;
    }

    protected abstract String getServiceRegistryType(Map<String, Object> providerConfig);

    protected abstract String getServiceDomain(Map<String, Object> providerConfig);

    protected abstract int getServicePort(Map<String, Object> providerConfig);

    protected abstract String getServiceProtocol(Map<String, Object> providerConfig);

    protected static int getIntConfig(Map<String, Object> providerConfig, String key) {
        Object serverPortObj = providerConfig.get(key);
        if (serverPortObj instanceof Integer) {
            return (Integer)serverPortObj;
        }
        if (serverPortObj instanceof String serverPortStr) {
            try {
                return Integer.parseInt(serverPortStr);
            } catch (NumberFormatException e) {
                throw new ValidationException(key + " must be a number.");
            }
        }
        throw new ValidationException(key + " must be a number.");
    }

    protected static String generateServiceProviderName(String llmProviderName) {
        return CommonKey.LLM_SERVICE_NAME_PREFIX + llmProviderName + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }

    private TokenFailoverConfig buildTokenFailoverConfig(Map<String, Object> failoverMap) {
        if (MapUtils.isEmpty(failoverMap)) {
            return null;
        }
        TokenFailoverConfig failoverConfig = new TokenFailoverConfig();
        failoverConfig.setEnabled(MapUtils.getBoolean(failoverMap, FAILOVER_ENABLED, false));
        failoverConfig.setFailureThreshold(MapUtils.getInteger(failoverMap, FAILOVER_FAILURE_THRESHOLD));
        failoverConfig.setSuccessThreshold(MapUtils.getInteger(failoverMap, FAILOVER_SUCCESS_THRESHOLD));
        failoverConfig.setHealthCheckInterval(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_INTERVAL));
        failoverConfig.setHealthCheckTimeout(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_TIMEOUT));
        failoverConfig.setHealthCheckModel(MapUtils.getString(failoverMap, FAILOVER_HEALTH_CHECK_MODEL));
        return failoverConfig;
    }

    private void saveTokenFailoverConfig(TokenFailoverConfig failoverConfig, Map<String, Object> failoverMap) {
        failoverMap.put(FAILOVER_ENABLED, failoverConfig.getEnabled());
        failoverMap.put(FAILOVER_FAILURE_THRESHOLD, failoverConfig.getFailureThreshold());
        failoverMap.put(FAILOVER_SUCCESS_THRESHOLD, failoverConfig.getSuccessThreshold());
        failoverMap.put(FAILOVER_HEALTH_CHECK_INTERVAL, failoverConfig.getHealthCheckInterval());
        failoverMap.put(FAILOVER_HEALTH_CHECK_TIMEOUT, failoverConfig.getHealthCheckTimeout());
        failoverMap.put(FAILOVER_HEALTH_CHECK_MODEL, failoverConfig.getHealthCheckModel());
    }
}
