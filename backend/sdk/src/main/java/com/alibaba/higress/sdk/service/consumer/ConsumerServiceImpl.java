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
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConsumerServiceImpl implements ConsumerService {

    private static final Map<String, CredentialHandler> CREDENTIAL_HANDLERS;

    static {
        CREDENTIAL_HANDLERS =
            Stream.of(new KeyAuthCredentialHandler()).collect(Collectors.toMap(CredentialHandler::getType, c -> c));
    }

    private final WasmPluginService wasmPluginService;
    private final WasmPluginInstanceService wasmPluginInstanceService;

    public ConsumerServiceImpl(WasmPluginService wasmPluginService,
        WasmPluginInstanceService wasmPluginInstanceService) {
        this.wasmPluginService = wasmPluginService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public Consumer addOrUpdate(Consumer consumer) {
        List<WasmPluginInstance> instancesToUpdate = new ArrayList<>(CREDENTIAL_HANDLERS.size());
        for (CredentialHandler config : CREDENTIAL_HANDLERS.values()) {
            WasmPluginInstance instance =
                wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, config.getPluginName(), true);
            if (instance == null) {
                WasmPlugin plugin = wasmPluginService.query(config.getPluginName(), null);
                if (plugin == null) {
                    throw new BusinessException("Plugin " + config.getPluginName() + " not found");
                }
                instance = new WasmPluginInstance();
                instance.setPluginName(plugin.getName());
                instance.setPluginVersion(plugin.getPluginVersion());
                instance.setInternal(true);
                instance.setScope(WasmPluginInstanceScope.GLOBAL);
            }
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
        return getConsumers().get(consumerName);
    }

    @Override
    public void delete(String consumerName) {
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
                .filter(i -> WasmPluginInstanceScope.GLOBAL.equals(i.getScope())).findFirst().orElse(null);
            if (globalInstance == null) {
                continue;
            }
            if (config.deleteConsumer(globalInstance, consumerName)) {
                wasmPluginInstanceService.addOrUpdate(globalInstance);
            }
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
                    existedConsumer.getCredentials().addAll(consumer.getCredentials());
                }
            }
        }
        return consumers;
    }
}
