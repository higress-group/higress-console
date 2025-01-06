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
package com.alibaba.higress.console.constant;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class UserConfigKey {

    private UserConfigKey() {}

    public static final String DEFAULT_ROUTE_INITIALIZED = "route.default.initialized";
    public static final String SYSTEM_INITIALIZED = "system.initialized";
    public static final String LOGIN_PAGE_PROMPT_KEY = "login.prompt";
    public static final String DASHBOARD_URL = "dashboard.url";
    public static final String DASHBOARD_URL_PREFIX = "dashboard.url.";
    public static final String DASHBOARD_BUILTIN = "dashboard.builtin";
    public static final String CHAT_ENABLED = "chat.enabled";
    public static final String ADMIN_PASSWORD_CHANGE_DISABLED = "admin.password-change.disabled";

    private static final Map<String, Class<?>> CONFIG_VALUE_TYPES = new HashMap<>();

    static {
        CONFIG_VALUE_TYPES.put(LOGIN_PAGE_PROMPT_KEY, String.class);
        CONFIG_VALUE_TYPES.put(DASHBOARD_URL, String.class);
        CONFIG_VALUE_TYPES.put(CHAT_ENABLED, Boolean.class);
        CONFIG_VALUE_TYPES.put(ADMIN_PASSWORD_CHANGE_DISABLED, Boolean.class);
        CONFIG_VALUE_TYPES.put(DASHBOARD_BUILTIN, Boolean.class);
        CONFIG_VALUE_TYPES.put(DEFAULT_ROUTE_INITIALIZED, Boolean.class);
        CONFIG_VALUE_TYPES.put(SYSTEM_INITIALIZED, Boolean.class);
    }

    public static Class<?> getConfigValueType(String key) {
        if (StringUtils.isEmpty(key)) {
            return null;
        }
        return CONFIG_VALUE_TYPES.get(key);
    }
}
