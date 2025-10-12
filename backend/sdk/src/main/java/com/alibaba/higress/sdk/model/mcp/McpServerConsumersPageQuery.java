package com.alibaba.higress.sdk.model.mcp;

import com.alibaba.higress.sdk.model.CommonPageQuery;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * MCP服务器消费者分页查询类
 * 用于MCP服务器消费者列表的查询条件
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "MCP服务器消费者分页查询条件")
public class McpServerConsumersPageQuery extends CommonPageQuery {

    /**
     * MCP服务器名称
     * 与路由关联的MCP服务器名称
     */
    @Schema(description = "MCP服务器名称")
    private String mcpServerName;

    /**
     * 消费者名称
     * 用于搜索的消费者名称
     */
    @Schema(description = "消费者名称")
    private String consumerName;

}
