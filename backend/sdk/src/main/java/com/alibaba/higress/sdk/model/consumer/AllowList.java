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
package com.alibaba.higress.sdk.model.consumer;

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowList {

    private Map<WasmPluginInstanceScope, String> targets;
    private List<String> consumerNames;

    public AllowList(WasmPluginInstanceScope scope, String target) {
        this(scope, target, null);
    }

    public AllowList(WasmPluginInstanceScope scope, String target, List<String> consumerNames) {
        this(Map.of(scope, target), consumerNames);
    }
}
