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
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.authorization.CredentialTypeEnum;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationServiceFactory;
import com.alibaba.higress.sdk.service.authorization.RelationshipConverter;
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
    private final AuthorizationServiceFactory authorizationServiceFactory;
    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final RouteService routeService;
    private final McpServerConfigMapHelper configMapHelper;
    private final McpServerDetailStrategyFactory detailStrategyFactory;

    public McpServiceContextImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.routeService = routeService;
        this.configMapHelper = new McpServerConfigMapHelper(kubernetesClientService);
        this.authorizationServiceFactory = new AuthorizationServiceFactory(wasmPluginInstanceService);
        this.saveStrategyFactory = new McpServerSaveStrategyFactory(kubernetesClientService, kubernetesModelConverter,
            wasmPluginInstanceService, routeService);
        this.detailStrategyFactory =
            new McpServerDetailStrategyFactory(kubernetesClientService, wasmPluginInstanceService, routeService);
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
        String routeName = McpServerHelper.mcpServerName2RouteName(consumers.getMcpServerName());
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        AuthorizationService authorizationService = authorizationServiceFactory.getService(CredentialTypeEnum.KEY_AUTH);
        authorizationService.bindList(RelationshipConverter.convert(consumers));
    }

    @Override
    public void deleteAllowConsumers(McpServerConsumers consumers) {
        String routeName = McpServerHelper.mcpServerName2RouteName(consumers.getMcpServerName());
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        AuthorizationService authorizationService = authorizationServiceFactory.getService(CredentialTypeEnum.KEY_AUTH);
        authorizationService.unbindList(RelationshipConverter.convert(consumers));
    }

    @Override
    public PaginatedResult<McpServerConsumerDetail> listAllowConsumers(McpServerConsumersPageQuery query) {
        String routeName = McpServerHelper.mcpServerName2RouteName(query.getMcpServerName());
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        List<String> allowedConsumers =
            Optional.ofNullable(route.getAuthConfig().getAllowedConsumers()).orElse(new ArrayList<>());
        List<McpServerConsumerDetail> resultList = allowedConsumers.stream().filter(consumer -> {
            String searchTerm = query.getConsumerName();
            if (StringUtils.isBlank(searchTerm)) {
                return true;
            }
            return consumer.contains(searchTerm);
        }).map(consumer -> McpServerConsumerDetail.builder().mcpServerName(route.getName()).consumerName(consumer)
            .type(CredentialTypeEnum.KEY_AUTH.getType()).build()).collect(Collectors.toList());

        return PaginatedResult.createFromFullList(resultList, query);
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

    private boolean isMcpServerRoute(Map<String, String> customLabels) {
        if (MapUtils.isEmpty(customLabels)) {
            return false;
        }

        return StringUtils.equalsIgnoreCase(McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE,
            customLabels.get(RESOURCE_BIZ_TYPE_KEY));
    }

}
