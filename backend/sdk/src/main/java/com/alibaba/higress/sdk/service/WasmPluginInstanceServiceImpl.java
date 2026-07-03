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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.ListValuedMap;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.collections4.multimap.ArrayListValuedHashMap;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginConfig;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.alibaba.higress.sdk.util.MapUtil;

import io.kubernetes.client.openapi.ApiException;
import io.swagger.v3.core.util.Yaml;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class WasmPluginInstanceServiceImpl implements WasmPluginInstanceService {

    private static final int KEY_AUTH_CONSUMERS_PER_SHARD = 100;
    private static final String KEY_AUTH_SHARD_NAME_PREFIX = BuiltInPluginName.KEY_AUTH + "-consumers-";

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
        if (isKeyAuthInternalOnly(instances)) {
            return addOrUpdateKeyAuthInternalInstances(instances);
        }

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

    private boolean isKeyAuthInternalOnly(List<WasmPluginInstance> instances) {
        return CollectionUtils.isNotEmpty(instances) && instances.stream()
            .allMatch(i -> BuiltInPluginName.KEY_AUTH.equals(i.getPluginName()) && i.isInternal());
    }

    private List<WasmPluginInstance> addOrUpdateKeyAuthInternalInstances(List<WasmPluginInstance> instances) {
        List<WasmPluginInstance> results = new ArrayList<>(instances.size());
        for (WasmPluginInstance instance : instances) {
            instance.syncDeprecatedFields();
            instance.validate();
            if (instance.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)) {
                results.add(addOrUpdateKeyAuthGlobalInstance(instance));
            } else {
                results.add(addOrUpdateKeyAuthScopedInstance(instance));
            }
        }
        return results;
    }

    @SuppressWarnings("unchecked")
    private WasmPluginInstance addOrUpdateKeyAuthGlobalInstance(WasmPluginInstance instance) {
        WasmPlugin plugin = queryKeyAuthPlugin(instance);
        List<V1alpha1WasmPlugin> existingCrs = listKeyAuthInternalCrs(plugin.getPluginVersion());
        List<MatchRule> existingMatchRules = collectMatchRules(existingCrs);

        List<Object> consumers = new ArrayList<>();
        Map<String, Object> configurations = Optional.ofNullable(instance.getConfigurations()).orElseGet(HashMap::new);
        Object consumersObj = configurations.get(KeyAuthConfig.CONSUMERS);
        if (consumersObj instanceof List<?>) {
            consumers.addAll((List<Object>)consumersObj);
        }

        int shardCount = Math.max(1, (consumers.size() + KEY_AUTH_CONSUMERS_PER_SHARD - 1) / KEY_AUTH_CONSUMERS_PER_SHARD);
        Map<String, V1alpha1WasmPlugin> existingByName = existingCrs.stream()
            .filter(cr -> cr.getMetadata() != null && StringUtils.isNotBlank(cr.getMetadata().getName()))
            .collect(Collectors.toMap(cr -> cr.getMetadata().getName(), cr -> cr, (a, b) -> a));

        List<V1alpha1WasmPlugin> savedCrs = new ArrayList<>(shardCount);
        for (int i = 0; i < shardCount; i++) {
            String shardName = keyAuthShardName(i);
            V1alpha1WasmPlugin cr = existingByName.get(shardName);
            if (cr == null) {
                cr = kubernetesModelConverter.wasmPluginToCr(plugin, true);
                Objects.requireNonNull(cr.getMetadata()).setName(shardName);
            }

            V1alpha1WasmPluginSpec spec = Objects.requireNonNull(cr.getSpec());
            spec.setDefaultConfigDisable(!Boolean.TRUE.equals(instance.getEnabled()));
            Map<String, Object> shardConfig = new HashMap<>(configurations);
            int from = i * KEY_AUTH_CONSUMERS_PER_SHARD;
            int to = Math.min(consumers.size(), from + KEY_AUTH_CONSUMERS_PER_SHARD);
            shardConfig.put(KeyAuthConfig.CONSUMERS, new ArrayList<>(consumers.subList(from, to)));
            spec.setDefaultConfig(shardConfig);
            spec.setMatchRules(copyMatchRules(existingMatchRules));
            savedCrs.add(saveWasmPluginCr(cr, existingByName.containsKey(shardName), plugin.getName()));
        }

        for (V1alpha1WasmPlugin cr : existingCrs) {
            String name = cr.getMetadata() == null ? null : cr.getMetadata().getName();
            if (isKeyAuthShardName(name) && shardIndex(name) >= shardCount) {
                deleteWasmPluginCr(name);
            }
        }

        return kubernetesModelConverter.getWasmPluginInstanceFromCr(savedCrs.get(0), instance.getTargets());
    }

    private WasmPluginInstance addOrUpdateKeyAuthScopedInstance(WasmPluginInstance instance) {
        WasmPlugin plugin = queryKeyAuthPlugin(instance);
        List<V1alpha1WasmPlugin> existingCrs = listKeyAuthInternalCrs(plugin.getPluginVersion());
        if (CollectionUtils.isEmpty(existingCrs)) {
            V1alpha1WasmPlugin cr = kubernetesModelConverter.wasmPluginToCr(plugin, true);
            kubernetesModelConverter.setWasmPluginInstanceToCr(cr, instance);
            return kubernetesModelConverter.getWasmPluginInstanceFromCr(saveWasmPluginCr(cr, false, plugin.getName()),
                instance.getTargets());
        }

        WasmPluginInstance result = null;
        for (V1alpha1WasmPlugin cr : existingCrs) {
            kubernetesModelConverter.setWasmPluginInstanceToCr(cr, instance);
            V1alpha1WasmPlugin saved = saveWasmPluginCr(cr, true, plugin.getName());
            if (result == null) {
                result = kubernetesModelConverter.getWasmPluginInstanceFromCr(saved, instance.getTargets());
            }
        }
        return result;
    }

    private WasmPlugin queryKeyAuthPlugin(WasmPluginInstance instance) {
        WasmPlugin plugin = wasmPluginService.query(BuiltInPluginName.KEY_AUTH, null);
        if (plugin == null) {
            throw new IllegalArgumentException("Unknown plugin: " + instance.getPluginName());
        }
        String version = StringUtils.firstNonEmpty(instance.getPluginVersion(), plugin.getPluginVersion());
        if (!version.equals(plugin.getPluginVersion())) {
            throw new IllegalArgumentException("Add operation is only allowed for the current plugin version.");
        }
        instance.setPluginVersion(version);
        return plugin;
    }

    private List<V1alpha1WasmPlugin> listKeyAuthInternalCrs(String version) {
        try {
            List<V1alpha1WasmPlugin> crs = kubernetesClientService.listWasmPlugin(BuiltInPluginName.KEY_AUTH, version);
            if (CollectionUtils.isEmpty(crs)) {
                return Collections.emptyList();
            }
            return crs.stream().filter(KubernetesUtil::isInternalResource).collect(Collectors.toList());
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
    }

    private V1alpha1WasmPlugin saveWasmPluginCr(V1alpha1WasmPlugin cr, boolean existed, String pluginName) {
        try {
            return existed ? kubernetesClientService.replaceWasmPlugin(cr) : kubernetesClientService.createWasmPlugin(cr);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding or updating the WasmPlugin CR with name: " + pluginName,
                e);
        }
    }

    private void deleteWasmPluginCr(String name) {
        try {
            kubernetesClientService.deleteWasmPlugin(name);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting stale WasmPlugin CR with name: " + name, e);
        }
    }

    private String keyAuthShardName(int index) {
        if (index == 0) {
            return BuiltInPluginName.KEY_AUTH + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
        }
        return KEY_AUTH_SHARD_NAME_PREFIX + index + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }

    private boolean isKeyAuthShardName(String name) {
        return StringUtils.equals(name, keyAuthShardName(0))
            || StringUtils.startsWith(name, KEY_AUTH_SHARD_NAME_PREFIX);
    }

    private int shardIndex(String name) {
        if (StringUtils.equals(name, keyAuthShardName(0))) {
            return 0;
        }
        if (!StringUtils.startsWith(name, KEY_AUTH_SHARD_NAME_PREFIX)) {
            return -1;
        }
        String suffix = StringUtils.removeEnd(StringUtils.removeStart(name, KEY_AUTH_SHARD_NAME_PREFIX),
            HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX);
        try {
            return Integer.parseInt(suffix);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private List<MatchRule> collectMatchRules(List<V1alpha1WasmPlugin> crs) {
        List<MatchRule> rules = new ArrayList<>();
        for (V1alpha1WasmPlugin cr : crs) {
            V1alpha1WasmPluginSpec spec = cr.getSpec();
            if (spec == null || CollectionUtils.isEmpty(spec.getMatchRules())) {
                continue;
            }
            for (MatchRule rule : spec.getMatchRules()) {
                if (rules.stream().noneMatch(rule::keyEquals)) {
                    rules.add(copyMatchRule(rule));
                }
            }
        }
        return rules;
    }

    private List<MatchRule> copyMatchRules(List<MatchRule> rules) {
        if (CollectionUtils.isEmpty(rules)) {
            return Collections.emptyList();
        }
        return rules.stream().map(this::copyMatchRule).collect(Collectors.toList());
    }

    private MatchRule copyMatchRule(MatchRule rule) {
        return new MatchRule(rule.getConfigDisable(), rule.getConfig() == null ? null : new HashMap<>(rule.getConfig()),
            rule.getDomain() == null ? null : new ArrayList<>(rule.getDomain()),
            rule.getIngress() == null ? null : new ArrayList<>(rule.getIngress()),
            rule.getService() == null ? null : new ArrayList<>(rule.getService()));
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName) {
        delete(MapUtil.of(scope, target), pluginName, null);
    }

    @Override
    public void delete(Map<WasmPluginInstanceScope, String> targets, String pluginName) {
        delete(targets, pluginName, null);
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName, Boolean internal) {
        delete(MapUtil.of(scope, target), pluginName, internal);
    }

    @Override
    public void delete(Map<WasmPluginInstanceScope, String> targets, String pluginName, Boolean internal) {
        if (MapUtils.isEmpty(targets)) {
            return;
        }
        List<V1alpha1WasmPlugin> existedCrs;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(pluginName, null);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
        if (internal != null) {
            existedCrs = existedCrs.stream().filter(cr -> internal == KubernetesUtil.isInternalResource(cr))
                .collect(Collectors.toList());
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
