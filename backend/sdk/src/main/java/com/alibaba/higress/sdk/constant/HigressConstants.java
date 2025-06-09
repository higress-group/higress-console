/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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

import java.util.Set;

import com.google.common.collect.Sets;

public class HigressConstants {
    public static final String NS_DEFAULT = "higress-system";
    public static final String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";
    public static final String CONTROLLER_INGRESS_CLASS_NAME_DEFAULT = "higress";
    public static final String NGINX_INGRESS_CLASS_NAME = "nginx";
    public static final String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";
    public static final int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;
    public static final String CONTROLLER_JWT_POLICY_DEFAULT = KubernetesConstants.JwtPolicy.THIRD_PARTY_JWT;
    public static final String DEFAULT_DOMAIN = "higress-default-domain";
    public static final String INTERNAL_RESOURCE_NAME_SUFFIX = ".internal";
    public static final String FALLBACK_ROUTE_NAME_SUFFIX = ".fallback";
    public static final String FALLBACK_FROM_HEADER = "x-higress-fallback-from";
    public static final String MODEL_ROUTING_HEADER = "x-higress-llm-model";
    public static final String INTERNAL_RESOURCE_COMMENT =
        "PLEASE DO NOT EDIT DIRECTLY. This resource is managed by Higress.";
    public static final Set<String> VALID_FALLBACK_RESPONSE_CODES = Sets.newHashSet("4xx", "5xx");
    public static final Boolean SERVICE_LIST_SUPPORT_REGISTRY_DEFAULT = Boolean.TRUE;
    public static final String CLUSTER_DOMAIN_SUFFIX_DEFAULT = "cluster.local";
}
