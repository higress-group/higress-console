package com.alibaba.higress.sdk.constant;

import java.nio.file.Paths;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.util.EnvReadUtil;

/**
 * MCP（Multi-Cluster Platform）相关常量类
 * 定义了MCP服务器相关的路径配置和环境变量配置
 *
 * @author fuyang
 */
public class McpConstants {

    /**
     * MCP服务器路径前缀
     * 用于构建MCP服务器相关资源的URL路径前缀
     */
    public static final String MCP_SERVER_PATH_PRE = "/mcp-servers";

    /**
     * MCP临时文件目录
     * MCP相关操作使用的默认临时工作目录路径
     */
    public static final String DEFAULT_MCP_WORK_DIR = "/app/tools/mcp/";

    /**
     * OpenAPI转MCP服务器脚本路径
     * 用于将OpenAPI格式转换为MCP服务器格式的脚本文件路径
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH = "/app/tools/mcp/openapiToMcpserver.sh";

    /**
     * MCP工作目录配置键
     * 用于在配置文件中指定MCP工作目录的键名
     */
    public static final String MCP_WORK_DIR_KEY = "mcp.work.dir";

    /**
     * MCP工作目录环境变量键
     * 用于通过环境变量指定MCP工作目录的键名
     */
    public static final String MCP_WORK_DIR_ENV_KEY = "MCP_WORK_DIR";

    /**
     * OpenAPI转MCP服务器脚本路径配置键
     * 用于在配置文件中指定转换脚本路径的键名
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY = "openapi.to.mcpserver.script.path";

    /**
     * OpenAPI转MCP服务器脚本路径环境变量键
     * 用于通过环境变量指定转换脚本路径的键名
     */
    public static final String OPENAPI_TO_MCPSERVER_SCRIPT_PATH_ENV_KEY = "OPENAPI_TO_MCPSERVER_SCRIPT_PATH";

    /**
     * 获取MCP临时目录路径
     * 在MCP工作目录下创建temp子目录作为临时文件存储路径
     *
     * @return MCP临时目录的完整路径字符串
     */
    public static String getMcpTempDir() {
        return Paths.get(getMcpWorkDir(), "temp").toString();
    }

    /**
     * 获取MCP工作目录路径
     * 优先从环境变量或配置文件中读取自定义工作目录，如果未配置则使用默认目录
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

    /**
     * 获取OpenAPI转MCP服务器脚本路径
     * 优先从环境变量或配置文件中读取自定义脚本路径，如果未配置则使用默认路径
     *
     * @return OpenAPI转MCP服务器脚本的完整路径
     */
    public static String getOpenApiToMcpserverScriptPath() {
        // 从环境变量中加载自定义配置的脚本路径
        String path = EnvReadUtil.loadCustomConfFromEnv(OPENAPI_TO_MCPSERVER_SCRIPT_PATH_KEY,
            OPENAPI_TO_MCPSERVER_SCRIPT_PATH_ENV_KEY);
        // 如果未配置脚本路径，则使用默认脚本路径
        if (StringUtils.isBlank(path)) {
            path = OPENAPI_TO_MCPSERVER_SCRIPT_PATH;
        }
        return path;
    }
}
