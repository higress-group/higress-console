package com.alibaba.higress.sdk.model.mcp;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * MCP服务器消费者详情类
 * 用于表示MCP服务器与消费者的关联详情
 */
@Data
@Builder
public class McpServerConsumerDetail {
    /**
     * MCP服务器名称
     * 关联的MCP服务器的名称
     */
    @Schema(description = "MCP服务器名称")
    private String mcpServerName;
    
    /**
     * 消费者名称
     * 关联的消费者的名称
     */
    @Schema(description = "消费者名称")
    private String consumerName;
}
