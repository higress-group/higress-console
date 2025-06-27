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
import java.util.Objects;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
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
public class McpServerSaveStrategyFactory {

    private final List<McpServerSaveStrategy> mcpServerServiceList = Lists.newArrayList();

    public McpServerSaveStrategyFactory(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {

        final McpServerSaveStrategy mcpServerOfOpenApiService = new OpenApiSaveStrategy(kubernetesClientService,
            kubernetesModelConverter, wasmPluginInstanceService, routeService);

        final McpServerSaveStrategy mcpServerOfDatabaseService = new DatabaseSaveStrategy(kubernetesClientService,
            kubernetesModelConverter, wasmPluginInstanceService, routeService);

        final McpServerSaveStrategy mcpServerOfDirectRoutingService = new DirectRoutingSaveStrategy(
            kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);

        mcpServerServiceList.add(mcpServerOfOpenApiService);
        mcpServerServiceList.add(mcpServerOfDatabaseService);
        mcpServerServiceList.add(mcpServerOfDirectRoutingService);
    }

    public McpServerSaveStrategy getService(McpServer mcpServer) {
        if (Objects.isNull(mcpServer)) {
            throw new NotFoundException("can't found mcp server");
        }

        for (McpServerSaveStrategy mcpServerService : mcpServerServiceList) {
            if (mcpServerService.support(mcpServer)) {
                return mcpServerService;
            }
        }
        throw new BusinessException(
            "No McpServerService implementation found to support mcp type: " + mcpServer.getType());
    }
}
