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
package com.alibaba.higress.sdk.service.kubernetes.crd.mcp;

import java.util.List;

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class V1RegistryConfig {

    /**
     * tcp,http,https,http2,grpc,grpcs,dubbo
     */
    public static final String SERIALIZED_NAME_PROTOCOL = "protocol";
    @SerializedName(SERIALIZED_NAME_PROTOCOL)
    private String protocol;

    public static final String SERIALIZED_NAME_SNI = "sni";
    @SerializedName(SERIALIZED_NAME_SNI)
    private String sni;

    public static final String SERIALIZED_NAME_TYPE = "type";
    /**
     * nacos,nacos2,zookeeper,consul,eureka
     */
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

    public static final String SERIALIZED_NAME_ZK_SERVICES_PATH = V1McpBridge.REGISTRY_TYPE_ZK_SERVICES_PATH;
    @SerializedName(SERIALIZED_NAME_ZK_SERVICES_PATH)
    private List<String> zkServicesPath;

    public static final String SERIALIZED_NAME_NACOS_NAMESPACE_ID = V1McpBridge.REGISTRY_TYPE_NACOS_NAMESPACE_ID;
    @SerializedName(SERIALIZED_NAME_NACOS_NAMESPACE_ID)
    private String nacosNamespaceId;

    public static final String SERIALIZED_NAME_NACOS_GROUPS = V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS;
    @SerializedName(SERIALIZED_NAME_NACOS_GROUPS)
    private List<String> nacosGroups;

    public static final String SERIALIZED_NAME_CONSUL_DATA_CENTER = V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER;
    @SerializedName(SERIALIZED_NAME_CONSUL_DATA_CENTER)
    private String consulDataCenter;

    public static final String SERIALIZED_NAME_CONSUL_SERVICE_TAG = V1McpBridge.REGISTRY_TYPE_CONSUL_SERVICE_TAG;
    @SerializedName(SERIALIZED_NAME_CONSUL_SERVICE_TAG)
    private String consulServiceTag;

    public static final String SERIALIZED_NAME_CONSUL_REFRESH_INTERVAL = V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL;
    @SerializedName(SERIALIZED_NAME_CONSUL_REFRESH_INTERVAL)
    private Integer consulRefreshInterval;

    public static final String SERIALIZED_NAME_AUTH_SECRET_NAME = "authSecretName";
    @SerializedName(SERIALIZED_NAME_AUTH_SECRET_NAME)
    private String authSecretName;
}
