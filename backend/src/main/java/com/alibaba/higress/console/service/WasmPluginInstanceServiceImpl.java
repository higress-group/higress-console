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

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
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
            plugins = kubernetesClientService.listWasmPlugin(scope.getId(), target, null);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return Collections.emptyList();
        }
        return plugins.stream().map(kubernetesModelConverter::wasmPluginCr2Instance).toList();
    }

    @Override
    public WasmPluginInstance query(WasmPluginInstanceScope scope, String target, String pluginName) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(scope.getId(), target, pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when querying WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return null;
        }
        return kubernetesModelConverter.wasmPluginCr2Instance(plugins.get(0));
    }

    @Override
    public WasmPluginInstance addOrUpdate(WasmPluginInstance instance) {
        WasmPlugin plugin = wasmPluginService.query(instance.getName(), null);
        V1alpha1WasmPlugin cr = kubernetesModelConverter.wasmPluginInstance2Cr(instance, plugin);
        V1alpha1WasmPlugin existedCr = null;
        try {
            existedCr = kubernetesClientService.getWasmPlugin(cr.getMetadata().getName());
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting WasmPlugin.", e);
            }
        }
        V1alpha1WasmPlugin newCr;
        try {
            if (existedCr == null) {
                newCr = kubernetesClientService.addWasmPlugin(cr);
            } else {
                newCr = kubernetesClientService.updateWasmPlugin(cr);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding or updating the WasmPlugin CR with name: " + cr.getMetadata().getName(), e);
        }
        return kubernetesModelConverter.wasmPluginCr2Instance(newCr);
    }

    @Override
    public void delete(WasmPluginInstanceScope scope, String target, String pluginName) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(scope.getId(), target, pluginName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return;
        }
        for (V1alpha1WasmPlugin plugin : plugins) {
            try {
                kubernetesClientService.deleteWasmPlugin(plugin.getMetadata().getName());
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when deleting WasmPlugin.", e);
            }
        }
    }

    @Override
    public void deleteAll(WasmPluginInstanceScope scope, String target) {
        List<V1alpha1WasmPlugin> plugins;
        try {
            plugins = kubernetesClientService.listWasmPlugin(scope.getId(), target, null);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing WasmPlugin.", e);
        }
        if (CollectionUtils.isEmpty(plugins)) {
            return;
        }
        for (V1alpha1WasmPlugin plugin : plugins) {
            try {
                kubernetesClientService.deleteWasmPlugin(plugin.getMetadata().getName());
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when deleting WasmPlugin.", e);
            }
        }
    }
}
