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
package com.alibaba.higress.console.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginInstance;
import com.alibaba.higress.console.controller.dto.WasmPluginInstanceScope;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.controller.exception.ResourceConflictException;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;

import io.kubernetes.client.openapi.ApiException;

@Service
public class WasmPluginInstanceServiceImpl implements WasmPluginInstanceService {

    private WasmPluginService wasmPluginService;
    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;

    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setKubernetesModelConverter(KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public List<WasmPluginInstance> list(WasmPluginInstanceScope scope, String target) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(null, null);
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
            plugins = kubernetesClientService.listWasmPlugin(pluginName, null);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when querying WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return null;
        }
        return kubernetesModelConverter.getWasmPluginInstanceFromCr(plugins.get(0), scope, target);
    }

    @Override
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
        }

        String name = instance.getPluginName();
        WasmPlugin plugin = wasmPluginService.query(name, null);
        String version = StringUtils.firstNonEmpty(instance.getPluginVersion(), plugin.getVersion());
        V1alpha1WasmPlugin existedCr = null;
        try {
            List<V1alpha1WasmPlugin> existedCrs = kubernetesClientService.listWasmPlugin(name, version);
            if (CollectionUtils.isNotEmpty(existedCrs)) {
                existedCr = existedCrs.get(0);
            }
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting WasmPlugin.", e);
            }
        }
        V1alpha1WasmPlugin result;
        try {
            if (existedCr == null) {
                if (!version.equals(plugin.getVersion())) {
                    throw new IllegalArgumentException("Add operation is only allowed for the current plugin version.");
                }
                result = kubernetesModelConverter.wasmPluginToCr(plugin);
                kubernetesModelConverter.setWasmPluginInstanceToCr(result, instance);
                result = kubernetesClientService.addWasmPlugin(result);
            } else {
                result = existedCr;
                kubernetesModelConverter.setWasmPluginInstanceToCr(result, instance);
                result = kubernetesClientService.updateWasmPlugin(result);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding or updating the WasmPlugin CR with name: " + plugin.getName(), e);
        }
        return kubernetesModelConverter.getWasmPluginInstanceFromCr(result, scope, target);
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName) {
        List<V1alpha1WasmPlugin> existedCrs = null;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(pluginName, null);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting WasmPlugin.", e);
            }
        }
        deletePluginInstances(existedCrs, scope, target);
    }

    @Override
    public void deleteAll(WasmPluginInstanceScope scope, String target) {
        List<V1alpha1WasmPlugin> existedCrs = null;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(null, null);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting WasmPlugin.", e);
            }
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
                    kubernetesClientService.updateWasmPlugin(cr);
                } catch (ApiException e) {
                    throw new BusinessException(
                        "Error occurs when trying to updating WasmPlugin with name " + cr.getMetadata().getName(), e);
                }
            }
        }
    }
}
