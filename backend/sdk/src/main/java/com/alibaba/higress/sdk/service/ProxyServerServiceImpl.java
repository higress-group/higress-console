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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ProxyServer;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1ProxyConfig;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;

import io.kubernetes.client.openapi.ApiException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class ProxyServerServiceImpl implements ProxyServerService {

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;

    public ProxyServerServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public PaginatedResult<ProxyServer> list(CommonPageQuery query) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        List<ProxyServer> proxyServers = Collections.emptyList();
        if (null != mcpBridge) {
            String resourceVersion =
                mcpBridge.getMetadata() != null ? mcpBridge.getMetadata().getResourceVersion() : null;
            if (null != mcpBridge.getSpec() && CollectionUtils.isNotEmpty(mcpBridge.getSpec().getProxies())) {
                List<V1ProxyConfig> proxies = mcpBridge.getSpec().getProxies();
                proxyServers = new ArrayList<>(proxies.size());
                for (V1ProxyConfig proxy : proxies) {
                    ProxyServer proxyServer = convert(proxy);
                    proxyServer.setVersion(resourceVersion);
                    proxyServers.add(proxyServer);
                }
            }
        }
        return PaginatedResult.createFromFullList(proxyServers, query);
    }

    @Override
    public ProxyServer addOrUpdate(ProxyServer proxyServer) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                V1ProxyConfig proxy = kubernetesModelConverter.addV1McpBridgeProxy(mcpBridge, proxyServer);
                kubernetesClientService.createMcpBridge(mcpBridge);
            } else {
                V1ProxyConfig proxy = kubernetesModelConverter.addV1McpBridgeProxy(mcpBridge, proxyServer);
                kubernetesClientService.replaceMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding or updating the ProxyServer with name: " + proxyServer.getName(), e);
        }
        return proxyServer;
    }

    @Override
    public void delete(String name) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        if (mcpBridge == null || mcpBridge.getSpec() == null) {
            return;
        }
        if (CollectionUtils.isNotEmpty(mcpBridge.getSpec().getRegistries())) {
            for (V1RegistryConfig registryConfig : mcpBridge.getSpec().getRegistries()) {
                if (name.equals(registryConfig.getProxyName())) {
                    throw new BusinessException("Cannot delete the ProxyServer with name: " + name
                        + ", because it is used by a service registry.");
                }
            }
        }
        V1ProxyConfig proxy = kubernetesModelConverter.removeV1McpBridgeProxy(mcpBridge, name);
        if (proxy == null) {
            // There is nothing to delete.
            return;
        }
        try {
            kubernetesClientService.replaceMcpBridge(mcpBridge);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ProxyServer with name: " + name, e);
        }
    }

    @Override
    public ProxyServer query(String name) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        if (null == mcpBridge || CollectionUtils.isEmpty(mcpBridge.getSpec().getProxies())) {
            return null;
        }
        Optional<V1ProxyConfig> op =
            mcpBridge.getSpec().getProxies().stream().filter(r -> name.equals(r.getName())).findFirst();
        if (!op.isPresent()) {
            return null;
        }
        ProxyServer proxyServer = convert(op.get());
        proxyServer.setVersion(mcpBridge.getMetadata().getResourceVersion());
        return proxyServer;
    }

    @Override
    public ProxyServer add(ProxyServer proxyServer) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                kubernetesModelConverter.addV1McpBridgeProxy(mcpBridge, proxyServer);
                kubernetesClientService.createMcpBridge(mcpBridge);
            } else {
                V1McpBridgeSpec spec = mcpBridge.getSpec();
                if (spec != null && spec.getProxies() != null) {
                    Optional<V1ProxyConfig> op =
                        spec.getProxies().stream().filter(r -> proxyServer.getName().equals(r.getName())).findFirst();
                    if (op.isPresent()) {
                        throw new ResourceConflictException();
                    }
                }
                kubernetesModelConverter.addV1McpBridgeProxy(mcpBridge, proxyServer);
                kubernetesClientService.replaceMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding the ProxyServer with name: " + proxyServer.getName(),
                e);
        }
        return proxyServer;
    }

    private ProxyServer convert(V1ProxyConfig proxy) {
        return kubernetesModelConverter.v1ProxyConfig2ProxyServer(proxy);
    }
}
