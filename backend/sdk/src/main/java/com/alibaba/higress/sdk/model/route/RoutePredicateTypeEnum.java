package com.alibaba.higress.sdk.model.route;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 路由谓词类型枚举
 * 定义了可用的路由匹配类型，包括精确匹配、前缀匹配和正则表达式匹配
 */
@Schema(description = "Route Predicate Types", type = "string", allowableValues = {"EXACT", "PRE", "REGEX"})
public enum RoutePredicateTypeEnum {

    /**
     * 精确匹配
     * 要求请求与配置值完全一致
     */
    EQUAL("exact"),
    /**
     * 前缀匹配
     * 要求请求以配置值作为前缀
     */
    PRE("prefix"),
    /**
     * 正则表达式匹配
     * 使用正则表达式进行匹配
     */
    REGULAR("regex");

    /**
     * 注解前缀
     * 用于标识不同匹配类型的前缀
     */
    private final String annotationPrefix;

    /**
     * 名称映射表
     * 用于根据名称快速查找对应的枚举值
     */
    private static final Map<String, RoutePredicateTypeEnum> NAME_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(RoutePredicateTypeEnum::name, t -> t));

    /**
     * 注解前缀映射表
     * 用于根据注解前缀快速查找对应的枚举值
     */
    private static final Map<String, RoutePredicateTypeEnum> ANNOTATION_PREFIX_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(RoutePredicateTypeEnum::getAnnotationPrefix, t -> t));

    /**
     * 构造函数
     * @param annotationPrefix 注解前缀
     */
    RoutePredicateTypeEnum(String annotationPrefix) {
        this.annotationPrefix = annotationPrefix;
    }

    /**
     * 获取注解前缀
     * @return 注解前缀字符串
     */
    public String getAnnotationPrefix() {
        return annotationPrefix;
    }

    /**
     * 根据名称获取枚举值
     * @param name 枚举名称
     * @return 对应的枚举值，如果未找到则返回null
     */
    public static RoutePredicateTypeEnum fromName(String name) {
        return StringUtils.isNotEmpty(name) ? NAME_MAP.get(name.toUpperCase(Locale.ROOT)) : null;
    }

    /**
     * 根据注解前缀获取枚举值
     * @param annotationPrefix 注解前缀
     * @return 对应的枚举值，如果未找到则返回null
     */
    public static RoutePredicateTypeEnum fromAnnotationPrefix(String annotationPrefix) {
        return StringUtils.isNotEmpty(annotationPrefix) ? ANNOTATION_PREFIX_MAP.get(annotationPrefix) : null;
    }
}
