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
package com.alibaba.higress.sdk.model.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.models.media.Schema;
import lombok.Data;
import lombok.Getter;

/**
 * @author CH3CHO
 */
@Data
public class PluginConfigSchema {

    @JsonProperty("openAPIV3Schema")
    private Schema openApiV3Schema;

    @JsonIgnore
    @Getter(onMethod_ = @JsonAnyGetter)
    private Map<String, Object> extensions;

    @JsonAnySetter
    public void setExtension(String name, Object value) {
        if (this.extensions == null) {
            this.extensions = new HashMap<>(8);
        }
        this.extensions.put(name, value);
    }
}
