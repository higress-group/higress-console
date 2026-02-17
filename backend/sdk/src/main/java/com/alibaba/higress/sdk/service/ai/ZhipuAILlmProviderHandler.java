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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ConverterUtil;

/**
 * Handler for Zhipu AI LLM provider with support for:
 * <ul>
 * <li>Custom domain configuration (zhipuDomain)</li>
 * <li>- Code Plan Mode (zhipuCodePlanMode)</li>
 * </ul>
 */
public class ZhipuAILlmProviderHandler extends AbstractLlmProviderHandler {

    private static final int DEFAULT_SERVICE_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;
    private static final String DEFAULT_SERVICE_DOMAIN = "open.bigmodel.cn";
    private static final String INTERNATIONAL_SERVICE_DOMAIN = "api.z.ai";

    private static final String DOMAIN_KEY = "zhipuDomain";
    private static final String CODE_PLAN_MODE_KEY = "zhipuCodePlanMode";

    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS = Collections.singletonList(
        new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/"));

    @Override
    public String getType() {
        return LlmProviderType.ZHIPUAI;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (configurations == null) {
            return;
        }

        // Default to enable Code Plan mode for better code generation
        Object codePlanModeObj = configurations.get(CODE_PLAN_MODE_KEY);
        configurations.put(CODE_PLAN_MODE_KEY, ConverterUtil.toBoolean(codePlanModeObj, Boolean.TRUE));
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        String domain = getCustomDomain(providerConfig);
        if (StringUtils.isNotEmpty(domain)) {
            try {
                URI uri = new URI(DEFAULT_SERVICE_PROTOCOL, domain, "/", null);
                return Collections.singletonList(LlmProviderEndpoint.fromUri(uri));
            } catch (URISyntaxException e) {
                throw new ValidationException(DOMAIN_KEY + " contains an invalid domain name: " + domain, e);
            }
        }
        return DEFAULT_ENDPOINTS;
    }

    private String getCustomDomain(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        Object domainObj = providerConfig.get(DOMAIN_KEY);
        if (!(domainObj instanceof String)) {
            return null;
        }
        String domain = ((String)domainObj).trim();
        return StringUtils.isNotEmpty(domain) ? domain : null;
    }
}
