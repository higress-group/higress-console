package com.alibaba.higress.sdk.model.wasmplugin;

/**
 * 插件分类常量类
 * 定义了系统中可用的插件分类常量
 */
public final class PluginCategory {

    /**
     * 私有构造函数
     * 防止实例化该类
     */
    private PluginCategory() {}

    /**
     * 认证类插件
     * 用于处理身份验证和授权的插件
     */
    public static final String AUTH = "auth";
    
    /**
     * 安全类插件
     * 用于处理安全防护的插件
     */
    public static final String SECURITY = "security";
    
    /**
     * 协议类插件
     * 用于处理协议转换和适配的插件
     */
    public static final String PROTOCOL = "protocol";
    
    /**
     * 流量控制类插件
     * 用于处理流量控制和限流的插件
     */
    public static final String FLOW_CONTROL = "flow-control";
    
    /**
     * 流量监控类插件
     * 用于处理流量监控和分析的插件
     */
    public static final String FLOW_MONITOR = "flow-monitor";
    
    /**
     * 自定义类插件
     * 用户自定义的插件
     */
    public static final String CUSTOM = "custom";
}
