package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.model.DashboardInfo;
import com.alibaba.higress.console.model.DashboardType;
import com.alibaba.higress.console.service.DashboardService;
import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 仪表板控制器
 * 提供仪表板相关的API接口，包括初始化、获取信息、设置URL和获取配置数据等功能
 *
 * @author CH3CHO
 */
@RestController("DashboardController")
@RequestMapping("/dashboard")
@Validated
@Tag(name = "Dashboard APIs")
public class DashboardController {

    /**
     * 仪表板服务实例
     * 用于处理仪表板相关的业务逻辑
     */
    private DashboardService dashboardService;

    /**
     * 注入仪表板服务依赖
     *
     * @param dashboardService 仪表板服务实例
     */
    @Resource
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 初始化仪表板
     * 使用默认设置初始化仪表板，支持强制重新初始化
     *
     * @param force 是否强制重新初始化，如果为true则即使已初始化也会重新初始化
     * @return 初始化后的仪表板信息响应实体
     */
    @GetMapping("/init")
    @Operation(summary = "Initialize dashboards", description = "Initialize dashboards with default settings. ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard initialized successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<DashboardInfo>> init(
            @RequestParam(required = false) @Parameter(description = "If true, the dashboard will be re-initialized "
                + "even if it has been initialized before.") Boolean force) {
        // 调用服务层初始化仪表板
        dashboardService.initializeDashboard(Boolean.TRUE.equals(force));
        // 返回仪表板信息
        return info(null);
    }

    /**
     * 获取仪表板信息
     * 根据指定类型获取仪表板的详细信息
     *
     * @param type 仪表板类型(MAIN/AI/LOG)，默认为MAIN
     * @return 仪表板信息响应实体
     */
    @GetMapping("/info")
    @Operation(summary = "Get dashboard info")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard info retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<DashboardInfo>> info(@RequestParam(required = false) @Parameter(
        description = "Available types: MAIN/AI/LOG Default: MAIN") String type) {
        // 转换仪表板类型字符串为枚举值
        DashboardType dashboardType = toDashboardType(type);
        // 调用服务层获取仪表板信息并构建响应
        return ResponseEntity.ok(Response.success(dashboardService.getDashboardInfo(dashboardType)));
    }

    /**
     * 设置自定义仪表板URL
     * 当内置仪表板未安装时，可以设置自定义仪表板的URL
     *
     * @param type 仪表板类型(MAIN/AI/LOG)，默认为MAIN
     * @param dashboardInfo 包含仪表板URL信息的对象
     * @return 更新后的仪表板信息响应实体
     */
    @PutMapping("/info")
    @Operation(summary = "Set custom dashboard URL",
        description = "Set the URL of dashboard. Only works when the built-in dashboard is not installed.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard info updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<DashboardInfo>> setUrl(
        @RequestParam(required = false) @Parameter(
            description = "Available types: MAIN/AI/LOG Default: MAIN") String type,
        @RequestBody DashboardInfo dashboardInfo) {
        // 转换仪表板类型字符串为枚举值
        DashboardType dashboardType = toDashboardType(type);
        // 验证URL参数是否为空
        if (StringUtils.isEmpty(dashboardInfo.getUrl())) {
            throw new ValidationException("Missing required parameter: url");
        }
        // 调用服务层设置仪表板URL
        dashboardService.setDashboardUrl(dashboardType, dashboardInfo.getUrl());
        // 返回更新后的仪表板信息
        return info(dashboardType.toString());
    }

    /**
     * 获取Grafana仪表板配置数据
     * 根据数据源UID生成Grafana仪表板的配置数据
     *
     * @param type 仪表板类型(MAIN/AI/LOG)，默认为MAIN
     * @param dataSourceUid Grafana中为仪表板设置的数据源UID
     * @return 包含配置数据的响应实体
     */
    @GetMapping("/configData")
    @Operation(summary = "Get Grafana dashboard configuration",
        description = "Get the configuration data for Grafana dashboard. "
            + "The data source UID is required to generate the configuration.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard info updated successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<String>> getConfigData(
        @RequestParam(required = false) @Parameter(
            description = "Available types: MAIN/AI/LOG Default: MAIN") String type,
        @RequestParam @NotBlank @Parameter(
            description = "The UID of data source set in Grafana for the dashboard") String dataSourceUid) {
        // 转换仪表板类型字符串为枚举值
        DashboardType dashboardType = toDashboardType(type);
        // 调用服务层构建配置数据并构建响应
        return ResponseEntity.ok(Response.success(dashboardService.buildConfigData(dashboardType, dataSourceUid)));
    }

    /**
     * 将字符串转换为仪表板类型枚举
     *
     * @param type 仪表板类型字符串
     * @return 对应的仪表板类型枚举值
     * @throws ValidationException 当类型字符串无效时抛出异常
     */
    private static DashboardType toDashboardType(String type) {
        // 如果类型字符串为空，返回默认的MAIN类型
        if (StringUtils.isEmpty(type)) {
            return DashboardType.MAIN;
        }
        try {
            // 尝试将字符串转换为枚举值
            return DashboardType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 类型无效时抛出验证异常
            throw new ValidationException("Unknown dashboard type: " + type);
        }
    }
}
