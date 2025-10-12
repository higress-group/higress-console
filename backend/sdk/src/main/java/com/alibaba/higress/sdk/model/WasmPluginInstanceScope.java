package com.alibaba.higress.sdk.model;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

/**
 * WASM插件实例作用域枚举类
 * 定义了插件实例可以应用的范围，包括全局、域名、路由和服务四个级别
 */
@Getter
@Schema(description = "WASM 插件实例作用域枚举，定义了插件实例可以应用的范围。", allowableValues = {"global", "domain", "route", "service"})
public enum WasmPluginInstanceScope {

    /**
     * 全局作用域
     * 插件实例应用到整个网关系统，对所有请求生效
     */
    GLOBAL("global", 0),

    /**
     * 域名级别作用域
     * 插件实例仅应用到指定域名下的请求
     */
    DOMAIN("domain", 10),

    /**
     * 路由级别作用域
     * 插件实例仅应用到指定路由下的请求
     */
    ROUTE("route", 100),

    /**
     * 服务级别作用域
     * 插件实例仅应用到指定服务的请求
     */
    SERVICE("service", 1000);

    /**
     * 非全局作用域列表
     * 包含域名、路由和服务三个作用域，用于区分需要指定目标对象的作用域
     */
    public static final List<WasmPluginInstanceScope> NON_GLOBAL_SCOPES = Arrays.asList(DOMAIN, ROUTE, SERVICE);

    /**
     * 作用域ID到枚举值的映射表
     * 用于通过作用域ID快速查找对应的枚举值
     */
    private static final Map<String, WasmPluginInstanceScope> ID_SCOPE_MAPPING = Arrays
        .stream(WasmPluginInstanceScope.values()).collect(Collectors.toMap(WasmPluginInstanceScope::getId, s -> s));

    /**
     * 作用域ID
     * 用于标识作用域类型的字符串
     */
    private final String id;

    /**
     * 作用域优先级
     * 数值越小优先级越高，用于确定插件实例的执行顺序
     */
    private final int priority;

    /**
     * 构造函数
     *
     * @param id 作用域ID
     * @param priority 作用域优先级
     */
    WasmPluginInstanceScope(String id, int priority) {
        this.id = id;
        this.priority = priority;
    }

    /**
     * 根据作用域ID获取对应的枚举值
     *
     * @param id 作用域ID
     * @return 对应的枚举值，如果未找到则返回null
     */
    public static WasmPluginInstanceScope fromId(String id) {
        return StringUtils.isNotEmpty(id) ? ID_SCOPE_MAPPING.get(id) : null;
    }
}
