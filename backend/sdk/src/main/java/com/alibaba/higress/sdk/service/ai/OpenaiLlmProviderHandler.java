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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

public class OpenaiLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String CUSTOM_URL_KEY = "openaiCustomUrl";
    private static final String EXTRA_CUSTOM_URLS_KEY = "openaiExtraCustomUrls";

    private static final String DEFAULT_SERVICE_DOMAIN = "api.openai.com";
    private static final int DEFAULT_SERVICE_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;
    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS = Collections.singletonList(
        new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/v1"));

    @Override
    public String getType() {
        return LlmProviderType.OPENAI;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }
        List<URI> customUris = getCustomUris(configurations);
        if (CollectionUtils.isEmpty(customUris)) {
            return;
        }
        for (URI uri : customUris) {
            String scheme = uri.getScheme();
            if (StringUtils.isEmpty(scheme)) {
                throw new ValidationException("Custom service URL must have a scheme: " + uri);
            }
            scheme = scheme.toLowerCase(Locale.ROOT);
            if (!scheme.equals(V1McpBridge.PROTOCOL_HTTP) && !scheme.equals(V1McpBridge.PROTOCOL_HTTPS)) {
                throw new ValidationException("Custom service URL must have a valid scheme: " + uri);
            }
        }
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        List<URI> customUris = getCustomUris(providerConfig);
        if (CollectionUtils.isEmpty(customUris)) {
            return DEFAULT_ENDPOINTS;
        }
        return customUris.stream().map(LlmProviderEndpoint::fromUri).collect(Collectors.toList());
    }

    private List<URI> getCustomUris(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        Object rawCustomUrlObject = providerConfig.get(CUSTOM_URL_KEY);
        if (!(rawCustomUrlObject instanceof String)) {
            return null;
        }
        String rawCustomUrl = (String)rawCustomUrlObject;
        if (StringUtils.isEmpty(rawCustomUrl)) {
            throw new ValidationException(CUSTOM_URL_KEY + " cannot be empty.");
        }

        List<String> customUrls = new ArrayList<>();
        customUrls.add(rawCustomUrl);

        Object rawExtraCustomUrlsObject = providerConfig.get(EXTRA_CUSTOM_URLS_KEY);
        if (rawExtraCustomUrlsObject instanceof List<?>
            && CollectionUtils.isNotEmpty((List<?>)rawExtraCustomUrlsObject)) {
            for (Object extraUrl : (List<?>)rawExtraCustomUrlsObject) {
                if (extraUrl instanceof String && StringUtils.isNotEmpty((String)extraUrl)) {
                    customUrls.add((String)extraUrl);
                } else {
                    throw new ValidationException(EXTRA_CUSTOM_URLS_KEY + " must contain non-empty strings.");
                }
            }
        }

        List<URI> customUris = new ArrayList<>();
        for (String customUrl : customUrls) {
            try {
                customUris.add(new URI(customUrl));
            } catch (URISyntaxException e) {
                throw new ValidationException(CUSTOM_URL_KEY + " contains an invalid URL: " + customUrl, e);
            }
        }
        return customUris;
    }
}
