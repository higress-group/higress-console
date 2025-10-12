package com.alibaba.higress.sdk.model.route;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 请求头控制阶段配置类
 * 用于配置特定阶段（请求或响应）的头部控制策略
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Header Control Stage Configuration")
public class HeaderControlStageConfig {

    /**
     * 要添加的请求头列表
     * 在现有请求头基础上添加新的请求头
     */
    @Schema(description = "Headers to add")
    private List<Header> add;

    /**
     * 要设置的请求头列表
     * 设置或覆盖指定的请求头
     */
    @Schema(description = "Headers to set")
    private List<Header> set;

    /**
     * 要移除的请求头键列表
     * 从请求头中移除指定的请求头
     */
    @Schema(description = "Headers to remove")
    private List<String> remove;
}
