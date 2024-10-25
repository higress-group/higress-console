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
package com.alibaba.higress.sdk.model;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
public enum WasmPluginInstanceScope {

    /**
     * Global
     */
    GLOBAL("global", 0),
    /**
     * Domain level
     */
    DOMAIN("domain", 10),
    /**
     * Route level
     */
    ROUTE("route", 100),
    /**
     * Service level
     */
    SERVICE("service", 1000);

    private static final Map<String, WasmPluginInstanceScope> ID_SCOPE_MAPPING = Arrays
        .stream(WasmPluginInstanceScope.values()).collect(Collectors.toMap(WasmPluginInstanceScope::getId, s -> s));

    private final String id;
    private final int priority;

    WasmPluginInstanceScope(String id, int priority) {
        this.id = id;
        this.priority = priority;
    }

    public static WasmPluginInstanceScope fromId(String id) {
        return StringUtils.isNotEmpty(id) ? ID_SCOPE_MAPPING.get(id) : null;
    }
}
