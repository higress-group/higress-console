package com.alibaba.higress.sdk.model.mcp;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 消费者认证信息类
 * 用于定义消费者认证的相关配置，包括凭据类型、启用状态和允许的消费者列表
 */
@Data
public class ConsumerAuthInfo {
    /**
     * 凭据类型
     * 指定用于认证的凭据类型
     */
    private String type;

    /**
     * 启用状态
     * 指示是否启用消费者认证功能
     */
    private Boolean enable = Boolean.FALSE;

    /**
     * 允许的消费者名称列表
     * 定义允许访问的消费者名称集合
     */
    @Schema(description = "Allowed consumer names")
    private List<String> allowedConsumers;
}
