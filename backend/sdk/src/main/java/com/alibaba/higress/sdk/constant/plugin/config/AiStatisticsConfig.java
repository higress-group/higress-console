package com.alibaba.higress.sdk.constant.plugin.config;

import java.util.HashMap;
import java.util.Map;

/**
 * AI统计插件配置常量类
 * 定义了AI统计插件相关的配置项键名常量和辅助方法
 */
public class AiStatisticsConfig {

    /**
     * 属性配置键
     * 用于存储统计属性的配置信息
     */
    public static final String ATTRIBUTES = "attributes";

    /**
     * 属性键名配置键
     * 用于指定统计属性的名称
     */
    public static final String KEY = "key";

    /**
     * 属性值来源配置键
     * 用于指定统计属性值的来源
     */
    public static final String VALUE_SOURCE = "value_source";

    /**
     * 属性值配置键
     * 用于指定统计属性的固定值
     */
    public static final String VALUE = "value";

    /**
     * 属性规则配置键
     * 用于指定统计属性的处理规则
     */
    public static final String RULE = "rule";

    /**
     * 应用到日志配置键
     * 用于控制是否将统计属性应用到日志中
     */
    public static final String APPLY_TO_LOG = "apply_to_log";

    /**
     * 应用到跨度配置键
     * 用于控制是否将统计属性应用到跨度(Span)中
     */
    public static final String APPLY_TO_SPAN = "apply_to_span";

    /**
     * 值来源常量内部类
     * 定义了统计属性值可能的来源类型
     */
    public static class ValueSource {

        /**
         * 固定值来源
         * 表示属性值来自预设的固定值
         */
        public static final String FIXED_VALUE = "fixed_value";

        /**
         * 请求头来源
         * 表示属性值来自HTTP请求头
         */
        public static final String REQUEST_HEADER = "request_header";

        /**
         * 请求体来源
         * 表示属性值来自HTTP请求体
         */
        public static final String REQUEST_BODY = "request_body";

        /**
         * 响应头来源
         * 表示属性值来自HTTP响应头
         */
        public static final String RESPONSE_HEADER = "response_header";

        /**
         * 响应体来源
         * 表示属性值来自HTTP响应体
         */
        public static final String RESPONSE_BODY = "response_body";

        /**
         * 响应流体来源
         * 表示属性值来自HTTP流式响应体
         */
        public static final String RESPONSE_STREAMING_BODY = "response_streaming_body";
    }

    /**
     * 规则常量内部类
     * 定义了统计属性的处理规则类型
     */
    public static class Rule {

        /**
         * 首次规则
         * 表示只在第一次时应用该属性
         */
        public static final String FIRST = "first";

        /**
         * 替换规则
         * 表示用新值替换原有值
         */
        public static final String REPLACE = "replace";

        /**
         * 追加规则
         * 表示将新值追加到原有值后面
         */
        public static final String APPEND = "append";
    }

    /**
     * 构建统计属性配置映射
     *
     * @param key 属性键名
     * @param valueSource 属性值来源
     * @param value 属性值
     * @param rule 属性处理规则
     * @param applyToLog 是否应用到日志
     * @param applyToSpan 是否应用到跨度
     * @return 包含统计属性配置的映射
     */
    public static Map<String, Object> buildAttribute(String key, String valueSource, String value, String rule,
        Boolean applyToLog, Boolean applyToSpan) {
        // 创建属性映射
        Map<String, Object> attribute = new HashMap<>();

        // 如果键名不为空，去除首尾空格后添加到映射中
        if (key != null) {
            key = key.trim();
            attribute.put(KEY, key);
        }

        // 如果值来源不为空，添加到映射中
        if (valueSource != null) {
            attribute.put(VALUE_SOURCE, valueSource);
        }

        // 如果值不为空，添加到映射中
        if (value != null) {
            attribute.put(VALUE, value);
        }

        // 如果规则不为空，添加到映射中
        if (rule != null) {
            attribute.put(RULE, rule);
        }

        // 如果应用到日志标志不为空，添加到映射中
        if (applyToLog != null) {
            attribute.put(APPLY_TO_LOG, applyToLog);
        }

        // 如果应用到跨度标志不为空，添加到映射中
        if (applyToSpan != null) {
            attribute.put(APPLY_TO_SPAN, applyToSpan);
        }

        // 返回构建的属性映射
        return attribute;
    }
}
