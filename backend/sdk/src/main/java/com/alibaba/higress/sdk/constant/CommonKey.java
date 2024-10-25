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

public class CommonKey {

    public static final String PROTOCOL_KEYWORD = "://";

    public static final String OCI_PROTOCOL = "oci" + PROTOCOL_KEYWORD;

    public static final String MCP_NAMESPACE = "mcp";

    public static final String WILDCARD = "wildcard";

    public static final String DOMAIN = "domain";

    public static final String DOMAIN_PREFIX = DOMAIN + Separators.DASH;

    public static final String AI_ROUTE = "ai-route";

    public static final String AI_ROUTE_PREFIX = AI_ROUTE + Separators.DASH;
}
