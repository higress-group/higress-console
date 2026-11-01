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
package com.alibaba.higress.console.controller.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.TokenFailoverConfig;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "LLM service provider response without credential values")
public class LlmProviderResponse {

    private static final String AWS_ACCESS_KEY = "awsAccessKey";
    private static final String AWS_SECRET_KEY = "awsSecretKey";
    private static final String VERTEX_AUTH_KEY = "vertexAuthKey";

    @Schema(description = "Provider name")
    private String name;
    @Schema(description = "Provider type", ref = "LlmProviderType")
    private String type;
    @Schema(description = "Provider protocol", ref = "LlmProviderProtocol")
    private String protocol;
    @Schema(description = "Proxy server name")
    private String proxyName;
    @Schema(description = "Number of configured provider tokens")
    private int tokenCount;
    @Schema(description = "Whether an AWS access key is configured")
    private boolean awsAccessKeyConfigured;
    @Schema(description = "Whether an AWS secret key is configured")
    private boolean awsSecretKeyConfigured;
    @Schema(description = "Whether a Vertex authentication key is configured")
    private boolean vertexAuthKeyConfigured;
    @Schema(description = "Token fail-over configuration")
    private TokenFailoverConfig tokenFailoverConfig;
    @Schema(description = "Raw configuration key-value pairs without credential values")
    private Map<String, Object> rawConfigs;

    public static LlmProviderResponse from(LlmProvider provider) {
        if (provider == null) {
            return null;
        }

        Map<String, Object> rawConfigs = null;
        if (provider.getRawConfigs() != null) {
            rawConfigs = new HashMap<>(provider.getRawConfigs());
            rawConfigs.remove(AiProxyConfig.PROVIDER_API_TOKENS);
            rawConfigs.remove(AWS_ACCESS_KEY);
            rawConfigs.remove(AWS_SECRET_KEY);
            rawConfigs.remove(VERTEX_AUTH_KEY);
        }

        return LlmProviderResponse.builder().name(provider.getName()).type(provider.getType())
            .protocol(provider.getProtocol()).proxyName(provider.getProxyName())
            .tokenCount(getTokenCount(provider)).awsAccessKeyConfigured(isConfigured(provider, AWS_ACCESS_KEY))
            .awsSecretKeyConfigured(isConfigured(provider, AWS_SECRET_KEY))
            .vertexAuthKeyConfigured(isConfigured(provider, VERTEX_AUTH_KEY))
            .tokenFailoverConfig(provider.getTokenFailoverConfig()).rawConfigs(rawConfigs).build();
    }

    private static int getTokenCount(LlmProvider provider) {
        List<String> tokens = provider.getTokens();
        if (tokens != null) {
            return tokens.size();
        }
        if (provider.getRawConfigs() != null) {
            Object rawTokens = provider.getRawConfigs().get(AiProxyConfig.PROVIDER_API_TOKENS);
            if (rawTokens instanceof List<?>) {
                return ((List<?>)rawTokens).size();
            }
        }
        return 0;
    }

    private static boolean isConfigured(LlmProvider provider, String key) {
        return provider.getRawConfigs() != null
            && StringUtils.isNotEmpty(MapUtils.getString(provider.getRawConfigs(), key));
    }
}
