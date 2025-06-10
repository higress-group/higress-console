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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;
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
 * @author lvshui
 */
@Slf4j
public class McpServerOfDatabaseImpl extends AbstractMcpServerServiceImpl {

    public McpServerOfDatabaseImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.DATABASE.equals(mcpServer.getType());
    }

    @Override
    protected List<McpServer> getServerListByType(McpServerPageQuery query) {
        return getDatabaseTypeMcpServers(query);
    }

    @Override
    protected void saveMcpServerConfig(McpServer mcpInstance) {
        addOrUpdateServersConfig(mcpInstance);
    }

    private void validate(McpServer mcpInstance) {
        if (StringUtils.isBlank(mcpInstance.getDsn())) {
            throw new ValidationException("dsn cannot be blank.");
        }
        if (Objects.isNull(mcpInstance.getDbType())) {
            throw new ValidationException("dbType is null.");
        }
    }

    private void addOrUpdateServersConfig(McpServer mcpInstance) {
        validate(mcpInstance);

        try {
            McpServerConfigMap.DBServerConfig dbConfig = new McpServerConfigMap.DBServerConfig();
            dbConfig.setDsn(mcpInstance.getDsn());
            dbConfig.setDbType(mcpInstance.getDbType().getValue());

            updateServerConfig(severs -> {
                severs.removeIf(server -> server.getName().equals(mcpInstance.getName()));

                McpServerConfigMap.Server server = new McpServerConfigMap.Server();
                server.setName(mcpInstance.getName());
                server.setPath(generateMcpServerPath(mcpInstance.getName()));
                server.setType(McpServerTypeEnum.DATABASE.getValue());
                server.setConfig(dbConfig);
                severs.add(server);
            });

        } catch (Exception e) {
            throw new BusinessException("Error occurs when add or update mcp servers config: ", e);
        }
    }

    @Override
    public McpServer query(String name) {
        Route route = routeService.query(name);
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        McpServer result = routeToMcpServerWithAth(route);
        completeConfigFields(name, result);

        return result;
    }

    private void completeConfigFields(String name, McpServer result) {
        V1ConfigMap configMap = null;
        try {
            configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
        } catch (Exception e) {
            log.error("Failed to get mcp server list", e);
        }
        McpServerConfigMap mcpConfig = getMcpConfig(configMap);
        Optional<McpServerConfigMap.Server> first =
            mcpConfig.getServers().stream().filter(i -> StringUtils.equals(i.getName(), name)).findFirst();
        if (first.isPresent()) {
            McpServerConfigMap.Server server = first.get();
            result.setDsn(server.getConfig().getDsn());
            result.setDbType(McpServerDBTypeEnum.fromValue(server.getConfig().getDbType()));
            result.setRawConfigurations(buildDatabaseToolsConfig(name, server.getConfig().getDbType()));
        }
    }

    private List<McpServer> getDatabaseTypeMcpServers(McpServerPageQuery query) {
        List<McpServer> resultList = Lists.newArrayList();
        PaginatedResult<Route> routeList = routeService.list(new RoutePageQuery());
        Map<String, Route> routeMap = routeList.getData().stream().collect(Collectors.toMap(Route::getName, r -> r));

        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
            McpServerConfigMap mcpConfig = getMcpConfig(configMap);
            for (McpServerConfigMap.Server server : mcpConfig.getServers()) {
                if (StringUtils.isNotEmpty(query.getServerName())
                    && !StringUtils.contains(server.getName(), query.getServerName())) {
                    continue;
                }

                McpServer mcpServer = new McpServer();
                mcpServer.setName(server.getName());
                mcpServer.setType(McpServerTypeEnum.DATABASE);
                mcpServer.setDsn(server.getConfig().getDsn());
                mcpServer.setDbType(McpServerDBTypeEnum.fromValue(server.getConfig().getDbType()));
                mcpServer.setRawConfigurations(
                    buildDatabaseToolsConfig(mcpServer.getName(), mcpServer.getDbType().getValue()));

                Route matchRoute = routeMap.get(server.getName());
                if (Objects.nonNull(matchRoute)) {
                    mcpServer.setServices(matchRoute.getServices());
                    mcpServer.setDomains(matchRoute.getDomains());
                }

                resultList.add(mcpServer);
            }

        } catch (Exception e) {
            log.error("Failed to get mcp server list", e);
        }

        return resultList;
    }

    /**
     * build DB tools config, DB MCP server tools parameters are currently hardcoded, keep it consistent
     *
     * @param serverName mcp server name
     * @param dbType db type
     * @return db tools config YAML
     */
    private String buildDatabaseToolsConfig(String serverName, String dbType) {

        Map<String, Object> sqlArg = new HashMap<>();
        sqlArg.put("name", "sql");
        sqlArg.put("type", "string");
        sqlArg.put("description", "The sql query to execute");
        sqlArg.put("required", true);
        sqlArg.put("position", "body");

        List<Map<String, Object>> args = new ArrayList<>();
        args.add(sqlArg);

        Map<String, Object> queryTool = new HashMap<>();
        queryTool.put("name", "query");
        queryTool.put("description", String.format("Run a read-only SQL query in database %s.", dbType));
        queryTool.put("args", args);

        List<Map<String, Object>> tools = new ArrayList<>();
        tools.add(queryTool);

        Map<String, Object> server = new HashMap<>();
        server.put("name", serverName);

        Map<String, Object> config = new HashMap<>();
        config.put("tools", tools);
        config.put("server", server);

        String result = "";
        try {
            result = YAML.writeValueAsString(config);
        } catch (Exception e) {
            log.error("Failed to build db tools config", e);
        }
        return result;
    }
}
