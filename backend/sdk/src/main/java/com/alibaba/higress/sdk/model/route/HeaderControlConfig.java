package com.alibaba.higress.sdk.model.route;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 请求头控制配置类
 * 用于配置请求和响应头的控制策略
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Header Control Configuration")
public class HeaderControlConfig {

    /**
     * 头部控制功能启用状态
     * 指示是否启用请求头控制功能
     */
    @Schema(description = "Whether to enable the header control feature.")
    private Boolean enabled;

    /**
     * 请求头控制配置
     * 定义请求阶段的头部控制策略
     */
    @Schema(description = "Request header control configuration")
    private HeaderControlStageConfig request;

    /**
     * 响应头控制配置
     * 定义响应阶段的头部控制策略
     */
    @Schema(description = "Response header control configuration")
    private HeaderControlStageConfig response;
}
