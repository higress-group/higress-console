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

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.higress.console.model.DashboardInfo;
import com.alibaba.higress.console.model.DashboardType;

/**
 * @author CH3CHO
 */
public interface DashboardService {

    boolean isBuiltIn();

    @Deprecated
    DashboardInfo getDashboardInfo();

    DashboardInfo getDashboardInfo(DashboardType type);

    void initializeDashboard(boolean overwrite);

    @Deprecated
    void setDashboardUrl(String url);

    void setDashboardUrl(DashboardType type, String url);

    @Deprecated
    String buildConfigData(String dataSourceUid);

    String buildConfigData(DashboardType type, String dataSourceUid);

    void forwardDashboardRequest(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
