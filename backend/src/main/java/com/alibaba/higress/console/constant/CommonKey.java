/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.higress.console.constant;

import java.nio.file.Paths;

public class CommonKey {

    public final static String CONFIG_KEY_PREFIX = "higress-console.";

    public final static String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";

    public final static String KUBE_CONFIG_DEFAULT_PATH =
        Paths.get(System.getProperty("user.home"), "/.kube/config").toString();

    public final static String NS_KEY = CONFIG_KEY_PREFIX + "ns";

    public final static String NS_DEFAULT = "higress-system";

    public final static String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";

    public final static String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";

    public final static String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";

    public final static String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";

    public final static String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";

    public final static int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;

    public final static String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";

    public final static String WILDCARD = "wildcard";

    public final static String DOMAIN = "domain";

    public final static String DASH = "-";

    public final static String ASTERISK = "*";

    public final static String DOMAIN_PREFIX = DOMAIN + DASH;

    public final static String COMMA = ",";

    public final static String EQUALS_SIGN = "=";

}
