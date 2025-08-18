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
package com.alibaba.higress.sdk.service;

import java.io.IOException;
import java.io.StringReader;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.ListValuedMap;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.collections4.multimap.ArrayListValuedHashMap;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginConfig;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.util.MapUtil;

import io.kubernetes.client.openapi.ApiException;
import io.swagger.v3.core.util.Yaml;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class WasmPluginInstanceServiceImpl implements WasmPluginInstanceService {

    private final WasmPluginService wasmPluginService;
    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;

    public WasmPluginInstanceServiceImpl(WasmPluginService wasmPluginService,
        KubernetesClientService kubernetesClientService, KubernetesModelConverter kubernetesModelConverter) {
        this.wasmPluginService = wasmPluginService;
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public WasmPluginInstance createEmptyInstance(String pluginName) {
        WasmPlugin plugin = wasmPluginService.query(pluginName, null);
        if (plugin == null) {
            throw new BusinessException("Plugin " + pluginName + " not found");
        }
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(plugin.getName());
        instance.setPluginVersion(plugin.getPluginVersion());
        return instance;
    }

    @Override
    public List<WasmPluginInstance> list(String pluginName) {
        return list(pluginName, null);
    }

    @Override
    public List<WasmPluginInstance> list(String pluginName, Boolean internal) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(pluginName, null);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return Collections.emptyList();
        }
        return plugins.stream().filter(p -> internal == null || internal == KubernetesUtil.isInternalResource(p))
            .map(kubernetesModelConverter::getWasmPluginInstancesFromCr).filter(Objects::nonNull)
            .flatMap(Collection::stream).collect(Collectors.toList());
    }

    @Override
    public List<WasmPluginInstance> list(WasmPluginInstanceScope scope, String target) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin();
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return Collections.emptyList();
        }
        return plugins.stream().map(p -> kubernetesModelConverter.getWasmPluginInstanceFromCr(p, scope, target))
            .filter(Objects::nonNull).collect(Collectors.toList());
    }

    @Override
    public WasmPluginInstance query(WasmPluginInstanceScope scope, String target, String pluginName) {
        return query(scope, target, pluginName, null);
    }

    @Override
    public WasmPluginInstance query(WasmPluginInstanceScope scope, String target, String pluginName, Boolean internal) {
        return query(MapUtil.of(scope, target), pluginName, internal);
    }

    @Override
    public WasmPluginInstance query(Map<WasmPluginInstanceScope, String> targets, String pluginName, Boolean internal) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when querying WasmPlugin.", e);
        }
        WasmPluginInstance instance = null;
        if (CollectionUtils.isNotEmpty(plugins)) {
            for (V1alpha1WasmPlugin plugin : plugins) {
                if (internal != null && internal != KubernetesUtil.isInternalResource(plugin)) {
                    continue;
                }
                instance = kubernetesModelConverter.getWasmPluginInstanceFromCr(plugin, targets);
                if (instance != null) {
                    break;
                }
            }
        }
        return instance;
    }

    @Override
    public WasmPluginInstance addOrUpdate(WasmPluginInstance instance) {
        List<WasmPluginInstance> updatedInstances = addOrUpdateAll(Collections.singletonList(instance));
        if (CollectionUtils.isEmpty(updatedInstances)) {
            throw new BusinessException("No instances were updated for plugin: " + instance.getPluginName());
        }
        if (updatedInstances.size() > 1) {
            throw new BusinessException(
                "Expected only one instance to be updated, but got: " + updatedInstances.size());
        }
        return updatedInstances.get(0);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<WasmPluginInstance> addOrUpdateAll(List<WasmPluginInstance> instances) {
        Map<String, WasmPlugin> pluginsToUpdate = new HashMap<>();
        ListValuedMap<WasmPluginInstanceGroupKey, WasmPluginInstance> groupedInstances = new ArrayListValuedHashMap<>();
        for (WasmPluginInstance instance : instances) {
            instance.syncDeprecatedFields();
            instance.validate();

            String pluginName = instance.getPluginName();
            WasmPlugin plugin =
                pluginsToUpdate.computeIfAbsent(pluginName, name -> wasmPluginService.query(name, null));
            if (plugin == null) {
                throw new IllegalArgumentException("Unknown plugin: " + instance.getPluginName());
            }

            String version = StringUtils.firstNonEmpty(instance.getPluginVersion(), plugin.getPluginVersion());
            WasmPluginInstanceGroupKey key = new WasmPluginInstanceGroupKey(pluginName, version, instance.isInternal());
            groupedInstances.put(key, instance);
        }

        IdentityHashMap<WasmPluginInstance, WasmPluginInstance> beforeToAfterMap = new IdentityHashMap<>();

        for (WasmPluginInstanceGroupKey key : groupedInstances.keySet()) {
            String name = key.getPluginName();
            String version = key.getPluginVersion();
            boolean internal = key.isInternal();

            WasmPlugin plugin = pluginsToUpdate.get(name);

            List<WasmPluginInstance> instancesToUpdate = groupedInstances.get(key);
            if (CollectionUtils.isEmpty(instancesToUpdate)) {
                continue;
            }

            V1alpha1WasmPlugin existedCr = null;
            try {
                List<V1alpha1WasmPlugin> existedCrs = kubernetesClientService.listWasmPlugin(name, version);
                if (CollectionUtils.isNotEmpty(existedCrs)) {
                    existedCr = existedCrs.stream().filter(cr -> internal == KubernetesUtil.isInternalResource(cr))
                        .findFirst().orElse(null);
                }
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when getting WasmPlugin.", e);
            }

            V1alpha1WasmPlugin result;
            if (existedCr != null) {
                result = existedCr;
            } else if (version.equals(plugin.getPluginVersion())) {
                result = kubernetesModelConverter.wasmPluginToCr(plugin, internal);
            } else {
                throw new IllegalArgumentException("Add operation is only allowed for the current plugin version.");
            }

            for (WasmPluginInstance instance : instancesToUpdate) {
                if (instance.getConfigurations() == null && StringUtils.isNotEmpty(instance.getRawConfigurations())) {
                    try {
                        Map<String, Object> configurations = (Map<String, Object>)Yaml.mapper()
                            .readValue(new StringReader(instance.getRawConfigurations()), Map.class);
                        instance.setConfigurations(configurations);
                    } catch (IOException e) {
                        throw new ValidationException(
                            "Error occurs when parsing raw configurations: " + instance.getRawConfigurations(), e);
                    }
                }

                Map<String, Object> configurations = instance.getConfigurations();
                WasmPluginConfig pluginConfig = wasmPluginService.queryConfig(name, null);
                if (pluginConfig != null) {
                    configurations = pluginConfig.validateAndCleanUp(configurations);
                }
                instance.setConfigurations(configurations);
                kubernetesModelConverter.setWasmPluginInstanceToCr(result, instance);
            }

            try {
                if (existedCr == null) {
                    result = kubernetesClientService.createWasmPlugin(result);
                } else {
                    result = kubernetesClientService.replaceWasmPlugin(result);
                }
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                    "Error occurs when adding or updating the WasmPlugin CR with name: " + plugin.getName(), e);
            }

            for (WasmPluginInstance instance : instancesToUpdate) {
                beforeToAfterMap.put(instance,
                    kubernetesModelConverter.getWasmPluginInstanceFromCr(result, instance.getTargets()));
            }
        }

        return instances.stream().map(beforeToAfterMap::get).collect(Collectors.toList());
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName) {
        delete(MapUtil.of(scope, target), pluginName);
    }

    @Override
    public void delete(Map<WasmPluginInstanceScope, String> targets, String pluginName) {
        if (MapUtils.isEmpty(targets)) {
            return;
        }
        List<V1alpha1WasmPlugin> existedCrs;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
        deletePluginInstances(existedCrs, targets);
    }

    @Override
    public void deleteAll(WasmPluginInstanceScope scope, String target) {
        deleteAll(MapUtil.of(scope, target));
    }

    @Override
    public void deleteAll(Map<WasmPluginInstanceScope, String> targets) {
        if (MapUtils.isEmpty(targets)) {
            return;
        }
        List<V1alpha1WasmPlugin> existedCrs;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin();
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
        deletePluginInstances(existedCrs, targets);
    }

    private void deletePluginInstances(List<V1alpha1WasmPlugin> crs, Map<WasmPluginInstanceScope, String> targets) {
        if (CollectionUtils.isEmpty(crs)) {
            return;
        }
        for (V1alpha1WasmPlugin cr : crs) {
            boolean needUpdate = kubernetesModelConverter.removeWasmPluginInstanceFromCr(cr, targets);
            if (needUpdate) {
                try {
                    kubernetesClientService.replaceWasmPlugin(cr);
                } catch (ApiException e) {
                    throw new BusinessException(
                        "Error occurs when trying to updating WasmPlugin with name " + cr.getMetadata().getName(), e);
                }
            }
        }
    }

    @Value
    private static class WasmPluginInstanceGroupKey {
        String pluginName;
        String pluginVersion;
        boolean internal;
    }
}
