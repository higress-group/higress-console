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

public final class BuiltInPluginName {

    // AI
    public static final String AI_PROMPT_DECORATOR = "ai-prompt-decorator";
    public static final String AI_PROMPT_TEMPLATE = "ai-prompt-template";
    public static final String AI_RAG = "ai-rag";
    public static final String AI_SECURITY_GUARD = "ai-security-guard";
    public static final String AI_STATISTICS = "ai-statistics";
    public static final String AI_TOKEN_RATELIMIT = "ai-token-ratelimit";
    public static final String AI_TRANSFORMER = "ai-transformer";
    public static final String AI_CACHE = "ai-cache";
    public static final String AI_PROXY = "ai-proxy";
    public static final String AI_HISTORY = "ai-history";
    public static final String AI_INTENT = "ai-intent";
    public static final String AI_QUOTA = "ai-quota";
    public static final String AI_AGENT = "ai-agent";

    // Auth
    public static final String BASIC_AUTH = "basic-auth";
    public static final String KEY_AUTH = "key-auth";
    public static final String OIDC = "oidc";
    public static final String JWT_AUTH = "jwt-auth";
    public static final String HMAC_AUTH = "hmac-auth";
    public static final String EXT_AUTH = "ext-auth";

    // Transformation
    public static final String CUSTOM_RESPONSE = "custom-response";
    public static final String TRANSFORMER = "transformer";
    public static final String CACHE_CONTROL = "cache-control";
    public static final String DE_GRAPHQL = "de-graphql";
    public static final String GEO_IP = "geo-ip";
    public static final String FRONTEND_GRAY = "frontend-gray";

    // Traffic
    public static final String REQUEST_BLOCK = "request-block";
    public static final String KEY_RATE_LIMIT = "key-rate-limit";
    public static final String CLUSTER_KEY_RATE_LIMIT = "cluster-key-rate-limit";
    public static final String IP_RESTRICTION = "ip-restriction";
    public static final String REQUEST_VALIDATION = "request-validation";

    // Security
    public static final String BOT_DETECT = "bot-detect";
    public static final String WAF = "waf";
    public static final String CORS = "cors";
}
