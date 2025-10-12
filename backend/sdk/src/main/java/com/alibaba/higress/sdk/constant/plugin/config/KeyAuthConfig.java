package com.alibaba.higress.sdk.constant.plugin.config;

/**
 * 密钥认证插件配置常量类
 * 定义了密钥认证插件相关的配置项键名常量
 */
public class KeyAuthConfig {

    /**
     * 消费者配置键
     * 用于存储认证消费者列表的配置项
     */
    public static final String CONSUMERS = "consumers";

    /**
     * 消费者名称配置键
     * 用于指定消费者的名称
     */
    public static final String CONSUMER_NAME = "name";

    /**
     * 消费者凭证列表配置键
     * 用于存储消费者的所有认证凭证
     */
    public static final String CONSUMER_CREDENTIALS = "credentials";

    /**
     * 消费者单个凭证配置键（已废弃）
     * 用于指定消费者的单个认证凭证，已被 CONSUMER_CREDENTIALS 替代
     */
    @Deprecated
    public static final String CONSUMER_CREDENTIAL = "credential";

    /**
     * 密钥列表配置键
     * 用于存储认证密钥列表
     */
    public static final String KEYS = "keys";

    /**
     * 头部认证配置键
     * 用于指定是否在HTTP头部中查找认证密钥
     */
    public static final String IN_HEADER = "in_header";

    /**
     * 查询参数认证配置键
     * 用于指定是否在URL查询参数中查找认证密钥
     */
    public static final String IN_QUERY = "in_query";

    /**
     * 允许列表配置键
     * 用于指定允许访问的消费者列表
     */
    public static final String ALLOW = "allow";

    /**
     * 全局认证配置键
     * 用于控制是否启用全局认证模式
     */
    public static final String GLOBAL_AUTH = "global_auth";
}
