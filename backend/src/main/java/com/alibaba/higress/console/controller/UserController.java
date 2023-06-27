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
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.ChangePasswordRequest;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.User;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.SessionService;
import com.alibaba.higress.console.service.SessionUserHelper;

/**
 * @author CH3CHO
 */
@RestController("UserController")
@RequestMapping("/user")
public class UserController {

    private SessionService sessionService;

    @Resource
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/info")
    public ResponseEntity<Response<User>> getUserInfo() {
        User user = SessionUserHelper.getCurrentUser();
        return ControllerUtil.buildResponseEntity(user);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> logout(@RequestBody ChangePasswordRequest request, HttpServletResponse response) {
        if (StringUtils.isEmpty(request.getOldPassword())) {
            throw new ValidationException("Missing old password.");
        }
        if (StringUtils.isEmpty(request.getNewPassword())) {
            throw new ValidationException("Missing new password.");
        }
        User user = SessionUserHelper.getCurrentUser();
        sessionService.changePassword(user.getName(), request.getOldPassword(), request.getNewPassword());
        sessionService.clearSession(response);
        return ControllerUtil.buildSuccessResponseEntity();
    }
}
