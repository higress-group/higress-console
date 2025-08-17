/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class V1ProxyConfig {

    public static final String SERIALIZED_NAME_TYPE = "type";
    @SerializedName(SERIALIZED_NAME_TYPE)
    private String type;

    public static final String SERIALIZED_NAME_NAME = "name";
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;

    public static final String SERIALIZED_NAME_SERVER_ADDRESS = "serverAddress";
    @SerializedName(SERIALIZED_NAME_SERVER_ADDRESS)
    private String serverAddress;

    public static final String SERIALIZED_NAME_SERVER_PORT = "serverPort";
    @SerializedName(SERIALIZED_NAME_SERVER_PORT)
    private Integer serverPort;

    public static final String SERIALIZED_NAME_LISTENER_PORT = "listenerPort";
    @SerializedName(SERIALIZED_NAME_LISTENER_PORT)
    private Integer listenerPort;

    public static final String SERIALIZED_NAME_CONNECT_TIMEOUT = "connectTimeout";
    @SerializedName(SERIALIZED_NAME_CONNECT_TIMEOUT)
    private Integer connectTimeout;
}
