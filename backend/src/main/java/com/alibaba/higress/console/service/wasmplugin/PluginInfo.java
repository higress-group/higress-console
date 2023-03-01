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
package com.alibaba.higress.console.service.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import org.openapi4j.parser.model.v3.Contact;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.Getter;

/**
 * @author CH3CHO
 */
@Data
public class PluginInfo {

    private String category;
    private String name;

    private String title;

    @JsonProperty("x-title-i18n")
    private Map<String, String> titleI18n;

    private String description;

    @JsonProperty("x-description-i18n")
    private Map<String, String> descriptionI18n;

    private String version;

    private Contact contact;

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
