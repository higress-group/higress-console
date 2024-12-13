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

import com.alibaba.higress.console.controller.dto.DashboardInfo;
import com.alibaba.higress.console.controller.dto.DashboardType;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.service.DashboardService;
import com.alibaba.higress.sdk.exception.ValidationException;

/**
 * @author CH3CHO
 */
@RestController("DashboardController")
@RequestMapping("/dashboard")
@Validated
public class DashboardController {

    private DashboardService dashboardService;

    @Resource
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/init")
    public ResponseEntity<Response<DashboardInfo>> init(@RequestParam(required = false) Boolean force) {
        dashboardService.initializeDashboard(Boolean.TRUE.equals(force));
        return info(null);
    }

    @GetMapping("/info")
    public ResponseEntity<Response<DashboardInfo>> info(@RequestParam(required = false) String type) {
        DashboardType dashboardType = toDashboardType(type);
        return ResponseEntity.ok(Response.success(dashboardService.getDashboardInfo(dashboardType)));
    }

    @PutMapping("/info")
    public ResponseEntity<Response<DashboardInfo>> setUrl(@RequestParam(required = false) String type,
        @RequestBody DashboardInfo dashboardInfo) {
        DashboardType dashboardType = toDashboardType(type);
        if (StringUtils.isEmpty(dashboardInfo.getUrl())) {
            throw new ValidationException("Missing required parameter: url");
        }
        dashboardService.setDashboardUrl(dashboardType, dashboardInfo.getUrl());
        return info(dashboardType.toString());
    }

    @GetMapping("/configData")
    public ResponseEntity<Response<String>> getConfigData(@RequestParam(required = false) String type,
        @RequestParam @NotBlank String dataSourceUid) {
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
