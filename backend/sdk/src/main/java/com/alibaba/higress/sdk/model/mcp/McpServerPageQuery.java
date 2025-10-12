package com.alibaba.higress.sdk.model.mcp;

import com.alibaba.higress.sdk.model.CommonPageQuery;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * MCP服务器分页查询类
 * 用于MCP服务器列表的查询条件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "MCP服务器分页查询条件")
public class McpServerPageQuery extends CommonPageQuery {

    /**
     * MCP服务器名称
     * 与路由关联的MCP服务器名称
     */
    @Schema(description = "MCP服务器名称")
    private String mcpServerName;

    /**
     * MCP服务器类型
     * MCP服务器的类型
     */
    @Schema(description = "MCP服务器类型")
    private String type;

}
