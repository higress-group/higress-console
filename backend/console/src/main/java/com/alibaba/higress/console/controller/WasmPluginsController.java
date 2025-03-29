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
import org.springdoc.api.annotations.ParameterObject;
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
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginConfig;
import com.alibaba.higress.sdk.model.WasmPluginPageQuery;
import com.alibaba.higress.sdk.service.WasmPluginService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author CH3CHO
 */
@RestController("WasmPluginsController ")
@RequestMapping("/v1/wasm-plugins")
@Validated
@Tag(name = "Wasm Plugin APIs")
public class WasmPluginsController {

    private WasmPluginService wasmPluginService;

    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    @GetMapping
    @Operation(summary = "List Wasm plugins")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugins listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPlugin>> list(@ParameterObject WasmPluginPageQuery query) {
        PaginatedResult<WasmPlugin> plugins = wasmPluginService.list(query);
        return ControllerUtil.buildResponseEntity(plugins);
    }

    @GetMapping(value = "/{name}")
    @Operation(summary = "Get Wasm plugin by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugin found"),
        @ApiResponse(responseCode = "404", description = "Plugin not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> query(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) @Parameter(description = "Available languages: zh-CN/en-US") String lang) {
        WasmPlugin plugin = wasmPluginService.query(name, lang);
        return ControllerUtil.buildResponseEntity(plugin);
    }

    @PostMapping
    @Operation(summary = "Add a new plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Plugin data is not valid"),
        @ApiResponse(responseCode = "409", description = "Plugin already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> add(@RequestBody WasmPlugin plugin) {
        plugin.validate();
        WasmPlugin newPlugin = wasmPluginService.addCustom(plugin);
        return ControllerUtil.buildResponseEntity(newPlugin);
    }

    @PutMapping(value = "/{name}")
    @Operation(summary = "Update an existed plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugin updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Plugin data is not valid or plugin name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Plugin already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> update(@PathVariable("name") @NotBlank String name,
        @RequestBody WasmPlugin plugin) {
        if (StringUtils.isEmpty(plugin.getName())) {
            plugin.setName(name);
        } else if (!StringUtils.equals(name, plugin.getName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        plugin.validate();
        WasmPlugin updatedPlugin = Boolean.TRUE.equals(plugin.getBuiltIn()) ? wasmPluginService.updateBuiltIn(plugin)
            : wasmPluginService.updateCustom(plugin);
        return ControllerUtil.buildResponseEntity(updatedPlugin);
    }

    @DeleteMapping(value = "/{name}")
    @Operation(summary = "Delete a custom plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Plugin deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginConfig>> delete(@PathVariable("name") @NotBlank String name) {
        wasmPluginService.deleteCustom(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{name}/config")
    @Operation(summary = "Get configuration schema by plugin name")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "200", description = "Configuration schema retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Plugin not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginConfig>> queryConfig(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        WasmPluginConfig config = wasmPluginService.queryConfig(name, lang);
        return ControllerUtil.buildResponseEntity(config);
    }

    @GetMapping(value = "/{name}/readme")
    @Operation(summary = "Get readme document by plugin name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Readme document retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Plugin not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> queryReadme(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        String readme = wasmPluginService.queryReadme(name, lang);
        return ControllerUtil.buildResponseEntity(readme);
    }
}
