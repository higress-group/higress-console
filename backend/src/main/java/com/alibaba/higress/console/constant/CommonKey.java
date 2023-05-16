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

import java.nio.file.Paths;

public class CommonKey {

    public final static String CONFIG_KEY_PREFIX = "higress-console.";

    public final static String LIST_CONFIG_SEPARATOR = ";";

    public final static String PROTOCOL_KEYWORD = "://";

    public final static String OCI_PROTOCOL = "oci" + PROTOCOL_KEYWORD;

    public final static String MCP_NAMESPACE = "mcp";

    public final static String CONFIG_MAP_NAME_KEY = CONFIG_KEY_PREFIX + "config-map.name";

    public final static String CONFIG_MAP_NAME_KEY_DEFAULT = "higress-console";

    public final static String ADMIN_SECRET_NAME_KEY = CONFIG_KEY_PREFIX + "admin.secret";

    public final static String ADMIN_SECRET_NAME_DEFAULT = "higress-console";

    public final static String ADMIN_COOKIE_NAME_KEY = CONFIG_KEY_PREFIX + "admin.cookie.name";

    public final static String ADMIN_COOKIE_NAME_DEFAULT = "_hi_sess";

    public final static String ADMIN_COOKIE_MAX_AGE_KEY = CONFIG_KEY_PREFIX + "admin.cookie.max-age";

    public final static int ADMIN_COOKIE_MAX_AGE_DEFAULT = 30 * 24 * 60 * 60;

    public final static String ADMIN_CONFIG_TTL_KEY = CONFIG_KEY_PREFIX + "admin.config-ttl";

    public final static long ADMIN_CONFIG_TTL_DEFAULT = 60 * 1000;

    public final static String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";

    public final static String KUBE_CONFIG_DEFAULT_PATH =
        Paths.get(System.getProperty("user.home"), "/.kube/config").toString();

    public final static String NS_KEY = CONFIG_KEY_PREFIX + "ns";

    public final static String NS_DEFAULT = "higress-system";

    public final static String PROTECTED_NSES_KEY = CONFIG_KEY_PREFIX + "protected-ns-list";

    public final static String PROTECTED_NSES = "kube-system" + LIST_CONFIG_SEPARATOR + NS_DEFAULT;

    public final static String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";

    public final static String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";

    public final static String CONTROLLER_INGRESS_CLASS_NAME_KEY = CONFIG_KEY_PREFIX + "controller.ingress-class-name";

    public final static String CONTROLLER_INGRESS_CLASS_NAME_DEFAULT = "higress";

    public final static String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";

    public final static String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";

    public final static String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";

    public final static int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;

    public final static String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";

    public final static String DASHBOARD_OVERWRITE_WHEN_STARTUP_KEY = CONFIG_KEY_PREFIX + "dashboard.overwrite-when-startup";
    public final static boolean DASHBOARD_OVERWRITE_WHEN_STARTUP_DEFAULT = true;
    public final static String DASHBOARD_BASE_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.base-url";

    public final static String DASHBOARD_USERNAME_KEY = CONFIG_KEY_PREFIX + "dashboard.username";

    public final static String DASHBOARD_USERNAME_DEFAULT = "admin";

    public final static String DASHBOARD_PASSWORD_KEY = CONFIG_KEY_PREFIX + "dashboard.password";

    public final static String DASHBOARD_PASSWORD_DEFAULT = "admin";

    public final static String DASHBOARD_DATASOURCE_NAME_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.name";

    public final static String DASHBOARD_DATASOURCE_NAME_DEFAULT = "Prometheus";

    public final static String DASHBOARD_DATASOURCE_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.url";

    public final static String LOGIN_PAGE_PROMPT_KEY = CONFIG_KEY_PREFIX + "web.login.prompt";

    public final static String WILDCARD = "wildcard";

    public final static String DOMAIN = "domain";

    public final static String DASH = "-";

    public final static String ASTERISK = "*";

    public final static String DOMAIN_PREFIX = DOMAIN + DASH;

    public final static String COMMA = ",";

    public final static String EQUALS_SIGN = "=";

    public final static String NEW_LINE = "\n";

    public final static String SPACE = " ";

    public final static String UNDERSCORE = "_";

    public final static String COLON = ":";
}
