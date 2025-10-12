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
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.RouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 路由管理控制器
 * 提供路由配置的增删改查等RESTful API接口
 */
@RestController("RoutesController")
@RequestMapping("/v1/routes")
@Validated
@Tag(name = "Route APIs")
public class RoutesController {

    // 注入路由服务层实例
    @Resource
    private RouteService routeService;

    /**
     * 获取路由列表
     *
     * @param query 路由分页查询参数
     * @return 路由分页结果响应
     */
    @GetMapping
    @Operation(summary = "List routes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Routes listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Route>> list(@ParameterObject RoutePageQuery query) {
        // 调用服务层获取路由列表并构建响应实体
        return ControllerUtil.buildResponseEntity(routeService.list(query));
    }

    /**
     * 根据名称查询路由
     *
     * @param routeName 路由名称
     * @return 路由详情响应
     */
    @GetMapping("/{name}")
    @Operation(summary = "Get route by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route found"),
        @ApiResponse(responseCode = "404", description = "Route not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Route>> query(@PathVariable("name") @NotBlank String routeName) {
        // 调用服务层根据名称查询路由并构建响应实体
        return ControllerUtil.buildResponseEntity(routeService.query(routeName));
    }

    /**
     * 添加新的路由
     *
     * @param route 路由对象
     * @return 添加成功的路由响应
     */
    @PostMapping
    @Operation(summary = "Add a new route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Route data is not valid"),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Route>> add(@RequestBody Route route) {
        // 检查路由名称是否为空
        if (StringUtils.isEmpty(route.getName())) {
            throw new ValidationException("Route name is required.");
        }
        // 禁止添加内部资源名称后缀的路由
        if (route.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Adding an internal route is not allowed.");
        }
        // 验证路由数据有效性
        route.validate();
        // 调用服务层添加路由并构建响应实体
        return ControllerUtil.buildResponseEntity(routeService.add(route));
    }

    /**
     * 更新已存在的路由
     *
     * @param routeName 路由名称（来自URL路径）
     * @param route 路由对象
     * @return 更新后的路由响应
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Route data is not valid or route name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Route>> update(@PathVariable("name") @NotBlank String routeName,
        @RequestBody Route route) {
        // 如果路由对象中没有设置名称，则使用URL中的名称
        if (StringUtils.isEmpty(route.getName())) {
            route.setName(routeName);
        }
        // 如果路由对象中的名称与URL中的名称不一致，则抛出验证异常
        else if (!StringUtils.equals(routeName, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        // 禁止更新内部资源名称后缀的路由
        if (route.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Updating an internal route is not allowed.");
        }
        // 验证路由数据有效性
        route.validate();
        // 调用服务层更新路由并构建响应实体
        return ControllerUtil.buildResponseEntity(routeService.update(route));
    }

    /**
     * 删除路由
     *
     * @param name 路由名称
     * @return 删除成功响应（无内容）
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Route deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Deleting an internal route is not allowed."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Route>> delete(@PathVariable("name") @NotBlank String name) {
        // 禁止删除内部资源名称后缀的路由
        if (name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Deleting an internal route is not allowed.");
        }
        // 调用服务层删除路由
        routeService.delete(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }
}
