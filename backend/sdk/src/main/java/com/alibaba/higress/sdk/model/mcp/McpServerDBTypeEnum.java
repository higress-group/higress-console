/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.sdk.model.mcp;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * McpServerTypeEnum
 *
 * @author hongzhouzi
 */
@Schema(description = "Mcp Server DB Type Enum", type = "string",
    allowableValues = {"MYSQL", "POSTGRESQL", "SQLITE", "CLICKHOUSE"})
public enum McpServerDBTypeEnum {

    /**
     * MySQL
     */
    MYSQL("mysql"),

    /**
     * PostgreSQL
     */
    POSTGRESQL("postgres"),

    /**
     * SQLite
     */
    SQLITE("sqlite"),

    /**
     * ClickHouse
     */
    CLICKHOUSE("clickhouse");

    private final String value;

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

    public static McpServerDBTypeEnum fromName(String name) {
        return Optional.ofNullable(NAME_MAP.get(name.toUpperCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + name));
    }

    public static McpServerDBTypeEnum fromValue(String value) {
        return Optional.ofNullable(VALUE_MAP.get(value.toLowerCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + value));
    }
}
