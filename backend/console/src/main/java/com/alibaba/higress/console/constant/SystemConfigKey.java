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

public class SystemConfigKey {

    private static final String CONFIG_KEY_PREFIX = "higress-console.";

    public static final String VERSION_KEY = CONFIG_KEY_PREFIX + "build.version";

    public static final String DEV_BUILD_KEY = CONFIG_KEY_PREFIX + "build.dev";

    public static final boolean DEV_BUILD_DEFAULT = true;

    public static final String NS_KEY = CONFIG_KEY_PREFIX + "ns";

    public static final String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";

    public static final String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";

    public static final String CONTROLLER_JWT_POLICY_KEY = CONFIG_KEY_PREFIX + "controller.jwt-policy";

    public static final String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";

    public static final String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";

    public static final String CONTROLLER_INGRESS_CLASS_NAME_KEY = CONFIG_KEY_PREFIX + "controller.ingress-class-name";

    public static final String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";

    public static final String CONFIG_MAP_NAME_KEY = CONFIG_KEY_PREFIX + "config-map.name";

    public static final String CONFIG_MAP_NAME_KEY_DEFAULT = "higress-console";

    public static final String ADMIN_SECRET_NAME_KEY = CONFIG_KEY_PREFIX + "admin.secret";

    public static final String ADMIN_SECRET_NAME_DEFAULT = "higress-console";

    public static final String ADMIN_COOKIE_NAME_KEY = CONFIG_KEY_PREFIX + "admin.cookie.name";

    public static final String ADMIN_COOKIE_NAME_DEFAULT = "_hi_sess";

    public static final String ADMIN_COOKIE_MAX_AGE_KEY = CONFIG_KEY_PREFIX + "admin.cookie.max-age";

    public static final int ADMIN_COOKIE_MAX_AGE_DEFAULT = 30 * 24 * 60 * 60;

    public static final String ADMIN_CONFIG_TTL_KEY = CONFIG_KEY_PREFIX + "admin.config-ttl";

    public static final long ADMIN_CONFIG_TTL_DEFAULT = 10 * 1000;

    public static final String DASHBOARD_OVERWRITE_WHEN_STARTUP_KEY =
        CONFIG_KEY_PREFIX + "dashboard.overwrite-when-startup";
    public static final boolean DASHBOARD_OVERWRITE_WHEN_STARTUP_DEFAULT = true;
    public static final String DASHBOARD_BASE_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.base-url";

    public static final String DASHBOARD_USERNAME_KEY = CONFIG_KEY_PREFIX + "dashboard.username";

    public static final String DASHBOARD_USERNAME_DEFAULT = "admin";

    public static final String DASHBOARD_PASSWORD_KEY = CONFIG_KEY_PREFIX + "dashboard.password";

    public static final String DASHBOARD_PASSWORD_DEFAULT = "admin";

    public static final String DASHBOARD_DATASOURCE_NAME_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.name";

    public static final String DASHBOARD_DATASOURCE_NAME_DEFAULT = "Prometheus";

    public static final String DASHBOARD_DATASOURCE_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.url";

    public static final String DASHBOARD_PROXY_CONNECTION_TIMEOUT_KEY =
        CONFIG_KEY_PREFIX + "dashboard.proxy.connection-timeout";

    public static final int DASHBOARD_PROXY_CONNECTION_TIMEOUT_DEFAULT = 1200;

    public static final String DASHBOARD_PROXY_SOCKET_TIMEOUT_KEY =
        CONFIG_KEY_PREFIX + "dashboard.proxy.socket-timeout";

    public static final int DASHBOARD_PROXY_SOCKET_TIMEOUT_DEFAULT = 2 * 60 * 1000;
}
