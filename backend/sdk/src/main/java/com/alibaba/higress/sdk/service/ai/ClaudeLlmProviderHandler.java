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
import com.alibaba.higress.sdk.util.ConverterUtil;

/**
 * Handler for Claude LLM provider with support for API version (claudeVersion), Claude Code Mode (claudeCodeMode),
 * and ai-proxy Wasm overrides (providerDomain, providerBasePath).
 */
public class ClaudeLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String CUSTOM_URL_KEY = "claudeCustomUrl";
    private static final String PROVIDER_DOMAIN_KEY = "providerDomain";
    private static final String PROVIDER_BASE_PATH_KEY = "providerBasePath";

    private static final int DEFAULT_HTTP_PORT = 80;
    private static final int DEFAULT_HTTPS_PORT = 443;
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;
    private static final String DEFAULT_SERVICE_DOMAIN = "api.anthropic.com";

    private static final String VERSION_KEY = "claudeVersion";
    private static final String CODE_MODE_KEY = "claudeCodeMode";
    private static final String DEFAULT_VERSION = "2023-06-01";

    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS = Collections.singletonList(
        new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_HTTPS_PORT, "/"));

    @Override
    public String getType() {
        return LlmProviderType.CLAUDE;
    }

    @Override
    public boolean loadConfig(com.alibaba.higress.sdk.model.ai.LlmProvider provider, Map<String, Object> configurations) {
        if (!super.loadConfig(provider, configurations)) {
            return false;
        }
        Map<String, Object> rawConfigs = provider.getRawConfigs();
        if (MapUtils.isEmpty(rawConfigs)) {
            return true;
        }
        List<LlmProviderEndpoint> endpoints = getProviderEndpoints(rawConfigs);
        if (CollectionUtils.isEmpty(endpoints)) {
            return true;
        }
        LlmProviderEndpoint endpoint = endpoints.get(0);
        if (endpoint == null || StringUtils.isBlank(endpoint.getProtocol()) || StringUtils.isBlank(endpoint.getAddress())) {
            return true;
        }
        String path = StringUtils.defaultIfBlank(endpoint.getContextPath(), "/");
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        String host = endpoint.getAddress().trim();
        int port = endpoint.getPort() != null ? endpoint.getPort()
            : (V1McpBridge.PROTOCOL_HTTP.equals(endpoint.getProtocol()) ? DEFAULT_HTTP_PORT : DEFAULT_HTTPS_PORT);
        boolean omitPort = V1McpBridge.PROTOCOL_HTTP.equals(endpoint.getProtocol()) && port == DEFAULT_HTTP_PORT
            || V1McpBridge.PROTOCOL_HTTPS.equals(endpoint.getProtocol()) && port == DEFAULT_HTTPS_PORT;
        String customUrl = endpoint.getProtocol() + "://" + host + (omitPort ? "" : ":" + port) + path;
        rawConfigs.put(CUSTOM_URL_KEY, customUrl);
        return true;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }

        Object codeModeObj = configurations.get(CODE_MODE_KEY);
        if (codeModeObj != null) {
            Boolean codeMode = ConverterUtil.toBoolean(codeModeObj);
            if (codeMode != null) {
                configurations.put(CODE_MODE_KEY, codeMode);
            }
        }

        Object versionObj = configurations.get(VERSION_KEY);
        if (versionObj == null || versionObj instanceof String && StringUtils.isBlank((String)versionObj)) {
            configurations.put(VERSION_KEY, DEFAULT_VERSION);
        }

        List<URI> legacyUris = getLegacyCustomUris(configurations);
        if (CollectionUtils.isNotEmpty(legacyUris)) {
            for (URI uri : legacyUris) {
                String scheme = uri.getScheme();
                if (StringUtils.isEmpty(scheme)) {
                    throw new ValidationException("Custom service URL must have a scheme: " + uri);
                }
                scheme = scheme.toLowerCase(Locale.ROOT);
                if (!scheme.equals(V1McpBridge.PROTOCOL_HTTP) && !scheme.equals(V1McpBridge.PROTOCOL_HTTPS)) {
                    throw new ValidationException("Custom service URL must have a valid scheme: " + uri);
                }
            }
            return;
        }
        validateWasmDomainOverrides(configurations);
    }

    @Override
    public boolean needSyncRouteAfterUpdate() {
        return true;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        List<URI> legacyUris = getLegacyCustomUris(providerConfig);
        if (CollectionUtils.isNotEmpty(legacyUris)) {
            return legacyUris.stream().map(LlmProviderEndpoint::fromUri).collect(Collectors.toList());
        }
        List<LlmProviderEndpoint> wasmEndpoints = buildEndpointsFromWasmDomainOverrides(providerConfig);
        if (CollectionUtils.isNotEmpty(wasmEndpoints)) {
            return wasmEndpoints;
        }
        return DEFAULT_ENDPOINTS;
    }

    /**
     * Builds endpoints from ai-proxy providerDomain / providerBasePath.
     */
    private List<LlmProviderEndpoint> buildEndpointsFromWasmDomainOverrides(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        String domain = MapUtils.getString(providerConfig, PROVIDER_DOMAIN_KEY);
        String basePath = MapUtils.getString(providerConfig, PROVIDER_BASE_PATH_KEY);
        if (StringUtils.isBlank(domain) && StringUtils.isBlank(basePath)) {
            return null;
        }
        if (StringUtils.isBlank(domain)) {
            domain = DEFAULT_SERVICE_DOMAIN;
        } else {
            domain = domain.trim();
        }
        if (StringUtils.isBlank(basePath)) {
            basePath = "/";
        } else {
            basePath = basePath.trim();
            if (!basePath.startsWith("/")) {
                basePath = "/" + basePath;
            }
        }
        String scheme = resolveWasmScheme(providerConfig);
        try {
            URI uri = buildUri(scheme, domain, basePath);
            return Collections.singletonList(LlmProviderEndpoint.fromUri(uri));
        } catch (URISyntaxException e) {
            throw new ValidationException("Invalid " + PROVIDER_DOMAIN_KEY + " / " + PROVIDER_BASE_PATH_KEY + ": "
                + domain + " / " + basePath, e);
        }
    }

    private String resolveWasmScheme(Map<String, Object> providerConfig) {
        List<URI> legacyUris = getLegacyCustomUris(providerConfig);
        if (CollectionUtils.isNotEmpty(legacyUris)) {
            String scheme = legacyUris.get(0).getScheme();
            if (StringUtils.equalsIgnoreCase(scheme, V1McpBridge.PROTOCOL_HTTP)) {
                return V1McpBridge.PROTOCOL_HTTP;
            }
            return V1McpBridge.PROTOCOL_HTTPS;
        }
        return V1McpBridge.PROTOCOL_HTTPS;
    }

    private List<URI> getLegacyCustomUris(Map<String, Object> providerConfig) {
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
        try {
            return Collections.singletonList(new URI(rawCustomUrl));
        } catch (URISyntaxException e) {
            throw new ValidationException("Claude custom URL is invalid: " + rawCustomUrl, e);
        }
    }


    private static URI buildUri(String scheme, String domainHostAndMaybePort, String path) throws URISyntaxException {
        String host;
        int port = -1;
        String domainTrim = domainHostAndMaybePort.trim();
        int colon = domainTrim.lastIndexOf(':');
        if (colon > 0 && colon < domainTrim.length() - 1) {
            String maybePort = domainTrim.substring(colon + 1);
            if (maybePort.matches("\\d{1,5}")) {
                host = domainTrim.substring(0, colon);
                port = Integer.parseInt(maybePort);
            } else {
                host = domainTrim;
            }
        } else {
            host = domainTrim;
        }
        if (port == -1) {
            port = V1McpBridge.PROTOCOL_HTTP.equals(scheme) ? DEFAULT_HTTP_PORT : DEFAULT_HTTPS_PORT;
        }
        return new URI(scheme, null, host, port, path, null, null);
    }

    private void validateWasmDomainOverrides(Map<String, Object> configurations) {
        String domain = MapUtils.getString(configurations, PROVIDER_DOMAIN_KEY);
        String basePath = MapUtils.getString(configurations, PROVIDER_BASE_PATH_KEY);
        if (StringUtils.isBlank(domain) && StringUtils.isBlank(basePath)) {
            return;
        }
        String normDomain = StringUtils.isBlank(domain) ? DEFAULT_SERVICE_DOMAIN : domain.trim();
        String normPath;
        if (StringUtils.isBlank(basePath)) {
            normPath = "/";
        } else {
            normPath = basePath.trim();
            if (!normPath.startsWith("/")) {
                normPath = "/" + normPath;
            }
            if (!StringUtils.equals(basePath, normPath)) {
                configurations.put(PROVIDER_BASE_PATH_KEY, normPath);
            }
        }
        try {
            buildUri(resolveWasmScheme(configurations), normDomain, normPath);
        } catch (URISyntaxException e) {
            throw new ValidationException("Invalid " + PROVIDER_DOMAIN_KEY + " / " + PROVIDER_BASE_PATH_KEY, e);
        }
    }

}
