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

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.function.UnaryOperator;

import javax.annotation.Resource;

import org.apache.commons.collections4.MapUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

@Service
public class KubernetesLoginAttemptStore implements LoginAttemptStore {

    private static final String RESOURCE_NAME = "higress-console-login-attempts";
    private static final String STATE_SEPARATOR = ":";
    private static final int STATE_PARTS = 3;
    private static final int MAX_ENTRIES = 4096;
    private static final int MAX_UPDATE_ATTEMPTS = 8;

    @Value("${" + SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_KEY + ":"
        + SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_DEFAULT + "}")
    private long attemptWindowSeconds = SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_DEFAULT;

    private KubernetesClientService kubernetesClientService;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public LoginAttemptState get(LoginAttemptKey key) {
        return deserialize(read()).getOrDefault(getDataKey(key), LoginAttemptState.EMPTY);
    }

    @Override
    public LoginAttemptState update(LoginAttemptKey key, UnaryOperator<LoginAttemptState> update) {
        String dataKey = getDataKey(key);
        for (int attempt = 0; attempt < MAX_UPDATE_ATTEMPTS; attempt++) {
            V1ConfigMap configMap = read();
            Map<String, LoginAttemptState> states = deserialize(configMap);
            LoginAttemptState previous = states.getOrDefault(dataKey, LoginAttemptState.EMPTY);
            LoginAttemptState updated = Objects.requireNonNull(update.apply(previous), "Updated state must not be null.");

            // Eviction cannot be lockout-safe across replica clocks; rejecting a full store with 503 avoids silent bypass.
            evictExpired(states);
            if (updated.isEmpty()) {
                states.remove(dataKey);
            } else {
                if (!states.containsKey(dataKey) && states.size() >= MAX_ENTRIES) {
                    throw new ResponseStatusException(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,
                        "Login attempt store is full.");
                }
                states.put(dataKey, updated);
            }
            Map<String, String> data = serialize(states);
            if (configMap == null && data.isEmpty() || configMap != null && Objects.equals(configMap.getData(), data)) {
                return updated;
            }
            try {
                if (configMap == null) {
                    kubernetesClientService.createConfigMap(new V1ConfigMap()
                        .metadata(new V1ObjectMeta().name(RESOURCE_NAME)).data(data));
                } else {
                    // Keeping the read resourceVersion makes this replacement a compare-and-swap operation.
                    configMap.setData(data);
                    kubernetesClientService.replaceConfigMap(configMap);
                }
                return updated;
            } catch (ApiException e) {
                if (e.getCode() != HttpStatus.CONFLICT) {
                    throw new BusinessException("Unable to update login budget ConfigMap " + RESOURCE_NAME, e);
                }
            }
        }
        throw new BusinessException(
            "Unable to update login budget ConfigMap " + RESOURCE_NAME + " after " + MAX_UPDATE_ATTEMPTS + " attempts.");
    }

    private V1ConfigMap read() {
        try {
            return kubernetesClientService.readConfigMap(RESOURCE_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Unable to read login budget ConfigMap " + RESOURCE_NAME, e);
        }
    }

    private static String getDataKey(LoginAttemptKey key) {
        String material = key.getSource().getKey().length() + STATE_SEPARATOR + key.getSource().getKey() + "|"
            + key.getAccount().length() + STATE_SEPARATOR + key.getAccount() + "|" + key.getClientIp().length()
            + STATE_SEPARATOR + key.getClientIp();
        return Hashing.sha256().hashString(material, StandardCharsets.UTF_8).toString();
    }

    private static Map<String, String> serialize(Map<String, LoginAttemptState> states) {
        if (states.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<String, String> data = new HashMap<>();
        states.forEach((key, state) -> data.put(key, serialize(state)));
        return data;
    }

    private static String serialize(LoginAttemptState state) {
        return state.getWindowStartedAt() + STATE_SEPARATOR + state.getAttemptCount() + STATE_SEPARATOR
            + state.getLockedUntil();
    }

    private static Map<String, LoginAttemptState> deserialize(V1ConfigMap configMap) {
        Map<String, LoginAttemptState> states = new HashMap<>();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return states;
        }
        for (Map.Entry<String, String> entry : configMap.getData().entrySet()) {
            try {
                String[] parts = entry.getValue().split(STATE_SEPARATOR, -1);
                if (parts.length != STATE_PARTS) {
                    throw new IllegalArgumentException("Expected three state fields.");
                }
                states.put(entry.getKey(), new LoginAttemptState(Long.parseLong(parts[0]), Integer.parseInt(parts[1]),
                    Long.parseLong(parts[2])));
            } catch (RuntimeException e) {
                throw new BusinessException("Invalid login budget state in ConfigMap " + RESOURCE_NAME + " at "
                    + entry.getKey(), e);
            }
        }
        return states;
    }

    private void evictExpired(Map<String, LoginAttemptState> states) {
        long now = System.currentTimeMillis();
        List<Map.Entry<String, LoginAttemptState>> expired = new ArrayList<>();
        for (Map.Entry<String, LoginAttemptState> entry : states.entrySet()) {
            if (getExpiresAt(entry.getValue()) <= now) {
                expired.add(entry);
            }
        }
        expired.sort(Comparator.comparingLong(entry -> getExpiresAt(entry.getValue())));
        for (Map.Entry<String, LoginAttemptState> entry : expired) {
            states.remove(entry.getKey());
        }
    }

    private long getExpiresAt(LoginAttemptState state) {
        long windowMillis = TimeUnit.SECONDS.toMillis(Math.max(1, attemptWindowSeconds));
        return Math.max(state.getWindowStartedAt() + windowMillis, state.getLockedUntil());
    }
}
