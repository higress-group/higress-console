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

import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginConfig;
import com.alibaba.higress.console.controller.dto.WasmPluginPageQuery;

/**
 * @author CH3CHO
 */
public interface WasmPluginService {

    PaginatedResult<WasmPlugin> list(WasmPluginPageQuery query);

    WasmPlugin query(String name, String language);

    WasmPluginConfig queryConfig(String name, String language);

    String queryReadme(String name, String language);

    WasmPlugin addCustom(WasmPlugin plugin);

    WasmPlugin updateCustom(WasmPlugin plugin);

    void deleteCustom(String name);
}
