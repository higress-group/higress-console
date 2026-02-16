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

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

/**
 * Handler for Claude LLM provider.
 * Supports extra configurations like claudeCodeMode.
 */
public class ClaudeLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String DEFAULT_DOMAIN = "api.anthropic.com";
    private static final String KEY_CLAUDE_CODE_MODE = "claudeCodeMode";
    private static final String KEY_CLAUDE_VERSION = "claudeVersion";

    @Override
    public String getType() {
        return LlmProviderType.CLAUDE;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return Collections.singletonList(new LlmProviderEndpoint(
            V1McpBridge.PROTOCOL_HTTPS, DEFAULT_DOMAIN, V1McpBridge.DEFAULT_HTTPS_PORT, "/"));
    }

    @Override
    public void saveConfig(LlmProvider provider, Map<String, Object> configurations) {
        super.saveConfig(provider, configurations);
        
        // Save extra configs
        Map<String, Object> rawConfigs = provider.getRawConfigs();
        if (rawConfigs != null) {
            // claudeCodeMode
            Object codeModeObj = rawConfigs.get(KEY_CLAUDE_CODE_MODE);
            if (codeModeObj instanceof Boolean && (Boolean) codeModeObj) {
                configurations.put(KEY_CLAUDE_CODE_MODE, true);
            } else {
                configurations.remove(KEY_CLAUDE_CODE_MODE);
            }
            
            // claudeVersion - keep existing version config if present
            Object versionObj = rawConfigs.get(KEY_CLAUDE_VERSION);
            if (versionObj instanceof String && StringUtils.isNotBlank((String) versionObj)) {
                configurations.put(KEY_CLAUDE_VERSION, versionObj);
            }
        }
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        // Normalize claudeCodeMode
        Object codeModeObj = configurations.get(KEY_CLAUDE_CODE_MODE);
        if (!(codeModeObj instanceof Boolean) || !(Boolean) codeModeObj) {
            configurations.remove(KEY_CLAUDE_CODE_MODE);
        }
    }
}
