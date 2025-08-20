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

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ValidateUtil;

public class OllamaLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String SERVER_HOST_KEY = "ollamaServerHost";
    private static final String SERVER_PORT_KEY = "ollamaServerPort";

    private static final int DEFAULT_PORT = 11434;

    @Override
    public String getType() {
        return LlmProviderType.OLLAMA;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            throw new ValidationException("Missing Azure specific configurations.");
        }
        Object serverHostObj = configurations.get(SERVER_HOST_KEY);
        if (!(serverHostObj instanceof String)) {
            throw new ValidationException(SERVER_HOST_KEY + " must be a string.");
        }
        String serverHost= (String)serverHostObj;
        if (StringUtils.isEmpty(serverHost)) {
            throw new ValidationException(SERVER_HOST_KEY + " cannot be empty.");
        }
        int serverPort = getIntConfig(configurations, SERVER_PORT_KEY);
        if (!ValidateUtil.checkPort(serverPort)) {
            throw new ValidationException(SERVER_PORT_KEY + " must be a valid port number.");
        }
        configurations.put(SERVER_PORT_KEY, serverPort);
    }

    @Override
    public boolean needSyncRouteAfterUpdate() {
        return true;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return Collections.singletonList(new LlmProviderEndpoint(getServiceProtocol(providerConfig),
            getServiceDomain(providerConfig), getServicePort(providerConfig), "/"));
    }

    private String getServiceDomain(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return "";
        }
        return (String)providerConfig.getOrDefault(SERVER_HOST_KEY, "");
    }

    private int getServicePort(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return DEFAULT_PORT;
        }
        try {
            int serverPort = getIntConfig(providerConfig, SERVER_PORT_KEY);
            return ValidateUtil.checkPort(serverPort) ? serverPort : DEFAULT_PORT;
        } catch (ValidationException ve) {
            return DEFAULT_PORT;
        }
    }

    private String getServiceProtocol(Map<String, Object> providerConfig) {
        return V1McpBridge.PROTOCOL_HTTP;
    }
}
