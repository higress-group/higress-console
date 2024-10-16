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

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
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
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import io.kubernetes.client.openapi.ApiException;
import io.swagger.v3.core.util.Yaml;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.io.StringReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
                .filter(Objects::nonNull).toList();
    }

    @Override
    public WasmPluginInstance query(WasmPluginInstanceScope scope, String target, String pluginName) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when querying WasmPlugin.", e);
        }
        WasmPluginInstance instance = null;
        if (CollectionUtils.isNotEmpty(plugins)) {
            instance = kubernetesModelConverter.getWasmPluginInstanceFromCr(plugins.get(0), scope, target);
        }
        if (instance == null) {
            instance = new WasmPluginInstance(null, scope, target, pluginName, null, false, null, null);
        }
        return instance;
    }

    @Override
    @SuppressWarnings("unchecked")
    public WasmPluginInstance addOrUpdate(WasmPluginInstance instance) {
        WasmPluginInstanceScope scope = instance.getScope();
        if (scope == null) {
            throw new IllegalArgumentException("instance.scope cannot be null.");
        }
        String target = instance.getTarget();
        if (scope == WasmPluginInstanceScope.GLOBAL) {
            if (target != null) {
                throw new IllegalArgumentException("instance.target must be null when scope is GLOBAL.");
            }
        } else {
            if (StringUtils.isEmpty(target)) {
                throw new IllegalArgumentException(
                        "instance.target must not be null or empty when scope is not GLOBAL.");
            }
            if (!kubernetesClientService.isIngressWorkMode()) {
                if (!HigressConstants.NS_DEFAULT.equals(kubernetesClientService.httpRouteNameSpace)) {
                    target = kubernetesClientService.httpRouteNameSpace + Separators.SLASH + target;
                }
            }
        }

        String name = instance.getPluginName();

        WasmPlugin plugin = wasmPluginService.query(name, null);
        if (plugin == null) {
            throw new IllegalArgumentException("Unknown plugin: " + name);
        }

        String version = StringUtils.firstNonEmpty(instance.getPluginVersion(), plugin.getPluginVersion());
        V1alpha1WasmPlugin existedCr = null;
        try {
            List<V1alpha1WasmPlugin> existedCrs = kubernetesClientService.listWasmPlugin(name, version);
            if (CollectionUtils.isNotEmpty(existedCrs)) {
                existedCr = existedCrs.get(0);
            }
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }

        if (instance.getConfigurations() == null && StringUtils.isNotEmpty(instance.getRawConfigurations())) {
            try {
                Map<String, Object> configurations = (Map<String, Object>) Yaml.mapper()
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

        V1alpha1WasmPlugin result;
        try {
            if (existedCr == null) {
                if (!version.equals(plugin.getPluginVersion())) {
                    throw new IllegalArgumentException("Add operation is only allowed for the current plugin version.");
                }
                result = kubernetesModelConverter.wasmPluginToCr(plugin);
                kubernetesModelConverter.setWasmPluginInstanceToCr(result, instance);
                result = kubernetesClientService.createWasmPlugin(result);
            } else {
                result = existedCr;
                kubernetesModelConverter.setWasmPluginInstanceToCr(result, instance);
                result = kubernetesClientService.replaceWasmPlugin(result);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                    "Error occurs when adding or updating the WasmPlugin CR with name: " + plugin.getName(), e);
        }
        return kubernetesModelConverter.getWasmPluginInstanceFromCr(result, scope, target);
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName) {
        List<V1alpha1WasmPlugin> existedCrs;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
        deletePluginInstances(existedCrs, scope, target);
    }

    @Override
    public void deleteAll(WasmPluginInstanceScope scope, String target) {
        List<V1alpha1WasmPlugin> existedCrs = null;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin();
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting WasmPlugin.", e);
        }
        deletePluginInstances(existedCrs, scope, target);
    }

    private void deletePluginInstances(List<V1alpha1WasmPlugin> crs, WasmPluginInstanceScope scope, String target) {
        if (CollectionUtils.isEmpty(crs)) {
            return;
        }
        for (V1alpha1WasmPlugin cr : crs) {
            boolean needUpdate = kubernetesModelConverter.removeWasmPluginInstanceFromCr(cr, scope, target);
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
}
