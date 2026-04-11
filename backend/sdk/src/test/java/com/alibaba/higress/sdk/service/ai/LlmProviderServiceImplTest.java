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

        Assertions.assertDoesNotThrow(() -> service.addOrUpdate(provider));
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
