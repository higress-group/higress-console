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
package com.alibaba.higress.sdk.model.mcp;

/**
 * @author lvshui
 */
public class McpServerConstants {
    public static final class Annotation {
        public static final String RESOURCE_DESCRIPTION_KEY = "higress.io/resource-description";
    }

    public static final class Label {
        public static final String RESOURCE_BIZ_TYPE_KEY = "higress.io/biz-type";
        public static final String RESOURCE_MCP_SERVER_TYPE_KEY = "higress.io/mcp-server-type";
    }

}
