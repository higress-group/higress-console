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
import java.util.Locale;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ValidateUtil;

public class OpenaiLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String CUSTOM_URL_KEY = "openaiCustomUrl";

    private static final String DEFAULT_REGISTRY_TYPE = V1McpBridge.REGISTRY_TYPE_DNS;
    private static final String DEFAULT_SERVICE_DOMAIN = "api.openai.com";
    private static final int DEFAULT_SERVICE_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;

    @Override
    public String getType() {
        return LlmProviderType.OPENAI;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }
        URI uri = getCustomUri(configurations);
        if (uri != null) {
            String scheme = uri.getScheme();
            if (StringUtils.isEmpty(scheme)) {
                throw new ValidationException("Custom service URL must have a scheme.");
            }
            scheme = scheme.toLowerCase(Locale.ROOT);
            if (!scheme.equals(V1McpBridge.PROTOCOL_HTTP) && !scheme.equals(V1McpBridge.PROTOCOL_HTTPS)) {
                throw new ValidationException("Custom service URL must have a valid scheme.");
            }
        }
    }

    @Override
    protected String getServiceRegistryType(Map<String, Object> providerConfig) {
        URI uri = getCustomUri(providerConfig);
        if (uri == null) {
            return DEFAULT_REGISTRY_TYPE;
        }
        if (ValidateUtil.checkIpAddress(uri.getHost())) {
            return V1McpBridge.REGISTRY_TYPE_STATIC;
        }
        return V1McpBridge.REGISTRY_TYPE_DNS;
    }

    @Override
    protected String getServiceDomain(Map<String, Object> providerConfig) {
        URI uri = getCustomUri(providerConfig);
        return uri != null ? uri.getHost() : DEFAULT_SERVICE_DOMAIN;
    }

    @Override
    protected int getServicePort(Map<String, Object> providerConfig) {
        URI uri = getCustomUri(providerConfig);
        if (uri == null){
            return DEFAULT_SERVICE_PORT;
        }
        int port = uri.getPort();
        if (port != -1){
            return port;
        }
        String scheme = uri.getScheme();
        if (scheme == null) {
            return 80;
        }
        scheme = scheme.toLowerCase(Locale.ROOT);
        switch (scheme) {
            case V1McpBridge.PROTOCOL_HTTP:
                return 80;
            case V1McpBridge.PROTOCOL_HTTPS:
                return 443;
            default:
                return 80;
        }
    }

    @Override
    protected String getServiceProtocol(Map<String, Object> providerConfig) {
        URI uri = getCustomUri(providerConfig);
        if (uri == null){
            return DEFAULT_SERVICE_PROTOCOL;
        }
        String scheme = uri.getScheme();
        if (scheme == null) {
            return V1McpBridge.PROTOCOL_HTTP;
        }
        scheme = scheme.toLowerCase(Locale.ROOT);
        switch (scheme) {
            case V1McpBridge.PROTOCOL_HTTP:
            case V1McpBridge.PROTOCOL_HTTPS:
                return scheme;
            default:
                return V1McpBridge.PROTOCOL_HTTP;
        }
    }

    private static URI getCustomUri(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        Object customUrlObject = providerConfig.get(CUSTOM_URL_KEY);
        if (!(customUrlObject instanceof String)) {
            return null;
        }
        String customUrl= (String)customUrlObject;
        if (StringUtils.isEmpty(customUrl)) {
            throw new ValidationException(CUSTOM_URL_KEY + " cannot be empty.");
        }
        try {
            return new URI(customUrl);
        } catch (URISyntaxException e) {
            throw new ValidationException(CUSTOM_URL_KEY + " is not a valid URL.", e);
        }
    }
}
