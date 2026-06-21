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

import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.ALLOW;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.CONSUMERS;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.CONSUMER_NAME;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.ACCESS_KEY;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.LEGACY_KEY;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.LEGACY_SECRET;
import static com.alibaba.higress.sdk.constant.plugin.config.HmacAuthConfig.SECRET_KEY;

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
import com.alibaba.higress.sdk.model.consumer.HmacAuthCredential;
import com.google.common.collect.Lists;

class HmacAuthCredentialHandler implements CredentialHandler {

    @Override
    public String getType() {
        return CredentialType.HMAC_AUTH;
    }

    @Override
    public String getPluginName() {
        return BuiltInPluginName.HMAC_AUTH;
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

        HmacAuthCredential credential = (HmacAuthCredential)consumer.getCredentials().stream()
            .filter(c -> CredentialType.HMAC_AUTH.equals(c.getType())).findFirst().orElse(null);
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
                    "HMAC auth credential already in use by consumer: " + existedConsumer.getName());
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
        consumerConfig.put(ACCESS_KEY, credential.getKey());
        consumerConfig.put(SECRET_KEY, credential.getSecret());
        consumerConfig.remove(LEGACY_KEY);
        consumerConfig.remove(LEGACY_SECRET);
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

        HmacAuthCredential credential = parseCredential(consumerMap);
        if (credential == null) {
            return null;
        }
        return new Consumer(name, Lists.newArrayList(credential));
    }

    private boolean hasSameCredential(Consumer existedConsumer, HmacAuthCredential credential) {
        if (credential == null || existedConsumer == null) {
            return false;
        }
        HmacAuthCredential existedCredential = (HmacAuthCredential)existedConsumer.getCredentials().stream()
            .filter(c -> CredentialType.HMAC_AUTH.equals(c.getType())).findFirst().orElse(null);
        return existedCredential != null && StringUtils.equals(credential.getKey(), existedCredential.getKey());
    }

    private HmacAuthCredential mergeExistedConfig(HmacAuthCredential credential, Map<String, Object> consumerConfig) {
        HmacAuthCredential existedCredential = parseCredential(consumerConfig);
        if (existedCredential == null) {
            return credential;
        }
        return new HmacAuthCredential(StringUtils.firstNonBlank(credential.getKey(), existedCredential.getKey()),
            StringUtils.firstNonBlank(credential.getSecret(), existedCredential.getSecret()));
    }

    private HmacAuthCredential parseCredential(Map<String, Object> consumerMap) {
        String key = MapUtils.getString(consumerMap, ACCESS_KEY, MapUtils.getString(consumerMap, LEGACY_KEY));
        String secret =
            MapUtils.getString(consumerMap, SECRET_KEY, MapUtils.getString(consumerMap, LEGACY_SECRET));
        if (StringUtils.isAnyBlank(key, secret)) {
            return null;
        }
        return new HmacAuthCredential(key, secret);
    }
}
