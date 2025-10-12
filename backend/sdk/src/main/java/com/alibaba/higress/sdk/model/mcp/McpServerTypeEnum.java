package com.alibaba.higress.sdk.model.mcp;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * MCP服务器类型枚举
 * 定义了MCP服务器的类型
 */
@Schema(description = "MCP服务器类型枚举", type = "string",
    allowableValues = {"OPEN_API", "DATABASE", "DIRECT_ROUTE"})
public enum McpServerTypeEnum {

    /**
     * OpenAPI类型
     * <p>
     *     上游服务是一个开放API
     * </p>
     */
    OPEN_API("open_api"),

    /**
     * 数据库类型，支持的数据库类型见 {@link McpServerDBTypeEnum}
     */
    DATABASE("database"),

    /**
     * 直连路由类型
     * <p>
     *     上游服务是一个MCP服务器
     * </p>
     */
    DIRECT_ROUTE("direct_route");

    private final String value;

    /**
     * 获取服务器类型值
     * @return 服务器类型值
     */
    public String getValue() {
        return value;
    }

    McpServerTypeEnum(String value) {
        this.value = value;
    }

    private static final Map<String, McpServerTypeEnum> NAME_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(McpServerTypeEnum::name, t -> t));

    /**
     * 根据名称获取服务器类型枚举
     * @param name 服务器类型名称
     * @return 服务器类型枚举
     */
    public static McpServerTypeEnum fromName(String name) {
        return Optional.ofNullable(NAME_MAP.get(name.toUpperCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + name));
    }
}
