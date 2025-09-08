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

import static com.alibaba.higress.sdk.constant.KubernetesConstants.Label.RESOURCE_BIZ_TYPE_KEY;
import static com.alibaba.higress.sdk.model.mcp.McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.AllowList;
import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.detail.McpServerDetailStrategyFactory;
import com.alibaba.higress.sdk.service.mcp.save.McpServerSaveStrategyFactory;
import com.alibaba.higress.sdk.util.ConverterUtil;
import com.alibaba.higress.sdk.util.MapUtil;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

/**
 * McpService entry
 *
 * @author Thomas-eliot
 */
@Slf4j
public class McpServiceContextImpl implements McpServerService {

    private final McpServerSaveStrategyFactory saveStrategyFactory;
    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final ConsumerService consumerService;
    private final RouteService routeService;
    private final McpServerConfigMapHelper configMapHelper;
    private final McpServerDetailStrategyFactory detailStrategyFactory;

    public McpServiceContextImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        ConsumerService consumerService, RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.consumerService = consumerService;
        this.routeService = routeService;
        this.configMapHelper = new McpServerConfigMapHelper(kubernetesClientService);
        this.saveStrategyFactory = new McpServerSaveStrategyFactory(kubernetesClientService, kubernetesModelConverter,
            wasmPluginInstanceService, consumerService, routeService);
        this.detailStrategyFactory = new McpServerDetailStrategyFactory(kubernetesClientService,
            wasmPluginInstanceService, consumerService, routeService);
    }

    @Override
    public McpServer addOrUpdate(McpServer instance) {
        return saveStrategyFactory.getService(instance).save(instance);
    }

    @Override
    public McpServer addOrUpdateWithAuthorization(McpServer instance) {
        return saveStrategyFactory.getService(instance).saveWithAuthorization(instance);
    }

    @Override
    public McpServer query(String name) {
        String routeName = McpServerHelper.mcpServerName2RouteName(name);
        Route route = routeService.query(routeName);
        if (Objects.isNull(route) || !isMcpServerRoute(route.getCustomLabels())) {
            throw new NotFoundException("can't found the bound route by name: " + routeName);
        }
        McpServer mcpServer = McpServerHelper.routeToMcpServer(route);
        Objects.requireNonNull(mcpServer);
        return detailStrategyFactory.getService(mcpServer.getType()).query(name);
    }

    @Override
    public PaginatedResult<McpServer> list(McpServerPageQuery query) {
        List<McpServer> resultList;

        Map<String, String> labelMap =
            MapUtil.of(KubernetesConstants.Label.RESOURCE_BIZ_TYPE_KEY, MCP_SERVER_BIZ_TYPE_VALUE);
        try {
            List<V1Ingress> v1Ingresses = kubernetesClientService.listIngress(labelMap);
            List<Route> routeList = ConverterUtil.toList(v1Ingresses, kubernetesModelConverter::ingress2Route);
            resultList = ConverterUtil.toList(routeList, McpServerHelper::routeToMcpServer);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing Ingresses.", e);
        }

        filterMcpServers(resultList, query);
        sortMcpServers(resultList);
        return PaginatedResult.createFromFullList(resultList, query);
    }

    @Override
    public void delete(String name) {
        routeService.delete(McpServerHelper.mcpServerName2RouteName(name));
        routeService.delete(name);
        deleteMatchRulePath(name);
        deleteServersConfig(name);
    }

    @Override
    public void addAllowConsumers(McpServerConsumers consumers) {
        Route route = getMcpServerBoundRoute(consumers.getMcpServerName());
        AllowList allowList = AllowList.forTarget(WasmPluginInstanceScope.ROUTE, route.getName())
            .consumerNames(consumers.getConsumers()).build();
        consumerService.updateAllowList(AllowListOperation.ADD, allowList);
    }

    @Override
    public void deleteAllowConsumers(McpServerConsumers consumers) {
        Route route = getMcpServerBoundRoute(consumers.getMcpServerName());
        AllowList allowList = AllowList.forTarget(WasmPluginInstanceScope.ROUTE, route.getName())
            .consumerNames(consumers.getConsumers()).build();
        consumerService.updateAllowList(AllowListOperation.REMOVE, allowList);
    }

    @Override
    public PaginatedResult<McpServerConsumerDetail> listAllowConsumers(McpServerConsumersPageQuery query) {
        Route route = getMcpServerBoundRoute(query.getMcpServerName());
        List<String> allowedConsumers =
            Optional.ofNullable(route.getAuthConfig().getAllowedConsumers()).orElse(new ArrayList<>());
        Predicate<String> consumerFilter = c -> true;
        if (StringUtils.isNotBlank(query.getConsumerName())) {
            consumerFilter = c -> c.contains(query.getConsumerName());
        }
        List<McpServerConsumerDetail> resultList = allowedConsumers.stream().filter(consumerFilter).map(
            consumer -> McpServerConsumerDetail.builder().mcpServerName(route.getName()).consumerName(consumer).build())
            .collect(Collectors.toList());
        return PaginatedResult.createFromFullList(resultList, query);
    }

    private @NotNull Route getMcpServerBoundRoute(String serverName) {
        String routeName = McpServerHelper.mcpServerName2RouteName(serverName);
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new BusinessException(String
                .format("No MCP-bound route is found. McpServerName=%s ExpectedRouteName=%s", serverName, routeName));
        }
        return route;
    }

    private void deleteMatchRulePath(String name) {
        configMapHelper.updateMatchList(
            matchList -> matchList.removeIf(rule -> (McpServerConfigMapHelper.generateMcpServerPath(name))
                .equals(rule.get(McpServerConfigMapHelper.MATCH_RULE_PATH_KEY))));
    }

    private void deleteServersConfig(String name) {
        configMapHelper.updateServerConfig(servers -> {
            if (CollectionUtils.isEmpty(servers)) {
                return;
            }
            servers.removeIf(server -> server.getName().equals(name));
        });
    }

    private void sortMcpServers(List<McpServer> mcpServers) {
        if (CollectionUtils.isEmpty(mcpServers)) {
            return;
        }
        mcpServers.sort(Comparator.comparing(McpServer::getName));
    }

    private void filterMcpServers(List<McpServer> resultList, McpServerPageQuery query) {
        if (CollectionUtils.isEmpty(resultList)) {
            return;
        }
        String fuzzyServerName = query.getMcpServerName();
        if (StringUtils.isNotBlank(fuzzyServerName)) {
            resultList.removeIf(mcpServer -> !StringUtils.contains(mcpServer.getName(), fuzzyServerName));
        }

        String type = query.getType();
        if (StringUtils.isNotBlank(type)) {
            McpServerTypeEnum mcpServerTypeEnum = McpServerTypeEnum.fromName(type);
            resultList.removeIf(mcpServer -> !mcpServerTypeEnum.equals(mcpServer.getType()));
        }
    }

    // TODO: Use another way instead of customLabels to determine whether the route is bound to mcpServer
    private boolean isMcpServerRoute(Map<String, String> customLabels) {
        if (MapUtils.isEmpty(customLabels)) {
            return false;
        }

        return StringUtils.equalsIgnoreCase(McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE,
            customLabels.get(RESOURCE_BIZ_TYPE_KEY));
    }

}
