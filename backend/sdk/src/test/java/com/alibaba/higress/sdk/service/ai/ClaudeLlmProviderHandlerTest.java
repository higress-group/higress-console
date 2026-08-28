/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig;
import com.alibaba.higress.sdk.model.ai.LlmProvider;

/**
 * Tests for {@link ClaudeLlmProviderHandler}, focused on rebuilding the Claude custom URL in
 * {@link ClaudeLlmProviderHandler#loadConfig}. A URL entered without a trailing slash must not be rewritten with an
 * extra "/" on every config reload, since {@link com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint} defaults a
 * missing context path to "/".
 */
public class ClaudeLlmProviderHandlerTest {

    private static final String PROVIDER_NAME = "test-claude";
    private static final String CUSTOM_URL_KEY = "claudeCustomUrl";

    private ClaudeLlmProviderHandler handler;

    @BeforeEach
    public void setUp() {
        handler = new ClaudeLlmProviderHandler();
    }

    @Test
    @DisplayName("keeps a custom URL without a trailing slash unchanged instead of appending an extra '/'")
    public void loadConfig_customUrlWithoutTrailingSlash_isNotRewrittenWithExtraSlash() {
        LlmProvider provider = loadConfigWithCustomUrl("https://api.test.com");

        Assertions.assertEquals("https://api.test.com", customUrlOf(provider));
    }

    @Test
    @DisplayName("keeps the custom URL stable across repeated reloads so no slash accumulates")
    public void loadConfig_customUrlWithoutTrailingSlash_isStableAcrossReloads() {
        LlmProvider firstReload = loadConfigWithCustomUrl("https://api.test.com");
        String afterFirstReload = customUrlOf(firstReload);
        Assertions.assertEquals("https://api.test.com", afterFirstReload);

        // Feeding the rebuilt URL back in emulates a subsequent config reload; it must not grow another slash.
        LlmProvider secondReload = loadConfigWithCustomUrl(afterFirstReload);
        Assertions.assertEquals(afterFirstReload, customUrlOf(secondReload));
    }

    @Test
    @DisplayName("preserves a non-root context path on the custom URL")
    public void loadConfig_customUrlWithContextPath_isPreserved() {
        LlmProvider provider = loadConfigWithCustomUrl("https://api.test.com/custom/v1");

        Assertions.assertEquals("https://api.test.com/custom/v1", customUrlOf(provider));
    }

    @Test
    @DisplayName("collapses an all-slash context path so no trailing slash is left behind")
    public void loadConfig_customUrlWithOnlySlashesPath_collapsesTrailingSlash() {
        LlmProvider provider = loadConfigWithCustomUrl("https://api.test.com//");

        Assertions.assertEquals("https://api.test.com", customUrlOf(provider));
    }

    @Test
    @DisplayName("keeps a non-default port and still avoids appending an extra '/'")
    public void loadConfig_customUrlWithCustomPort_preservesPortWithoutExtraSlash() {
        LlmProvider provider = loadConfigWithCustomUrl("https://api.test.com:8443");

        Assertions.assertEquals("https://api.test.com:8443", customUrlOf(provider));
    }

    @Test
    @DisplayName("drops the custom URL when it points at the default Claude endpoint")
    public void loadConfig_defaultEndpoint_removesCustomUrl() {
        LlmProvider provider = loadConfigWithCustomUrl("https://api.anthropic.com/");

        Assertions.assertFalse(provider.getRawConfigs().containsKey(CUSTOM_URL_KEY));
    }

    private LlmProvider loadConfigWithCustomUrl(String customUrl) {
        Map<String, Object> configurations = new HashMap<>();
        configurations.put(AiProxyConfig.PROVIDER_ID, PROVIDER_NAME);
        configurations.put(CUSTOM_URL_KEY, customUrl);
        LlmProvider provider = new LlmProvider();
        Assertions.assertTrue(handler.loadConfig(provider, configurations));
        return provider;
    }

    private static String customUrlOf(LlmProvider provider) {
        return (String)provider.getRawConfigs().get(CUSTOM_URL_KEY);
    }
}
