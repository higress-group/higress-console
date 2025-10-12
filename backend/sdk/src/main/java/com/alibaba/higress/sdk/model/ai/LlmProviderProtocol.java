package com.alibaba.higress.sdk.model.ai;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * LLM服务提供者协议枚举类
 * 定义了与LLM服务提供者通信时支持的协议类型
 */
@Schema(description = "LLM Service Provider Protocols", type = "string", allowableValues = {"openai/v1", "original"})
public enum LlmProviderProtocol {

    /**
     * OpenAI v1 协议
     * 支持OpenAI兼容的API接口
     */
    OPENAI_V1("openai/v1", "openai"),
    
    /**
     * 原始协议
     * 使用提供者原生的API接口
     */
    ORIGINAL("original", "original"),;

    /**
     * 默认协议
     * 当未指定协议时使用的默认值
     */
    public static final LlmProviderProtocol DEFAULT = OPENAI_V1;

    /**
     * 协议值
     * 用于标识协议类型的字符串
     */
    private final String value;
    
    /**
     * 插件值
     * 用于插件配置中的协议标识
     */
    private final String pluginValue;

    /**
     * 构造函数
     * 初始化协议枚举值
     *
     * @param value 协议值
     * @param pluginValue 插件值
     */
    LlmProviderProtocol(String value, String pluginValue) {
        this.value = value;
        this.pluginValue = pluginValue;
    }

    /**
     * 获取协议值
     *
     * @return 协议值
     */
    public String getValue() {
        return value;
    }

    /**
     * 获取插件值
     *
     * @return 插件值
     */
    public String getPluginValue() {
        return pluginValue;
    }

    /**
     * 根据协议值获取协议枚举
     *
     * @param value 协议值
     * @return 对应的协议枚举，如果未找到则返回null
     */
    public static LlmProviderProtocol fromValue(String value) {
        for (LlmProviderProtocol protocol : LlmProviderProtocol.values()) {
            if (protocol.getValue().equals(value)) {
                return protocol;
            }
        }
        return null;
    }

    /**
     * 根据插件值获取协议枚举
     *
     * @param pluginValue 插件值
     * @return 对应的协议枚举，如果未找到则返回null
     */
    public static LlmProviderProtocol fromPluginValue(String pluginValue) {
        for (LlmProviderProtocol protocol : LlmProviderProtocol.values()) {
            if (protocol.getPluginValue().equals(pluginValue)) {
                return protocol;
            }
        }
        return null;
    }
}
