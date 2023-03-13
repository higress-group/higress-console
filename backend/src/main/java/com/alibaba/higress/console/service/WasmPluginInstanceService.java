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
package com.alibaba.higress.console.service;

import java.util.List;

import com.alibaba.higress.console.controller.dto.WasmPluginInstance;
import com.alibaba.higress.console.controller.dto.WasmPluginInstanceScope;

public interface WasmPluginInstanceService {

    List<WasmPluginInstance> list(WasmPluginInstanceScope scope, String target);

    WasmPluginInstance query(WasmPluginInstanceScope scope, String target, String pluginName);

    WasmPluginInstance addOrUpdate(WasmPluginInstance instance);

    void delete(WasmPluginInstanceScope scope, String target, String pluginName);

    void deleteAll(WasmPluginInstanceScope scope, String target);
}
