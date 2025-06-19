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
@Schema(description = "Mcp Server Type Enum", type = "string",
    allowableValues = {"OPEN_API", "DATABASE", "DIRECT_ROUTE"})
public enum McpServerTypeEnum {

    /**
     * OpenAPI
     */
    OPEN_API("openapi"),

    /**
     * Database, supported database types {@link McpServerDBTypeEnum}
     */
    DATABASE("database"),

    /**
     * Direct Route
     */
    DIRECT_ROUTE("direct_route");

    private final String value;

    public String getValue() {
        return value;
    }

    McpServerTypeEnum(String value) {
        this.value = value;
    }

    private static final Map<String, McpServerTypeEnum> NAME_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(McpServerTypeEnum::name, t -> t));

    public static McpServerTypeEnum fromName(String name) {
        return Optional.ofNullable(NAME_MAP.get(name.toUpperCase(Locale.ROOT)))
            .orElseThrow(() -> new IllegalArgumentException("Invalid value: " + name));
    }
}
