/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
package com.alibaba.higress.sdk.constant.plugin;

/**
 * Built-in plugins whose configuration is automatically managed by dedicated
 * Console product features. Manually enabling such a plugin while the
 * corresponding product feature is in use can cause conflicts.
 */
public final class ProductCoveredPlugin {

    private ProductCoveredPlugin() {
    }

    /**
     * Plugin covered by the AI Route product feature.
     */
    public static final String AI_PROXY = "ai-proxy";

    /**
     * Plugin covered by the AI Route product feature.
     */
    public static final String MODEL_ROUTER = "model-router";

    /**
     * Plugin covered by the AI Route product feature.
     */
    public static final String MODEL_MAPPER = "model-mapper";

    /**
     * Plugin covered by the MCP Server product feature.
     */
    public static final String MCP_SERVER = "mcp-server";

    /**
     * Plugin covered by the Consumer product feature.
     */
    public static final String KEY_AUTH = "key-auth";
}
