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

import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_ON_STATUS;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_API_TOKENS;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_ID;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROTOCOL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ON_FAILURE;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.RetryOnFailureConfig;
import com.alibaba.higress.sdk.model.ai.TokenFailoverConfig;

public class AbstractLlmProviderHandlerTest {

    private final OpenaiLlmProviderHandler handler = new OpenaiLlmProviderHandler();

    @Test
    public void loadConfig_readsFailoverOnStatus() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(PROVIDER_ID, "test-provider");
        configs.put(PROTOCOL, "openai/v1");
        configs.put(PROVIDER_API_TOKENS, Collections.singletonList("sk-test"));

        Map<String, Object> failoverMap = new HashMap<>();
        failoverMap.put(FAILOVER_ENABLED, true);
        failoverMap.put(FAILOVER_ON_STATUS, Arrays.asList(502, 503, 504));
        configs.put(FAILOVER, failoverMap);

        LlmProvider provider = new LlmProvider();
        boolean result = handler.loadConfig(provider, configs);

        Assertions.assertTrue(result);
        TokenFailoverConfig failoverConfig = provider.getTokenFailoverConfig();
        Assertions.assertNotNull(failoverConfig);
        Assertions.assertEquals(Arrays.asList(502, 503, 504), failoverConfig.getFailoverOnStatus());
    }

    @Test
    public void loadConfig_readsFailoverOnStatusAsNumbers() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(PROVIDER_ID, "test-provider");
        configs.put(PROTOCOL, "openai/v1");

        Map<String, Object> failoverMap = new HashMap<>();
        failoverMap.put(FAILOVER_ON_STATUS, Arrays.asList(502L, 503L));
        configs.put(FAILOVER, failoverMap);

        LlmProvider provider = new LlmProvider();
        handler.loadConfig(provider, configs);

        List<Integer> statuses = provider.getTokenFailoverConfig().getFailoverOnStatus();
        Assertions.assertEquals(Arrays.asList(502, 503), statuses);
    }

    @Test
    public void loadConfig_readsRetryOnFailureConfig() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(PROVIDER_ID, "test-provider");
        configs.put(PROTOCOL, "openai/v1");

        Map<String, Object> retryMap = new HashMap<>();
        retryMap.put(RETRY_ENABLED, true);
        configs.put(RETRY_ON_FAILURE, retryMap);

        LlmProvider provider = new LlmProvider();
        handler.loadConfig(provider, configs);

        RetryOnFailureConfig retryConfig = provider.getRetryOnFailureConfig();
        Assertions.assertNotNull(retryConfig);
        Assertions.assertTrue(retryConfig.getEnabled());
    }

    @Test
    public void loadConfig_retryOnFailureNotSet_returnsNull() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(PROVIDER_ID, "test-provider");
        configs.put(PROTOCOL, "openai/v1");

        LlmProvider provider = new LlmProvider();
        handler.loadConfig(provider, configs);

        Assertions.assertNull(provider.getRetryOnFailureConfig());
    }

    @Test
    public void saveConfig_savesFailoverOnStatus() {
        Map<String, Object> configs = new HashMap<>();

        LlmProvider provider = new LlmProvider();
        provider.setName("test-provider");
        provider.setProtocol("openai/v1");
        TokenFailoverConfig failoverConfig = TokenFailoverConfig.builder()
            .enabled(true)
            .failoverOnStatus(Arrays.asList(502, 503))
            .build();
        provider.setTokenFailoverConfig(failoverConfig);

        handler.saveConfig(provider, configs);

        @SuppressWarnings("unchecked")
        Map<String, Object> savedFailover = (Map<String, Object>)configs.get(FAILOVER);
        Assertions.assertNotNull(savedFailover);
        @SuppressWarnings("unchecked")
        List<Integer> savedStatuses = (List<Integer>)savedFailover.get(FAILOVER_ON_STATUS);
        Assertions.assertEquals(Arrays.asList(502, 503), savedStatuses);
    }

    @Test
    public void saveConfig_emptyFailoverOnStatus_removesKey() {
        Map<String, Object> configs = new HashMap<>();

        LlmProvider provider = new LlmProvider();
        provider.setName("test-provider");
        provider.setProtocol("openai/v1");
        TokenFailoverConfig failoverConfig = TokenFailoverConfig.builder()
            .enabled(true)
            .failoverOnStatus(Collections.emptyList())
            .build();
        provider.setTokenFailoverConfig(failoverConfig);

        handler.saveConfig(provider, configs);

        @SuppressWarnings("unchecked")
        Map<String, Object> savedFailover = (Map<String, Object>)configs.get(FAILOVER);
        Assertions.assertNotNull(savedFailover);
        Assertions.assertNull(savedFailover.get(FAILOVER_ON_STATUS),
            "empty failoverOnStatus should be removed from config map");
    }

    @Test
    public void saveConfig_savesRetryOnFailureConfig() {
        Map<String, Object> configs = new HashMap<>();

        LlmProvider provider = new LlmProvider();
        provider.setName("test-provider");
        provider.setProtocol("openai/v1");
        provider.setRetryOnFailureConfig(RetryOnFailureConfig.builder().enabled(false).build());

        handler.saveConfig(provider, configs);

        @SuppressWarnings("unchecked")
        Map<String, Object> savedRetry = (Map<String, Object>)configs.get(RETRY_ON_FAILURE);
        Assertions.assertNotNull(savedRetry);
        Assertions.assertEquals(false, savedRetry.get(RETRY_ENABLED));
    }

    @Test
    public void saveConfig_nullRetryOnFailureConfig_removesKey() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(RETRY_ON_FAILURE, new HashMap<>());

        LlmProvider provider = new LlmProvider();
        provider.setName("test-provider");
        provider.setProtocol("openai/v1");

        handler.saveConfig(provider, configs);

        Assertions.assertNull(configs.get(RETRY_ON_FAILURE),
            "null retryOnFailureConfig should remove key from config map");
    }

    @Test
    public void roundTrip_failoverOnStatusAndRetryOnFailure() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(PROVIDER_ID, "test-provider");
        configs.put(PROTOCOL, "openai/v1");
        configs.put(PROVIDER_API_TOKENS, Arrays.asList("sk-1", "sk-2"));

        Map<String, Object> failoverMap = new HashMap<>();
        failoverMap.put(FAILOVER_ENABLED, true);
        failoverMap.put(FAILOVER_ON_STATUS, Arrays.asList(500, 502, 503));
        configs.put(FAILOVER, failoverMap);

        Map<String, Object> retryMap = new HashMap<>();
        retryMap.put(RETRY_ENABLED, false);
        configs.put(RETRY_ON_FAILURE, retryMap);

        LlmProvider provider = new LlmProvider();
        handler.loadConfig(provider, configs);

        Map<String, Object> savedConfigs = new HashMap<>();
        handler.saveConfig(provider, savedConfigs);

        LlmProvider reloaded = new LlmProvider();
        handler.loadConfig(reloaded, savedConfigs);

        Assertions.assertEquals(Arrays.asList("sk-1", "sk-2"), reloaded.getTokens());
        Assertions.assertEquals(Arrays.asList(500, 502, 503),
            reloaded.getTokenFailoverConfig().getFailoverOnStatus());
        Assertions.assertNotNull(reloaded.getRetryOnFailureConfig());
        Assertions.assertFalse(reloaded.getRetryOnFailureConfig().getEnabled());
    }
}