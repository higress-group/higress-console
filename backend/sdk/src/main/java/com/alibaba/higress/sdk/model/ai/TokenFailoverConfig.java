package com.alibaba.higress.sdk.model.ai;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 令牌故障转移配置模型类
 * 用于定义访问令牌的故障转移策略和相关配置参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Token Failover Config")
public class TokenFailoverConfig {

    /**
     * 是否启用故障转移
     * 控制是否启用访问令牌的故障转移机制
     */
    private Boolean enabled;
    
    /**
     * 故障阈值
     * 定义触发故障转移的连续失败次数
     */
    private Integer failureThreshold;
    
    /**
     * 成功阈值
     * 定义确认令牌恢复健康的连续成功次数
     */
    private Integer successThreshold;
    
    /**
     * 健康检查间隔
     * 定义执行健康检查的时间间隔（秒）
     */
    private Integer healthCheckInterval;
    
    /**
     * 健康检查超时
     * 定义健康检查的超时时间（秒）
     */
    private Integer healthCheckTimeout;
    
    /**
     * 健康检查模型
     * 定义用于健康检查的模型名称
     */
    private String healthCheckModel;
}
