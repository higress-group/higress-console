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
import java.time.Clock;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import lombok.extern.slf4j.Slf4j;

/**
 * Shared session store backed by one Kubernetes Secret per session.
 */
@Service
@Slf4j
public class KubernetesSessionStore implements SessionStore {

    static final String SESSION_SECRET_TYPE = "higress.io/console-session";

    private static final String SESSION_SECRET_NAME_PREFIX = "higress-console-session-";
    private static final String SESSION_SECRET_LABEL_KEY = "higress.io/console-session";
    private static final String SESSION_SECRET_LABEL_VALUE = "true";
    private static final Map<String, String> SESSION_SECRET_LABELS =
        Collections.singletonMap(SESSION_SECRET_LABEL_KEY, SESSION_SECRET_LABEL_VALUE);
    private static final String CREDENTIAL_SECRET_TYPE = "higress.io/console-user-credential";
    private static final String CREDENTIAL_SECRET_NAME_PREFIX = "higress-console-user-credential-";
    private static final String USERNAME_KEY = "username";
    private static final String CREATED_AT_KEY = "createdAt";
    private static final String LAST_ACCESS_AT_KEY = "lastAccessAt";
    private static final String CREDENTIAL_VERSION_KEY = "credentialVersion";
    private static final String VERSION_KEY = "version";
    private static final int MAX_MUTATION_ATTEMPTS = 5;
    private static final long CONFLICT_BACKOFF_MILLIS = 10L;
    static final long CREDENTIAL_VERSION_CACHE_TTL_MILLIS = 10_000L;
    static final long SESSION_CLEANUP_INTERVAL_MILLIS = 10 * 60 * 1000L;

    private long idleTimeout = SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_DEFAULT;

    private long absoluteTimeout = SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_DEFAULT;

    private KubernetesClientService kubernetesClientService;
    private Clock clock = Clock.systemUTC();
    private final Map<String, CachedCredentialVersion> credentialVersionCache = new ConcurrentHashMap<>();

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setClock(Clock clock) {
        this.clock = clock;
    }

    @Value("${" + SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_KEY + ":"
        + SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_DEFAULT + "}")
    public void setIdleTimeout(long idleTimeout) {
        this.idleTimeout = SessionData.validateTimeout(SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_KEY, idleTimeout);
    }

    @Value("${" + SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_KEY + ":"
        + SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_DEFAULT + "}")
    public void setAbsoluteTimeout(long absoluteTimeout) {
        this.absoluteTimeout =
            SessionData.validateTimeout(SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_KEY, absoluteTimeout);
    }

    @Override
    public void create(String sessionId, SessionData session) {
        mutateWithRetry("Unable to create session secret in K8s.", () -> {
            V1Secret secret = new V1Secret();
            secret.setMetadata(new V1ObjectMeta().name(getResourceName(sessionId)).labels(SESSION_SECRET_LABELS));
            secret.setType(SESSION_SECRET_TYPE);
            secret.setData(toSecretData(session));
            kubernetesClientService.createSecret(secret);
        });
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
        mutateWithRetry("Unable to update session secret in K8s.", () -> {
            V1Secret secret = kubernetesClientService.readSecret(getResourceName(sessionId));
            if (secret == null) {
                return;
            }
            SessionData existing = toSession(secret);
            if (existing == null) {
                return;
            }
            existing.setLastAccessAt(Math.max(session.getLastAccessAt(), existing.getLastAccessAt()));
            secret.setData(toSecretData(existing));
            kubernetesClientService.replaceSecret(secret);
        });
    }

    @Override
    public void delete(String sessionId) {
        mutateWithRetry("Unable to delete session secret from K8s.",
            () -> kubernetesClientService.deleteSecret(getResourceName(sessionId)));
    }

    @Override
    public void deleteByUsername(String username) {
        try {
            List<V1Secret> secrets = kubernetesClientService.listSecret(SESSION_SECRET_TYPE);
            if (secrets == null) {
                return;
            }
            long now = clock.millis();
            for (V1Secret secret : secrets) {
                SessionData session = toSession(secret);
                if (session == null || secret.getMetadata() == null) {
                    continue;
                }
                // Listing also performs a lazy amortized sweep of every expired session encountered.
                if (session.isExpired(now, idleTimeout, absoluteTimeout) || username.equals(session.getUsername())) {
                    deleteSecret(secret.getMetadata().getName());
                }
            }
        } catch (ApiException e) {
            throw new BusinessException("Unable to delete user session secrets from K8s.", e);
        }
    }

    @Override
    public String getCredentialVersion(String username) {
        long now = clock.millis();
        CachedCredentialVersion cached = credentialVersionCache.get(username);
        if (cached != null && now >= cached.cachedAt && now - cached.cachedAt < CREDENTIAL_VERSION_CACHE_TTL_MILLIS) {
            return cached.version;
        }
        return resolveCredentialVersion(username, false, "Unable to load user credential version from K8s.");
    }

    @Override
    public void bumpCredentialVersion(String username) {
        resolveCredentialVersion(username, true, "Unable to update user credential version in K8s.");
    }

    @Scheduled(fixedDelay = SESSION_CLEANUP_INTERVAL_MILLIS)
    public void cleanupExpiredSessions() {
        List<V1Secret> secrets;
        try {
            secrets = kubernetesClientService.listSecret(SESSION_SECRET_TYPE, SESSION_SECRET_LABELS);
        } catch (ApiException e) {
            log.warn("Unable to list console session secrets for cleanup.", e);
            return;
        }
        int deletedCount = 0;
        if (secrets != null) {
            long now = clock.millis();
            for (V1Secret secret : secrets) {
                SessionData session = toSession(secret);
                if (session == null || secret.getMetadata() == null
                    || !session.isExpired(now, idleTimeout, absoluteTimeout)) {
                    continue;
                }
                try {
                    deleteSecret(secret.getMetadata().getName());
                    deletedCount++;
                } catch (RuntimeException e) {
                    log.warn("Unable to delete expired console session secret {}.", secret.getMetadata().getName(), e);
                }
            }
        }
        log.info("Console session cleanup completed; deleted {} expired session secrets.", deletedCount);
    }

