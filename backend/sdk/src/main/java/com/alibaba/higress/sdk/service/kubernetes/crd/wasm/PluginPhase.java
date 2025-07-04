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
package com.alibaba.higress.sdk.service.kubernetes.crd.wasm;

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.google.common.base.Strings;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Plugin Execution Phase", allowableValues = {"UNSPECIFIED", "AUTHN", "AUTHZ", "STATS"})
public enum PluginPhase {

    /**
     * Control plane decides where to insert the plugin. This will generally // be at the end of the filter chain, right
     * before the Router. // Do not specify `PluginPhase` if the plugin is independent of others.
     */
    UNSPECIFIED("UNSPECIFIED_PHASE", 0),

    /**
     * Insert plugin before Istio authentication filters.
     */
    AUTHN("AUTHN", 1),

    /**
     * Insert plugin before Istio authorization filters and after Istio authentication filters.
     */
    AUTHZ("AUTHZ", 2),

    /**
     * Insert plugin before Istio stats filters and after Istio authorization filters.
     */
    STATS("STATS", 3);

    private static final Map<String, PluginPhase> LOWERED_NAME_MAP = Arrays.stream(PluginPhase.values())
        .collect(Collectors.toMap(p -> p.getName().toLowerCase(Locale.ROOT), Function.identity()));

    static {
        LOWERED_NAME_MAP.put("unspecified", UNSPECIFIED);
        LOWERED_NAME_MAP.put("default", UNSPECIFIED);
    }

    private final String name;
    private final int value;

    PluginPhase(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }

    public static PluginPhase fromName(String name) {
        if (Strings.isNullOrEmpty(name)) {
            return UNSPECIFIED;
        }
        return LOWERED_NAME_MAP.get(name.toLowerCase(Locale.ROOT));
    }
}
