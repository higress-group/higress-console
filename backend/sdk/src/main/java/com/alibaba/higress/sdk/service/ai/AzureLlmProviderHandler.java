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
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

public class AzureLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String SERVICE_URL_KEY = "azureServiceUrl";

    @Override
    public String getType() {
        return LlmProviderType.AZURE;
    }

    @Override
    public void validateConfig(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)){
            throw new ValidationException("Missing Azure specific configurations.");
        }
        Object serviceUrlObj = configurations.get(SERVICE_URL_KEY);
        if (!(serviceUrlObj instanceof String serviceUrl)){
            throw new ValidationException(SERVICE_URL_KEY + " must be a string.");
        }
        if (StringUtils.isEmpty(serviceUrl)) {
            throw new ValidationException(SERVICE_URL_KEY + " cannot be empty.");
        }
        try {
            new URI(serviceUrl);
        } catch (URISyntaxException e) {
            throw new ValidationException(SERVICE_URL_KEY + " is not a valid URL.", e);
        }
    }

    @Override
    protected String getServiceRegistryType(Map<String, Object> providerConfig) {
        return V1McpBridge.REGISTRY_TYPE_DNS;
    }

    @Override
    protected String getServiceDomain(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)){
            return "";
        }
        String serviceUrl = (String)providerConfig.get(SERVICE_URL_KEY);
        if (StringUtils.isEmpty(serviceUrl)) {
            return "";
        }
        try {
            URI uri = new URI(serviceUrl);
            return uri.getHost();
        } catch (URISyntaxException e) {
            return null;
        }
    }

    @Override
    protected int getServicePort(Map<String, Object> providerConfig) {
        return 443;
    }

    @Override
    protected String getServiceProtocol(Map<String, Object> providerConfig) {
        return V1McpBridge.PROTOCOL_HTTPS;
    }
}
