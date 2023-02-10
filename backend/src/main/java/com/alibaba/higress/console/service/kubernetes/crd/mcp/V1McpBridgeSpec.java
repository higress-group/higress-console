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
public class V1McpBridgeSpec {

    public static final String SERIALIZED_NAME_REGISTRIES = "registries";
    @SerializedName(SERIALIZED_NAME_REGISTRIES)
    private List<V1RegistryConfig> registries;

}
