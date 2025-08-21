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

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.util.MapUtil;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Wasm Plugin Instance")
public class WasmPluginInstance implements VersionedDto {

    @Schema(description = "Plugin instance version. Required when updating.")
    private String version;

    @Deprecated
    @Schema(deprecated = true)
    private WasmPluginInstanceScope scope;

    @Deprecated
    @Schema(deprecated = true)
    private String target;

    @Schema(description = "Plugin instance targets")
    private Map<WasmPluginInstanceScope, String> targets;

    @Schema(description = "Plugin name")
    private String pluginName;

    @Schema(description = "Plugin version. Fixed to 1.0.0")
    private String pluginVersion;

    @Schema(description = "Whether this is an internal plugin instance managed by the console itself")
    private Boolean internal;

    @Schema(description = "Whether this plugin instance is enabled")
    private Boolean enabled;

    @Schema(description = "Raw configurations in YAML format")
    private String rawConfigurations;

    @Schema(description = "Configurations")
    private Map<String, Object> configurations;

    public boolean isInternal() {
        return Boolean.TRUE.equals(internal);
    }

    public void syncDeprecatedFields() {
        if (scope == null && MapUtils.isEmpty(targets)) {
            return;
        }
        if (scope != null) {
            targets = MapUtil.of(scope, target);
        } else if (targets.size() == 1) {
            Map.Entry<WasmPluginInstanceScope, String> entry = targets.entrySet().iterator().next();
            scope = entry.getKey();
            target = entry.getValue();
        } else {
            // We don't know which one to choose, so skip syncing.
        }
    }

    public boolean hasScopedTarget(WasmPluginInstanceScope scope) {
        return targets != null && targets.containsKey(scope);
    }

    public void setGlobalTarget() {
        setTarget(WasmPluginInstanceScope.GLOBAL, null);
    }

    public void setTarget(WasmPluginInstanceScope scope, String target) {
        if (targets == null) {
            targets = new HashMap<>();
        } else {
            targets.clear();
        }
        targets.put(scope, target);
        syncDeprecatedFields();
    }

    public void putTarget(WasmPluginInstanceScope scope, String target) {
        if (targets == null) {
            targets = new HashMap<>();
        }
        targets.put(scope, target);
        syncDeprecatedFields();
    }

    public void validate() {
        if (MapUtils.isEmpty(targets)) {
            throw new IllegalArgumentException("instance.targets cannot be empty.");
        }
        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            if (targets.size() > 1) {
                throw new IllegalArgumentException(
                        "instance.targets cannot contain GLOBAL and other scopes at the same time.");
            }
            String target = targets.get(WasmPluginInstanceScope.GLOBAL);
            if (target != null) {
                throw new IllegalArgumentException("instance.target must be empty when scope is GLOBAL.");
            }
        } else {
            for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                if (StringUtils.isEmpty(entry.getValue())) {
                    throw new IllegalArgumentException(
                            "instance.target must not be null or empty when scope is not GLOBAL.");
                }
            }
        }
    }
}
