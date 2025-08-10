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

import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.ALLOW;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.CONSUMERS;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.CONSUMER_CREDENTIAL;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.CONSUMER_CREDENTIALS;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.CONSUMER_NAME;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_HEADER;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_QUERY;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.KEYS;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredentialSource;
import com.google.common.collect.Lists;
import com.google.common.net.HttpHeaders;

class KeyAuthCredentialHandler implements CredentialHandler {

    private static final String BEARER_TOKEN_PREFIX = "Bearer ";

    @Override
    public String getType() {
        return CredentialType.KEY_AUTH;
    }

    @Override
    public String getPluginName() {
        return BuiltInPluginName.KEY_AUTH;
    }

    @Override
    public boolean isConsumerInUse(String consumerName, List<WasmPluginInstance> instances) {
        if (CollectionUtils.isEmpty(instances)) {
            return false;
        }
        for (WasmPluginInstance instance : instances) {
            Map<String, Object> configurations = instance.getConfigurations();
            if (MapUtils.isEmpty(configurations)) {
                continue;
            }
            Object allowObj = configurations.get(ALLOW);
            if (allowObj instanceof List<?>) {
                List<?> allowList = (List<?>)allowObj;
                if (allowList.contains(consumerName)) {
                    return true;
                }
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

            Map<String, Object> consumerMap = (Map<String, Object>)consumerObj;

            String name = MapUtils.getString(consumerMap, CONSUMER_NAME);
            if (StringUtils.isBlank(name)) {
                continue;
            }

            KeyAuthCredential credential = parseCredential(consumerMap);
            if (credential == null) {
                continue;
            }

            Consumer consumer = new Consumer();
            consumer.setName(name);
            consumer.setCredentials(Lists.newArrayList(credential));
            consumers.add(consumer);
        }
        return consumers;
    }

    @Override
    @SuppressWarnings("unchecked")
    public boolean saveConsumer(WasmPluginInstance instance, Consumer consumer) {
        if (CollectionUtils.isEmpty(consumer.getCredentials())) {
            return false;
        }

        KeyAuthCredential keyAuthCredential = (KeyAuthCredential)consumer.getCredentials().stream()
            .filter(c -> CredentialType.KEY_AUTH.equals(c.getType())).findFirst().orElse(null);
        if (keyAuthCredential == null) {
            return deleteConsumer(instance, consumer.getName());
        }

        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            configurations = new HashMap<>();
            instance.setConfigurations(configurations);
        }

        // TODO: Remove this after plugin upgrade.
        // Add a dummy key to the global keys list because the plugin requires at least one global key.
        configurations.put(KEYS, Lists.newArrayList("x-higress-dummy-key"));

        Object consumersObj = configurations.computeIfAbsent(CONSUMERS, k -> new ArrayList<>());
        List<Object> consumers;
        if (consumersObj instanceof List) {
            consumers = new ArrayList<>((List<Object>)consumersObj);
        } else {
            consumers = new ArrayList<>();
        }
        Map<String, Object> consumerConfig = null;
        for (Object consumerObj : consumers) {
            if (!(consumerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> consumerMap = (Map<String, Object>)consumerObj;
            if (consumer.getName().equals(consumerMap.get(CONSUMER_NAME))) {
                consumerConfig = consumerMap;
                break;
            }
        }

        if (consumerConfig == null) {
            consumerConfig = new HashMap<>();
            consumerConfig.put(CONSUMER_NAME, consumer.getName());
            consumers.add(consumerConfig);
        } else {
            keyAuthCredential = mergeExistedConfig(keyAuthCredential, consumerConfig);
        }

        keyAuthCredential.validate(false);

        KeyAuthCredentialSource sourceEnum = KeyAuthCredentialSource.parse(keyAuthCredential.getSource());
        if (sourceEnum == null) {
            throw new IllegalArgumentException("Invalid key auth credential source: " + keyAuthCredential.getSource());
        }
        String key = keyAuthCredential.getKey();
        List<String> credentials = keyAuthCredential.getValues();
        switch (sourceEnum) {
            case BEARER:
            case HEADER:
                consumerConfig.put(IN_HEADER, true);
                consumerConfig.put(IN_QUERY, false);
                if (sourceEnum == KeyAuthCredentialSource.BEARER) {
                    key = HttpHeaders.AUTHORIZATION;
                    credentials = credentials.stream().map(c -> BEARER_TOKEN_PREFIX + c).collect(Collectors.toList());
                }
                break;
            case QUERY:
                consumerConfig.put(IN_HEADER, false);
                consumerConfig.put(IN_QUERY, true);
                break;
            default:
                throw new IllegalArgumentException(
                    "Unsupported key auth credential source: " + keyAuthCredential.getSource());
        }
        consumerConfig.put(KEYS, Lists.newArrayList(key));
        consumerConfig.put(CONSUMER_CREDENTIALS, credentials);
        consumerConfig.remove(CONSUMER_CREDENTIAL);

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
        if (!(consumersObj instanceof List)) {
            return false;
        }
        boolean deleted = false;
        List<Object> consumers = (List<Object>)consumersObj;
        for (int i = consumers.size() - 1; i >= 0; --i) {
            Object consumerObj = consumers.get(i);
            if (!(consumerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> consumerMap = (Map<String, Object>)consumerObj;
            if (consumerName.equals(consumerMap.get(CONSUMER_NAME))) {
                consumers.remove(i);
                deleted = true;
            }
        }
        return deleted;
    }

    @Override
    public List<String> getAllowList(WasmPluginInstance instance) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            return Lists.newArrayList();
        }

        Object allowObj = configurations.get(ALLOW);
        if (!(allowObj instanceof List<?>)) {
            return Lists.newArrayList();
        }
        List<?> allowList = (List<?>)allowObj;
        return allowList.stream().filter(a -> a instanceof String).map(a -> (String)a).collect(Collectors.toList());
    }

    @Override
    public void updateAllowList(AllowListOperation operation, WasmPluginInstance instance, List<String> consumerNames) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            configurations = new HashMap<>();
            instance.setConfigurations(configurations);
        }

        if (CollectionUtils.isEmpty(consumerNames)) {
            configurations.put(ALLOW, Collections.emptyList());
        } else {
            List<String> newAllowList = getAllowList(instance);
            switch (operation) {
                case ADD:
                    for (String consumerName : consumerNames) {
                        if (!newAllowList.contains(consumerName)) {
                            newAllowList.add(consumerName);
                        }
                    }
                    break;
                case REMOVE:
                    for (String consumerName : consumerNames) {
                        newAllowList.remove(consumerName);
                    }
                    break;
                case REPLACE:
                    newAllowList = consumerNames;
                    break;
                default:
                    throw new UnsupportedOperationException("Unsupported operation: " + operation);
            }
            configurations.put(ALLOW, newAllowList);
        }
    }

