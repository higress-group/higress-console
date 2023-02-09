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
import com.alibaba.higress.console.controller.exception.NotFoundException;
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
        V1McpBridge v1McpBridge = kubernetesClientService.getV1McpBridge(V1McpBridge.MCP_BRIDGE_NAME);
        List<ServiceSource> serviceSources = Collections.emptyList();
        if (null != v1McpBridge) {
            String resourceVersion =
                v1McpBridge.getMetadata() != null ? v1McpBridge.getMetadata().getResourceVersion() : null;
            if (null != v1McpBridge.getSpec() && CollectionUtils.isNotEmpty(v1McpBridge.getSpec().getRegistries())) {
                serviceSources = v1McpBridge.getSpec().getRegistries().stream()
                    .map(kubernetesModelConverter::v1RegistryConfig2ServiceSource).collect(Collectors.toList());
                serviceSources.forEach(s -> s.setVersion(resourceVersion));
            }
        }
        return PaginatedResult.createFromFullList(serviceSources, query);
    }

    @Override
    public ServiceSource addOrUpdate(ServiceSource serviceSource) {
        try {
            V1McpBridge v1McpBridge = kubernetesClientService.getV1McpBridge(V1McpBridge.MCP_BRIDGE_NAME);
            if (null == v1McpBridge) {
                v1McpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(v1McpBridge);
                kubernetesModelConverter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);
                kubernetesClientService.addV1McpBridge(v1McpBridge);
            } else {
                kubernetesModelConverter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);
                kubernetesClientService.updateV1McpBridge(v1McpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when add the serviceSource with name: " + serviceSource.getName(),
                e);
        }
        return serviceSource;
    }

    @Override
    public void delete(String name) {
        try {
            V1McpBridge v1McpBridge = kubernetesClientService.getV1McpBridge(V1McpBridge.MCP_BRIDGE_NAME);
            if (null == v1McpBridge) {
                throw new NotFoundException("V1McpBridge not found");
            }
            kubernetesModelConverter.removeV1McpBridgeRegistry(v1McpBridge, name);
            kubernetesClientService.updateV1McpBridge(v1McpBridge);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the serviceSource with name: " + name, e);
        }
    }

    @Override
    public ServiceSource query(String name) throws BusinessException {
        V1McpBridge v1McpBridge = kubernetesClientService.getV1McpBridge(V1McpBridge.MCP_BRIDGE_NAME);
        if (null == v1McpBridge || CollectionUtils.isEmpty(v1McpBridge.getSpec().getRegistries())) {
            return null;
        }
        Optional<V1RegistryConfig> op =
            v1McpBridge.getSpec().getRegistries().stream().filter(r -> name.equals(r.getName())).findFirst();
        return op.map(kubernetesModelConverter::v1RegistryConfig2ServiceSource).orElse(null);
    }

    @Override
    public ServiceSource add(ServiceSource serviceSource) {
        try {
            V1McpBridge v1McpBridge = kubernetesClientService.getV1McpBridge(V1McpBridge.MCP_BRIDGE_NAME);
            if (null == v1McpBridge) {
                v1McpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(v1McpBridge);
                kubernetesModelConverter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);
                kubernetesClientService.addV1McpBridge(v1McpBridge);
            } else {
                Optional<V1RegistryConfig> op = v1McpBridge.getSpec().getRegistries().stream()
                    .filter(r -> StringUtils.isNotBlank(r.getName()) && r.getName().equals(serviceSource.getName()))
                    .findFirst();
                if (op.isPresent()) {
                    throw new ResourceConflictException();
                }
                kubernetesModelConverter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);
                kubernetesClientService.updateV1McpBridge(v1McpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when add the serviceSource with name: " + serviceSource.getName(),
                e);
        }
        return serviceSource;
    }
}
