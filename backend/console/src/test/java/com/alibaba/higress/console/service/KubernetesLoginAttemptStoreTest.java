/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

class KubernetesLoginAttemptStoreTest {

    private static final LoginAttemptKey KEY = new LoginAttemptKey("admin", "192.0.2.10");

    private KubernetesClientService kubernetesClientService;
    private KubernetesLoginAttemptStore store;

    @BeforeEach
    void setUp() {
        kubernetesClientService = mock(KubernetesClientService.class);
        store = new KubernetesLoginAttemptStore();
        store.setKubernetesClientService(kubernetesClientService);
    }

    @Test
    void replaceConflictRetriesFromLatestResourceVersion() throws Exception {
        V1ConfigMap initial = configMap("1", new LoginAttemptState(100, 1, 0));
        V1ConfigMap latest = configMap("2", new LoginAttemptState(100, 2, 0));
        when(kubernetesClientService.readConfigMap(anyString())).thenReturn(initial, latest);
        when(kubernetesClientService.replaceConfigMap(any())).thenThrow(new ApiException(HttpStatus.CONFLICT, "Conflict"))
            .thenAnswer(invocation -> invocation.getArgument(0));

        LoginAttemptState result = store.update(KEY,
            state -> new LoginAttemptState(state.getWindowStartedAt(), state.getFailureCount() + 1, 0));

        assertEquals(3, result.getFailureCount());
        ArgumentCaptor<V1ConfigMap> captor = ArgumentCaptor.forClass(V1ConfigMap.class);
        verify(kubernetesClientService, times(2)).replaceConfigMap(captor.capture());
        List<V1ConfigMap> updates = captor.getAllValues();
        assertEquals("1", updates.get(0).getMetadata().getResourceVersion());
        assertEquals("2", updates.get(1).getMetadata().getResourceVersion());
        verify(kubernetesClientService, times(2)).readConfigMap(anyString());
    }

    @Test
    void createConflictRetriesWithCompareAndSwapAndHashedName() throws Exception {
        V1ConfigMap concurrentlyCreated = configMap("7", new LoginAttemptState(100, 1, 0));
        when(kubernetesClientService.readConfigMap(anyString())).thenReturn(null, concurrentlyCreated);
        when(kubernetesClientService.createConfigMap(any())).thenThrow(new ApiException(HttpStatus.CONFLICT, "Conflict"));
        when(kubernetesClientService.replaceConfigMap(any())).thenAnswer(invocation -> invocation.getArgument(0));

        LoginAttemptState result = store.update(KEY,
            state -> new LoginAttemptState(state.getWindowStartedAt(), state.getFailureCount() + 1, 0));

        assertEquals(2, result.getFailureCount());
        ArgumentCaptor<V1ConfigMap> createCaptor = ArgumentCaptor.forClass(V1ConfigMap.class);
        verify(kubernetesClientService).createConfigMap(createCaptor.capture());
        String name = createCaptor.getValue().getMetadata().getName();
        assertTrue(name.matches("higress-console-login-[0-9a-f]{64}"));
        assertFalse(name.contains(KEY.getAccount()));
        assertFalse(name.contains(KEY.getClientIp()));
        ArgumentCaptor<V1ConfigMap> replaceCaptor = ArgumentCaptor.forClass(V1ConfigMap.class);
        verify(kubernetesClientService).replaceConfigMap(replaceCaptor.capture());
        assertEquals("7", replaceCaptor.getValue().getMetadata().getResourceVersion());
    }

    @Test
    void resetPersistsAnEmptyState() throws Exception {
        when(kubernetesClientService.readConfigMap(anyString()))
            .thenReturn(configMap("3", new LoginAttemptState(100, 4, 0)));
        when(kubernetesClientService.replaceConfigMap(any())).thenAnswer(invocation -> invocation.getArgument(0));

        LoginAttemptState result = store.update(KEY, state -> LoginAttemptState.EMPTY);

        assertTrue(result.isEmpty());
        ArgumentCaptor<V1ConfigMap> captor = ArgumentCaptor.forClass(V1ConfigMap.class);
        verify(kubernetesClientService).replaceConfigMap(captor.capture());
        assertTrue(captor.getValue().getData().isEmpty());
        assertEquals("3", captor.getValue().getMetadata().getResourceVersion());
    }

    private static V1ConfigMap configMap(String resourceVersion, LoginAttemptState state) {
        String value = state.getWindowStartedAt() + ":" + state.getFailureCount() + ":" + state.getLockedUntil();
        return new V1ConfigMap().metadata(new V1ObjectMeta().name("higress-console-login-test")
            .resourceVersion(resourceVersion)).data(Collections.singletonMap("state", value));
    }
}
