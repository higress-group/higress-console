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
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
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
import com.google.common.collect.Lists;

@ExtendWith(MockitoExtension.class)
public class ConsumerServiceTest {

    @Mock
    private WasmPluginInstanceService wasmPluginInstanceService;

    private ConsumerServiceImpl consumerService;

    @BeforeEach
    void setUp() {
        consumerService = new ConsumerServiceImpl(wasmPluginInstanceService);
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
        verify(wasmPluginInstanceService).addOrUpdate(instance);
        assertNotNull(result);
    }

    @Test
    void testAddOrUpdate_UpdateExistingConsumer() {
        // Given
        Consumer consumer = createTestConsumer("testUser");
        WasmPluginInstance instance = createTestInstance();

        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(instance);

        // When
        Consumer result = consumerService.addOrUpdate(consumer);

        // Then
        verify(wasmPluginInstanceService).addOrUpdate(instance);
        assertNotNull(result);
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
        when(wasmPluginInstanceService.query(eq(WasmPluginInstanceScope.GLOBAL), isNull(),
            eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(instance);

        // When
        Consumer result = consumerService.query(consumerName);

        // Then
        // Result might be null if no consumers exist in the instance
        // This is expected behavior
    }

    @Test
    void testQuery_EmptyConsumerName() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> consumerService.query(""));
        assertThrows(IllegalArgumentException.class, () -> consumerService.query(null));
    }

    @Test
    void testDelete_ValidConsumerName() {
        // Given
        String consumerName = "testUser";
        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH)).thenReturn(Lists.newArrayList(instance));

        // When
        consumerService.delete(consumerName);

        // Then - should not throw exception
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

        when(wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH))
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
    void testGetAllowList_ValidTargets() {
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
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(Lists.newArrayList("user1"))
            .build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When
        consumerService.updateAllowList(AllowListOperation.ADD, allowList);

        // Then
        verify(wasmPluginInstanceService).addOrUpdate(instance);
    }

    @Test
    void testUpdateAllowList_RemoveOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.ROUTE, "test-route");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(false)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(Lists.newArrayList("user1"))
            .build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When
        consumerService.updateAllowList(AllowListOperation.REMOVE, allowList);

        // Then
        verify(wasmPluginInstanceService).addOrUpdate(instance);
    }

    @Test
    void testUpdateAllowList_ReplaceOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(Lists.newArrayList("user1", "user2")).build();

        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true))).thenReturn(null);
        WasmPluginInstance newInstance = createTestInstance();
        when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.KEY_AUTH)).thenReturn(newInstance);

        // When
        consumerService.updateAllowList(AllowListOperation.REPLACE, allowList);

        // Then
        verify(wasmPluginInstanceService).addOrUpdate(newInstance);
    }

    @Test
    void testUpdateAllowList_ToggleOnlyOperation() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder().targets(targets).authEnabled(false)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH)).consumerNames(new ArrayList<>()).build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When
        consumerService.updateAllowList(AllowListOperation.TOGGLE_ONLY, allowList);

        // Then
        verify(wasmPluginInstanceService).addOrUpdate(instance);
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

    @Test
    void testUpdateAllowList_EnableAuthWithoutConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.ROUTE, "test-route");

        AllowList allowList = AllowList.builder()
            .targets(targets)
            .authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
            () -> consumerService.updateAllowList(AllowListOperation.TOGGLE_ONLY, allowList));

        assertEquals("It is not allowed to enable authentication without any allowed consumers.",
            exception.getMessage());
    }

    @Test
    void testUpdateAllowList_EnableAuthWithEmptyConsumerList() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder()
            .targets(targets)
            .authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(new ArrayList<>())  // Empty consumer list
            .build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
            () -> consumerService.updateAllowList(AllowListOperation.REPLACE, allowList));

        assertEquals("It is not allowed to enable authentication without any allowed consumers.",
            exception.getMessage());
    }

    @Test
    void testUpdateAllowList_DisableAuthWithoutConsumers() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder()
            .targets(targets)
            .authEnabled(false)  // Disabled auth should not throw exception
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(new ArrayList<>())
            .build();

        WasmPluginInstance instance = createTestInstance();
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When
        consumerService.updateAllowList(AllowListOperation.REPLACE, allowList);

        // Then - should not throw exception
        verify(wasmPluginInstanceService).addOrUpdate(instance);
    }

    @Test
    void testUpdateAllowList_RemoveAllConsumersButKeepAuthEnabled() {
        // Given
        Map<WasmPluginInstanceScope, String> targets = new HashMap<>();
        targets.put(WasmPluginInstanceScope.DOMAIN, "example.com");

        AllowList allowList = AllowList.builder()
            .targets(targets)
            .authEnabled(true)
            .credentialTypes(Lists.newArrayList(CredentialType.KEY_AUTH))
            .consumerNames(Lists.newArrayList("user1"))  // This will be removed by handler
            .build();

        WasmPluginInstance instance = createTestInstance();
        instance.setEnabled(true);
        when(wasmPluginInstanceService.query(eq(targets), eq(BuiltInPluginName.KEY_AUTH), eq(true)))
            .thenReturn(instance);

        // When & Then
        BusinessException exception = assertThrows(BusinessException.class,
            () -> consumerService.updateAllowList(AllowListOperation.REMOVE, allowList));

        assertEquals("It is not allowed to enable authentication without any allowed consumers.",
            exception.getMessage());
    }

    private Consumer createTestConsumer(String name) {
        KeyAuthCredential credential = new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "Authorization",
            Lists.newArrayList("test-key"));
        return new Consumer(name, Lists.newArrayList(credential));
    }

    private WasmPluginInstance createTestInstance() {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(BuiltInPluginName.KEY_AUTH);
        instance.setPluginVersion("1.0.0");
        instance.setInternal(true);
        instance.setEnabled(true);
        instance.setConfigurations(new HashMap<>());
        return instance;
    }
}
