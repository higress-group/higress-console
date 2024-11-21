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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass;

import com.google.gson.annotations.SerializedName;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;


@Data
public class V1GatewayClass implements io.kubernetes.client.common.KubernetesObject {
    public static final String API_GROUP = "gateway.networking.k8s.io";
    public static final String VERSION = "v1";
    public static final String KIND = "GatewayClass";
    public static final String PLURAL = "gatewayclasses";
    public static final String DEFAULT_NAME = "higress-gateway";


    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_METADATA = "metadata";
    public static final String SERIALIZED_NAME_SPEC = "spec";
    public static final String SERIALIZED_NAME_STATUS = "status";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion = API_GROUP + "/" + VERSION;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind = KIND;
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ObjectMeta metadata = null;
    @SerializedName(SERIALIZED_NAME_SPEC)
    private V1GatewayClassSpec spec;
    @SerializedName(SERIALIZED_NAME_STATUS)
    private V1GatewayClassStatus status;

}

