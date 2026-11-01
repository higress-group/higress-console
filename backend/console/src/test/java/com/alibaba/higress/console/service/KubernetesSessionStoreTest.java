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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

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

    private static V1Secret sessionSecret(String name, String username) {
        Map<String, byte[]> data = new HashMap<>();
        data.put("username", username.getBytes(StandardCharsets.UTF_8));
        data.put("createdAt", "1000".getBytes(StandardCharsets.UTF_8));
        data.put("lastAccessAt", "2000".getBytes(StandardCharsets.UTF_8));
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta().name(name));
        secret.setType(KubernetesSessionStore.SESSION_SECRET_TYPE);
        secret.setData(data);
        return secret;
    }

    private static String value(V1Secret secret, String key) {
        return new String(secret.getData().get(key), StandardCharsets.UTF_8);
    }
}
