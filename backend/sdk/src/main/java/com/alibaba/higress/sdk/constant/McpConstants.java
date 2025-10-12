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

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.util.EnvReadUtil;

/**
 * @author fuyang
 */
public class McpConstants {
    public static final String MCP_SERVER_PATH_PRE = "/mcp-servers";


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
    public static final String MCP_WORK_DIR_ENV_KEY = "MCP_WORK_DIR";

    /**
     * openapi to mcpserver script path key
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY = "openapi.to.mcpserver.script.path";
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH_ENV_KEY = "OPENAPI_TO_MCPSERVER_SCRIPT_PATH";

    public static String getMcpTempDir() {
        return Paths.get(getMcpWorkDir(), "temp").toString();
    }

        /**
     * 获取MCP工作目录路径
     *
     * @return 返回MCP工作目录路径，如果环境变量中未配置则返回默认工作目录
     */
    public static String getMcpWorkDir() {
        // 从环境变量中加载自定义配置的工作目录
        String workDir = EnvReadUtil.loadCustomConfFromEnv(MCP_WORK_DIR_KEY, MCP_WORK_DIR_ENV_KEY);
        // 如果未配置工作目录，则使用默认工作目录
        if (StringUtils.isBlank(workDir)) {
            workDir = DEFAULT_MCP_WORK_DIR;
        }
        return workDir;
    }


    public static String getOpenApiToMcpserverScriptPath() {
        String path = EnvReadUtil.loadCustomConfFromEnv(OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY,
            OPENAPI_TO_MCPSERVER_SCRIPT_PATH_ENV_KEY);
        if (StringUtils.isBlank(path)) {
            path = OPENAPI_TO_MCPSERVER_SCRIPT_PATH;
        }
        return path;
    }

}
