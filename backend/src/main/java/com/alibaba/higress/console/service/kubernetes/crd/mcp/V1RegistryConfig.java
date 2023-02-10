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
package com.alibaba.higress.console.service.kubernetes.crd.mcp;

import java.util.List;

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class V1RegistryConfig {

    /**
     * nacos,nacos2,zookeeper,consul,eureka
     */
    public static final String SERIALIZED_NAME_TYPE = "type";
    @SerializedName(SERIALIZED_NAME_TYPE)
    private String type;

    public static final String SERIALIZED_NAME_NAME = "name";
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;

    public static final String SERIALIZED_NAME_DOMAIN = "domain";
    @SerializedName(SERIALIZED_NAME_DOMAIN)
    private String domain;

    public static final String SERIALIZED_NAME_PORT = "port";
    @SerializedName(SERIALIZED_NAME_PORT)
    private Integer port;

    public static final String SERIALIZED_NAME_CONSUL_NAMESPACE = "consulNamespace";
    @SerializedName(SERIALIZED_NAME_CONSUL_NAMESPACE)
    private String consulNamespace;

    public static final String SERIALIZED_NAME_ZK_SERVICES_PATH = "zkServicesPath";
    @SerializedName(SERIALIZED_NAME_ZK_SERVICES_PATH)
    private List<String> zkServicesPath;

    public static final String SERIALIZED_NAME_NACOS_NAMESPACE_ID = "nacosNamespaceId";
    @SerializedName(SERIALIZED_NAME_NACOS_NAMESPACE_ID)
    private String nacosNamespaceId;

    public static final String SERIALIZED_NAME_NACOS_GROUPS = "nacosGroups";
    @SerializedName(SERIALIZED_NAME_NACOS_GROUPS)
    private List<String> nacosGroups;
}
