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
package com.alibaba.higress.sdk.service.mcp.detail;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerDirectRouteConfig;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;

/**
 * @author lvshui
 */
public class DirectRoutingDetailStrategy extends AbstractMcpServerDetailStrategy {
    private final McpServerConfigMapHelper mcpServerConfigMapHelper;

    public DirectRoutingDetailStrategy(KubernetesClientService kubernetesClientService, ConsumerService consumerService,
        RouteService routeService) {
        super(kubernetesClientService, consumerService, routeService);
        this.mcpServerConfigMapHelper = new McpServerConfigMapHelper(kubernetesClientService);
    }

    @Override
    public boolean support(McpServerTypeEnum type) {
        return McpServerTypeEnum.DIRECT_ROUTE.equals(type);
    }

    @Override
    protected void completeInfo(Route route, McpServer result) {
        completeUpstreamPathPrefix(route, result);
    }

    private void completeUpstreamPathPrefix(Route route, McpServer mcpServer) {
        McpServerDirectRouteConfig config = new McpServerDirectRouteConfig();
        String transportType = MapUtils.getString(route.getCustomConfigs(),
            McpServerConstants.Annotation.RESOURCE_MCP_SERVER_UPSTREAM_TRANSPORT_TYPE_KEY);
        config.setTransportType(transportType);
        mcpServer.setDirectRouteConfig(config);
        String path = route.getRewrite().getPath();
        if (StringUtils.equals(transportType, McpConstants.MCP_TRANSPORT_SSE)) {
            path = StringUtils.join(path, generateUpstreamPathPrefix());
        }
        config.setPath(path);
    }

    private String generateUpstreamPathPrefix() {
        McpServerConfigMap mcpServerConfig = mcpServerConfigMapHelper.getMcpConfig();
        return mcpServerConfig.getSsePathSuffix();
    }
}
