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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;

public class LlmProviderServiceImplTest {

    private static final String TEST_PROVIDER_NAME = "test-provider";

    private WasmPluginInstanceService wasmPluginInstanceService;
    private ServiceSourceService serviceSourceService;
    private AiRouteService aiRouteService;
    private LlmProviderServiceImpl service;

    @BeforeEach
    public void setUp() {
        wasmPluginInstanceService = Mockito.mock(WasmPluginInstanceService.class);
        serviceSourceService = Mockito.mock(ServiceSourceService.class);
        aiRouteService = Mockito.mock(AiRouteService.class);
        service = new LlmProviderServiceImpl(serviceSourceService, wasmPluginInstanceService);
        service.setAiRouteService(aiRouteService);
    }

    @AfterEach
    public void tearDown() {
        service = null;
        wasmPluginInstanceService = null;
        serviceSourceService = null;
        aiRouteService = null;
    }

    @Test
    public void addOrUpdate_newProvider_callsAddOrUpdateAll() {
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.AI_PROXY), anyBoolean()))
            .thenReturn(Collections.emptyList());
        when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_PROXY))
            .thenReturn(createEmptyGlobalInstance());
        when(aiRouteService.list(any(CommonPageQuery.class)))
            .thenReturn(createEmptyPaginatedResult());
        when(wasmPluginInstanceService.addOrUpdateAll(any()))
            .thenReturn(Collections.emptyList());

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);

        service.addOrUpdate(provider);

        verify(wasmPluginInstanceService).addOrUpdateAll(any());
        verify(serviceSourceService).addOrUpdate(any(ServiceSource.class));
    }

    @Test
    public void addOrUpdate_existingProvider_callsAddOrUpdateAll() {
        WasmPluginInstance existingGlobalInstance = createGlobalInstance();

        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.AI_PROXY), anyBoolean()))
            .thenReturn(Collections.singletonList(existingGlobalInstance));
        when(aiRouteService.list(any(CommonPageQuery.class)))
            .thenReturn(createEmptyPaginatedResult());
        when(wasmPluginInstanceService.addOrUpdateAll(any()))
            .thenReturn(Collections.emptyList());

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);

        service.addOrUpdate(provider);

        verify(wasmPluginInstanceService).addOrUpdateAll(any());
    }

    @Test
    public void addOrUpdate_nullRawConfigs_doesNotThrow() {
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.AI_PROXY), anyBoolean()))
            .thenReturn(Collections.emptyList());
        when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_PROXY))
            .thenReturn(createEmptyGlobalInstance());
        when(aiRouteService.list(any(CommonPageQuery.class)))
            .thenReturn(createEmptyPaginatedResult());
        when(wasmPluginInstanceService.addOrUpdateAll(any()))
            .thenReturn(Collections.emptyList());

        LlmProvider provider = LlmProvider.builder()
            .name(TEST_PROVIDER_NAME)
            .type(LlmProviderType.OPENAI)
            .rawConfigs(null)
            .build();

        service.addOrUpdate(provider);
    }

    @Test
    public void addOrUpdate_invalidProviderType_throwsValidationException() {
        LlmProvider provider = LlmProvider.builder()
            .name(TEST_PROVIDER_NAME)
            .type("invalid-type")
            .rawConfigs(new HashMap<>())
            .build();

        ValidationException exception = Assertions.assertThrows(ValidationException.class, () -> {
            service.addOrUpdate(provider);
        });

        Assertions.assertTrue(exception.getMessage().contains("invalid-type"));
        verify(wasmPluginInstanceService, never()).addOrUpdateAll(any());
    }

    @Test
    public void addOrUpdate_addOrUpdateAllIsCalledWithInstancesList() {
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.AI_PROXY), anyBoolean()))
            .thenReturn(Collections.emptyList());
        when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_PROXY))
            .thenReturn(createEmptyGlobalInstance());
        when(aiRouteService.list(any(CommonPageQuery.class)))
            .thenReturn(createEmptyPaginatedResult());
        when(wasmPluginInstanceService.addOrUpdateAll(any()))
            .thenReturn(Collections.emptyList());

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);

        service.addOrUpdate(provider);

        ArgumentCaptor<List<WasmPluginInstance>> instancesCaptor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(instancesCaptor.capture());

        List<WasmPluginInstance> capturedInstances = instancesCaptor.getValue();
        Assertions.assertFalse(capturedInstances.isEmpty(), "addOrUpdateAll should be called with non-empty list");
        boolean hasGlobalInstance = capturedInstances.stream()
            .anyMatch(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL));
        boolean hasServiceInstance = capturedInstances.stream()
            .anyMatch(i -> i.hasScopedTarget(WasmPluginInstanceScope.SERVICE));
        Assertions.assertTrue(hasGlobalInstance, "Should contain global instance");
        Assertions.assertTrue(hasServiceInstance, "Should contain service instance");
    }

    @Test
    public void addOrUpdate_tokensSupportKeepReplaceAndClear() {
        Map<String, Object> providerConfig = new HashMap<>();
        providerConfig.put(AiProxyConfig.PROVIDER_ID, TEST_PROVIDER_NAME);
        providerConfig.put(AiProxyConfig.PROVIDER_TYPE, LlmProviderType.OPENAI);
        providerConfig.put(AiProxyConfig.PROVIDER_API_TOKENS, Lists.newArrayList("old-token"));
        WasmPluginInstance globalInstance = createGlobalInstance(providerConfig);
        prepareExistingProvider(globalInstance);

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);
        provider.getRawConfigs().put(AiProxyConfig.PROVIDER_API_TOKENS, null);
        service.addOrUpdate(provider);
        Assertions.assertEquals(Lists.newArrayList("old-token"),
            getProviderConfig(globalInstance).get(AiProxyConfig.PROVIDER_API_TOKENS));

        provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);
        provider.setTokens(Lists.newArrayList("new-token"));
        service.addOrUpdate(provider);
        Assertions.assertEquals(Lists.newArrayList("new-token"),
            getProviderConfig(globalInstance).get(AiProxyConfig.PROVIDER_API_TOKENS));

        provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.OPENAI);
        provider.setTokens(Collections.emptyList());
        service.addOrUpdate(provider);
        Assertions.assertFalse(getProviderConfig(globalInstance).containsKey(AiProxyConfig.PROVIDER_API_TOKENS));
    }

    @Test
    public void addOrUpdate_bedrockSecretsMergeBeforeValidationAndCanBeCleared() {
        Map<String, Object> providerConfig = new HashMap<>();
        providerConfig.put(AiProxyConfig.PROVIDER_ID, TEST_PROVIDER_NAME);
        providerConfig.put(AiProxyConfig.PROVIDER_TYPE, LlmProviderType.BEDROCK);
        providerConfig.put("awsRegion", "us-east-1");
        providerConfig.put("awsAccessKey", "old-access-key");
        providerConfig.put("awsSecretKey", "old-secret-key");
        WasmPluginInstance globalInstance = createGlobalInstance(providerConfig);
        prepareExistingProvider(globalInstance);

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.BEDROCK);
        provider.getRawConfigs().put("awsRegion", "us-east-1");
        service.addOrUpdate(provider);
        Assertions.assertEquals("old-access-key", getProviderConfig(globalInstance).get("awsAccessKey"));
        Assertions.assertEquals("old-secret-key", getProviderConfig(globalInstance).get("awsSecretKey"));

        provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.BEDROCK);
        provider.getRawConfigs().put("awsRegion", "us-east-1");
        provider.getRawConfigs().put("awsAccessKey", "");
        provider.getRawConfigs().put("awsSecretKey", "");
        service.addOrUpdate(provider);
        Assertions.assertEquals("", getProviderConfig(globalInstance).get("awsAccessKey"));
        Assertions.assertEquals("", getProviderConfig(globalInstance).get("awsSecretKey"));
    }

    @Test
    public void addOrUpdate_bedrockSecretsCanBeReplaced() {
        Map<String, Object> providerConfig = new HashMap<>();
        providerConfig.put(AiProxyConfig.PROVIDER_ID, TEST_PROVIDER_NAME);
        providerConfig.put(AiProxyConfig.PROVIDER_TYPE, LlmProviderType.BEDROCK);
        providerConfig.put("awsRegion", "us-east-1");
        providerConfig.put("awsAccessKey", "old-access-key");
        providerConfig.put("awsSecretKey", "old-secret-key");
        WasmPluginInstance globalInstance = createGlobalInstance(providerConfig);
        prepareExistingProvider(globalInstance);

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.BEDROCK);
        provider.getRawConfigs().put("awsRegion", "us-east-1");
        provider.getRawConfigs().put("awsAccessKey", "new-access-key");
        provider.getRawConfigs().put("awsSecretKey", "new-secret-key");
        service.addOrUpdate(provider);

        Assertions.assertEquals("new-access-key", getProviderConfig(globalInstance).get("awsAccessKey"));
        Assertions.assertEquals("new-secret-key", getProviderConfig(globalInstance).get("awsSecretKey"));
    }

    @Test
    public void addOrUpdate_vertexSecretMergesBeforeValidationAndCanBeCleared() {
        Map<String, Object> providerConfig = new HashMap<>();
        providerConfig.put(AiProxyConfig.PROVIDER_ID, TEST_PROVIDER_NAME);
        providerConfig.put(AiProxyConfig.PROVIDER_TYPE, LlmProviderType.VERTEX);
        providerConfig.put("vertexRegion", "us-central1");
        providerConfig.put("vertexProjectId", "project");
        providerConfig.put("vertexAuthKey", createVertexAuthKey());
        WasmPluginInstance globalInstance = createGlobalInstance(providerConfig);
        prepareExistingProvider(globalInstance);

        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.VERTEX);
        provider.getRawConfigs().put("vertexRegion", "us-central1");
        provider.getRawConfigs().put("vertexProjectId", "project");
        service.addOrUpdate(provider);
        Assertions.assertEquals(createVertexAuthKey(), getProviderConfig(globalInstance).get("vertexAuthKey"));

        provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.VERTEX);
        provider.getRawConfigs().put("vertexRegion", "us-central1");
        provider.getRawConfigs().put("vertexProjectId", "project");
        provider.getRawConfigs().put("vertexAuthKey", "");
        service.addOrUpdate(provider);
        Assertions.assertEquals("", getProviderConfig(globalInstance).get("vertexAuthKey"));
    }

    @Test
    public void addOrUpdate_vertexSecretCanBeReplaced() {
        Map<String, Object> providerConfig = new HashMap<>();
        providerConfig.put(AiProxyConfig.PROVIDER_ID, TEST_PROVIDER_NAME);
        providerConfig.put(AiProxyConfig.PROVIDER_TYPE, LlmProviderType.VERTEX);
        providerConfig.put("vertexRegion", "us-central1");
        providerConfig.put("vertexProjectId", "project");
        providerConfig.put("vertexAuthKey", createVertexAuthKey());
        WasmPluginInstance globalInstance = createGlobalInstance(providerConfig);
        prepareExistingProvider(globalInstance);

        String replacementAuthKey = "{\"client_email\":\"replacement@example.com\","
            + "\"private_key_id\":\"replacement-key-id\",\"private_key\":\"replacement-private-key\","
            + "\"token_uri\":\"https://oauth2.googleapis.com/token\"}";
        LlmProvider provider = buildProvider(TEST_PROVIDER_NAME, LlmProviderType.VERTEX);
        provider.getRawConfigs().put("vertexRegion", "us-central1");
        provider.getRawConfigs().put("vertexProjectId", "project");
        provider.getRawConfigs().put("vertexAuthKey", replacementAuthKey);
        service.addOrUpdate(provider);

        Assertions.assertEquals(replacementAuthKey, getProviderConfig(globalInstance).get("vertexAuthKey"));
    }

    private void prepareExistingProvider(WasmPluginInstance globalInstance) {
        when(wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, BuiltInPluginName.AI_PROXY, true))
            .thenReturn(globalInstance);
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.AI_PROXY), anyBoolean()))
            .thenReturn(Collections.singletonList(globalInstance));
        when(aiRouteService.list(any(CommonPageQuery.class))).thenReturn(createEmptyPaginatedResult());
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getProviderConfig(WasmPluginInstance globalInstance) {
        List<Object> providers = (List<Object>)globalInstance.getConfigurations().get(AiProxyConfig.PROVIDERS);
        return (Map<String, Object>)providers.get(0);
    }

    private static String createVertexAuthKey() {
        return "{\"client_email\":\"test@example.com\",\"private_key_id\":\"key-id\","
            + "\"private_key\":\"private-key\",\"token_uri\":\"https://oauth2.googleapis.com/token\"}";
    }

    private PaginatedResult<AiRoute> createEmptyPaginatedResult() {
        PaginatedResult<AiRoute> result = new PaginatedResult<>();
        result.setData(Collections.emptyList());
        result.setTotal(0);
        return result;
    }

    private LlmProvider buildProvider(String name, String type) {
        Map<String, Object> rawConfigs = new HashMap<>();
        rawConfigs.put("model", "gpt-4");
        rawConfigs.put("apiKey", "test-key");
        return LlmProvider.builder()
            .name(name)
            .type(type)
            .protocol("openai-v1")
            .rawConfigs(rawConfigs)
            .build();
    }

    private WasmPluginInstance createEmptyGlobalInstance() {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(BuiltInPluginName.AI_PROXY);
        instance.setPluginVersion("1.0.0");
        instance.setInternal(true);
        instance.setEnabled(true);
        instance.setTargets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null));
        instance.setConfigurations(new HashMap<>());
        return instance;
    }

    @SuppressWarnings("unchecked")
    private WasmPluginInstance createGlobalInstance(Map<String, Object> providerConfig) {
        WasmPluginInstance instance = createGlobalInstance();
        List<Object> providers = (List<Object>)instance.getConfigurations().get(AiProxyConfig.PROVIDERS);
        providers.add(providerConfig);
        return instance;
    }

    private WasmPluginInstance createGlobalInstance() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AiProxyConfig.PROVIDERS, new ArrayList<>());
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(BuiltInPluginName.AI_PROXY);
        instance.setPluginVersion("1.0.0");
        instance.setInternal(true);
        instance.setEnabled(true);
        instance.setTargets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null));
        instance.setConfigurations(configs);
        return instance;
    }
}
