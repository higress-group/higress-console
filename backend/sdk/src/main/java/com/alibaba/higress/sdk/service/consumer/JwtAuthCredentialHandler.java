/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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

import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.ALLOW;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.CLAIMS_TO_HEADERS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.CLOCK_SKEW_SECONDS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.CONSUMERS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.CONSUMER_NAME;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.FROM_COOKIES;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.FROM_HEADERS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.FROM_PARAMS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.ISSUER;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.JWKS;
import static com.alibaba.higress.sdk.constant.plugin.config.JwtAuthConfig.KEEP_TOKEN;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.model.consumer.JwtAuthCredential;
import com.google.common.collect.Lists;

class JwtAuthCredentialHandler implements CredentialHandler {

    @Override
    public String getType() {
        return CredentialType.JWT_AUTH;
    }

    @Override
    public String getPluginName() {
        return BuiltInPluginName.JWT_AUTH;
    }

    @Override
    public boolean isConsumerInUse(String consumerName, List<WasmPluginInstance> instances) {
        if (CollectionUtils.isEmpty(instances)) {
            return false;
        }
        for (WasmPluginInstance instance : instances) {
            List<String> allowedConsumers = getAllowedConsumers(instance);
            if (allowedConsumers.contains(consumerName)) {
                return true;
            }
        }
        return false;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Consumer> extractConsumers(WasmPluginInstance instance) {
        if (MapUtils.isEmpty(instance.getConfigurations())) {
            return Lists.newArrayList();
        }
        Object consumersObj = instance.getConfigurations().get(CONSUMERS);
        if (!(consumersObj instanceof List<?>)) {
            return Lists.newArrayList();
        }
        List<?> consumerList = (List<?>)consumersObj;

        List<Consumer> consumers = new ArrayList<>(consumerList.size());
        for (Object consumerObj : consumerList) {
            if (!(consumerObj instanceof Map<?, ?>)) {
                continue;
            }
            Consumer consumer = extractConsumer((Map<String, Object>)consumerObj);
            if (consumer != null) {
                consumers.add(consumer);
            }
        }
        return consumers;
    }

    @Override
    public void initDefaultGlobalConfigs(WasmPluginInstance instance) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            configurations = new LinkedHashMap<>();
            instance.setConfigurations(configurations);
        }
        configurations.putIfAbsent(GLOBAL_AUTH, false);
        configurations.putIfAbsent(ALLOW, Collections.emptyList());
        configurations.computeIfAbsent(CONSUMERS, k -> new ArrayList<>());
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean saveConsumer(WasmPluginInstance instance, Consumer consumer) {
        if (CollectionUtils.isEmpty(consumer.getCredentials())) {
            return false;
        }

        JwtAuthCredential credential = (JwtAuthCredential)consumer.getCredentials().stream()
            .filter(c -> CredentialType.JWT_AUTH.equals(c.getType())).findFirst().orElse(null);
        if (credential == null) {
            return deleteConsumer(instance, consumer.getName());
        }

        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            initDefaultGlobalConfigs(instance);
            configurations = instance.getConfigurations();
        }

        Object consumersObj = configurations.computeIfAbsent(CONSUMERS, k -> new ArrayList<>());
        List<Object> consumers = consumersObj instanceof List ? new ArrayList<>((List<Object>)consumersObj)
            : new ArrayList<>();

