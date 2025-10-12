package com.alibaba.higress.console.controller.ai;

import javax.annotation.Resource;
import javax.validation.ValidationException;
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
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.service.ai.AiRouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * AI路由管理控制器，提供AI路由的增删改查功能
 */
@RestController("AiRoutesController")
@RequestMapping("/v1/ai/routes")
@Validated
@Tag(name = "AI Route APIs")
public class AiRoutesController {

    /**
     * AI路由服务接口，用于处理具体的业务逻辑
     */
    private AiRouteService aiRouteService;

    /**
     * 注入AI路由服务实例
     *
     * @param aiRouteService AI路由服务实例
     */
    @Resource
    public void setAiRouteService(AiRouteService aiRouteService) {
        this.aiRouteService = aiRouteService;
    }

    /**
     * 获取AI路由列表，支持分页查询
     *
     * @param query 分页查询参数
     * @return 包含AI路由列表的分页响应
     */
    @GetMapping
    @Operation(summary = "List AI routes")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Routes listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<AiRoute>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务层获取分页结果
        PaginatedResult<AiRoute> routes = aiRouteService.list(query);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(routes);
    }

    /**
     * 添加新的AI路由
     *
     * @param route 要添加的AI路由对象
     * @return 添加成功的AI路由响应
     */
    @PostMapping
    @Operation(summary = "Add a new AI route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Route data is not valid"),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<AiRoute>> add(@RequestBody AiRoute route) {
        // 验证路由数据的有效性
        route.validate();
        // 调用服务层添加路由
        AiRoute newRoute = aiRouteService.add(route);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(newRoute);
    }

    /**
     * 根据名称查询AI路由
     *
     * @param name 路由名称
     * @return 查询到的AI路由响应
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get AI route by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route found"),
        @ApiResponse(responseCode = "404", description = "Route not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<AiRoute>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务层查询路由
        AiRoute route = aiRouteService.query(name);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(route);
    }

    /**
     * 更新已存在的AI路由
     *
     * @param name 路由名称（来自路径变量）
     * @param route 要更新的路由对象
     * @return 更新后的AI路由响应
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed AI route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Route data is not valid or route name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<AiRoute>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody AiRoute route) {
        // 确保路由名称一致性
        if (StringUtils.isNotEmpty(route.getName())) {
            route.setName(name);
        } else if (!StringUtils.equals(name, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        // 验证路由数据的有效性
        route.validate();
        // 调用服务层更新路由
        AiRoute updatedRoute = aiRouteService.update(route);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(updatedRoute);
    }

    /**
     * 删除AI路由
     *
     * @param name 要删除的路由名称
     * @return 删除成功的响应（无内容）
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete an AI route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Route deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Deleting an internal route is not allowed."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<AiRoute>> delete(@PathVariable("name") @NotBlank String name) {
        // 调用服务层删除路由
        aiRouteService.delete(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }
}