    private String resolveCredentialVersion(String username, boolean forceNewVersion, String errorMessage) {
        String resourceName = getCredentialResourceName(username);
        String newVersion = UUID.randomUUID().toString();
        for (int attempt = 1; attempt <= MAX_MUTATION_ATTEMPTS; attempt++) {
            try {
                V1Secret secret = kubernetesClientService.readSecret(resourceName);
                String currentVersion = getCredentialVersion(secret);
                if (!forceNewVersion && StringUtils.isNotBlank(currentVersion)) {
                    credentialVersionCache.put(username, new CachedCredentialVersion(currentVersion, clock.millis()));
                    return currentVersion;
                }

                Map<String, byte[]> data =
                    secret == null || secret.getData() == null ? new HashMap<>() : new HashMap<>(secret.getData());
                data.put(VERSION_KEY, newVersion.getBytes(StandardCharsets.UTF_8));
                if (secret == null) {
                    secret = new V1Secret();
                    secret.setMetadata(new V1ObjectMeta().name(resourceName));
                    secret.setType(CREDENTIAL_SECRET_TYPE);
                    secret.setData(data);
                    kubernetesClientService.createSecret(secret);
                } else {
                    secret.setType(CREDENTIAL_SECRET_TYPE);
                    secret.setData(data);
                    kubernetesClientService.replaceSecret(secret);
                }
                credentialVersionCache.put(username, new CachedCredentialVersion(newVersion, clock.millis()));
                return newVersion;
            } catch (ApiException e) {
                if (e.getCode() != HttpStatus.CONFLICT) {
                    throw new BusinessException(errorMessage, e);
                }
                if (attempt == MAX_MUTATION_ATTEMPTS) {
                    throw new SessionStoreRetryableException(errorMessage, e);
                }
                backoff(attempt, errorMessage, e);
            }
        }
        throw new IllegalStateException("Unreachable credential version update state.");
    }

    private void deleteSecret(String name) {
        mutateWithRetry("Unable to delete session secret from K8s.", () -> kubernetesClientService.deleteSecret(name));
    }

    private void mutateWithRetry(String errorMessage, KubernetesMutation mutation) {
        for (int attempt = 1; attempt <= MAX_MUTATION_ATTEMPTS; attempt++) {
            try {
                mutation.execute();
                return;
            } catch (ApiException e) {
                if (e.getCode() != HttpStatus.CONFLICT) {
                    throw new BusinessException(errorMessage, e);
                }
                if (attempt == MAX_MUTATION_ATTEMPTS) {
                    throw new SessionStoreRetryableException(errorMessage, e);
                }
                backoff(attempt, errorMessage, e);
            }
        }
    }

    private static void backoff(int attempt, String errorMessage, ApiException conflict) {
        try {
            Thread.sleep(CONFLICT_BACKOFF_MILLIS * attempt);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(errorMessage, conflict);
        }
    }

    @FunctionalInterface
    private interface KubernetesMutation {

        void execute() throws ApiException;
    }

    private static String getResourceName(String sessionId) {
        String idHash = Hashing.sha256().hashString(sessionId, StandardCharsets.UTF_8).toString();
        return SESSION_SECRET_NAME_PREFIX + idHash;
    }

    private static String getCredentialResourceName(String username) {
        String usernameHash = Hashing.sha256().hashString(username, StandardCharsets.UTF_8).toString();
        return CREDENTIAL_SECRET_NAME_PREFIX + usernameHash;
    }

    private static Map<String, byte[]> toSecretData(SessionData session) {
        Map<String, byte[]> data = new HashMap<>();
        data.put(USERNAME_KEY, session.getUsername().getBytes(StandardCharsets.UTF_8));
        data.put(CREATED_AT_KEY, String.valueOf(session.getCreatedAt()).getBytes(StandardCharsets.UTF_8));
        data.put(LAST_ACCESS_AT_KEY, String.valueOf(session.getLastAccessAt()).getBytes(StandardCharsets.UTF_8));
        if (session.getCredentialVersion() != null) {
            data.put(CREDENTIAL_VERSION_KEY, session.getCredentialVersion().getBytes(StandardCharsets.UTF_8));
        }
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
        String credentialVersion = getString(data, CREDENTIAL_VERSION_KEY);
        if (StringUtils.isAnyBlank(username, createdAt, lastAccessAt)) {
            return null;
        }
        try {
            return SessionData.builder().username(username).createdAt(Long.parseLong(createdAt))
                .lastAccessAt(Long.parseLong(lastAccessAt)).credentialVersion(credentialVersion).build();
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String getCredentialVersion(V1Secret secret) {
        return secret == null || secret.getData() == null ? null : getString(secret.getData(), VERSION_KEY);
    }

    private static String getString(Map<String, byte[]> data, String key) {
        byte[] value = data.get(key);
        return value == null ? null : new String(value, StandardCharsets.UTF_8);
    }

    private static final class CachedCredentialVersion {

        private final String version;
        private final long cachedAt;

        private CachedCredentialVersion(String version, long cachedAt) {
            this.version = version;
            this.cachedAt = cachedAt;
        }
    }
}
