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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.aop.AllowAnonymous;
import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.SystemInitRequest;
import com.alibaba.higress.console.controller.dto.UpdateHigressConfigRequest;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.model.SystemInfo;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.service.ConfigService;
import com.alibaba.higress.console.service.SystemService;
import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author CH3CHO
 */
@RestController("SystemController")
@RequestMapping("/system")
@Validated
@Tag(name = "System APIs")
public class SystemController {

    private ConfigService configService;
    private SystemService systemService;

    @Autowired
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    @Autowired
    public void setSystemService(SystemService systemService) {
        this.systemService = systemService;
    }

    @AllowAnonymous
    @PostMapping("/init")
    @Operation(summary = "Initialize")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "System initialized successfully."),
            @ApiResponse(responseCode = "400", description = "Incomplete initialization data."),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<?> initialize(@RequestBody SystemInitRequest request) {
        User adminUser = request.getAdminUser();
        if (adminUser == null) {
            throw new ValidationException("Missing adminUser.");
        }
        if (StringUtils.isAnyEmpty(adminUser.getName(), adminUser.getDisplayName(), adminUser.getPassword())) {
            throw new ValidationException("Incomplete adminUser object.");
        }

        systemService.initSystem(adminUser, request.getConfigs());

        return ControllerUtil.buildSuccessResponseEntity();
    }

    @AllowAnonymous
    @GetMapping("/info")
    @Operation(summary = "Get system info")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "System info retrieved successfully."),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<SystemInfo> info() {
        SystemInfo info = systemService.getSystemInfo();
        return ResponseEntity.ok(info);
    }

    @AllowAnonymous
    @GetMapping("/config")
    @Operation(summary = "Get system configurations")
    @ApiResponses(
            value = {@ApiResponse(responseCode = "200", description = "System configurations retrieved successfully."),
                    @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Map<String, Object>>> getConfigs() {
        List<String> keys = configService.getConfigKeys();
        Map<String, Object> configs;
        if (CollectionUtils.isEmpty(keys)) {
            configs = Collections.emptyMap();
        } else {
            configs = new HashMap<>(keys.size());
            for (String key : keys) {
                Class<?> type = UserConfigKey.getConfigValueType(key);
                if (type == null) {
                    type = String.class;
                }
                Object value;
                if (type == Boolean.class) {
                    value = configService.getBoolean(key);
                } else if (type == Integer.class) {
                    value = configService.getInteger(key);
                } else if (type == Long.class) {
                    value = configService.getLong(key);
                } else {
                    value = configService.getString(key);
                }
                configs.put(key, value);
            }
        }
        return ResponseEntity.ok(Response.success(configs));
    }

    @GetMapping("/higress-config")
    @Operation(summary = "Get the content of higress-config ConfigMap")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "higress-config retrieved successfully."),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> getHigressConfig() {
        return ResponseEntity.ok(Response.success(systemService.getHigressConfig()));
    }

    @PutMapping("/higress-config")
    @Operation(summary = "Update the content of higress-config ConfigMap")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "higress-config updated successfully."),
            @ApiResponse(responseCode = "400", description = "Config data is not valid"),
            @ApiResponse(responseCode = "409", description = "Config data has been updated by someone else."),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> updateHigressConfig(@RequestBody UpdateHigressConfigRequest request) {
        String config = request.getConfig();
        if (StringUtils.isEmpty(config)) {
            throw new ValidationException("Missing required parameter: config");
        }
        String updatedConfig = systemService.setHigressConfig(config);
        return ResponseEntity.ok(Response.success(updatedConfig));
    }
}
