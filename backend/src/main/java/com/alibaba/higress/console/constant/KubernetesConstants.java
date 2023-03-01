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

public class KubernetesConstants {

    public static final String MCP_BRIDGE_API_GROUP = "networking.higress.io";
    public static final String MCP_BRIDGE_KIND = "McpBridge";
    public static final String MCP_BRIDGE_NAME_DEFAULT = "default";

    public static final String K8S_CERT = "cert";
    public static final String K8S_ENABLE_HTTPS = "enableHttps";

    public static final String TYPE_FIELD = "type";
    public static final String SECRET_TYPE_TLS = "kubernetes.io/tls";
    public static final String SECRET_TLS_CRT_FIELD = "tls.crt";
    public static final String SECRET_TLS_KEY_FIELD = "tls.key";

    public static class Annotation {
        public static final String KEY_PREFIX = "higress.io/";
        public static final String TRUE_VALUE = "true";
        public static final String USE_REGEX_KEY = "higress.io/use-regex";
        public static final String DESTINATION = "higress.io/destination";
        public static final String SSL_REDIRECT_KEY = "higress.io/ssl-redirect";
        public static final String REWRITE_TARGET_KEY = "higress.io/rewrite-target";
        public static final String UPSTREAM_VHOST_KEY = "higress.io/upstream-vhost";
        public static final String PROXY_NEXT_UPSTREAM_TRIES_KEY = "higress.io/proxy-next-upstream-tries";
        public static final String PROXY_NEXT_UPSTREAM_TIMEOUT_KEY = "higress.io/proxy-next-upstream-timeout";
        public static final String PROXY_NEXT_UPSTREAM_KEY = "higress.io/proxy-next-upstream";
        public static final String REQUEST_HEADER_CONTROL_ADD_KEY = "higress.io/request-header-control-add";
        public static final String REQUEST_HEADER_CONTROL_SET_KEY = "higress.io/request-header-control-set";
        public static final String REQUEST_HEADER_CONTROL_REMOVE_KEY = "higress.io/request-header-control-remove";
        public static final String RESPONSE_HEADER_CONTROL_ADD_KEY = "higress.io/response-header-control-add";
        public static final String RESPONSE_HEADER_CONTROL_SET_KEY = "higress.io/response-header-control-set";
        public static final String RESPONSE_HEADER_CONTROL_REMOVE_KEY = "higress.io/response-header-control-remove";
        public static final String ENABLE_CORS_KEY = "higress.io/enable-cors";
        public static final String CORS_ALLOW_ORIGIN_KEY = "higress.io/cors-allow-origin";
        public static final String CORS_ALLOW_METHODS_KEY = "higress.io/cors-allow-methods";
        public static final String CORS_ALLOW_HEADERS_KEY = "higress.io/cors-allow-headers";
        public static final String CORS_EXPOSE_HEADERS_KEY = "higress.io/cors-expose-headers";
        public static final String CORS_ALLOW_CREDENTIALS_KEY = "higress.io/cors-allow-credentials";
        public static final String CORS_MAX_AGE_KEY = "higress.io/cors-max-age";
        public static final String QUERY_MATCH_KEYWORD = "-match-query-";
        public static final String QUERY_MATCH_KEY_FORMAT = "higress.io/%s" + QUERY_MATCH_KEYWORD + "%s";
        public static final String HEADER_MATCH_KEYWORD = "-match-header-";
        public static final String HEADER_MATCH_KEY_FORMAT = "higress.io/%s" + HEADER_MATCH_KEYWORD + "%s";
        public static final String METHOD_KEY = "higress.io/match-method";

        public static final String IGNORE_PATH_CASE_KEY = "higress.io/ignore-path-case";
    }

    public static class Label {
        public static final String DOMAIN_KEY_PREFIX = "higress.io/domain_";
        public static final String DOMAIN_VALUE_DUMMY = "true";
        public static final String RESOURCE_DEFINER_KEY = "higress.io/resource-definer";
        public static final String RESOURCE_DEFINER_VALUE = "higress";
    }

    public static class IngressPathType {
        public static final String EXACT = "Exact";
        public static final String PREFIX = "Prefix";
        public static final String IMPLEMENTATION_SPECIFIC = "ImplementationSpecific";
    }
}
