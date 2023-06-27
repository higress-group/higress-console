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

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.SystemInitRequest;
import com.alibaba.higress.console.controller.dto.User;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.ConfigService;
import com.alibaba.higress.console.service.SessionService;

/**
 * @author CH3CHO
 */
@RestController("SystemController")
@RequestMapping("/system")
@Validated
public class SystemController {

    private SessionService sessionService;
    private ConfigService configService;

    @Autowired
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Autowired
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    @PostMapping("/init")
    public ResponseEntity<?> initialize(@RequestBody SystemInitRequest request) {
        User adminUser = request.getAdminUser();
        if (adminUser == null) {
            throw new ValidationException("Missing adminUser.");
        }
        if (StringUtils.isAnyEmpty(adminUser.getName(), adminUser.getDisplayName(), adminUser.getPassword())) {
            throw new ValidationException("Incomplete adminUser object.");
        }
        sessionService.initializeAdmin(adminUser);

        Map<String, Object> configs = new HashMap<>();
        if (MapUtils.isNotEmpty(request.getConfigs())) {
            configs.putAll(request.getConfigs());
        }
        configs.put(UserConfigKey.SYSTEM_INITIALIZED, true);
        configService.setConfigs(configs);

        return ControllerUtil.buildSuccessResponseEntity();
    }

    @GetMapping("/config")
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
}