        Map<String, Object> consumerConfig = null;
        for (Object consumerObj : consumers) {
            if (!(consumerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> consumerMap = (Map<String, Object>)consumerObj;
            Consumer existedConsumer = extractConsumer(consumerMap);
            if (existedConsumer == null) {
                continue;
            }
            if (consumer.getName().equals(existedConsumer.getName())) {
                consumerConfig = consumerMap;
            } else if (hasSameCredential(existedConsumer, credential)) {
                throw new IllegalArgumentException(
                    "JWT auth credential already in use by consumer: " + existedConsumer.getName());
            }
        }

        if (consumerConfig == null) {
            consumerConfig = new HashMap<>();
            consumerConfig.put(CONSUMER_NAME, consumer.getName());
            consumers.add(consumerConfig);
        } else {
            credential = mergeExistedConfig(credential, consumerConfig);
        }

        credential.validate(false);
        consumerConfig.put(ISSUER, credential.getIssuer());
        consumerConfig.put(JWKS, credential.getJwks());
        overwriteListValue(consumerConfig, CLAIMS_TO_HEADERS, credential.getClaimsToHeaders());
        overwriteListValue(consumerConfig, FROM_HEADERS, credential.getFromHeaders());
        overwriteListValue(consumerConfig, FROM_PARAMS, credential.getFromParams());
        overwriteListValue(consumerConfig, FROM_COOKIES, credential.getFromCookies());
        overwriteValue(consumerConfig, CLOCK_SKEW_SECONDS, credential.getClockSkewSeconds());
        overwriteValue(consumerConfig, KEEP_TOKEN, credential.getKeepToken());
        configurations.put(CONSUMERS, consumers);
        configurations.put(GLOBAL_AUTH, false);
        return true;
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean deleteConsumer(WasmPluginInstance globalInstance, String consumerName) {
        Map<String, Object> globalConfigurations = globalInstance.getConfigurations();
        if (MapUtils.isEmpty(globalConfigurations)) {
            return false;
        }
        Object consumersObj = globalConfigurations.get(CONSUMERS);
        if (!(consumersObj instanceof List<?>)) {
            return false;
        }
        List<?> consumers = (List<?>)consumersObj;

        List<Object> newConsumers = new ArrayList<>(consumers);
        boolean deleted = newConsumers.removeIf(consumerObj -> {
            if (!(consumerObj instanceof Map<?, ?>)) {
                return false;
            }
            Map<?, ?> consumerMap = (Map<?, ?>)consumerObj;
            return consumerName.equals(consumerMap.get(CONSUMER_NAME));
        });
        if (deleted) {
            globalConfigurations.put(CONSUMERS, newConsumers);
        }
        return deleted;
    }

    @Override
    public List<String> getAllowedConsumers(WasmPluginInstance instance) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            return Lists.newArrayList();
        }

        Object allowObj = configurations.get(ALLOW);
        if (!(allowObj instanceof List<?>)) {
            return Lists.newArrayList();
        }
        List<?> allowList = (List<?>)allowObj;
        return allowList.stream().filter(String.class::isInstance).map(String.class::cast).collect(Collectors.toList());
    }

