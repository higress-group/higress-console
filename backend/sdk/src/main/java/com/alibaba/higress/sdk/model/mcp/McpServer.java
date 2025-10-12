package com.alibaba.higress.sdk.model.mcp;

import java.util.List;

import com.alibaba.higress.sdk.model.route.UpstreamService;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * MCP服务器配置类
 * 用于定义MCP服务器的相关配置，包括基本信息、域名、上游服务、认证信息等
 */
@Data
public class McpServer {
    /**
     * 服务器ID（已弃用）
     * 旧版本标识符，新版本中不再使用
     */
    @Deprecated
    private String id;
    
    /**
     * 服务器名称
     * MCP服务器的唯一标识名称
     */
    @Schema(description = "Mcp server name")
    private String name;
    
    /**
     * 服务器描述
     * 对MCP服务器的详细描述信息
     */
    @Schema(description = "Mcp server description")
    private String description;
    
    /**
     * 域名列表
     * 定义该MCP服务器适用的域名集合
     */
    @Schema(description = "Domains that the mcp server applies to.")
    private List<String> domains;
    
    /**
     * 上游服务列表
     * 定义MCP服务器的上游服务配置
     */
    @Schema(description = "Mcp server upstream services")
    private List<UpstreamService> services;
    
    /**
     * 服务器类型
     * 定义MCP服务器的类型，可选值包括OPEN_API、DATABASE、DIRECT_ROUTE
     */
    @Schema(description = "Mcp server type", allowableValues = {"OPEN_API", "DATABASE", "DIRECT_ROUTE"})
    private McpServerTypeEnum type;

    /**
     * 消费者认证信息
     * 定义MCP服务器的消费者认证配置
     */
    @Schema(description = "Mcp server consumer auth info")
    private ConsumerAuthInfo consumerAuthInfo;

    /**
     * 原始配置（OPEN_API类型）
     * 以YAML格式存储的原始配置信息
     */
    @Schema(description = "Raw configurations in YAML format")
    private String rawConfigurations;

    /**
     * 数据源名称（DATABASE类型）
     * 对于数据库类型服务器，此字段为必需项
     */
    @Schema(description = "Data Source Name. For DB type server, it is required")
    private String dsn;

    /**
     * 数据库类型
     * 定义数据库类型，可选值包括MYSQL、POSTGRESQL、SQLITE、CLICKHOUSE
     */
    @Schema(description = "Database type",allowableValues = {"MYSQL", "POSTGRESQL", "SQLITE", "CLICKHOUSE"})
    private McpServerDBTypeEnum dbType;

    /**
     * 上游路径前缀（DIRECT_ROUTE类型）
     * 上游MCP服务器将根据此路径前缀重定向请求
     */
    @Schema(description = "The upstream MCP server will redirect requests based on the path prefix.")
    private String upstreamPathPrefix;
}
