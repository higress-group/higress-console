package com.alibaba.higress.sdk.constant.plugin.config;

/**
 * 模型路由插件配置常量类
 * 定义了模型路由插件相关的配置项键名常量
 */
public class ModelRouterConfig {

    /**
     * 模型到头部映射配置键
     * 用于存储模型名称到HTTP头部信息的映射关系配置
     * 通常用于根据请求的模型名称动态设置HTTP头部参数
     */
    public static final String MODEL_TO_HEADER = "modelToHeader";
}
