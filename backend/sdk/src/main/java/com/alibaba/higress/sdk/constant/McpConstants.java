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

/**
 * @author fuyang
 */
public class McpConstants {

    /**
     * mcp temp file dir
     */
    public static final String DEFAULT_MCP_WORK_DIR = "/app/tools/mcp/";

    /**
     * mcp convert script path
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH = "/app/tools/mcp/openapiToMcpserver.sh";

    /**
     * mcp work dir key
     */
    public static final String MCP_WORK_DIR_KEY = "mcp.work.dir";

    /**
     * openapi to mcpserver script path key
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY = "openapi.to.mcpserver.script.path";

    public static String getMcpTempDir() {
        String workDir = System.getProperty(MCP_WORK_DIR_KEY, DEFAULT_MCP_WORK_DIR);
        return Paths.get(workDir, "temp").toString();
    }

    public static String getMcpWorkDir() {
        return System.getProperty(MCP_WORK_DIR_KEY, DEFAULT_MCP_WORK_DIR);
    }

    public static String getOpenApiToMcpserverScriptPath() {
        return System.getProperty(OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY, OPENAPI_TO_MCPSERVER_SCRIPT_PATH);
    }

}
