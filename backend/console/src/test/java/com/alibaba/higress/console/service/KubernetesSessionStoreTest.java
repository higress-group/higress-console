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
import java.time.Clock;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.http.HttpStatus;
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
        SessionData session = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(2000L)
            .credentialFingerprint("credential-fingerprint").build();

        store.create(sessionId, session);

        ArgumentCaptor<V1Secret> captor = ArgumentCaptor.forClass(V1Secret.class);
        verify(client).createSecret(captor.capture());
        V1Secret secret = captor.getValue();
        String expectedHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        assertEquals("higress-console-session-" + expectedHash, secret.getMetadata().getName());
        assertEquals(KubernetesSessionStore.SESSION_SECRET_TYPE, secret.getType());
        assertEquals(4, secret.getData().size());
        assertEquals("admin", value(secret, "username"));
        assertEquals("1000", value(secret, "createdAt"));
        assertEquals("2000", value(secret, "lastAccessAt"));
        assertEquals("credential-fingerprint", value(secret, "credentialFingerprint"));
        assertEquals("true", secret.getMetadata().getLabels().get("higress.io/console-session"));
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
        V1Secret original = sessionSecret(resourceName, "admin", 1000L, 2000L);
        original.getMetadata().setResourceVersion("1");
        V1Secret concurrentlyUpdated = sessionSecret(resourceName, "admin", 1000L, 4000L);
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
        assertEquals("4000", value(concurrentlyUpdated, "lastAccessAt"));
    }

    @Test
    void updateDoesNotRollBackLastAccessTime() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String resourceName = resourceName("session-id");
        V1Secret existing = sessionSecret(resourceName, "admin", 1000L, 5000L);
        when(client.readSecret(resourceName)).thenReturn(existing);
        SessionData older = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(3000L).build();

        store.update("session-id", older);

        assertEquals("5000", value(existing, "lastAccessAt"));
        verify(client).replaceSecret(existing);
    }

    @Test
    void updateExhaustsRetriesAndRereadsEveryAttempt() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String sessionId = "session-id";
        String resourceName = resourceName(sessionId);
        when(client.readSecret(resourceName)).thenReturn(sessionSecret(resourceName, "admin"));
        when(client.replaceSecret(any(V1Secret.class))).thenThrow(conflict());
        SessionData session = SessionData.builder().username("admin").createdAt(1000L).lastAccessAt(3000L).build();

        assertThrows(SessionStoreRetryableException.class, () -> store.update(sessionId, session));
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

    @Test
    void deleteByUsernameDoesNotSweepSessionsWhenTimeoutsAreDisabled() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        store.setIdleTimeout(0);
        store.setAbsoluteTimeout(0);
        V1Secret adminSession = sessionSecret("session-admin", "admin");
        V1Secret oldOtherSession = sessionSecret("session-old-other", "other", 1000L, 2000L);
        when(client.listSecret(KubernetesSessionStore.SESSION_SECRET_TYPE))
            .thenReturn(Arrays.asList(adminSession, oldOtherSession));

        store.deleteByUsername("admin");

        verify(client).deleteSecret("session-admin");
        verify(client, never()).deleteSecret("session-old-other");
    }

    @Test
    void credentialFingerprintIsCreatedWhenMissing() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String resourceName = credentialResourceName("admin");
        when(client.readSecret(resourceName)).thenReturn(null);

        String fingerprint = store.getOrCreateCredentialFingerprint("admin", "bootstrap-fingerprint");

        ArgumentCaptor<V1Secret> captor = ArgumentCaptor.forClass(V1Secret.class);
        verify(client).createSecret(captor.capture());
        assertEquals(resourceName, captor.getValue().getMetadata().getName());
        assertEquals(fingerprint, value(captor.getValue(), "fingerprint"));
    }

    @Test
    void concurrentCredentialBootstrapRereadsAfterCreateConflict() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String resourceName = credentialResourceName("admin");
        when(client.readSecret(resourceName)).thenReturn(null, credentialSecret("concurrent-fingerprint"));
        when(client.createSecret(any(V1Secret.class))).thenThrow(conflict());

        String fingerprint = store.getOrCreateCredentialFingerprint("admin", "bootstrap-fingerprint");

        assertEquals("concurrent-fingerprint", fingerprint);
        verify(client, times(2)).readSecret(resourceName);
        verify(client).createSecret(any(V1Secret.class));
        verify(client, never()).replaceSecret(any(V1Secret.class));
    }

    @Test
    void credentialFingerprintCacheExpiresAfterTenSeconds() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        Clock clock = mock(Clock.class);
        when(clock.millis()).thenReturn(1000L, 1000L, 5000L, 11_001L, 11_001L);
        store.setClock(clock);
        String resourceName = credentialResourceName("admin");
        when(client.readSecret(resourceName)).thenReturn(credentialSecret("fingerprint-1"),
            credentialSecret("fingerprint-2"));

        assertEquals("fingerprint-1", store.getOrCreateCredentialFingerprint("admin", "bootstrap-1"));
        assertEquals("fingerprint-1", store.getOrCreateCredentialFingerprint("admin", "bootstrap-1"));
        assertEquals("fingerprint-2", store.getOrCreateCredentialFingerprint("admin", "bootstrap-2"));
        verify(client, times(2)).readSecret(resourceName);
    }

    @Test
    void updateCredentialFingerprintPersistsAndCachesNewFingerprint() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        String resourceName = credentialResourceName("admin");
        when(client.readSecret(resourceName)).thenReturn(credentialSecret("fingerprint-1"));

        store.updateCredentialFingerprint("admin", "fingerprint-2");

        ArgumentCaptor<V1Secret> captor = ArgumentCaptor.forClass(V1Secret.class);
        verify(client).replaceSecret(captor.capture());
        assertEquals("fingerprint-2", value(captor.getValue(), "fingerprint"));
        assertEquals("fingerprint-2", store.getOrCreateCredentialFingerprint("admin", "bootstrap-fingerprint"));
        verify(client, times(1)).readSecret(resourceName);
    }

    @Test
    void cleanupDeletesExpiredSessionsListedByLabel() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        long now = 100_000L;
        Clock clock = mock(Clock.class);
        when(clock.millis()).thenReturn(now);
        store.setClock(clock);
        store.setIdleTimeout(1000L);
        store.setAbsoluteTimeout(0);
        V1Secret active = sessionSecret("session-active", "admin", now, now);
        V1Secret expired = sessionSecret("session-expired", "admin", now, now - 1000L);
        when(client.listSecret(KubernetesSessionStore.SESSION_SECRET_TYPE, sessionLabels()))
            .thenReturn(Arrays.asList(active, expired));

        store.cleanupExpiredSessions();

        verify(client).deleteSecret("session-expired");
        verify(client, never()).deleteSecret("session-active");
    }

    @Test
    void cleanupDoesNotDeleteOldSessionsWhenTimeoutsAreDisabled() throws Exception {
        KubernetesClientService client = mock(KubernetesClientService.class);
        KubernetesSessionStore store = new KubernetesSessionStore();
        store.setKubernetesClientService(client);
        store.setIdleTimeout(0);
        store.setAbsoluteTimeout(0);
        V1Secret old = sessionSecret("session-old", "admin", 1000L, 2000L);
        when(client.listSecret(KubernetesSessionStore.SESSION_SECRET_TYPE, sessionLabels()))
            .thenReturn(Collections.singletonList(old));

        store.cleanupExpiredSessions();

        verify(client, never()).deleteSecret("session-old");
    }

    @Test
    void negativeTimeoutsAreRejected() {
        KubernetesSessionStore store = new KubernetesSessionStore();

        assertThrows(IllegalArgumentException.class, () -> store.setIdleTimeout(-1));
        assertThrows(IllegalArgumentException.class, () -> store.setAbsoluteTimeout(-1));
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

    private static V1Secret credentialSecret(String fingerprint) {
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta().name(credentialResourceName("admin")));
        secret.setData(
            new HashMap<>(Collections.singletonMap("fingerprint", fingerprint.getBytes(StandardCharsets.UTF_8))));
        return secret;
    }

    private static ApiException conflict() {
        return new ApiException(HttpStatus.CONFLICT, "Conflict");
    }

    private static String resourceName(String sessionId) {
        String idHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        return "higress-console-session-" + idHash;
    }

    private static String credentialResourceName(String username) {
        String usernameHash = Hashing.sha256().hashString(username, StandardCharsets.UTF_8).toString();
        return "higress-console-user-credential-" + usernameHash;
    }

    private static Map<String, String> sessionLabels() {
        return Collections.singletonMap("higress.io/console-session", "true");
    }

    private static String value(V1Secret secret, String key) {
        return new String(secret.getData().get(key), StandardCharsets.UTF_8);
    }
}
