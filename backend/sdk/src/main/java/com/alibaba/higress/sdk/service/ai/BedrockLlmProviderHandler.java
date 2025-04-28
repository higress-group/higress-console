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

import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

public class BedrockLlmProviderHandler extends AbstractLlmProviderHandler {

    private static final String AWS_ACCESS_KEY_KEY = "awsAccessKey";
    private static final String AWS_SECRET_KEY_KEY = "awsSecretKey";
    private static final String AWS_REGION_KEY = "awsRegion";

    private static final String DOMAIN_FORMAT = "bedrock-runtime.%s.amazonaws.com";

    @Override
    public String getType() {
        return LlmProviderType.BEDROCK;
    }

    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            throw new ValidationException("Missing Bedrock specific configurations.");
        }

        String region = MapUtils.getString(configurations, AWS_REGION_KEY);
        if (StringUtils.isEmpty(region)) {
            throw new ValidationException(AWS_REGION_KEY + " cannot be empty.");
        }

        String accessKey = MapUtils.getString(configurations, AWS_ACCESS_KEY_KEY);
        if (StringUtils.isEmpty(accessKey)) {
            throw new ValidationException(AWS_ACCESS_KEY_KEY + " cannot be empty.");
        }

        String secretKey = MapUtils.getString(configurations, AWS_SECRET_KEY_KEY);
        if (StringUtils.isEmpty(secretKey)) {
            throw new ValidationException(AWS_SECRET_KEY_KEY + " cannot be empty.");
        }
    }

    @Override
    protected String getServiceRegistryType(Map<String, Object> providerConfig) {
        return V1McpBridge.REGISTRY_TYPE_DNS;
    }

    @Override
    protected String getServiceDomain(Map<String, Object> providerConfig) {
        String region = MapUtils.getString(providerConfig, AWS_REGION_KEY);
        if (StringUtils.isEmpty(region)) {
            throw new ValidationException(AWS_REGION_KEY + " cannot be empty.");
        }
        return String.format(DOMAIN_FORMAT, region);
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
