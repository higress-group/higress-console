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
        public static final String TRUE_VALUE = "true";
        public static final String USE_REGEX_KEY = "higress.io/use-regex";
        public static final String DESTINATION = "higress.io/destination";
        public static final String SSL_REDIRECT_KEY = "higress.io/ssl-redirect";
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
