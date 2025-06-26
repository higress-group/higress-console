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

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.BiConsumer;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

public class VertexLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String VERTEX_AUTH_KEY_KEY = "vertexAuthKey";
    private static final String VERTEX_REGION_KEY = "vertexRegion";
    private static final String VERTEX_PROJECT_ID_KEY = "vertexProjectId";
    private static final String VERTEX_AUTH_SERVICE_NAME_KEY = "vertexAuthServiceName";
    private static final String VERTEX_TOKEN_REFRESH_AHEAD_KEY = "vertexTokenRefreshAhead";
    private static final String GEMINI_SAFETY_SETTING_KEY = "geminiSafetySetting";

    private static final String DOMAIN_FORMAT = "%s-aiplatform.googleapis.com";

    private static final String DEFAULT_AUTH_SERVICE_NAME =
        "vertex-auth" + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    private static final String AUTH_SERVICE_DOMAIN = "oauth2.googleapis.com";
    private static final List<ServiceSource> EXTRA_SERVICE_SOURCES;

    static {
        ServiceSource authServiceSource = new ServiceSource();
        authServiceSource.setName(DEFAULT_AUTH_SERVICE_NAME);
        authServiceSource.setType(V1McpBridge.REGISTRY_TYPE_DNS);
        authServiceSource.setProtocol(V1McpBridge.PROTOCOL_HTTPS);
        authServiceSource.setPort(443);
        authServiceSource.setDomain(AUTH_SERVICE_DOMAIN);
        EXTRA_SERVICE_SOURCES = Collections.singletonList(authServiceSource);
    }

    @Override
    public String getType() {
        return LlmProviderType.VERTEX;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            throw new ValidationException("Missing Vertex specific configurations.");
        }

        String region = MapUtils.getString(configurations, VERTEX_REGION_KEY);
        if (StringUtils.isEmpty(region)) {
            throw new ValidationException(VERTEX_REGION_KEY + " cannot be empty.");
        }
        configurations.put(VERTEX_REGION_KEY, region.toLowerCase(Locale.ROOT));

        String projectId = MapUtils.getString(configurations, VERTEX_PROJECT_ID_KEY);
        if (StringUtils.isEmpty(projectId)) {
            throw new ValidationException(VERTEX_PROJECT_ID_KEY + " cannot be empty.");
        }

        String authKey = MapUtils.getString(configurations, VERTEX_AUTH_KEY_KEY);
        if (StringUtils.isEmpty(authKey)) {
            throw new ValidationException(VERTEX_AUTH_KEY_KEY + " cannot be empty.");
        }
        JSONObject authKeyObject;
        try {
            authKeyObject = JSON.parseObject(authKey);
        } catch (JSONException ex) {
            throw new ValidationException(VERTEX_AUTH_KEY_KEY + " must contain a valid JSON object.", ex);
        }
        final BiConsumer<JSONObject, String> ensureJsonStringProperty = (jsonObject, key) -> {
            Object value = jsonObject.get(key);
            if (!(value instanceof String)) {
                throw new ValidationException(
                    VERTEX_AUTH_KEY_KEY + " must contain a valid JSON object with a string property: " + key);
            }
        };
        ensureJsonStringProperty.accept(authKeyObject, "client_email");
        ensureJsonStringProperty.accept(authKeyObject, "private_key_id");
        ensureJsonStringProperty.accept(authKeyObject, "private_key");
        ensureJsonStringProperty.accept(authKeyObject, "token_uri");

        Integer tokenRefreshAhead = MapUtils.getInteger(configurations, VERTEX_TOKEN_REFRESH_AHEAD_KEY);
        if (tokenRefreshAhead != null && tokenRefreshAhead < 0) {
            throw new ValidationException(VERTEX_TOKEN_REFRESH_AHEAD_KEY + " must be a non-negative number.");
        }

        Object rawGeminiSafetySetting = configurations.get(GEMINI_SAFETY_SETTING_KEY);
        if (rawGeminiSafetySetting != null) {
            if (!(rawGeminiSafetySetting instanceof Map)) {
                throw new ValidationException(GEMINI_SAFETY_SETTING_KEY + " must be an object.");
            }
            Map<?, ?> geminiSafetySetting = (Map<?, ?>)rawGeminiSafetySetting;
            for (Map.Entry<?, ?> entry : geminiSafetySetting.entrySet()) {
                if (!(entry.getKey() instanceof String) || !(entry.getValue() instanceof String)) {
                    throw new ValidationException(
                        GEMINI_SAFETY_SETTING_KEY + " must be an object with string key-value pairs.");
                }
            }
        }

        configurations.put(VERTEX_AUTH_SERVICE_NAME_KEY, DEFAULT_AUTH_SERVICE_NAME);
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        String region = MapUtils.getString(providerConfig, VERTEX_REGION_KEY);
        if (StringUtils.isEmpty(region)) {
            throw new ValidationException(VERTEX_REGION_KEY + " cannot be empty.");
        }
        String domain = String.format(DOMAIN_FORMAT, region);
        return Collections.singletonList(new LlmProviderEndpoint(V1McpBridge.PROTOCOL_HTTPS, domain, 443, "/"));
    }

    @Override
    public List<ServiceSource> getExtraServiceSources(String providerName, Map<String, Object> providerConfig,
        boolean forDelete) {
        return forDelete ? null : EXTRA_SERVICE_SOURCES;
    }
}
