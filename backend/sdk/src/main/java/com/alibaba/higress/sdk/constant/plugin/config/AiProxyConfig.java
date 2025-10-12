package com.alibaba.higress.sdk.constant.plugin.config;

/**
 * AI代理插件配置常量类
 * 定义了AI代理插件相关的配置项键名常量
 */
public class AiProxyConfig {

    /**
     * 活跃提供商ID配置键
     * 用于指定当前激活的AI服务提供商
     */
    public static final String ACTIVE_PROVIDER_ID = "activeProviderId";

    /**
     * 服务提供商配置键
     * 用于存储所有AI服务提供商的配置信息
     */
    public static final String PROVIDERS = "providers";

    /**
     * 服务提供商ID配置键
     * 用于标识具体的服务提供商
     */
    public static final String PROVIDER_ID = "id";

    /**
     * 服务提供商类型配置键
     * 用于指定服务提供商的类型（如OpenAI、Azure等）
     */
    public static final String PROVIDER_TYPE = "type";

    /**
     * 服务提供商API令牌配置键
     * 用于存储访问服务提供商API所需的认证令牌
     */
    public static final String PROVIDER_API_TOKENS = "apiTokens";

    /**
     * 协议配置键
     * 用于指定与AI服务通信的协议类型
     */
    public static final String PROTOCOL = "protocol";

    /**
     * 故障转移配置键
     * 用于配置故障转移相关参数
     */
    public static final String FAILOVER = "failover";

    /**
     * 故障转移启用配置键
     * 用于控制是否启用故障转移功能
     */
    public static final String FAILOVER_ENABLED = "enabled";

    /**
     * 故障转移失败阈值配置键
     * 用于设置触发故障转移的连续失败次数阈值
     */
    public static final String FAILOVER_FAILURE_THRESHOLD = "failureThreshold";

    /**
     * 故障转移成功阈值配置键
     * 用于设置恢复为主提供商所需的成功次数阈值
     */
    public static final String FAILOVER_SUCCESS_THRESHOLD = "successThreshold";

    /**
     * 故障转移健康检查间隔配置键
     * 用于设置健康检查的时间间隔
     */
    public static final String FAILOVER_HEALTH_CHECK_INTERVAL = "healthCheckInterval";

    /**
     * 故障转移健康检查超时配置键
     * 用于设置健康检查的超时时间
     */
    public static final String FAILOVER_HEALTH_CHECK_TIMEOUT = "healthCheckTimeout";

    /**
     * 故障转移健康检查模型配置键
     * 用于设置健康检查时使用的模型
     */
    public static final String FAILOVER_HEALTH_CHECK_MODEL = "healthCheckModel";

    /**
     * 失败重试配置键
     * 用于配置请求失败时的重试机制
     */
    public static final String RETRY_ON_FAILURE = "retryOnFailure";

    /**
     * 重试启用配置键
     * 用于控制是否启用失败重试功能
     */
    public static final String RETRY_ENABLED = "enabled";
}
