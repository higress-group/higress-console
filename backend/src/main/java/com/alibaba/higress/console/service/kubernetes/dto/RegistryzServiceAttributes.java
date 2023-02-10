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

import com.alibaba.fastjson.annotation.JSONField;

public class RegistryzServiceAttributes {

    @JSONField(name = "ServiceRegistry")
    private String serviceRegistry;

    @JSONField(name = "Name")
    private String name;

    @JSONField(name = "Namespace")
    private String namespace;

    public String getServiceRegistry() {
        return serviceRegistry;
    }

    public void setServiceRegistry(String serviceRegistry) {
        this.serviceRegistry = serviceRegistry;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }
}
