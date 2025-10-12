package com.alibaba.higress.sdk.model.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 上游服务类
 * 用于定义路由的上游服务配置，包括服务名称、端口、版本和权重
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpstreamService {

    /**
     * 服务名称
     * 上游服务的唯一标识名称
     */
    private String name;

    /**
     * 服务端口
     * 上游服务监听的端口号
     */
    private Integer port;

    /**
     * 服务版本
     * 上游服务的版本信息
     */
    private String version;

    /**
     * 服务权重
     * 在负载均衡中使用的权重值
     */
    private Integer weight;

    /**
     * 验证上游服务配置
     * 检查配置的有效性
     */
    public void validate() {
        // TODO: Implement validation logic
    }
}
