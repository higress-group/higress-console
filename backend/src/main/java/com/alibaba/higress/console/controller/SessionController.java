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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.LoginRequest;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.User;
import com.alibaba.higress.console.controller.exception.AuthException;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.SessionService;

/**
 * @author CH3CHO
 */
@RestController("SessionController")
@RequestMapping("/session")
public class SessionController {

    private SessionService sessionService;

    @Resource
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/login")
    public ResponseEntity<Response<User>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        if (StringUtils.isEmpty(request.getUsername()) || StringUtils.isEmpty(request.getPassword())) {
            throw new ValidationException("Missing user name or password.");
        }

        User user = sessionService.login(request.getUsername(), request.getPassword());
        if (user == null) {
            throw new AuthException("Incorrect username or password");
        }
        sessionService.saveSession(response, user, Boolean.TRUE.equals(request.getAutoLogin()));
        return ControllerUtil.buildResponseEntity(user);
    }

    @GetMapping("/check")
    public ResponseEntity<Response<User>> check(HttpServletRequest request) {
        User user = sessionService.validateSession(request);
        if (user == null) {
            throw new AuthException("No valid session is found.");
        }
        return ControllerUtil.buildResponseEntity(user);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        sessionService.clearSession(response);
        return ResponseEntity.ok().build();
    }
}
