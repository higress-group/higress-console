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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;

import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;

/**
 * @author lvshui
 */
@Slf4j
public class DatabaseDetailStrategy extends AbstractMcpServerDetailStrategy {
    @Override
    public boolean support(McpServerTypeEnum type) {
        return McpServerTypeEnum.DATABASE.equals(type);
    }

    public DatabaseDetailStrategy(KubernetesClientService kubernetesClientService,
        WasmPluginInstanceService wasmPluginInstanceService, RouteService routeService) {
        super(kubernetesClientService, wasmPluginInstanceService, routeService);
    }

    @Override
    protected void completeInfo(Route route, McpServer result) {
        completeConfigFields(route.getName(), result);
    }

    private void completeConfigFields(String name, McpServer result) {
        V1ConfigMap configMap = null;
        try {
            configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
        } catch (Exception e) {
            log.error("Failed to get mcp server list", e);
        }
        McpServerConfigMap mcpConfig = McpServerConfigMapHelper.getMcpConfig(configMap);
        Optional<McpServerConfigMap.Server> first =
            mcpConfig.getServers().stream().filter(i -> StringUtils.equals(i.getName(), name)).findFirst();
        if (first.isPresent()) {
            McpServerConfigMap.Server server = first.get();
            result.setDsn(server.getConfig().getDsn());
            result.setDbType(McpServerDBTypeEnum.fromValue(server.getConfig().getDbType()));
            result.setRawConfigurations(buildDatabaseToolsConfig(name, server.getConfig().getDbType()));
        }
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
