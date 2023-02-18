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

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.DashboardInfo;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.service.DashboardService;

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
    public ResponseEntity<Response<DashboardInfo>> init() {
        dashboardService.initializeDashboard();
        return info();
    }

    @GetMapping("/info")
    public ResponseEntity<Response<DashboardInfo>> info() {
        return ResponseEntity.ok(Response.success(dashboardService.getDashboardInfo()));
    }
}
