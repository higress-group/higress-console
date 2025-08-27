/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.mcp.save;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerDirectRouteConfig;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Thomas-eliot
 */
@Slf4j
public class DirectRoutingSaveStrategy extends AbstractMcpServerSaveStrategy {
    public DirectRoutingSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, ConsumerService consumerService, RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, consumerService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.DIRECT_ROUTE.equals(mcpServer.getType());
    }

    @Override
    protected void doSaveMcpServerConfig(McpServer mcpInstance) {
        // nothing to do!
    }

    @Override
    protected void setDefaultConfigs(Route route, McpServer mcpInstance) {
        super.setDefaultConfigs(route, mcpInstance);
        UpstreamService upstreamService = route.getServices().get(0);

        Map<String, String> annotationsMap = route.getCustomConfigs();
        McpServerDirectRouteConfig directRouteConfig = mcpInstance.getDirectRouteConfig();
        if (Objects.isNull(directRouteConfig)) {
            return;
        }
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_UPSTREAM_TYPE_KEY,
            McpConstants.UPSTREAM_MCP_SERVER_TYPE);
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_UPSTREAM_TRANSPORT_TYPE_KEY,
            directRouteConfig.getTransportType());
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_ENABLE_REWRITE_KEY,
            Boolean.TRUE.toString());

        // rewrite upstream sse event endpoint( all path ) to /mcp-servers/name/**
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_PATH_REWRITE_KEY, "/");
        // rewrite /mcp-servers/name to mcpInstance.getDirectRouteConfig().getPath()
        String upstreamPathPrefix = generateUpstreamPathPrefix(directRouteConfig);
        RewriteConfig rewriteConfig = RewriteConfig.builder().path(upstreamPathPrefix).enabled(Boolean.TRUE).build();
        // default rewrite host
        String serviceDomainName = getServiceDomainName(upstreamService);
        if (StringUtils.isNotBlank(serviceDomainName)) {
            rewriteConfig.setHost(serviceDomainName);
        }
        route.setRewrite(rewriteConfig);

    }

    private String getServiceDomainName(UpstreamService upstreamService) {
        if (!StringUtils.endsWith(upstreamService.getName(),
            StringUtils.join(Separators.DOT, V1McpBridge.REGISTRY_TYPE_DNS))) {
            return null;
        }
        String name = StringUtils.substringBeforeLast(upstreamService.getName(), Separators.DOT);

        List<V1McpBridge> v1McpBridges = kubernetesClientService.listMcpBridge();
        if (CollectionUtils.isEmpty(v1McpBridges)) {
            return null;
        }
        for (V1McpBridge i : v1McpBridges) {
            List<V1RegistryConfig> registries = i.getSpec().getRegistries();
            if (CollectionUtils.isEmpty(registries)) {
                continue;
            }
            for (V1RegistryConfig j : registries) {
                if (StringUtils.equalsIgnoreCase(j.getType(), V1McpBridge.REGISTRY_TYPE_DNS)
                    && StringUtils.equalsIgnoreCase(j.getName(), name)) {
                    return j.getDomain();
                }
            }
        }
        return null;
    }

    private String generateUpstreamPathPrefix(McpServerDirectRouteConfig directRouteConfig) {
        if (StringUtils.equalsIgnoreCase(McpConstants.MCP_TRANSPORT_STREAMABLE, directRouteConfig.getTransportType())) {
            return directRouteConfig.getPath();
        }
        McpServerConfigMap mcpServerConfig = mcpServerConfigMapHelper.getMcpConfig();
        String ssePathSuffix = mcpServerConfig.getSsePathSuffix();
        if (StringUtils.endsWith(directRouteConfig.getPath(), ssePathSuffix)) {
            String result = StringUtils.substringBeforeLast(directRouteConfig.getPath(), ssePathSuffix);
            if (StringUtils.isBlank(result)) {
                return "/";
            }
            return result;
        } else {
            throw new BusinessException("The path of direct route config must end with " + ssePathSuffix);
        }
    }

}
