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
package com.alibaba.higress.console.service.kubernetes.crd.wasm;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.annotations.SerializedName;

import io.kubernetes.client.openapi.models.V1ListMeta;
import lombok.Data;

@Data
public class V1alpha1WasmPluginList implements io.kubernetes.client.common.KubernetesListObject {

    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion;

    public static final String SERIALIZED_NAME_ITEMS = "items";
    @SerializedName(SERIALIZED_NAME_ITEMS)
    private List<V1alpha1WasmPlugin> items = new ArrayList<>();

    public static final String SERIALIZED_NAME_KIND = "kind";
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;

    public static final String SERIALIZED_NAME_METADATA = "metadata";
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ListMeta metadata = null;

    public V1alpha1WasmPluginList apiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
        return this;
    }

    public V1alpha1WasmPluginList kind(String kind) {
        this.kind = kind;
        return this;
    }

    public V1alpha1WasmPluginList items(List<V1alpha1WasmPlugin> items) {
        this.items = items;
        return this;
    }

    public V1alpha1WasmPluginList addItemsItem(V1alpha1WasmPlugin itemsItem) {
        this.items.add(itemsItem);
        return this;
    }
}
