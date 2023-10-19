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
package com.alibaba.higress.console.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.higress.console.controller.dto.User;

/**
 * @author CH3CHO
 */
public interface SessionService {

    boolean isAdminInitialized();

    void initializeAdmin(User user);

    User login(String username, String password);

    void saveSession(HttpServletResponse response, User user, boolean persistent);

    void clearSession(HttpServletResponse response);

    User validateSession(HttpServletRequest request);

    void changePassword(String username, String oldPassword, String newPassword);
}
