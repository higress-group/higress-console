/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.sdk.service.ai;

import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Handler for Claude LLM provider with support for:
 * - Claude Code mode using OAuth token (claudeCodeMode + claudeCodeApiKey)
 * - Custom API version (claudeVersion)
 */
public class ClaudeLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final int DEFAULT_SERVICE_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;
    private static final String DEFAULT_SERVICE_DOMAIN = "api.anthropic.com";
    private static final String DEFAULT_API_VERSION = "2023-06-01";

    private static final String CODE_MODE_KEY = "claudeCodeMode";
    private static final String CODE_API_KEY = "claudeCodeApiKey";
    private static final String API_VERSION_KEY = "claudeVersion";

    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS =
            Collections.singletonList(new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/"));

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }

        // Normalize claudeCodeMode to boolean
        Boolean codeMode = MapUtils.getBoolean(configurations, CODE_MODE_KEY, Boolean.FALSE);
        configurations.put(CODE_MODE_KEY, codeMode);

        // If claudeCodeApiKey is provided, enable code mode automatically
        Object codeApiKey = configurations.get(CODE_API_KEY);
        if (codeApiKey instanceof String && StringUtils.isNotBlank((String) codeApiKey)) {
            configurations.put(CODE_MODE_KEY, Boolean.TRUE);
        }

        // Set default API version if not specified
        if (!configurations.containsKey(API_VERSION_KEY)) {
            configurations.put(API_VERSION_KEY, DEFAULT_API_VERSION);
        }
    }

    @Override
    public String getType() {
        return LlmProviderType.CLAUDE;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return DEFAULT_ENDPOINTS;
    }
}
