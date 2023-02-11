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
package com.alibaba.higress.console.client.grafana.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrafanaDashboard {

    private DashboardMeta meta;
    private ObjectNode dashboard;

    @JsonIgnore
    public String getTitle() {
        if (dashboard == null) {
            return null;
        }
        JsonNode titleToken = dashboard.get("title");
        return titleToken != null ? titleToken.asText() : null;
    }
}