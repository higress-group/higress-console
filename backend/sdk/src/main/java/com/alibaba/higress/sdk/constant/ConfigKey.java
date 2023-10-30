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
package com.alibaba.higress.sdk.constant;

import java.nio.file.Paths;

public class ConfigKey {
    public static final String KUBE_CONFIG_DEFAULT_PATH =
            Paths.get(System.getProperty("user.home"), "/.kube/config").toString();
    public static final String NS_DEFAULT = "higress-system";
    public static final String PROTECTED_NSES = "kube-system" + Separators.LIST_CONFIG_SEPARATOR + NS_DEFAULT;
    public static final String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";
    public static final String CONTROLLER_INGRESS_CLASS_NAME_DEFAULT = "higress";
    public static final String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";
    public static final int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;
    public static final String CONTROLLER_JWT_POLICY_DEFAULT = KubernetesConstants.JwtPolicy.THIRD_PARTY_JWT;
    private static final String CONFIG_KEY_PREFIX = "higress-console.";
    public static final String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";
    public static final String CONTROLLER_JWT_POLICY_KEY = CONFIG_KEY_PREFIX + "controller.jwt-policy";
    public static final String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";
    public static final String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";
    public static final String CONTROLLER_INGRESS_CLASS_NAME_KEY = CONFIG_KEY_PREFIX + "controller.ingress-class-name";
    public static final String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";
    public static final String PROTECTED_NSES_KEY = CONFIG_KEY_PREFIX + "protected-ns-list";
    public static final String NS_KEY = CONFIG_KEY_PREFIX + "ns";
    public static final String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";
}
