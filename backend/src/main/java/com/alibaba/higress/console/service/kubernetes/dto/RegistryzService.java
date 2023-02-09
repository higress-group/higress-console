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
package com.alibaba.higress.console.service.kubernetes.dto;

import java.util.List;

import com.alibaba.fastjson.annotation.JSONField;

public class RegistryzService {

    @JSONField(name = "Attributes")
    private RegistryzServiceAttributes attributes;

    private String hostname;

    private List<Port> ports;

    public RegistryzServiceAttributes getAttributes() {
        return attributes;
    }

    public void setAttributes(RegistryzServiceAttributes attributes) {
        this.attributes = attributes;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public List<Port> getPorts() {
        return ports;
    }

    public void setPorts(List<Port> ports) {
        this.ports = ports;
    }
}
