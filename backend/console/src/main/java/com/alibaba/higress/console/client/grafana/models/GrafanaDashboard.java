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

import com.alibaba.higress.console.client.grafana.GrafanaClient;
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

    private static final String ID = "id";
    private static final String UID = "uid";
    private static final String TITLE = "title";
    private static final String VERSION = "version";

    private DashboardMeta meta;
    private ObjectNode dashboard;

    @JsonIgnore
    public Integer getId() {
        if (dashboard == null) {
            return null;
        }
        JsonNode idToken = dashboard.get(ID);
        return idToken != null ? idToken.asInt() : null;
    }

    @JsonIgnore
    public void setId(Integer id) {
        if (dashboard == null) {
            dashboard = GrafanaClient.MAPPER.createObjectNode();
        }
        if (id == null) {
            dashboard.remove(ID);
        } else {
            dashboard.put(ID, id);
        }
    }

    @JsonIgnore
    public String getUid() {
        if (dashboard == null) {
            return null;
        }
        JsonNode uidToken = dashboard.get(UID);
        return uidToken != null ? uidToken.asText() : null;
    }

    @JsonIgnore
    public void setUid(String uid) {
        if (dashboard == null) {
            dashboard = GrafanaClient.MAPPER.createObjectNode();
        }
        if (uid == null) {
            dashboard.remove(UID);
        } else {
            dashboard.put(UID, uid);
        }
    }

    @JsonIgnore
    public String getTitle() {
        if (dashboard == null) {
            return null;
        }
        JsonNode titleToken = dashboard.get(TITLE);
        return titleToken != null ? titleToken.asText() : null;
    }

    @JsonIgnore
    public Integer getVersion() {
        if (dashboard == null) {
            return null;
        }
        JsonNode versionToken = dashboard.get(VERSION);
        return versionToken != null ? versionToken.asInt() : null;
    }

    @JsonIgnore
    public void setVersion(Integer version) {
        if (dashboard == null) {
            dashboard = GrafanaClient.MAPPER.createObjectNode();
        }
        if (version == null) {
            dashboard.remove(VERSION);
        } else {
            dashboard.put(VERSION, version);
        }
    }
}