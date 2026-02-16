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

import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_EXTRA_CONFIGS;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

/**
 * Handler for ZhipuAI (智谱 AI) LLM provider.
 * Supports extra configurations like zhipuDomain and zhipuCodePlanMode.
 */
public class ZhipuLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String DEFAULT_DOMAIN = "open.bigmodel.cn";
    private static final String KEY_ZHIPU_DOMAIN = "zhipuDomain";
    private static final String KEY_ZHIPU_CODE_PLAN_MODE = "zhipuCodePlanMode";

    @Override
    public String getType() {
        return LlmProviderType.ZHIPUAI;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        String domain = DEFAULT_DOMAIN;
        Object domainObj = providerConfig.get(KEY_ZHIPU_DOMAIN);
        if (domainObj instanceof String) {
            String domainStr = (String) domainObj;
            if (StringUtils.isNotBlank(domainStr)) {
                domain = domainStr;
            }
        }
        return Collections.singletonList(new LlmProviderEndpoint(
            V1McpBridge.PROTOCOL_HTTPS, domain, V1McpBridge.DEFAULT_HTTPS_PORT, "/"));
    }

    @Override
    public void saveConfig(LlmProvider provider, Map<String, Object> configurations) {
        super.saveConfig(provider, configurations);
        
        // Save extra configs
        Map<String, Object> rawConfigs = provider.getRawConfigs();
        if (rawConfigs != null) {
            // zhipuDomain
            Object domainObj = rawConfigs.get(KEY_ZHIPU_DOMAIN);
            if (domainObj instanceof String && StringUtils.isNotBlank((String) domainObj)) {
                configurations.put(KEY_ZHIPU_DOMAIN, domainObj);
            } else {
                configurations.remove(KEY_ZHIPU_DOMAIN);
            }
            
            // zhipuCodePlanMode
            Object codePlanModeObj = rawConfigs.get(KEY_ZHIPU_CODE_PLAN_MODE);
            if (codePlanModeObj instanceof Boolean && (Boolean) codePlanModeObj) {
                configurations.put(KEY_ZHIPU_CODE_PLAN_MODE, true);
            } else {
                configurations.remove(KEY_ZHIPU_CODE_PLAN_MODE);
            }
        }
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        // Normalize zhipuDomain
        Object domainObj = configurations.get(KEY_ZHIPU_DOMAIN);
        if (domainObj instanceof String) {
            String domain = ((String) domainObj).trim();
            if (StringUtils.isBlank(domain) || DEFAULT_DOMAIN.equals(domain)) {
                configurations.remove(KEY_ZHIPU_DOMAIN);
            }
        }
        
        // Normalize zhipuCodePlanMode
        Object codePlanModeObj = configurations.get(KEY_ZHIPU_CODE_PLAN_MODE);
        if (!(codePlanModeObj instanceof Boolean) || !(Boolean) codePlanModeObj) {
            configurations.remove(KEY_ZHIPU_CODE_PLAN_MODE);
        }
    }
}
