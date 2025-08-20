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
package com.alibaba.higress.sdk.service.consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.commons.collections4.MapUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.AllowList;
import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredentialSource;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;

@ExtendWith(MockitoExtension.class)
public class ConsumerServiceTest {

    private WasmPluginInstanceService wasmPluginInstanceService;

    private ConsumerServiceImpl consumerService;

    @BeforeEach
    void setUp() {
        wasmPluginInstanceService = mock(WasmPluginInstanceService.class);
        when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.KEY_AUTH))
            .thenAnswer(a -> createTestInstance());
        consumerService = new ConsumerServiceImpl(wasmPluginInstanceService);
    }

    @AfterEach
    void tearDown() {
        consumerService = null;
        reset(wasmPluginInstanceService);
        wasmPluginInstanceService = null;
    }

    @Test
    void testAddOrUpdate_NewConsumer() {
        // Given
        Consumer consumer = createTestConsumer("testUser");
        WasmPluginInstance instance = createTestInstance();

        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(instance);

        // When
        Consumer result = consumerService.addOrUpdate(consumer);

        // Then
        verify(wasmPluginInstanceService).addOrUpdateAll(Collections.singletonList(instance));
        assertNotNull(result);
        assertEquals(result, consumer);
    }

    @Test
    @SuppressWarnings("unchecked")
    void testAddOrUpdate_UpdateExistingConsumer() {
        // Given
        Consumer consumer = createTestConsumer("testUser");

        AtomicReference<WasmPluginInstance> globalInstanceRef = new AtomicReference<>();

        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenAnswer(a -> globalInstanceRef.get());
        when(wasmPluginInstanceService.addOrUpdateAll(any())).thenAnswer(a -> {
            List<WasmPluginInstance> instance = a.getArgument(0);
            globalInstanceRef.set(instance.get(0));
            return instance;
        });

        // When
        Consumer result = consumerService.addOrUpdate(consumer);

        // Then
        assertNotNull(result);
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());

        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(1, actualInstances.size());
        WasmPluginInstance instance = actualInstances.get(0);
        assertEquals(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null), instance.getTargets());
        Map<String, Object> configurations = instance.getConfigurations();
        validateDefaultGlobalConfig(configurations);

        assertNotNull(configurations.get("consumers"), "Consumers configuration should not be null");
        List<Map<String, Object>> consumers = (List<Map<String, Object>>)configurations.get("consumers");
        assertEquals(1, consumers.size(), "There should be exactly one consumer in the configuration");
        Map<String, Object> consumerConfig = consumers.get(0);
        assertEquals("testUser", consumerConfig.get("name"), "Consumer name should match the added consumer");
        assertEquals(Lists.newArrayList("Authorization"), consumerConfig.get("keys"),
            "Keys should match the added consumer's keys");
        assertEquals(true, consumerConfig.get("in_header"), "Consumer should be configured for header authentication");
        assertEquals(Lists.newArrayList("test-key"), consumerConfig.get("credentials"),
            "Credentials should match the added consumer's credentials");
    }

    private void validateDefaultGlobalConfig(Map<String, Object> configurations) {
        assertFalse(MapUtils.isEmpty(configurations));
        assertEquals(Collections.singletonList("x-higress-dummy-key"), configurations.get("keys"));
        assertEquals(Boolean.FALSE, configurations.get("global_auth"));
        assertEquals(Collections.emptyList(), configurations.get("allow"));
        assertNotNull(configurations.get("consumers"));
    }

    @Test
    void testList() {
        // Given
        CommonPageQuery pageQuery = new CommonPageQuery();
        pageQuery.setPageNum(1);
        pageQuery.setPageSize(10);

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(instance);

        // When
        PaginatedResult<Consumer> result = consumerService.list(pageQuery);

        // Then
        assertNotNull(result);
        assertNotNull(result.getData());
        assertTrue(result.getData().isEmpty());
    }

    @Test
    void testQuery_ValidConsumerName() {
        // Given
        String consumerName = "testUser";
        WasmPluginInstance instance = createTestInstance();
        instance.setGlobalTarget();
        Map<String, Object> config = new HashMap<>();
        config.put("consumers",
            Arrays.asList(ImmutableMap.of("name", consumerName, "keys", Lists.newArrayList("Authorization"),
                "in_header", true, "credentials", Lists.newArrayList("Bearer test-key"))));
        instance.setConfigurations(config);
        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(instance);

        // When
        Consumer result = consumerService.query(consumerName);

        verify(wasmPluginInstanceService).query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true));

        // Then
        assertNotNull(result);
        assertEquals(consumerName, result.getName());
        assertNotNull(result.getCredentials());
        assertEquals(1, result.getCredentials().size());
        KeyAuthCredential credential = (KeyAuthCredential)result.getCredentials().get(0);
        assertEquals(KeyAuthCredentialSource.BEARER.name(), credential.getSource());
        assertNull(credential.getKey());
        assertEquals(Lists.newArrayList("test-key"), credential.getValues());

        clearInvocations(wasmPluginInstanceService);

        // When
        result = consumerService.query(consumerName + "_dummy");

        verify(wasmPluginInstanceService).query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true));

        assertNull(result);
    }

    @Test
    void testQuery_EmptyConsumerName() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.query(""));
        assertThrows(IllegalArgumentException.class, () -> consumerService.query(null));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testDelete_ValidConsumerName() {
        // Given
        String consumerName = "testUser";
        WasmPluginInstance instance = createTestInstance();
        instance.setGlobalTarget();
        Map<String, Object> config = new HashMap<>();
        config.put("consumers",
            Arrays.asList(
                ImmutableMap.of("name", consumerName + "_1", "keys", Lists.newArrayList("Authorization"), "in_header",
                    true, "credentials", Lists.newArrayList("Bearer test-key-1")),
                ImmutableMap.of("name", consumerName + "_2", "keys", Lists.newArrayList("x-api-key"), "in_header", true,
                    "credentials", Lists.newArrayList("test-key-2"))));
        instance.setConfigurations(config);
        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH, true)).thenReturn(Lists.newArrayList(instance));

        // When
        consumerService.delete(consumerName + "_1");

        // Then - should not throw exception

        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));

        // Then
        ArgumentCaptor<WasmPluginInstance> captor = ArgumentCaptor.forClass(WasmPluginInstance.class);
        verify(wasmPluginInstanceService).addOrUpdate(captor.capture());
        WasmPluginInstance actualInstance = captor.getValue();
        assertNotNull(actualInstance);
        assertTrue(actualInstance.hasScopedTarget(WasmPluginInstanceScope.GLOBAL));
        Map<String, Object> configurations = actualInstance.getConfigurations();
        assertNotNull(configurations);
        assertEquals(1, ((List<?>)configurations.get("consumers")).size());
        Map<String, Object> consumerConfig = (Map<String, Object>)((List<?>)configurations.get("consumers")).get(0);
        assertEquals(consumerName + "_2", consumerConfig.get("name"));
    }

    @Test
    void testDelete_ConsumerNotFound() {
        // Given
        String consumerName = "testUser";
        WasmPluginInstance instance = createTestInstance();
        instance.setGlobalTarget();
        Map<String, Object> config = new HashMap<>();
        config.put("consumers",
            Arrays.asList(
                ImmutableMap.of("name", consumerName + "_1", "keys", Lists.newArrayList("Authorization"), "in_header",
                    true, "credentials", Lists.newArrayList("Bearer test-key-1")),
                ImmutableMap.of("name", consumerName + "_2", "keys", Lists.newArrayList("x-api-key"), "in_header", true,
                    "credentials", Lists.newArrayList("test-key-2"))));
        instance.setConfigurations(config);
        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH, true)).thenReturn(Lists.newArrayList(instance));

        // When
        consumerService.delete(consumerName + "_3");

        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));

        // Then
        verify(wasmPluginInstanceService, never()).addOrUpdate(any());
    }

    @Test
    void testDelete_ConsumerInUse() {
        // Given
        String consumerName = "testUser";
        WasmPluginInstance globalInstance = createTestInstance();
        globalInstance.setGlobalTarget();

        WasmPluginInstance domainInstance = createTestInstance();
        domainInstance.setTarget(WasmPluginInstanceScope.DOMAIN, "example.com");
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Lists.newArrayList(consumerName));
        domainInstance.setConfigurations(config);

        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH, true))
            .thenReturn(Lists.newArrayList(globalInstance, domainInstance));

        // When & Then
        assertThrows(BusinessException.class, () -> consumerService.delete(consumerName));
    }

    @Test
    void testDelete_EmptyConsumerName() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.delete(""));
        assertThrows(IllegalArgumentException.class, () -> consumerService.delete(null));
    }

    @Test
    void testListAllowLists() {
        // Given
        WasmPluginInstance domainInstance = createTestInstance();
        domainInstance.setTarget(WasmPluginInstanceScope.DOMAIN, "example.com");
        domainInstance.setEnabled(true);
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Lists.newArrayList("user1", "user2"));
        domainInstance.setConfigurations(config);

        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH, true))
            .thenReturn(Lists.newArrayList(domainInstance));

        // When
        List<AllowList> result = consumerService.listAllowLists();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        AllowList allowList = result.get(0);
        assertTrue(allowList.getAuthEnabled());
        assertEquals(2, allowList.getConsumerNames().size());
        assertTrue(allowList.getConsumerNames().contains("user1"));
        assertTrue(allowList.getConsumerNames().contains("user2"));
    }

    @Test
    void testGetAllowList_ValidTargets_EnabledNonEmptyConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        WasmPluginInstance instance = createTestInstance();
        instance.setEnabled(true);
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Lists.newArrayList("user1"));
        instance.setConfigurations(config);

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When
        AllowList result = consumerService.getAllowList(targets);

        // Then
        assertNotNull(result);
        assertTrue(result.getAuthEnabled());
        assertEquals(1, result.getConsumerNames().size());
        assertTrue(result.getConsumerNames().contains("user1"));
    }

    @Test
    void testGetAllowList_ValidTargets_EnabledEmptyConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        WasmPluginInstance instance = createTestInstance();
        instance.setEnabled(true);
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Collections.emptyList());
        instance.setConfigurations(config);

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
                .thenReturn(instance);

        // When
        AllowList result = consumerService.getAllowList(targets);

        // Then
        assertNotNull(result);
        assertTrue(result.getAuthEnabled());
        assertEquals(0, result.getConsumerNames().size());
    }

    @Test
    void testGetAllowList_ValidTargets_DisabledNonEmptyConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        WasmPluginInstance instance = createTestInstance();
        instance.setEnabled(false);
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Lists.newArrayList("user1", "user2"));
        instance.setConfigurations(config);

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
                .thenReturn(instance);

        // When
        AllowList result = consumerService.getAllowList(targets);

        // Then
        assertNotNull(result);
        assertFalse(result.getAuthEnabled());
        assertEquals(2, result.getConsumerNames().size());
        assertTrue(result.getConsumerNames().contains("user1"));
        assertTrue(result.getConsumerNames().contains("user2"));
    }

    @Test
    void testGetAllowList_ValidTargets_DisabledEmptyConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        WasmPluginInstance instance = createTestInstance();
        instance.setEnabled(false);
        Map<String, Object> config = new HashMap<>();
        config.put("allow", Collections.emptyList());
        instance.setConfigurations(config);

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
                .thenReturn(instance);

        // When
        AllowList result = consumerService.getAllowList(targets);

        // Then
        assertNotNull(result);
        assertFalse(result.getAuthEnabled());
        assertEquals(0, result.getConsumerNames().size());
    }

    @Test
    void testGetAllowList_EmptyTargets() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.getAllowList(null));
        assertThrows(IllegalArgumentException.class, () -> consumerService.getAllowList(new HashMap<>()));
    }

    @Test
    void testGetAllowList_GlobalScope() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.GLOBAL, null);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.getAllowList(targets));
    }

    @Test
    void testGetAllowList_NoInstance() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(null);

        // When
        AllowList result = consumerService.getAllowList(targets);

        // Then
        assertNull(result);
    }

    @Test
    void testUpdateAllowList_AddOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(Lists.newArrayList("user2"))
            .build();

        WasmPluginInstance globalInstance = createTestInstance();
        globalInstance.setGlobalTarget();
        WasmPluginInstance targetedInstance = createTestInstance();
        targetedInstance.setTargets(targets);
        targetedInstance.setConfigurations(new HashMap<>());
        targetedInstance.getConfigurations().put("allow", Lists.newArrayList("user1"));
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(Arrays.asList(globalInstance, targetedInstance));

        // When
        consumerService.updateAllowList(AllowListOperation.ADD, allowList);

        // Then
        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());
        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(1, actualInstances.size());
        WasmPluginInstance actualInstance = actualInstances.get(0);
        assertEquals(BuiltInPluginName.KEY_AUTH, actualInstance.getPluginName());
        assertEquals(targets, actualInstance.getTargets());
        Map<String, Object> configurations = actualInstance.getConfigurations();
        assertNotNull(configurations);
        assertEquals(Arrays.asList("user1", "user2"), configurations.get("allow"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testUpdateAllowList_RemoveOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.ROUTE, "test-route");

        WasmPluginInstance globalInstance = createTestInstance();
        globalInstance.setGlobalTarget();
        WasmPluginInstance targetedInstance = createTestInstance();
        targetedInstance.setTargets(targets);
        targetedInstance.setConfigurations(MapUtil.of("allow", Lists.newArrayList("user1", "user2")));
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(Lists.newArrayList(globalInstance, targetedInstance));

        // When
        AllowList allowList = AllowList.builder().targets(targets).authEnabled(false)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(Lists.newArrayList("user1"))
            .build();
        consumerService.updateAllowList(AllowListOperation.REMOVE, allowList);

        // Then
        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());
        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(1, actualInstances.size());
        WasmPluginInstance actualInstance = actualInstances.get(0);
        assertEquals(BuiltInPluginName.KEY_AUTH, actualInstance.getPluginName());
        assertEquals(targets, actualInstance.getTargets());
        Map<String, Object> configurations = actualInstance.getConfigurations();
        assertNotNull(configurations);
        assertEquals(Collections.singletonList("user2"), configurations.get("allow"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testUpdateAllowList_ReplaceOperation_New() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(Lists.newArrayList("user1", "user2")).build();

        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(null);

        // When
        consumerService.updateAllowList(AllowListOperation.REPLACE, allowList);

        // Then
        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());
        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(2, actualInstances.size());

        WasmPluginInstance globalInstance = actualInstances.stream()
            .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);
        assertNotNull(globalInstance);
        validateDefaultGlobalConfig(globalInstance.getConfigurations());

        WasmPluginInstance targetedInstance = actualInstances.stream()
            .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.DOMAIN)).findFirst().orElse(null);
        assertNotNull(targetedInstance);
        assertEquals(targets, targetedInstance.getTargets());
        Map<String, Object> targetedConfigs = targetedInstance.getConfigurations();
        assertNotNull(targetedConfigs);
        assertEquals(Lists.newArrayList("user1", "user2"), targetedConfigs.get("allow"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testUpdateAllowList_ReplaceOperation_Update() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(Lists.newArrayList("user1", "user2")).build();

        WasmPluginInstance globalInstance = createTestInstance();
        globalInstance.setGlobalTarget();
        WasmPluginInstance targetedInstance = createTestInstance();
        targetedInstance.setTargets(targets);
        targetedInstance.setConfigurations(MapUtil.of("allow", Lists.newArrayList("user3")));

        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(Lists.newArrayList(globalInstance, targetedInstance));

        // When
        consumerService.updateAllowList(AllowListOperation.REPLACE, allowList);

        // Then
        verify(wasmPluginInstanceService).list(eq(BuiltInPluginName.KEY_AUTH), eq(true));
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());
        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(1, actualInstances.size());

        WasmPluginInstance actualInstance = actualInstances.get(0);
        assertNotNull(actualInstance);
        assertEquals(targets, actualInstance.getTargets());
        Map<String, Object> actualConfigs = actualInstance.getConfigurations();
        assertNotNull(actualConfigs);
        assertEquals(Lists.newArrayList("user1", "user2"), actualConfigs.get("allow"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testUpdateAllowList_ToggleOnlyOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(false)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(new ArrayList<>()).build();

        WasmPluginInstance globalInstance = createTestInstance();
        globalInstance.setGlobalTarget();
        when(wasmPluginInstanceService.list(eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(Collections.singletonList(globalInstance));
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(null);

        // When
        consumerService.updateAllowList(AllowListOperation.TOGGLE_ONLY, allowList);

        // Then
        ArgumentCaptor<List<WasmPluginInstance>> captor = ArgumentCaptor.forClass(List.class);
        verify(wasmPluginInstanceService).addOrUpdateAll(captor.capture());
        List<WasmPluginInstance> actualInstances = captor.getValue();
        assertNotNull(actualInstances);
        assertEquals(1, actualInstances.size());
        assertEquals(targets, actualInstances.get(0).getTargets());
    }

    @Test
    void testUpdateAllowList_NullOperation() {
        // Given
        AllowList allowList = AllowList.builder()
            .targets(Collections.singletonMap(WasmPluginInstanceScope.DOMAIN, "example.com")).build();

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.updateAllowList(null, allowList));
    }

    @Test
    void testUpdateAllowList_NullAllowList() {
        // When & Then
        assertThrows(IllegalArgumentException.class,
            () -> consumerService.updateAllowList(AllowListOperation.ADD, null));
    }

    @Test
    void testUpdateAllowList_EmptyTargets() {
        // Given
        AllowList allowList = AllowList.builder().targets(new HashMap<>()).build();

        // When & Then
        assertThrows(IllegalArgumentException.class,
            () -> consumerService.updateAllowList(AllowListOperation.ADD, allowList));
    }

    @Test
    void testUpdateAllowList_GlobalScope() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.GLOBAL, null);

        AllowList allowList = AllowList.builder().targets(targets).build();

        // When & Then
        assertThrows(IllegalArgumentException.class,
            () -> consumerService.updateAllowList(AllowListOperation.ADD, allowList));
    }

    @Test
    void testUpdateAllowList_UnsupportedCredentialType() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets)
            .credentialTypes(Lists.newArrayList("UNSUPPORTED_TYPE")).consumerNames(Lists.newArrayList("user1")).build();

        // When & Then
        assertThrows(IllegalArgumentException.class,
            () -> consumerService.updateAllowList(AllowListOperation.ADD, allowList));
    }

    @Test
    void testUpdateAllowList_AddEmptyConsumerNamesAndNullAuthEnabled() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList =
            AllowList.builder().targets(targets).credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
                .consumerNames(new ArrayList<>()).authEnabled(null).build();

        // When
        consumerService.updateAllowList(AllowListOperation.ADD, allowList);

        // Then - should return early without doing anything
        verify(wasmPluginInstanceService, never()).addOrUpdate(any());
    }

    @Test
    void testUpdateAllowList_ToggleOnlyNullAuthEnabled() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).authEnabled(null).build();

        // When
        consumerService.updateAllowList(AllowListOperation.TOGGLE_ONLY, allowList);

        // Then - should return early without doing anything
        verify(wasmPluginInstanceService, never()).addOrUpdate(any());
    }

    private static Consumer createTestConsumer(String name) {
        KeyAuthCredential credential = new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "Authorization",
            Lists.newArrayList("test-key"));
        return new Consumer(name, Lists.newArrayList(credential));
    }

    private static WasmPluginInstance createTestInstance() {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(BuiltInPluginName.KEY_AUTH);
        instance.setPluginVersion("1.0.0");
        instance.setInternal(true);
        instance.setEnabled(true);
        instance.setConfigurations(new HashMap<>());
        return instance;
    }
}
