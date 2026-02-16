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

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

/**
 * Handler for Claude LLM provider with support for:
 * - Claude Code mode using OAuth token (claudeCodeMode)
 * - Custom API version (claudeVersion)
 */
public class ClaudeLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String DEFAULT_SERVICE_DOMAIN = "api.anthropic.com";
    private static final String DEFAULT_API_VERSION = "2023-06-01";

    private static final String KEY_CLAUDE_CODE_MODE = "claudeCodeMode";
    private static final String KEY_CLAUDE_VERSION = "claudeVersion";

    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS =
            Collections.singletonList(new LlmProviderEndpoint(
                V1McpBridge.PROTOCOL_HTTPS, DEFAULT_SERVICE_DOMAIN, V1McpBridge.DEFAULT_HTTPS_PORT, "/"));

    @Override
    public String getType() {
        return LlmProviderType.CLAUDE;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return DEFAULT_ENDPOINTS;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }

        // Normalize claudeCodeMode
        Object codeModeObj = configurations.get(KEY_CLAUDE_CODE_MODE);
        if (codeModeObj instanceof Boolean) {
            if ((Boolean) codeModeObj) {
                configurations.put(KEY_CLAUDE_CODE_MODE, true);
            } else {
                configurations.remove(KEY_CLAUDE_CODE_MODE);
            }
        } else if (codeModeObj instanceof String) {
            String strVal = ((String) codeModeObj).trim().toLowerCase();
            if ("true".equals(strVal) || "1".equals(strVal)) {
                configurations.put(KEY_CLAUDE_CODE_MODE, true);
            } else {
                configurations.remove(KEY_CLAUDE_CODE_MODE);
            }
        } else {
            configurations.remove(KEY_CLAUDE_CODE_MODE);
        }

        // Normalize claudeVersion
        Object versionObj = configurations.get(KEY_CLAUDE_VERSION);
        if (versionObj instanceof String) {
            String version = ((String) versionObj).trim();
            if (StringUtils.isBlank(version)) {
                configurations.remove(KEY_CLAUDE_VERSION);
            } else {
                configurations.put(KEY_CLAUDE_VERSION, version);
            }
        } else if (versionObj != null) {
            configurations.remove(KEY_CLAUDE_VERSION);
        }
    }
}
