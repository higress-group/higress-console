package com.alibaba.higress.sdk.model.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 重定向配置类
 * 用于配置路由的HTTP重定向行为
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedirectConfig {

    /**
     * 默认HTTP状态码
     * 当未指定状态码时使用的默认重定向状态码
     */
    public static final int DEFAULT_STATUS = 307;

    /**
     * 重定向功能启用状态
     * 指示是否启用重定向功能
     */
    private Boolean enabled;

    /**
     * HTTP状态码
     * 重定向响应返回的HTTP状态码
     */
    private Integer status;

    /**
     * 重定向目标URL
     * 客户端将被重定向到的目标地址
     */
    private String url;
}
