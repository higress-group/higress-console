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

import java.util.Objects;

import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Thomas-eliot
 */
@Slf4j
public class McpServerOfDirectRoutingImpl extends AbstractMcpServerServiceImpl {
    public McpServerOfDirectRoutingImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.DIRECT_ROUTE.equals(mcpServer.getType());
    }

    @Override
    public McpServer query(String name) {
        Route route = routeService.query(name);
        if (Objects.isNull(route)) {
            throw new NotFoundException("can't found the bound route by name: " + name);
        }
        McpServer result = routeToMcpServerWithAuth(route);

        completeUpstreamPathPrefix(route, result);
        return result;
    }

    private void completeUpstreamPathPrefix(Route route, McpServer mcpServer) {
        RewriteConfig rewrite = route.getRewrite();
        if (Objects.nonNull(rewrite)) {
            mcpServer.setUpstreamPathPrefix(rewrite.getPath());
        }
    }

    @Override
    protected void buildMcpServer(McpServer mcpInstance) {
        // nothing to do!
    }
}
