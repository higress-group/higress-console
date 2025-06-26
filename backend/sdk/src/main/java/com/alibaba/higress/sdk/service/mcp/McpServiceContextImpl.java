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

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import lombok.extern.slf4j.Slf4j;

/**
 * McpService entry
 *
 * @author Thomas-eliot
 */
@Slf4j
public class McpServiceContextImpl implements McpServerService {

    private final McpServerServiceFactory serviceFactory;

    private final RouteService routeService;

    public McpServiceContextImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        this.routeService = routeService;
        this.serviceFactory = new McpServerServiceFactory(kubernetesClientService, kubernetesModelConverter,
            wasmPluginInstanceService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return true;
    }

    @Override
    public McpServer addOrUpdate(McpServer instance) {
        return serviceFactory.getServiceImpl(instance).addOrUpdate(instance);
    }

    @Override
    public McpServer query(String name) {
        Route route = routeService.query(name);
        if (Objects.isNull(route) || !isMcpServerRoute(route.getCustomLabels())) {
            throw new NotFoundException("can't found the bound route by name: " + name);
        }
        McpServer mcpServer = routeToMcpServer(route);

        return serviceFactory.getServiceImpl(mcpServer).query(name);
    }

    private boolean isMcpServerRoute(Map<String, String> customLabels) {
        if (MapUtils.isEmpty(customLabels)) {
            return false;
        }

        return StringUtils.equalsIgnoreCase(McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE,
            customLabels.get(RESOURCE_BIZ_TYPE_KEY));
    }

    @Override
    public PaginatedResult<McpServer> list(McpServerPageQuery query) {
        return serviceFactory.getServiceImpl(null).list(query);
    }

    @Override
    public void delete(String name) {
        serviceFactory.getServiceImpl(null).delete(name);
    }

    @Override
    public void addAllowConsumers(McpServerConsumers consumers) {
        serviceFactory.getServiceImpl(null).addAllowConsumers(consumers);
    }

    @Override
    public void deleteAllowConsumers(McpServerConsumers consumers) {
        serviceFactory.getServiceImpl(null).deleteAllowConsumers(consumers);
    }

    @Override
    public PaginatedResult<McpServerConsumerDetail> listAllowConsumers(McpServerConsumersPageQuery query) {
        return serviceFactory.getServiceImpl(null).listAllowConsumers(query);
    }

    public static McpServer routeToMcpServer(Route route) {
        if (Objects.isNull(route)) {
            return null;
        }
        McpServer result = new McpServer();
        result.setName(route.getName());
        result.setServices(route.getServices());
        result.setDomains(route.getDomains());

        Map<String, String> customConfigs = route.getCustomConfigs();
        if (MapUtils.isNotEmpty(customConfigs)) {
            result.setDescription(customConfigs.get(McpServerConstants.Annotation.RESOURCE_DESCRIPTION_KEY));
        }

        Map<String, String> customLabels = route.getCustomLabels();
        if (MapUtils.isNotEmpty(customLabels)) {
            String mcpServerTypeStr = customLabels.get(McpServerConstants.Label.RESOURCE_MCP_SERVER_TYPE_KEY);
            Optional.ofNullable(mcpServerTypeStr).ifPresent(s -> result.setType(McpServerTypeEnum.fromName(s)));
        }

        if (Objects.nonNull(route.getAuthConfig())) {
            ConsumerAuthInfo consumerAuthInfo = new ConsumerAuthInfo();
            consumerAuthInfo.setType("API_KEY");
            consumerAuthInfo.setAllowedConsumers(route.getAuthConfig().getAllowedConsumers());
            consumerAuthInfo.setEnable(route.getAuthConfig().getEnabled());
            result.setConsumerAuthInfo(consumerAuthInfo);
        }

        return result;

    }

}
