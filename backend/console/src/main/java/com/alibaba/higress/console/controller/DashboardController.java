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
 * @author CH3CHO
 */
@RestController("DashboardController")
@RequestMapping("/dashboard")
@Validated
@Tag(name = "Dashboard APIs")
public class DashboardController {

    private DashboardService dashboardService;

    @Resource
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/init")
    @Operation(summary = "Initialize dashboards", description = "Initialize dashboards with default settings. ")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Dashboard initialized successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<DashboardInfo>>
        init(@RequestParam(required = false) @Parameter(description = "If true, the dashboard will be re-initialized "
            + "even if it has been initialized before.") Boolean force) {
        dashboardService.initializeDashboard(Boolean.TRUE.equals(force));
        return info(null);
    }

    @GetMapping("/info")
    @Operation(summary = "Get dashboard info")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Dashboard info retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<DashboardInfo>> info(@RequestParam(required = false) @Parameter(
        description = "Available types: MAIN/AI/LOG Default: MAIN") String type) {
        DashboardType dashboardType = toDashboardType(type);
        return ResponseEntity.ok(Response.success(dashboardService.getDashboardInfo(dashboardType)));
    }

    @PutMapping("/info")
    @Operation(summary = "Set custom dashboard URL",
        description = "Set the URL of dashboard. Only works when the built-in dashboard is not installed.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Dashboard info updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<DashboardInfo>> setUrl(
        @RequestParam(required = false) @Parameter(
            description = "Available types: MAIN/AI/LOG Default: MAIN") String type,
        @RequestBody DashboardInfo dashboardInfo) {
        DashboardType dashboardType = toDashboardType(type);
        if (StringUtils.isEmpty(dashboardInfo.getUrl())) {
            throw new ValidationException("Missing required parameter: url");
        }
        dashboardService.setDashboardUrl(dashboardType, dashboardInfo.getUrl());
        return info(dashboardType.toString());
    }

    @GetMapping("/configData")
    @Operation(summary = "Get Grafana dashboard configuration",
        description = "Get the configuration data for Grafana dashboard. "
            + "The data source UID is required to generate the configuration.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Dashboard info updated successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> getConfigData(
        @RequestParam(required = false) @Parameter(
            description = "Available types: MAIN/AI/LOG Default: MAIN") String type,
        @RequestParam @NotBlank @Parameter(
            description = "The UID of data source set in Grafana for the dashboard") String dataSourceUid) {
        DashboardType dashboardType = toDashboardType(type);
        return ResponseEntity.ok(Response.success(dashboardService.buildConfigData(dashboardType, dataSourceUid)));
    }

    private static DashboardType toDashboardType(String type) {
        if (StringUtils.isEmpty(type)) {
            return DashboardType.MAIN;
        }
        try {
            return DashboardType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Unknown dashboard type: " + type);
        }
    }
}
