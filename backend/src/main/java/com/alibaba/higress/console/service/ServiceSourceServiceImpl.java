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
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.ServiceSource;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.controller.exception.ResourceConflictException;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1RegistryConfig;

import io.kubernetes.client.openapi.ApiException;

@Service
public class ServiceSourceServiceImpl implements ServiceSourceService {

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setKubernetesModelConverter(KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public PaginatedResult<ServiceSource> list(CommonPageQuery query) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.getMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return PaginatedResult.createFromFullList(Collections.emptyList(), query);
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        List<ServiceSource> serviceSources = Collections.emptyList();
        if (null != mcpBridge) {
            String resourceVersion =
                mcpBridge.getMetadata() != null ? mcpBridge.getMetadata().getResourceVersion() : null;
            if (null != mcpBridge.getSpec() && CollectionUtils.isNotEmpty(mcpBridge.getSpec().getRegistries())) {
                serviceSources = mcpBridge.getSpec().getRegistries().stream()
                    .map(kubernetesModelConverter::v1RegistryConfig2ServiceSource).collect(Collectors.toList());
                serviceSources.forEach(s -> s.setVersion(resourceVersion));
            }
        }
        return PaginatedResult.createFromFullList(serviceSources, query);
    }

    @Override
    public ServiceSource addOrUpdate(ServiceSource serviceSource) {
        V1McpBridge mcpBridge = null;
        try {
            mcpBridge = kubernetesClientService.getMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting McpBridge.", e);
            }
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                kubernetesClientService.addMcpBridge(mcpBridge);
            } else {
                kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                kubernetesClientService.updateMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding or updating the ServiceSource with name: " + serviceSource.getName(), e);
        }
        return serviceSource;
    }

    @Override
    public void delete(String name) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.getMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return;
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        try {
            kubernetesModelConverter.removeV1McpBridgeRegistry(mcpBridge, name);
            kubernetesClientService.updateMcpBridge(mcpBridge);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ServiceSource with name: " + name, e);
        }
    }

    @Override
    public ServiceSource query(String name) throws BusinessException {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.getMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return null;
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        if (null == mcpBridge || CollectionUtils.isEmpty(mcpBridge.getSpec().getRegistries())) {
            return null;
        }
        Optional<V1RegistryConfig> op =
            mcpBridge.getSpec().getRegistries().stream().filter(r -> name.equals(r.getName())).findFirst();
        return op.map(kubernetesModelConverter::v1RegistryConfig2ServiceSource).orElse(null);
    }

    @Override
    public ServiceSource add(ServiceSource serviceSource) {
        V1McpBridge mcpBridge = null;
        try {
            mcpBridge = kubernetesClientService.getMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting McpBridge.", e);
            }
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                kubernetesClientService.addMcpBridge(mcpBridge);
            } else {
                if (mcpBridge.getSpec() != null && mcpBridge.getSpec().getRegistries() != null) {
                    Optional<V1RegistryConfig> op = mcpBridge.getSpec().getRegistries().stream()
                        .filter(r -> StringUtils.isNotBlank(r.getName()) && r.getName().equals(serviceSource.getName()))
                        .findFirst();
                    if (op.isPresent()) {
                        throw new ResourceConflictException();
                    }
                }
                kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                kubernetesClientService.updateMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding the ServiceSource with name: " + serviceSource.getName(), e);
        }
        return serviceSource;
    }
}
