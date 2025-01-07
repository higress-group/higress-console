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
import io.kubernetes.client.openapi.models.V1ListMeta;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * GatewayClassList is a list of GatewayClass
 */
@Data
public class V1GatewayClassList implements io.kubernetes.client.common.KubernetesListObject {
    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    public static final String SERIALIZED_NAME_ITEMS = "items";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_METADATA = "metadata";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion;
    @SerializedName(SERIALIZED_NAME_ITEMS)
    private List<V1GatewayClass> items = new ArrayList<>();
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ListMeta metadata = null;


}

