/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.controller.dto;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

public enum WasmPluginInstanceScope {

    /**
     * Global
     */
    GLOBAL("global"),
    /**
     * Domain level
     */
    DOMAIN("domain"),
    /**
     * Route level
     */
    ROUTE("route");

    private static final Map<String, WasmPluginInstanceScope> ID_SCOPE_MAPPING = Arrays
        .stream(WasmPluginInstanceScope.values()).collect(Collectors.toMap(WasmPluginInstanceScope::getId, s -> s));

    private final String id;

    WasmPluginInstanceScope(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public static WasmPluginInstanceScope fromId(String id) {
        return StringUtils.isNotEmpty(id) ? ID_SCOPE_MAPPING.get(id) : null;
    }
}
