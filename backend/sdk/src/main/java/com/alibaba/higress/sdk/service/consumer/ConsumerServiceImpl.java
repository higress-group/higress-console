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
import java.util.Collections;
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
import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.Credential;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConsumerServiceImpl implements ConsumerService {

    private static final List<String> DEFAULT_CREDENTIAL_TYPES = Collections.singletonList(CredentialType.KEY_AUTH);

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
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance = getGlobalPluginInstance(handler);
            if (instance == null) {
                instance = createGlobalPluginInstance(handler);
            }
            instance.setEnabled(true);
            if (handler.saveConsumer(instance, consumer)) {
                instancesToUpdate.add(instance);
            }
        }
        wasmPluginInstanceService.addOrUpdateAll(instancesToUpdate);
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
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = getAllPluginInstances(handler);
            if (handler.isConsumerInUse(consumerName, instances)) {
                throw new BusinessException("Consumer " + consumerName + " is still in use");
            }
            instancesCache.put(handler.getType(), instances);
        }
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = instancesCache.get(handler.getType());
            WasmPluginInstance globalInstance = instances.stream()
                .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);
            if (globalInstance == null) {
                continue;
            }
            if (handler.deleteConsumer(globalInstance, consumerName)) {
                wasmPluginInstanceService.addOrUpdate(globalInstance);
            }
        }
    }

    @Override
    public List<AllowList> listAllowLists() {
        List<AllowList> allowLists = new ArrayList<>();
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            List<WasmPluginInstance> instances = getAllPluginInstances(handler);
            if (CollectionUtils.isEmpty(instances)) {
                continue;
            }

            for (WasmPluginInstance instance : instances) {
                if (instance.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)) {
                    continue;
                }
                AllowList allowList = allowLists.stream()
                    .filter(a -> Objects.equals(instance.getTargets(), a.getTargets())).findFirst().orElseGet(() -> {
                        AllowList newAllowList =
                            AllowList.builder().targets(instance.getTargets()).authEnabled(instance.getEnabled())
                                .credentialTypes(new ArrayList<>()).consumerNames(new ArrayList<>()).build();
                        allowLists.add(newAllowList);
                        return newAllowList;
                    });
                List<String> consumerNames = handler.getAllowedConsumers(instance);
                if (CollectionUtils.isEmpty(consumerNames)) {
                    continue;
                }
                if (!allowList.getCredentialTypes().contains(handler.getType())) {
                    allowList.getCredentialTypes().add(handler.getType());
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

        List<String> credentialTypes = null;
        Set<String> allConsumerNames = null;
        boolean authEnabled = false;
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance = getPluginInstance(handler, targets);
            if (instance == null) {
                continue;
            }
            List<String> consumerNames = handler.getAllowedConsumers(instance);
            if (Boolean.TRUE.equals(instance.getEnabled())) {
                authEnabled = true;
            }
            if (credentialTypes == null) {
                credentialTypes = new ArrayList<>();
            }
            credentialTypes.add(handler.getType());
            if (allConsumerNames == null) {
                allConsumerNames = new LinkedHashSet<>();
            }
            allConsumerNames.addAll(consumerNames);
        }
        if (allConsumerNames == null) {
            return null;
        }
        return AllowList.builder().targets(targets).authEnabled(authEnabled).credentialTypes(credentialTypes)
            .consumerNames(new ArrayList<>(allConsumerNames)).build();
    }

    @Override
    public void updateAllowList(AllowListOperation operation, AllowList allowList) {
        if (operation == null) {
            throw new IllegalArgumentException("operation cannot be null.");
        }
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

        List<String> credentialTypes = allowList.getCredentialTypes();
        if (CollectionUtils.isEmpty(credentialTypes)) {
            credentialTypes = DEFAULT_CREDENTIAL_TYPES;
        } else {
            credentialTypes = credentialTypes.stream().distinct().collect(Collectors.toList());
        }

        switch (operation) {
            case ADD:
            case REMOVE:
                if (CollectionUtils.isEmpty(consumerNames) && allowList.getAuthEnabled() == null) {
                    // Nothing to do.
                    return;
                }
                break;
            case TOGGLE_ONLY:
                if (allowList.getAuthEnabled() == null) {
                    // Nothing to do.
                    return;
                }
                break;
            case REPLACE:
                break;
            default:
                throw new UnsupportedOperationException("Unsupported operation: " + operation);
        }

        for (String credentialType : credentialTypes) {
            CredentialHandler handler = CREDENTIAL_HANDLERS.get(credentialType);
            if (handler == null) {
                throw new IllegalArgumentException("Unsupported credential type: " + credentialType);
            }

            List<WasmPluginInstance> instancesToSave = new ArrayList<>();

            List<WasmPluginInstance> instances = getAllPluginInstances(handler);

            WasmPluginInstance globalInstance = instances.stream()
                .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);
            if (globalInstance == null) {
                globalInstance = createGlobalPluginInstance(handler);
                instancesToSave.add(globalInstance);
            }

            WasmPluginInstance targetInstance =
                instances.stream().filter(i -> targets.equals(i.getTargets())).findFirst().orElse(null);
            if (targetInstance == null) {
                targetInstance = wasmPluginInstanceService.createEmptyInstance(handler.getPluginName());
                targetInstance.setInternal(true);
                targetInstance.setTargets(targets);
            }
            if (allowList.getAuthEnabled() != null) {
                targetInstance.setEnabled(allowList.getAuthEnabled());
            }
            handler.updateAllowList(operation, targetInstance, consumerNames);
            instancesToSave.add(targetInstance);

            wasmPluginInstanceService.addOrUpdateAll(instancesToSave);
        }
    }

    private SortedMap<String, Consumer> getConsumers() {
        SortedMap<String, Consumer> consumers = new TreeMap<>();
        for (CredentialHandler handler : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance = getGlobalPluginInstance(handler);
            if (instance == null) {
                continue;
            }
            List<Consumer> extractedConsumers = handler.extractConsumers(instance);
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

    private List<WasmPluginInstance> getAllPluginInstances(CredentialHandler handler) {
        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(handler.getPluginName(), true);
        return instances != null ? instances : new ArrayList<>();
    }

    private WasmPluginInstance getGlobalPluginInstance(CredentialHandler handler) {
        return wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, handler.getPluginName(), true);
    }

    private WasmPluginInstance getPluginInstance(CredentialHandler handler,
        Map<WasmPluginInstanceScope, String> targets) {
        return wasmPluginInstanceService.query(targets, handler.getPluginName(), true);
    }

    private WasmPluginInstance createGlobalPluginInstance(CredentialHandler handler) {
        WasmPluginInstance instance = wasmPluginInstanceService.createEmptyInstance(handler.getPluginName());
        instance.setInternal(true);
        instance.setGlobalTarget();
        handler.initDefaultGlobalConfigs(instance);
        return instance;
    }
}
