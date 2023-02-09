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


import com.alibaba.higress.console.constant.KubernetesConstants;
import com.google.gson.annotations.SerializedName;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;


@Data
public class V1McpBridge implements  io.kubernetes.client.common.KubernetesObject {

    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion = KubernetesConstants.MCP_BRIDGE_VERSION;

    public static final String SERIALIZED_NAME_KIND = "kind";
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind = KubernetesConstants.MCP_BRIDGE_KIND;

    public static final String SERIALIZED_NAME_METADATA = "metadata";
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ObjectMeta metadata = null;

    public static final String SERIALIZED_NAME_SPEC = "spec";
    @SerializedName(SERIALIZED_NAME_SPEC)
    private V1McpBridgeSpec spec;

    @Override
    public V1ObjectMeta getMetadata() {
        return metadata;
    }

}
