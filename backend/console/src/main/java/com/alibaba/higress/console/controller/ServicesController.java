package com.alibaba.higress.console.controller;

import javax.annotation.Resource;

import org.springdoc.api.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.Service;
import com.alibaba.higress.sdk.service.ServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 服务管理控制器
 * 提供服务发现和管理的RESTful API接口
 */
@RestController("ServicesController")
@RequestMapping("/v1/services")
@Validated
@Tag(name = "Service APIs")
public class ServicesController {

    // 注入服务服务层实例，用于处理服务相关的业务逻辑
    @Resource
    private ServiceService serviceService;

    /**
     * 获取服务列表
     *
     * @param query 通用分页查询参数，包含分页和排序信息
     * @return 服务分页结果响应，包含服务列表和分页信息
     */
    @GetMapping
    @Operation(summary = "List services")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Services listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Service>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务层获取服务列表，并使用ControllerUtil工具类构建标准响应实体
        return ControllerUtil.buildResponseEntity(serviceService.list(query));
    }
}
