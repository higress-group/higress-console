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
package com.alibaba.higress.sdk.constant.plugin.config;

public class AiProxyConfig {

    public static final String ACTIVE_PROVIDER_ID = "activeProviderId";

    public static final String PROVIDERS = "providers";
    public static final String PROVIDER_ID = "id";
    public static final String PROVIDER_TYPE = "type";
    public static final String PROVIDER_API_TOKENS = "apiTokens";

    public static final String PROTOCOL = "protocol";

    public static final String FAILOVER = "failover";
    public static final String FAILOVER_ENABLED = "enabled";
    public static final String FAILOVER_FAILURE_THRESHOLD = "failureThreshold";
    public static final String FAILOVER_SUCCESS_THRESHOLD = "successThreshold";
    public static final String FAILOVER_HEALTH_CHECK_INTERVAL = "healthCheckInterval";
    public static final String FAILOVER_HEALTH_CHECK_TIMEOUT = "healthCheckTimeout";
    public static final String FAILOVER_HEALTH_CHECK_MODEL = "healthCheckModel";
}