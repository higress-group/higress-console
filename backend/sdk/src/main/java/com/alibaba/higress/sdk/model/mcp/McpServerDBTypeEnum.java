package com.alibaba.higress.sdk.model.mcp;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * MCP服务器数据库类型枚举
 * 定义了MCP服务器支持的数据库类型
 */
@Schema(description = "MCP服务器数据库类型枚举", type = "string",
    allowableValues = {"MYSQL", "POSTGRESQL", "SQLITE", "CLICKHOUSE"})
public enum McpServerDBTypeEnum {

    /**
     * MySQL数据库类型
     */
    MYSQL("mysql"),

    /**
     * PostgreSQL数据库类型
     */
    POSTGRESQL("postgres"),

    /**
     * SQLite数据库类型
     */
    SQLITE("sqlite"),

    /**
     * ClickHouse数据库类型
     */
    CLICKHOUSE("clickhouse");

    private final String value;

    /**
     * 获取数据库类型值
     * @return 数据库类型值
     */
    public String getValue() {
        return value;
    }

    McpServerDBTypeEnum(String value) {
        this.value = value;
    }

    private static final Map<String, McpServerDBTypeEnum> NAME_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(McpServerDBTypeEnum::name, t -> t));

    private static final Map<String, McpServerDBTypeEnum> VALUE_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(McpServerDBTypeEnum::getValue, t -> t));

    /**
     * 根据名称获取数据库类型枚举
     * @param name 数据库类型名称
     * @return 数据库类型枚举
     */
    public static McpServerDBTypeEnum fromName(String name) {
        return Optional.ofNullable(NAME_MAP.get(name.toUpperCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + name));
    }

    /**
     * 根据值获取数据库类型枚举
     * @param value 数据库类型值
     * @return 数据库类型枚举
     */
    public static McpServerDBTypeEnum fromValue(String value) {
        return Optional.ofNullable(VALUE_MAP.get(value.toLowerCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + value));
    }
}
