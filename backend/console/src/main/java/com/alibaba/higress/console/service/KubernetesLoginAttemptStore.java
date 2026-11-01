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
import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.function.UnaryOperator;

import javax.annotation.Resource;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

@Service
public class KubernetesLoginAttemptStore implements LoginAttemptStore {

    private static final String RESOURCE_NAME_PREFIX = "higress-console-login-";
    private static final String STATE_KEY = "state";
    private static final String STATE_SEPARATOR = ":";
    private static final int STATE_PARTS = 3;
    private static final int MAX_UPDATE_ATTEMPTS = 8;

    private KubernetesClientService kubernetesClientService;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public LoginAttemptState get(LoginAttemptKey key) {
        String name = getResourceName(key);
        try {
            return deserialize(kubernetesClientService.readConfigMap(name));
        } catch (ApiException e) {
            throw new BusinessException("Unable to read login budget ConfigMap " + name, e);
        }
    }

    @Override
    public LoginAttemptState update(LoginAttemptKey key, UnaryOperator<LoginAttemptState> update) {
        String name = getResourceName(key);
        for (int attempt = 0; attempt < MAX_UPDATE_ATTEMPTS; attempt++) {
            V1ConfigMap configMap = read(name);
            LoginAttemptState previous = deserialize(configMap);
            LoginAttemptState updated = Objects.requireNonNull(update.apply(previous), "Updated state must not be null.");
            if (previous.equals(updated) || configMap == null && updated.isEmpty()) {
                return updated;
            }
            try {
                if (configMap == null) {
                    kubernetesClientService.createConfigMap(new V1ConfigMap()
                        .metadata(new V1ObjectMeta().name(name)).data(serialize(updated)));
                } else {
                    // Keeping the read resourceVersion makes this replacement a compare-and-swap operation.
                    configMap.setData(serialize(updated));
                    kubernetesClientService.replaceConfigMap(configMap);
                }
                return updated;
            } catch (ApiException e) {
                if (e.getCode() != HttpStatus.CONFLICT) {
                    throw new BusinessException("Unable to update login budget ConfigMap " + name, e);
                }
            }
        }
        throw new BusinessException(
            "Unable to update login budget ConfigMap " + name + " after " + MAX_UPDATE_ATTEMPTS + " attempts.");
    }

    private V1ConfigMap read(String name) {
        try {
            return kubernetesClientService.readConfigMap(name);
        } catch (ApiException e) {
            throw new BusinessException("Unable to read login budget ConfigMap " + name, e);
        }
    }

    private static String getResourceName(LoginAttemptKey key) {
        String material = key.getAccount().length() + STATE_SEPARATOR + key.getAccount() + "|"
            + key.getClientIp().length() + STATE_SEPARATOR + key.getClientIp();
        return RESOURCE_NAME_PREFIX + Hashing.sha256().hashString(material, StandardCharsets.UTF_8);
    }

    private static Map<String, String> serialize(LoginAttemptState state) {
        if (state.isEmpty()) {
            return Collections.emptyMap();
        }
        String value = state.getWindowStartedAt() + STATE_SEPARATOR + state.getFailureCount() + STATE_SEPARATOR
            + state.getLockedUntil();
        return Collections.singletonMap(STATE_KEY, value);
    }

    private static LoginAttemptState deserialize(V1ConfigMap configMap) {
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return LoginAttemptState.EMPTY;
        }
        String name = configMap.getMetadata() != null ? configMap.getMetadata().getName() : "unknown";
        String value = configMap.getData().get(STATE_KEY);
        try {
            String[] parts = value.split(STATE_SEPARATOR, -1);
            if (parts.length != STATE_PARTS) {
                throw new IllegalArgumentException("Expected three state fields.");
            }
            return new LoginAttemptState(Long.parseLong(parts[0]), Integer.parseInt(parts[1]), Long.parseLong(parts[2]));
        } catch (RuntimeException e) {
            throw new BusinessException("Invalid login budget state in ConfigMap " + name, e);
        }
    }
}
