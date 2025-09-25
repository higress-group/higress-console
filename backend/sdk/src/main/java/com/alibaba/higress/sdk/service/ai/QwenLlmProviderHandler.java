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

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Map;


public class QwenLlmProviderHandler extends AbstractLlmProviderHandler{
    private static final int DEFAULT_SERVICE_PORT = 443;

    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;

    private static final String DEFAULT_SERVICE_DOMAIN = "dashscope.aliyuncs.com";

    private static final String CUSTOM_DOMAIN_KEY = "qwenDomain";
    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS =
            Collections.singletonList(new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/"));

    private static final String ENABLE_SEARCH_KEY = "qwenEnableSearch";
    private static final String ENABLE_COMPATIBLE_KEY = "qwenEnableCompatible";
    private static final String FILE_IDS_KEY = "qwenFileIds";

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            throw new ValidationException("Missing Qwen specific configurations.");
        }

        Boolean searchVal = MapUtils.getBoolean(configurations, ENABLE_SEARCH_KEY, Boolean.FALSE);
        configurations.put(ENABLE_SEARCH_KEY, searchVal);

        Boolean compatibleVal = MapUtils.getBoolean(configurations, ENABLE_COMPATIBLE_KEY, Boolean.FALSE);
        configurations.put(ENABLE_COMPATIBLE_KEY, compatibleVal);

        if (configurations.containsKey(FILE_IDS_KEY)) {
            Object fileIdsVal = configurations.get(FILE_IDS_KEY);
            if (!(fileIdsVal instanceof List)) {
                throw new ValidationException("Invalid configuration: " + FILE_IDS_KEY);
            }
        }
    }


    @Override
    public String getType() {
        return LlmProviderType.QWEN;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        URI customUrl = getCustomUrl(providerConfig);
        if(customUrl != null){
            return Collections.singletonList(LlmProviderEndpoint.fromUri(customUrl));
        }
        return DEFAULT_ENDPOINTS;
    }
    private URI getCustomUrl(Map<String, Object> providerConfig) {
        Object rawCustomDomainObject = providerConfig.get(CUSTOM_DOMAIN_KEY);
        if (!(rawCustomDomainObject instanceof String)) {
            return null;
        }
        String rawCustomDomain = ((String) rawCustomDomainObject).trim();
        if (StringUtils.isEmpty(rawCustomDomain)) {
            return null;
        }

        String scheme = V1McpBridge.PROTOCOL_HTTPS;
        String path = "/";

        try {
            return new URI(scheme, rawCustomDomain, path, null);
        } catch (URISyntaxException e) {
            throw new ValidationException(CUSTOM_DOMAIN_KEY + " contains an invalid domain name: " + rawCustomDomain, e);
        }
    }

}
