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

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.util.ValidateUtil;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Wasm Plugin")
public class WasmPlugin implements VersionedDto {

    @Schema(description = "Plugin name")
    private String name;

    @Schema(description = "Plugin version. Fixed to 1.0.0")
    private String pluginVersion;

    @Schema(description = "Plugin resource version. Required when updating.")
    private String version;

    @Schema(description = "Plugin category")
    private String category;

    @Schema(description = "Plugin title for display")
    private String title;

    @Schema(description = "Plugin description for display")
    private String description;

    @Schema(description = "Whether the plugin is built-in")
    private Boolean builtIn;

    @Schema(description = "Plugin icon URL")
    private String icon;

    @Schema(description = "Plugin image repository")
    private String imageRepository;

    @Schema(description = "Plugin image tag")
    private String imageVersion;

    @Schema(description = "Plugin execution phase", ref = "PluginPhase")
    private String phase;

    @Schema(description = "Plugin execution priority in the given phase", minimum = "0", maximum = "1000")
    private Integer priority;

    public void validate() {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }

        if (!ValidateUtil.checkServiceName(name)) {
            throw new ValidationException("Invalid name format.");
        }

        if (StringUtils.isBlank(title)) {
            throw new ValidationException("title cannot be blank.");
        }

        if (StringUtils.isBlank(category)) {
            throw new ValidationException("category cannot be blank.");
        }

        if (StringUtils.isBlank(imageRepository)) {
            throw new ValidationException("imageRepository cannot be blank.");
        }

        if (StringUtils.isBlank(imageVersion)) {
            throw new ValidationException("imageVersion cannot be blank.");
        }
    }
}
