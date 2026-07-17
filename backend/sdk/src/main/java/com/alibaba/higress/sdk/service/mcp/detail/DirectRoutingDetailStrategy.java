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
            path = joinPath(path, generateUpstreamPathPrefix());
        }
        config.setPath(path);
    }

    /**
     * Concatenates a path prefix and a suffix while guaranteeing exactly one '/' between them, regardless of whether
     * the prefix has a trailing slash and/or the suffix has a leading slash. If the prefix is the root path (i.e. '/'
     * or composed entirely of '/'), the suffix is returned on its own.
     */
    private static String joinPath(String prefix, String suffix) {
        if (StringUtils.isBlank(suffix)) {
            return prefix;
        }
        if (StringUtils.isBlank(prefix)) {
            return suffix;
        }
        String trimmedPrefix = StringUtils.stripEnd(prefix, "/");
        String normalizedSuffix = suffix.startsWith("/") ? suffix : "/" + suffix;
        if (trimmedPrefix.isEmpty()) {
            // The prefix was the root path '/' (or composed entirely of '/' characters); the normalized suffix
            // already carries its own leading separator.
            return normalizedSuffix;
        }
        return trimmedPrefix + normalizedSuffix;
    }

    private String generateUpstreamPathPrefix() {
        McpServerConfigMap mcpServerConfig = mcpServerConfigMapHelper.getMcpConfig();
        return mcpServerConfig.getSsePathSuffix();
    }
}
