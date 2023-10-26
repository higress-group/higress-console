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
package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginConfig;
import com.alibaba.higress.sdk.model.WasmPluginPageQuery;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.service.WasmPluginService;

/**
 * @author CH3CHO
 */
@RestController("WasmPluginsController ")
@RequestMapping("/v1/wasm-plugins")
@Validated
public class WasmPluginsController {

    private WasmPluginService wasmPluginService;

    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<WasmPlugin>> list(WasmPluginPageQuery query) {
        PaginatedResult<WasmPlugin> plugins = wasmPluginService.list(query);
        return ControllerUtil.buildResponseEntity(plugins);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<WasmPlugin>> query(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        WasmPlugin plugin = wasmPluginService.query(name, lang);
        return ControllerUtil.buildResponseEntity(plugin);
    }

    @PostMapping
    public ResponseEntity<Response<WasmPlugin>> add(@RequestBody WasmPlugin plugin) {
        plugin.validate();
        WasmPlugin newPlugin = wasmPluginService.addCustom(plugin);
        return ControllerUtil.buildResponseEntity(newPlugin);
    }

    @PutMapping(value = "/{name}")
    public ResponseEntity<Response<WasmPlugin>> update(@PathVariable("name") @NotBlank String name,
        @RequestBody WasmPlugin plugin) {
        if (StringUtils.isEmpty(plugin.getName())) {
            plugin.setName(name);
        } else if (!StringUtils.equals(name, plugin.getName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        plugin.validate();
        WasmPlugin updatedPlugin = wasmPluginService.updateCustom(plugin);
        return ControllerUtil.buildResponseEntity(updatedPlugin);
    }

    @DeleteMapping(value = "/{name}")
    public ResponseEntity<Response<WasmPluginConfig>> delete(@PathVariable("name") @NotBlank String name) {
        wasmPluginService.deleteCustom(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{name}/config")
    public ResponseEntity<Response<WasmPluginConfig>> queryConfig(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        WasmPluginConfig config = wasmPluginService.queryConfig(name, lang);
        return ControllerUtil.buildResponseEntity(config);
    }

    @GetMapping(value = "/{name}/readme")
    public ResponseEntity<Response<String>> queryReadme(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        String readme = wasmPluginService.queryReadme(name, lang);
        return ControllerUtil.buildResponseEntity(readme);
    }
}
