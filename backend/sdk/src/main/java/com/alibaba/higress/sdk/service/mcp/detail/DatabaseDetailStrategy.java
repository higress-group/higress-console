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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;

import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.Builder;
import lombok.Data;
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
        completeConfigFields(result.getName(), result);
    }

    private void completeConfigFields(String name, McpServer result) {
        V1ConfigMap configMap = null;
        try {
            configMap = kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG);
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
        SchemaConfig schemaConfig = buildSchemaConfig(serverName, dbType);
        String result = "";
        try {
            result = YAML.writeValueAsString(schemaConfig);
        } catch (Exception e) {
            log.error("Failed to build db tools config", e);
        }
        return result;
    }

    @Data
    @Builder
    static class ToolArgsSchemaConfig {
        private String name;
        private String type;
        private String description;
        private boolean required;
        private String position;
    }
    @Data
    @Builder
    static class ToolsSchemaConfig {
        private String name;
        private String description;
        private List<ToolArgsSchemaConfig> args;
    }
    @Data
    @Builder
    static class SchemaConfig {
        private String server;
        private List<ToolsSchemaConfig> tools;
    }

    private SchemaConfig buildSchemaConfig(String server, String dbType) {

        String descriptionSuffix = String.format("in database %s.", dbType);

        List<ToolsSchemaConfig> tools = new ArrayList<>();
        tools.add(buildToolsConfig("query",
                                   String.format("Run a read-only SQL query %s", descriptionSuffix),
                                   buildQueryToolsConfig()));
        tools.add(buildToolsConfig("execute",
                                   String.format("Execute an insert, update, or delete SQL %s", descriptionSuffix),
                                   buildExecuteToolsConfig()));
        tools.add(buildToolsConfig("list tables",
                                   String.format("List all tables %s", descriptionSuffix),
                                   Collections.emptyList()));
        tools.add(buildToolsConfig("describe table",
                                   String.format("Get the structure of a specific table %s", descriptionSuffix),
                                   buildDescribeTableToolsConfig()));

        return SchemaConfig.builder()
                .server(server)
                .tools(tools)
                .build();
    }

    private List<ToolArgsSchemaConfig> buildQueryToolsConfig() {
        ToolArgsSchemaConfig build = ToolArgsSchemaConfig.builder()
                .name("sql")
                .type("string")
                .description("The sql query to execute")
                .required(true)
                .position("body")
                .build();

        return Collections.singletonList(build);
    }

    private List<ToolArgsSchemaConfig> buildExecuteToolsConfig() {
        ToolArgsSchemaConfig build = ToolArgsSchemaConfig.builder()
                .name("sql")
                .type("string")
                .description("The sql to execute")
                .required(true)
                .position("body")
                .build();

        return Collections.singletonList(build);
    }

    private List<ToolArgsSchemaConfig> buildDescribeTableToolsConfig() {
        ToolArgsSchemaConfig build = ToolArgsSchemaConfig.builder()
                .name("table")
                .type("string")
                .description("table name")
                .required(true)
                .position("body")
                .build();

        return Collections.singletonList(build);
    }

    private ToolsSchemaConfig buildToolsConfig(String name, String desc, List<ToolArgsSchemaConfig> args) {
        return ToolsSchemaConfig.builder()
                .name(name)
                .description(desc)
                .args(args)
                .build();
    }

}
