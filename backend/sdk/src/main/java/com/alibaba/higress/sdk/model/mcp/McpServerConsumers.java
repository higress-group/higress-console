package com.alibaba.higress.sdk.model.mcp;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * MCP服务器消费者列表类
 * 用于表示MCP服务器关联的消费者列表
 */
@Data
public class McpServerConsumers {
    /**
     * MCP服务器名称
     * 关联的MCP服务器的名称
     */
    @Schema(description = "MCP服务器名称")
    private String mcpServerName;
    
    /**
     * 消费者名称列表
     * 关联的消费者名称列表
     */
    @Schema(description = "消费者名称列表")
    private List<String> consumers;
}
