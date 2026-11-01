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

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;

/**
 * Shared session store backed by one Kubernetes Secret per session.
 */
@Service
public class KubernetesSessionStore implements SessionStore {

    static final String SESSION_SECRET_TYPE = "higress.io/console-session";

    private static final String SESSION_SECRET_NAME_PREFIX = "higress-console-session-";
    private static final String USERNAME_KEY = "username";
    private static final String CREATED_AT_KEY = "createdAt";
    private static final String LAST_ACCESS_AT_KEY = "lastAccessAt";

    private KubernetesClientService kubernetesClientService;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public void create(String sessionId, SessionData session) {
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta().name(getResourceName(sessionId)));
        secret.setType(SESSION_SECRET_TYPE);
        secret.setData(toSecretData(session));
        try {
            kubernetesClientService.createSecret(secret);
        } catch (ApiException e) {
            throw new BusinessException("Unable to create session secret in K8s.", e);
        }
    }

    @Override
    public SessionData find(String sessionId) {
        try {
            return toSession(kubernetesClientService.readSecret(getResourceName(sessionId)));
        } catch (ApiException e) {
            throw new BusinessException("Unable to load session secret from K8s.", e);
        }
    }

    @Override
    public void update(String sessionId, SessionData session) {
        try {
            V1Secret secret = kubernetesClientService.readSecret(getResourceName(sessionId));
            if (secret == null) {
                return;
            }
            secret.setData(toSecretData(session));
            kubernetesClientService.replaceSecret(secret);
        } catch (ApiException e) {
            throw new BusinessException("Unable to update session secret in K8s.", e);
        }
    }

    @Override
    public void delete(String sessionId) {
        try {
            kubernetesClientService.deleteSecret(getResourceName(sessionId));
        } catch (ApiException e) {
            throw new BusinessException("Unable to delete session secret from K8s.", e);
        }
    }

    @Override
    public void deleteByUsername(String username) {
        try {
            List<V1Secret> secrets = kubernetesClientService.listSecret(SESSION_SECRET_TYPE);
            if (secrets == null) {
                return;
            }
            for (V1Secret secret : secrets) {
                SessionData session = toSession(secret);
                if (session == null || !username.equals(session.getUsername()) || secret.getMetadata() == null) {
                    continue;
                }
                kubernetesClientService.deleteSecret(secret.getMetadata().getName());
            }
        } catch (ApiException e) {
            throw new BusinessException("Unable to delete user session secrets from K8s.", e);
        }
    }

    private static String getResourceName(String sessionId) {
        String idHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        return SESSION_SECRET_NAME_PREFIX + idHash;
    }

    private static Map<String, byte[]> toSecretData(SessionData session) {
        Map<String, byte[]> data = new HashMap<>();
        data.put(USERNAME_KEY, session.getUsername().getBytes(StandardCharsets.UTF_8));
        data.put(CREATED_AT_KEY, String.valueOf(session.getCreatedAt()).getBytes(StandardCharsets.UTF_8));
        data.put(LAST_ACCESS_AT_KEY, String.valueOf(session.getLastAccessAt()).getBytes(StandardCharsets.UTF_8));
        return data;
    }

    private static SessionData toSession(V1Secret secret) {
        if (secret == null || secret.getData() == null) {
            return null;
        }
        Map<String, byte[]> data = secret.getData();
        String username = getString(data, USERNAME_KEY);
        String createdAt = getString(data, CREATED_AT_KEY);
        String lastAccessAt = getString(data, LAST_ACCESS_AT_KEY);
        if (StringUtils.isAnyBlank(username, createdAt, lastAccessAt)) {
            return null;
        }
        try {
            return SessionData.builder().username(username).createdAt(Long.parseLong(createdAt))
                .lastAccessAt(Long.parseLong(lastAccessAt)).build();
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String getString(Map<String, byte[]> data, String key) {
        byte[] value = data.get(key);
        return value == null ? null : new String(value, StandardCharsets.UTF_8);
    }
}
