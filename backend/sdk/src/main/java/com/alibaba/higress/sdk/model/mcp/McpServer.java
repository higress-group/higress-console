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
package com.alibaba.higress.sdk.model.mcp;

import java.util.List;

import com.alibaba.higress.sdk.model.route.UpstreamService;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * @author lvshui
 */
@Data
public class McpServer {
    @Deprecated
    private String id;
    @Schema(description = "Mcp server name")
    private String name;
    @Schema(description = "Mcp server description")
    private String description;
    @Schema(description = "Domains that the mcp server applies to.")
    private List<String> domains;
    @Schema(description = "Mcp server upstream services")
    private List<UpstreamService> services;
    @Schema(description = "Mcp server type")
    private McpServerTypeEnum type;

    @Schema(description = "Mcp server consumer auth info")
    private ConsumerAuthInfo consumerAuthInfo;

    /**
     * type =open api
     */
    @Schema(description = "Raw configurations in YAML format")
    private String rawConfigurations;

    /**
     * type= db
     */
    @Schema(description = "Data Source Name. For DB type server, it is required")
    private String dsn;

    @Schema(description = "Database type, support MYSQL POSTGRESQL SQLITE CLICKHOUSE")
    private McpServerDBTypeEnum dbType;

    /**
     * type= redirect route
     */
    @Schema(description = "The upstream MCP server will redirect requests based on the path prefix.")
    private String upstreamPathPrefix;
}
