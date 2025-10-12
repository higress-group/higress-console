package com.alibaba.higress.sdk.model.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 限流配置类
 * 用于配置路由的请求速率限制
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitConfig {

    /**
     * 限流功能启用状态
     * 指示是否启用请求速率限制功能
     */
    private Boolean enabled;

    /**
     * 每秒查询率（QPS）
     * 限制每秒允许的最大请求数
     */
    private Integer qps;
}