    private KeyAuthCredential mergeExistedConfig(KeyAuthCredential keyAuthCredential,
        Map<String, Object> consumerConfig) {
        KeyAuthCredential existedCredential = parseCredential(consumerConfig);
        if (existedCredential == null) {
            return keyAuthCredential;
        }

        return new KeyAuthCredential(
            StringUtils.firstNonBlank(keyAuthCredential.getSource(), existedCredential.getSource()),
            StringUtils.firstNonBlank(keyAuthCredential.getKey(), existedCredential.getKey()),
            CollectionUtils.isNotEmpty(keyAuthCredential.getValues()) ? keyAuthCredential.getValues()
                : existedCredential.getValues());
    }

    private static KeyAuthCredential parseCredential(Map<String, Object> consumerMap) {

        Object keyObj = MapUtils.getObject(consumerMap, KEYS);
        if (!(keyObj instanceof List<?>)) {
            return null;
        }

        List<?> keyList = (List<?>)keyObj;
        if (keyList.isEmpty()) {
            return null;
        }

        String key = null;
        for (Object keyItemObj : keyList) {
            if (!(keyItemObj instanceof String)) {
                continue;
            }
            String keyItem = (String)keyItemObj;
            if (StringUtils.isNotBlank(keyItem)) {
                key = keyItem;
            }
        }
        if (key == null) {
            return null;
        }

        Boolean inHeader = MapUtils.getBoolean(consumerMap, IN_HEADER);
        Boolean inQuery = MapUtils.getBoolean(consumerMap, IN_QUERY);

        List<String> credentials = new ArrayList<>();
        Object credentialsObj = consumerMap.get(CONSUMER_CREDENTIALS);
        if (credentialsObj instanceof List<?>) {
            List<?> credentialsList = (List<?>)credentialsObj;
            for (Object credentialObj : credentialsList) {
                if (credentialObj instanceof String) {
                    credentials.add((String)credentialObj);
                }
            }
        }
        {
            // TODO: To be removed later.
            String credential = MapUtils.getString(consumerMap, CONSUMER_CREDENTIAL);
            if (StringUtils.isNotBlank(credential) && !credentials.contains(credential)) {
                credentials.add(credential);
            }
        }

        KeyAuthCredentialSource source;
        if (Boolean.TRUE.equals(inHeader)) {
            if (HttpHeaders.AUTHORIZATION.equals(key)
                && credentials.stream().allMatch(c -> c.startsWith(BEARER_TOKEN_PREFIX))) {
                source = KeyAuthCredentialSource.BEARER;
                key = null;
                credentials.replaceAll(s -> s.substring(BEARER_TOKEN_PREFIX.length()).trim());
            } else {
                source = KeyAuthCredentialSource.HEADER;
            }
        } else if (Boolean.TRUE.equals(inQuery)) {
            source = KeyAuthCredentialSource.QUERY;
        } else {
            return null;
        }
        return new KeyAuthCredential(source.name(), key, credentials);
    }
}