    @Override
    public void updateAllowList(AllowListOperation operation, WasmPluginInstance instance, List<String> consumerNames) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            configurations = new HashMap<>();
            instance.setConfigurations(configurations);
        }

        List<String> newAllowList = getAllowedConsumers(instance);
        switch (operation) {
            case ADD:
                for (String consumerName : consumerNames) {
                    if (!newAllowList.contains(consumerName)) {
                        newAllowList.add(consumerName);
                    }
                }
                break;
            case REMOVE:
                newAllowList.removeAll(consumerNames);
                break;
            case REPLACE:
                newAllowList = consumerNames;
                break;
            case TOGGLE_ONLY:
                if (CollectionUtils.isEmpty(newAllowList)) {
                    newAllowList = new ArrayList<>();
                }
                break;
            default:
                throw new UnsupportedOperationException("Unsupported operation: " + operation);
        }
        configurations.put(ALLOW, newAllowList);
    }

    private Consumer extractConsumer(Map<String, Object> consumerMap) {
        if (MapUtils.isEmpty(consumerMap)) {
            return null;
        }
        String name = MapUtils.getString(consumerMap, CONSUMER_NAME);
        if (StringUtils.isBlank(name)) {
            return null;
        }

        JwtAuthCredential credential = parseCredential(consumerMap);
        if (credential == null) {
            return null;
        }
        return new Consumer(name, Lists.newArrayList(credential));
    }

    private boolean hasSameCredential(Consumer existedConsumer, JwtAuthCredential credential) {
        if (credential == null || existedConsumer == null) {
            return false;
        }
        JwtAuthCredential existedCredential = (JwtAuthCredential)existedConsumer.getCredentials().stream()
            .filter(c -> CredentialType.JWT_AUTH.equals(c.getType())).findFirst().orElse(null);
        return existedCredential != null && StringUtils.equals(credential.getIssuer(), existedCredential.getIssuer())
            && StringUtils.equals(credential.getJwks(), existedCredential.getJwks());
    }

    private JwtAuthCredential mergeExistedConfig(JwtAuthCredential credential, Map<String, Object> consumerConfig) {
        JwtAuthCredential existedCredential = parseCredential(consumerConfig);
        if (existedCredential == null) {
            return credential;
        }
        return new JwtAuthCredential(StringUtils.firstNonBlank(credential.getIssuer(), existedCredential.getIssuer()),
            StringUtils.firstNonBlank(credential.getJwks(), existedCredential.getJwks()),
            credential.getClaimsToHeaders() != null ? credential.getClaimsToHeaders() : existedCredential.getClaimsToHeaders(),
            credential.getFromHeaders() != null ? credential.getFromHeaders() : existedCredential.getFromHeaders(),
            credential.getFromParams() != null ? credential.getFromParams() : existedCredential.getFromParams(),
            credential.getFromCookies() != null ? credential.getFromCookies() : existedCredential.getFromCookies(),
            credential.getClockSkewSeconds() != null ? credential.getClockSkewSeconds()
                : existedCredential.getClockSkewSeconds(),
            credential.getKeepToken() != null ? credential.getKeepToken() : existedCredential.getKeepToken());
    }

    @SuppressWarnings("unchecked")
    private JwtAuthCredential parseCredential(Map<String, Object> consumerMap) {
        String issuer = MapUtils.getString(consumerMap, ISSUER);
        String jwks = MapUtils.getString(consumerMap, JWKS);
        if (StringUtils.isAnyBlank(issuer, jwks)) {
            return null;
        }

        return new JwtAuthCredential(issuer, jwks, copyListOfMaps(consumerMap.get(CLAIMS_TO_HEADERS)),
            copyListOfMaps(consumerMap.get(FROM_HEADERS)), copyStringList(consumerMap.get(FROM_PARAMS)),
            copyStringList(consumerMap.get(FROM_COOKIES)), MapUtils.getInteger(consumerMap, CLOCK_SKEW_SECONDS),
            MapUtils.getBoolean(consumerMap, KEEP_TOKEN));
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> copyListOfMaps(Object value) {
        if (!(value instanceof List<?>)) {
            return null;
        }
        List<?> values = (List<?>)value;
        List<Map<String, Object>> result = new ArrayList<>(values.size());
        for (Object item : values) {
            if (item instanceof Map<?, ?>) {
                result.add(new LinkedHashMap<>((Map<String, Object>)item));
            }
        }
        return result;
    }

    private List<String> copyStringList(Object value) {
        if (!(value instanceof List<?>)) {
            return null;
        }
        List<?> values = (List<?>)value;
        List<String> result = new ArrayList<>(values.size());
        for (Object item : values) {
            if (item instanceof String) {
                result.add((String)item);
            }
        }
        return result;
    }

    private void overwriteListValue(Map<String, Object> consumerConfig, String key, List<?> values) {
        if (values != null) {
            consumerConfig.put(key, values);
        } else {
            consumerConfig.remove(key);
        }
    }

    private void overwriteValue(Map<String, Object> consumerConfig, String key, Object value) {
        if (value != null) {
            consumerConfig.put(key, value);
        } else {
            consumerConfig.remove(key);
        }
    }
}
