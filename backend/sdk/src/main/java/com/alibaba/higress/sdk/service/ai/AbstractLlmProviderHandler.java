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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.TokenFailoverConfig;

abstract class AbstractLlmProviderHandler implements LlmProviderHandler {

    private static final String PROTOCOL_KEY = "protocol";
    private static final String PROVIDER_API_TOKENS_KEY = "apiTokens";
    private static final String PROVIDER_MODEL_MAPPING_KEY = "modelMapping";
    private static final String FAILOVER_KEY = "failover";
    private static final String FAILOVER_ENABLED_KEY = "enabled";
    private static final String FAILOVER_FAILURE_THRESHOLD_KEY = "failureThreshold";
    private static final String FAILOVER_SUCCESS_THRESHOLD_KEY = "successThreshold";
    private static final String FAILOVER_HEALTH_CHECK_INTERVAL_KEY = "healthCheckInterval";
    private static final String FAILOVER_HEALTH_CHECK_TIMEOUT_KEY = "healthCheckTimeout";
    private static final String FAILOVER_HEALTH_CHECK_MODEL_KEY = "healthCheckModel";

    public abstract String getType();

    @SuppressWarnings("unchecked")
    public boolean loadConfig(LlmProvider provider, Map<String, Object> configurations) {
        String id = MapUtils.getString(configurations, PROVIDER_ID_KEY);
        if (StringUtils.isBlank(id)) {
            return false;
        }

        Object modelMappingObj = configurations.get(PROVIDER_MODEL_MAPPING_KEY);
        Map<String, String> modelMapping = null;
        if (modelMappingObj instanceof Map<?, ?> modelMappingMap) {
            modelMapping = new HashMap<>(modelMappingMap.size());
            for (Map.Entry<?, ?> entry : modelMappingMap.entrySet()) {
                if (entry.getKey() instanceof String key && entry.getValue() instanceof String value) {
                    modelMapping.put(key, value);
                }
            }
        }

        Object tokensObj = configurations.get(PROVIDER_API_TOKENS_KEY);
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
        Object failoverObj = configurations.get(FAILOVER_KEY);
        if (failoverObj instanceof Map<?, ?> failoverMap) {
            failoverConfig = buildTokenFailoverConfig((Map<String, Object>)failoverMap);
        }

        LlmProviderProtocol protocol =
            LlmProviderProtocol.fromPluginValue(MapUtils.getString(configurations, PROTOCOL_KEY));
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT;
        }
        provider.setProtocol(protocol.getValue());

        provider.setName(id);
        provider.setType(getType());
        provider.setModelMapping(modelMapping);
        provider.setTokens(tokens);
        provider.setTokenFailoverConfig(failoverConfig);
        return true;
    }

    public void saveConfig(LlmProvider provider, Map<String, Object> configurations) {
        configurations.put(PROVIDER_ID_KEY, provider.getName());
        configurations.put(PROVIDER_TYPE_KEY, getType());

        LlmProviderProtocol protocol = LlmProviderProtocol.fromValue(provider.getProtocol());
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT;
            configurations.put(PROTOCOL_KEY, protocol.getPluginValue());
        }

        Map<String, String> modelMapping = provider.getModelMapping();
        if (MapUtils.isNotEmpty(modelMapping)) {
            configurations.put(PROVIDER_MODEL_MAPPING_KEY, new HashMap<>(modelMapping));
        } else {
            configurations.remove(PROVIDER_MODEL_MAPPING_KEY);
        }

        List<String> tokens = provider.getTokens();
        if (CollectionUtils.isNotEmpty(tokens)) {
            configurations.put(PROVIDER_API_TOKENS_KEY, tokens);
        } else {
            configurations.remove(PROVIDER_API_TOKENS_KEY);
        }

        TokenFailoverConfig failoverConfig = provider.getTokenFailoverConfig();
        if (failoverConfig == null) {
            configurations.remove(FAILOVER_KEY);
        } else {
            Map<String, Object> failoverMap = new HashMap<>();
            saveTokenFailoverConfig(failoverConfig, failoverMap);
            configurations.put(FAILOVER_KEY, failoverMap);
        }
    }

    protected static String generateServiceProviderName(String llmProviderName) {
        return HigressConstants.LLM_SERVICE_NAME_PREFIX + llmProviderName
            + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }

    private TokenFailoverConfig buildTokenFailoverConfig(Map<String, Object> failoverMap) {
        if (MapUtils.isEmpty(failoverMap)) {
            return null;
        }
        TokenFailoverConfig failoverConfig = new TokenFailoverConfig();
        failoverConfig.setEnabled(MapUtils.getBoolean(failoverMap, FAILOVER_ENABLED_KEY, false));
        failoverConfig.setFailureThreshold(MapUtils.getInteger(failoverMap, FAILOVER_FAILURE_THRESHOLD_KEY));
        failoverConfig.setSuccessThreshold(MapUtils.getInteger(failoverMap, FAILOVER_SUCCESS_THRESHOLD_KEY));
        failoverConfig.setHealthCheckInterval(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_INTERVAL_KEY));
        failoverConfig.setHealthCheckTimeout(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_TIMEOUT_KEY));
        failoverConfig.setHealthCheckModel(MapUtils.getString(failoverMap, FAILOVER_HEALTH_CHECK_MODEL_KEY));
        return failoverConfig;
    }

    private void saveTokenFailoverConfig(TokenFailoverConfig failoverConfig, Map<String, Object> failoverMap) {
        failoverMap.put(FAILOVER_ENABLED_KEY, failoverConfig.getEnabled());
        failoverMap.put(FAILOVER_FAILURE_THRESHOLD_KEY, failoverConfig.getFailureThreshold());
        failoverMap.put(FAILOVER_SUCCESS_THRESHOLD_KEY, failoverConfig.getSuccessThreshold());
        failoverMap.put(FAILOVER_HEALTH_CHECK_INTERVAL_KEY, failoverConfig.getHealthCheckInterval());
        failoverMap.put(FAILOVER_HEALTH_CHECK_TIMEOUT_KEY, failoverConfig.getHealthCheckTimeout());
        failoverMap.put(FAILOVER_HEALTH_CHECK_MODEL_KEY, failoverConfig.getHealthCheckModel());
    }
}
