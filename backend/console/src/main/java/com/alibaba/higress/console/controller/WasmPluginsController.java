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
 * WASM插件控制器，用于管理WASM插件的CRUD操作
 * 提供插件的增删改查、配置获取和文档查看等功能
 */
@RestController("WasmPluginsController ")
@RequestMapping("/v1/wasm-plugins")
@Validated
@Tag(name = "Wasm Plugin APIs")
public class WasmPluginsController {

    /**
     * WASM插件服务类，用于处理插件相关的业务逻辑
     */
    private WasmPluginService wasmPluginService;

    /**
     * 注入WASM插件服务
     * @param wasmPluginService WASM插件服务实例
     */
    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    /**
     * 获取WASM插件列表
     * @param query 插件分页查询参数
     * @return 分页的插件列表响应
     */
    @GetMapping
    @Operation(summary = "List Wasm plugins")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugins listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPlugin>> list(@ParameterObject WasmPluginPageQuery query) {
        // 调用服务获取插件列表
        PaginatedResult<WasmPlugin> plugins = wasmPluginService.list(query);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(plugins);
    }

    /**
     * 根据名称查询WASM插件
     * @param name 插件名称
     * @param lang 语言参数（可选，支持zh-CN/en-US）
     * @return 插件响应
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get Wasm plugin by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugin found"),
        @ApiResponse(responseCode = "404", description = "Plugin not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> query(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) @Parameter(description = "Available languages: zh-CN/en-US") String lang) {
        // 调用服务查询插件
        WasmPlugin plugin = wasmPluginService.query(name, lang);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(plugin);
    }

    /**
     * 添加新的自定义插件
     * @param plugin 插件对象
     * @return 添加后的插件响应
     */
    @PostMapping
    @Operation(summary = "Add a new plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Plugin data is not valid"),
        @ApiResponse(responseCode = "409", description = "Plugin already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> add(@RequestBody WasmPlugin plugin) {
        // 验证插件数据有效性
        plugin.validate();
        // 调用服务添加自定义插件
        WasmPlugin newPlugin = wasmPluginService.addCustom(plugin);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(newPlugin);
    }

    /**
     * 更新已存在的插件
     * @param name 插件名称（从URL路径获取）
     * @param plugin 插件对象
     * @return 更新后的插件响应
     */
    @PutMapping(value = "/{name}")
    @Operation(summary = "Update an existed plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Plugin updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Plugin data is not valid or plugin name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Plugin already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPlugin>> update(@PathVariable("name") @NotBlank String name,
        @RequestBody WasmPlugin plugin) {
        // 验证URL中的插件名称与请求体中的插件名称是否一致
        if (StringUtils.isEmpty(plugin.getName())) {
            plugin.setName(name);
        } else if (!StringUtils.equals(name, plugin.getName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        // 验证插件数据有效性
        plugin.validate();
        // 根据插件类型调用相应的更新方法
        WasmPlugin updatedPlugin = Boolean.TRUE.equals(plugin.getBuiltIn()) ? wasmPluginService.updateBuiltIn(plugin)
            : wasmPluginService.updateCustom(plugin);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(updatedPlugin);
    }

    /**
     * 删除自定义插件
     * @param name 插件名称
     * @return 删除响应
     */
    @DeleteMapping(value = "/{name}")
    @Operation(summary = "Delete a custom plugin")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Plugin deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginConfig>> delete(@PathVariable("name") @NotBlank String name) {
        // 调用服务删除自定义插件
        wasmPluginService.deleteCustom(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }

    /**
     * 根据插件名称获取配置模式
     * @param name 插件名称
     * @param lang 语言参数（可选）
     * @return 插件配置模式响应
     */
    @GetMapping(value = "/{name}/config")
    @Operation(summary = "Get configuration schema by plugin name")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "200", description = "Configuration schema retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Plugin not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginConfig>> queryConfig(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        // 调用服务查询插件配置
        WasmPluginConfig config = wasmPluginService.queryConfig(name, lang);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(config);
    }

    /**
     * 根据插件名称获取README文档
     * @param name 插件名称
     * @param lang 语言参数（可选）
     * @return 插件README文档响应
     */
    @GetMapping(value = "/{name}/readme")
    @Operation(summary = "Get readme document by plugin name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Readme document retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Plugin not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> queryReadme(@PathVariable("name") @NotBlank String name,
        @RequestParam(required = false) String lang) {
        // 调用服务查询插件README文档
        String readme = wasmPluginService.queryReadme(name, lang);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(readme);
    }
}
