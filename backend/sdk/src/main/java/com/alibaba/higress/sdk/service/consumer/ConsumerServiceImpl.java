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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.AllowList;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.Credential;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConsumerServiceImpl implements ConsumerService {

    private static final Map<String, CredentialHandler> CREDENTIAL_HANDLERS;

    static {
        CREDENTIAL_HANDLERS =
            Stream.of(new KeyAuthCredentialHandler()).collect(Collectors.toMap(CredentialHandler::getType, c -> c));
    }

    private final WasmPluginInstanceService wasmPluginInstanceService;

    public ConsumerServiceImpl(WasmPluginInstanceService wasmPluginInstanceService) {
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public Consumer addOrUpdate(Consumer consumer) {
        List<WasmPluginInstance> instancesToUpdate = new ArrayList<>(CREDENTIAL_HANDLERS.size());
        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance =
                wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, config.getPluginName(), true);
            if (instance == null) {
                instance = wasmPluginInstanceService.createEmptyInstance(config.getPluginName());
                instance.setInternal(true);
                instance.setGlobalTarget();
            }
            instance.setEnabled(true);
            if (config.saveConsumer(instance, consumer)) {
                instancesToUpdate.add(instance);
            }
        }
        for (WasmPluginInstance instance : instancesToUpdate) {
            wasmPluginInstanceService.addOrUpdate(instance);
        }
        return query(consumer.getName());
    }

    @Override
    public PaginatedResult<Consumer> list(CommonPageQuery query) {
        return PaginatedResult.createFromFullList(new ArrayList<>(getConsumers().values()), query);
    }

    @Override
    public Consumer query(String consumerName) {
        if (StringUtils.isEmpty(consumerName)) {
            throw new IllegalArgumentException("consumerName cannot be empty.");
        }
        return getConsumers().get(consumerName);
    }

    @Override
    public void delete(String consumerName) {
        if (StringUtils.isEmpty(consumerName)) {
            throw new IllegalArgumentException("consumerName cannot be empty.");
        }
        Map<String, List<WasmPluginInstance>> instancesCache = new HashMap<>(CREDENTIAL_HANDLERS.size());
        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = wasmPluginInstanceService.list(config.getPluginName());
            if (config.isConsumerInUse(consumerName, instances)) {
                throw new BusinessException("Consumer " + consumerName + " is still in use");
            }
            instancesCache.put(config.getType(), instances);
        }
        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = instancesCache.get(config.getType());
            WasmPluginInstance globalInstance = instances.stream()
                .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);
            if (globalInstance == null) {
                continue;
            }
            if (config.deleteConsumer(globalInstance, consumerName)) {
                wasmPluginInstanceService.addOrUpdate(globalInstance);
            }
        }
    }

    @Override
    public List<AllowList> listAllowLists() {
        List<AllowList> allowLists = new ArrayList<>();
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = wasmPluginInstanceService.list(handler.getPluginName(), true);
            if (CollectionUtils.isEmpty(instances)) {
                continue;
            }

            for (WasmPluginInstance instance : instances) {
                if (instance.getTargets().containsKey(WasmPluginInstanceScope.GLOBAL)) {
                    continue;
                }
                AllowList allowList = allowLists.stream()
                    .filter(a -> Objects.equals(instance.getTargets(), a.getTargets())).findFirst().orElseGet(() -> {
                        AllowList newAllowList = new AllowList(instance.getTargets(), new ArrayList<>());
                        allowLists.add(newAllowList);
                        return newAllowList;
                    });
                List<String> consumerNames = handler.getAllowList(instance);
                if (CollectionUtils.isEmpty(consumerNames)) {
                    continue;
                }
                for (String consumerName : consumerNames) {
                    if (!allowList.getConsumerNames().contains(consumerName)) {
                        allowList.getConsumerNames().add(consumerName);
                    }
                }
            }
        }
        return allowLists;
    }

    @Override
    public AllowList getAllowList(Map<WasmPluginInstanceScope, String> targets) {
        if (MapUtils.isEmpty(targets)) {
            throw new IllegalArgumentException("targets cannot be null or empty.");
        }
        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            throw new IllegalArgumentException("targets cannot contain GLOBAL scope.");
        }

        Set<String> allConsumerNames = null;
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance = wasmPluginInstanceService.query(targets, handler.getPluginName(), true);
            if (instance == null) {
                continue;
            }
            List<String> consumerNames = handler.getAllowList(instance);
            if (CollectionUtils.isEmpty(consumerNames)) {
                continue;
            }
            if (allConsumerNames == null) {
                allConsumerNames = new LinkedHashSet<>();
            }
            allConsumerNames.addAll(consumerNames);
        }
        if (allConsumerNames == null) {
            return null;
        }
        return new AllowList(targets, new ArrayList<>(allConsumerNames));
    }

    @Override
    public void updateAllowList(AllowList allowList) {
        if (allowList == null) {
            throw new IllegalArgumentException("allowList cannot be null.");
        }

        Map<WasmPluginInstanceScope, String> targets = allowList.getTargets();
        List<String> consumerNames = allowList.getConsumerNames();

        if (MapUtils.isEmpty(targets)) {
            throw new IllegalArgumentException("targets cannot be null or empty.");
        }
        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            throw new IllegalArgumentException("targets cannot contain GLOBAL scope.");
        }

        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance = wasmPluginInstanceService.query(targets, config.getPluginName(), true);
            if (CollectionUtils.isEmpty(consumerNames)) {
                if (instance != null) {
                    wasmPluginInstanceService.delete(targets, config.getPluginName());
                }
                continue;
            }

            if (instance == null) {
                instance = wasmPluginInstanceService.createEmptyInstance(config.getPluginName());
                instance.setInternal(true);
                instance.setTargets(targets);
            }
            config.updateAllowList(instance, consumerNames);
            wasmPluginInstanceService.addOrUpdate(instance);
        }
    }

    private SortedMap<String, Consumer> getConsumers() {
        SortedMap<String, Consumer> consumers = new TreeMap<>();
        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance =
                wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, config.getPluginName(), true);
            if (instance == null) {
                continue;
            }
            List<Consumer> extractedConsumers = config.extractConsumers(instance);
            for (Consumer consumer : extractedConsumers) {
                Consumer existedConsumer = consumers.putIfAbsent(consumer.getName(), consumer);
                if (existedConsumer != null) {
                    List<Credential> credentials = new ArrayList<>(existedConsumer.getCredentials());
                    credentials.addAll(consumer.getCredentials());
                    existedConsumer.setCredentials(credentials);
                }
            }
        }
        return consumers;
    }
}
