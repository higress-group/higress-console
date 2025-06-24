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
package com.alibaba.higress.sdk.service.mcp;

import java.util.List;
import java.util.Objects;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.google.common.collect.Lists;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Thomas-eliot
 */
@Slf4j
class McpServerServiceFactory {

    private final List<McpServerService> mcpServerServiceList = Lists.newArrayList();
    private final McpServerService defaultMcpServerService;

    public McpServerServiceFactory(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {

        final McpServerService mcpServerOfOpenApiService = new McpServerOfOpenApiImpl(kubernetesClientService,
            kubernetesModelConverter, wasmPluginInstanceService, routeService);

        final McpServerService mcpServerOfDatabaseService = new McpServerOfDatabaseImpl(kubernetesClientService,
            kubernetesModelConverter, wasmPluginInstanceService, routeService);

        final McpServerService mcpServerOfDirectRoutingService = new McpServerOfDirectRoutingImpl(
            kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);

        mcpServerServiceList.add(mcpServerOfOpenApiService);
        mcpServerServiceList.add(mcpServerOfDatabaseService);
        mcpServerServiceList.add(mcpServerOfDirectRoutingService);
        defaultMcpServerService = mcpServerOfDirectRoutingService;

    }

    public McpServerService getServiceImpl(McpServer mcpServer) {
        if (Objects.isNull(mcpServer)) {
            // support default mcp server
            return defaultMcpServerService;
        }

        for (McpServerService mcpServerService : mcpServerServiceList) {
            if (mcpServerService.support(mcpServer)) {
                return mcpServerService;
            }
        }
        throw new BusinessException(
            "No McpServerService implementation found to support mcp type: " + mcpServer.getType());
    }

    public List<McpServerService> getAll() {
        return mcpServerServiceList;
    }
}
