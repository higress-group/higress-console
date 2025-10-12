package com.alibaba.higress.sdk.model.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Mock配置类
 * 用于配置路由的Mock响应，以便在开发或测试时模拟后端服务
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MockConfig {

    /**
     * 默认HTTP状态码
     * 当未指定状态码时使用的默认值
     */
    public static final int DEFAULT_STATUS = 200;

    /**
     * Mock功能启用状态
     * 指示是否启用Mock功能
     */
    private Boolean enabled;

    /**
     * HTTP状态码
     * Mock响应返回的HTTP状态码
     */
    private Integer status;

    /**
     * Mock响应内容
     * 返回给客户端的模拟响应体
     */
    private String content;
}
