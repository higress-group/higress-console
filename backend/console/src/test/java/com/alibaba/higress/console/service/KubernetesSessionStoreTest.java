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
package com.alibaba.higress.console.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.alibaba.higress.console.aop.ApiStandardizationAspect;
import com.alibaba.higress.console.controller.SessionController;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;

class KubernetesSessionStoreTest {

    @Test
    void createUsesHashedResourceNameAndStoresNoCredentials() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String sessionId = "opaque-session-id-that-must-not-be-a-resource-name";
        SessionData session = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(2000L).build();

        store.create(sessionId, session);

        ArgumentCaptor<V1Secret> captor = ArgumentCaptor.forClass(V1Secret.class);
        verify(client).createSecret(captor.capture());
        V1Secret secret = captor.getValue();
        String expectedHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        assertEquals("higress-console-session-" + expectedHash, secret.getMetadata().getName());
        assertEquals(KubernetesSessionStore.SESSION_SECRET_TYPE, secret.getType());
        assertEquals(3, secret.getData().size());
        assertEquals("admin", value(secret, "username"));
        assertEquals("1000", value(secret, "createdAt"));
        assertEquals("2000", value(secret, "lastAccessAt"));
        assertFalse(secret.getData().containsKey("password"));
        assertFalse(secret.getData().containsKey("adminPassword"));
        assertFalse(secret.getMetadata().getName().contains(sessionId));
    }

    @Test
    void createRetriesConflict() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        SessionData session = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(2000L).build();
        when(client.createSecret(any(V1Secret.class))).thenThrow(conflict()).thenReturn(new V1Secret());

        store.create("session-id", session);

        verify(client, times(2)).createSecret(any(V1Secret.class));
    }

    @Test
    void updateRereadsAndRetriesConflict() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String sessionId = "session-id";
        String resourceName = resourceName(sessionId);
        V1Secret original = sessionSecret(resourceName, "admin");
        original.getMetadata().setResourceVersion("1");
        V1Secret concurrentlyUpdated = sessionSecret(resourceName, "admin");
        concurrentlyUpdated.getMetadata().setResourceVersion("2");
        when(client.readSecret(resourceName)).thenReturn(original, concurrentlyUpdated);
        when(client.replaceSecret(any(V1Secret.class))).thenThrow(conflict()).thenReturn(concurrentlyUpdated);
        SessionData updated = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(3000L).build();

        store.update(sessionId, updated);

        verify(client, times(2)).readSecret(resourceName);
        ArgumentCaptor<V1Secret> captor = ArgumentCaptor.forClass(V1Secret.class);
        verify(client, times(2)).replaceSecret(captor.capture());
        assertSame(original, captor.getAllValues().get(0));
        assertSame(concurrentlyUpdated, captor.getAllValues().get(1));
        assertEquals("2", captor.getAllValues().get(1).getMetadata().getResourceVersion());
        assertEquals("3000", value(concurrentlyUpdated, "lastAccessAt"));
    }

    @Test
    void updateExhaustsRetriesAndMapsToServiceUnavailable() throws Throwable {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String sessionId = "session-id";
        String resourceName = resourceName(sessionId);
        when(client.readSecret(resourceName)).thenReturn(sessionSecret(resourceName, "admin"));
        when(client.replaceSecret(any(V1Secret.class))).thenThrow(conflict());
        SessionData session = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(3000L).build();

        BusinessException exception = assertThrows(BusinessException.class, () -> store.update(sessionId, session));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, httpStatus(exception));
        verify(client, times(5)).readSecret(resourceName);
        verify(client, times(5)).replaceSecret(any(V1Secret.class));
    }

    @Test
    void deleteRetriesConflict() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String resourceName = resourceName("session-id");
        doThrow(conflict()).doNothing().when(client).deleteSecret(resourceName);

        store.delete("session-id");

        verify(client, times(2)).deleteSecret(resourceName);
    }

    @Test
    void deleteByUsernameDeletesOnlyMatchingSessionSecrets() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        V1Secret adminSession = sessionSecret("session-admin", "admin");
        V1Secret otherSession = sessionSecret("session-other", "other");
        when(client.listSecret(KubernetesSessionStore.SESSION_SECRET_TYPE))
            .thenReturn(Arrays.asList(adminSession, otherSession));

        store.deleteByUsername("admin");

        verify(client).deleteSecret("session-admin");
        verify(client, never()).deleteSecret("session-other");
    }

    @Test
    void deleteByUsernameSweepsExpiredSessionsForOtherUsers() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        long now = System.currentTimeMillis();
        V1Secret adminSession = sessionSecret("session-admin", "admin", now, now);
        V1Secret activeOtherSession = sessionSecret("session-other", "other", now, now);
        V1Secret expiredOtherSession = sessionSecret("session-expired-other", "other", 1000L, 2000L);
        when(client.listSecret(KubernetesSessionStore.SESSION_SECRET_TYPE))
            .thenReturn(Arrays.asList(adminSession, activeOtherSession, expiredOtherSession));

        store.deleteByUsername("admin");

        verify(client).deleteSecret("session-admin");
        verify(client).deleteSecret("session-expired-other");
        verify(client, never()).deleteSecret("session-other");
    }

    private static V1Secret sessionSecret(String name, String username) {
        long now = System.currentTimeMillis();
        return sessionSecret(name, username, now, now);
    }

    private static V1Secret sessionSecret(String name, String username, long createdAt, long lastAccessAt) {
        Map<String, byte[]> data = new HashMap<>();
        data.put("username", username.getBytes(StandardCharsets.UTF_8));
        data.put("createdAt", String.valueOf(createdAt).getBytes(StandardCharsets.UTF_8));
        data.put("lastAccessAt", String.valueOf(lastAccessAt).getBytes(StandardCharsets.UTF_8));
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta().name(name));
        secret.setType(KubernetesSessionStore.SESSION_SECRET_TYPE);
        secret.setData(data);
        return secret;
    }

    private static ApiException conflict() {
        return new ApiException(HttpStatus.CONFLICT.value(), "Conflict");
    }

    private static String resourceName(String sessionId) {
        String idHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        return "higress-console-session-" + idHash;
    }

    private static HttpStatus httpStatus(BusinessException exception) throws Throwable {
        ProceedingJoinPoint point = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class);
        when(point.getTarget()).thenReturn(new SessionController());
        when(point.getSignature()).thenReturn(signature);
        when(signature.getDeclaringTypeName()).thenReturn(SessionController.class.getName());
        when(signature.getName()).thenReturn("login");
        when(point.proceed()).thenThrow(exception);

        Object result = new ApiStandardizationAspect().intercept(point);

        return ((ResponseEntity<?>)result).getStatusCode();
    }

    private static String value(V1Secret secret, String key) {
        return new String(secret.getData().get(key), StandardCharsets.UTF_8);
    }
}
