package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.springdoc.api.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ProxyServer;
import com.alibaba.higress.sdk.service.ProxyServerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 代理服务器管理控制器
 * 提供代理服务器的增删改查等RESTful API接口
 */
@RestController("ProxyServerController")
@RequestMapping("/v1/proxy-servers")
@Tag(name = "Proxy Server APIs")
public class ProxyServerController {

    // 注入代理服务器服务层实例
    @Resource
    private ProxyServerService proxyServerService;

    /**
     * 获取代理服务器列表
     *
     * @param query 分页查询参数
     * @return 代理服务器分页结果响应
     */
    @GetMapping
    @Operation(summary = "List proxy servers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Proxy servers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<ProxyServer>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务层获取代理服务器列表
        PaginatedResult<ProxyServer> result = proxyServerService.list(query);
        // 使用工具类构建响应实体
        return ControllerUtil.buildResponseEntity(result);
    }

    /**
     * 添加新的代理服务器
     *
     * @param proxyServer 代理服务器对象
     * @return 添加成功的代理服务器响应
     */
    @PostMapping
    @Operation(summary = "Add a new proxy server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Proxy server added successfully"),
        @ApiResponse(responseCode = "400", description = "Proxy server data is not valid"),
        @ApiResponse(responseCode = "409", description = "Proxy server already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<ProxyServer>> add(@RequestBody ProxyServer proxyServer) {
        // 验证代理服务器数据有效性
        if (!proxyServer.isValid()) {
            throw new ValidationException("proxyServer body is not valid.");
        }
        // 禁止添加内部资源名称后缀的代理服务器
        if (proxyServer.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Adding an internal proxy server is not allowed.");
        }
        // 调用服务层添加代理服务器
        ProxyServer finalProxyServer = proxyServerService.add(proxyServer);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(finalProxyServer);
    }

    /**
     * 更新已存在的代理服务器
     *
     * @param name 代理服务器名称
     * @param proxyServer 代理服务器对象
     * @return 更新后的代理服务器响应
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed proxy server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Proxy server updated successfully"),
        @ApiResponse(responseCode = "400", description = "Proxy server data is not valid"),
        @ApiResponse(responseCode = "409", description = "Proxy server trying to add already existed"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<ProxyServer>> addOrUpdate(
            @PathVariable("name") @NotBlank String name,
            @RequestBody ProxyServer proxyServer) {
        // 设置代理服务器名称
        proxyServer.setName(name);
        // 验证代理服务器数据有效性
        if (!proxyServer.isValid()) {
            throw new ValidationException("proxyServer body is not valid.");
        }
        // 禁止更新内部资源名称后缀的代理服务器
        if (proxyServer.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Updating an internal proxy server is not allowed.");
        }
        // 调用服务层添加或更新代理服务器
        ProxyServer finalProxyServer = proxyServerService.addOrUpdate(proxyServer);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(finalProxyServer);
    }

    /**
     * 删除代理服务器
     *
     * @param name 代理服务器名称
     * @return 删除成功响应（无内容）
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a proxy server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Proxy server deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Deleting an internal proxy server is not allowed."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<ProxyServer>> delete(@PathVariable("name") @NotBlank String name) {
        // 禁止删除内部资源名称后缀的代理服务器
        if (name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Deleting an internal proxy server is not allowed.");
        }
        // 调用服务层删除代理服务器
        proxyServerService.delete(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }

    /**
     * 根据名称查询代理服务器
     *
     * @param name 代理服务器名称
     * @return 代理服务器详情响应
     */
    @GetMapping("/{name}")
    @Operation(summary = "Get proxy server by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Proxy server found"),
        @ApiResponse(responseCode = "404", description = "Proxy server not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<ProxyServer>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务层根据名称查询代理服务器
        ProxyServer server = proxyServerService.query(name);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(server);
    }
}
