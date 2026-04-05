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

public final class JwtAuthConfig {

    private JwtAuthConfig() {}

    public static final String ALLOW = "allow";
    public static final String GLOBAL_AUTH = "global_auth";
    public static final String CONSUMERS = "consumers";
    public static final String CONSUMER_NAME = "name";
    public static final String ISSUER = "issuer";
    public static final String JWKS = "jwks";
    public static final String CLAIMS_TO_HEADERS = "claims_to_headers";
    public static final String FROM_HEADERS = "from_headers";
    public static final String FROM_PARAMS = "from_params";
    public static final String FROM_COOKIES = "from_cookies";
    public static final String CLOCK_SKEW_SECONDS = "clock_skew_seconds";
    public static final String KEEP_TOKEN = "keep_token";
}
