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
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ConverterUtil;

/**
 * Handler for Claude LLM provider with support for: - API version configuration (claudeVersion) - Claude Code Mode
 * using OAuth token (claudeCodeMode)
 */
public class ClaudeLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final int DEFAULT_SERVICE_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;
    private static final String DEFAULT_SERVICE_DOMAIN = "api.anthropic.com";

    private static final String VERSION_KEY = "claudeVersion";
    private static final String CODE_MODE_KEY = "claudeCodeMode";
    private static final String DEFAULT_VERSION = "2023-06-01";

    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS = Collections.singletonList(
        new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/"));

    @Override
    public String getType() {
        return LlmProviderType.CLAUDE;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }

        // Normalize claudeCodeMode to boolean
        Object codeModeObj = configurations.get(CODE_MODE_KEY);
        if (codeModeObj != null) {
            Boolean codeMode = ConverterUtil.toBoolean(codeModeObj);
            if (codeMode != null) {
                configurations.put(CODE_MODE_KEY, codeMode);
            }
        }

        // Ensure claudeVersion has a default value if not set
        Object versionObj = configurations.get(VERSION_KEY);
        if (versionObj == null || versionObj instanceof String && StringUtils.isBlank((String)versionObj)) {
            configurations.put(VERSION_KEY, DEFAULT_VERSION);
        }
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return DEFAULT_ENDPOINTS;
    }
}
