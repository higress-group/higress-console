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
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.google.common.collect.Lists;

import io.kubernetes.client.openapi.models.V1ConfigMap;
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
        // TODO-lvshui 2025/5/27: query condition need add labels
        Route route = routeService.query(name);
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        McpServer result = routeToMcpServerWithAth(route);

        completeUpstreamPathPrefix(route, result);
        return result;
    }

    @Override
    protected List<McpServer> getServerListByType(McpServerPageQuery query) {
        return Lists.newArrayList();
    }

    private void completeUpstreamPathPrefix(Route route, McpServer mcpServer) {
        V1ConfigMap configMap = null;
        try {
            configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
        } catch (Exception e) {
            log.error("Failed to get mcp server list", e);
        }

        McpServerConfigMap mcpConfig = getMcpConfig(configMap);
        List<McpServerConfigMap.MatchList> matchList = mcpConfig.getMatchList();
        if (CollectionUtils.isEmpty(matchList)) {
            throw new BusinessException("no any match list");
        }
        Optional<McpServerConfigMap.MatchList> first = matchList.stream()
            .filter(i -> StringUtils.equals(i.getMatchRulePath(), route.getPath().getMatchValue())).findFirst();

        if (first.isPresent()) {
            McpServerConfigMap.MatchList matchListItem = first.get();
            mcpServer.setUpstreamPathPrefix(matchListItem.getPathRewritePrefix());
        }
    }

    @Override
    protected void saveMcpServerConfig(McpServer mcpInstance) {
        // nothing to do!
    }

    @Override
    protected McpServerConfigMap.MatchList generateMatchList(McpServer mcpInstance) {
        McpServerConfigMap.MatchList result = super.generateMatchList(mcpInstance);
        result.setUpstreamType("sse");
        if (StringUtils.isNotBlank(mcpInstance.getUpstreamPathPrefix())) {
            result.setEnablePathRewrite(Boolean.TRUE);
            result.setPathRewritePrefix(mcpInstance.getUpstreamPathPrefix());
        }
        return result;
    }
}
