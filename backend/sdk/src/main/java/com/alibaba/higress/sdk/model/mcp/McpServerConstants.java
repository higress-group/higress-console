package com.alibaba.higress.sdk.model.mcp;

/**
 * MCP服务器常量类
 * 定义了MCP服务器使用的各种常量，包括注解和标签常量
 */
public class McpServerConstants {
    /**
     * 注解常量内部类
     * 定义了MCP服务器使用的注解常量
     */
    public static final class Annotation {
        /**
         * 资源描述键
         * 用于标识资源描述的注解键
         */
        public static final String RESOURCE_DESCRIPTION_KEY = "higress.io/resource-description";
        
        /**
         * MCP服务器相关注解键
         * 以下常量参考自：https://github.com/alibaba/higress/pull/2207
         */
        /**
         * MCP服务器键
         * 用于标识MCP服务器的注解键
         */
        public static final String RESOURCE_MCP_SERVER_KEY = "higress.io/mcp-server";
        
        /**
         * MCP服务器匹配规则域名键
         * 用于标识MCP服务器匹配规则域名的注解键
         */
        public static final String RESOURCE_MCP_SERVER_MATCH_RULE_DOMAINS_KEY =
            "higress.io/mcp-server-match-rule-domains";
        
        /**
         * MCP服务器匹配规则类型键
         * 用于标识MCP服务器匹配规则类型的注解键
         */
        public static final String RESOURCE_MCP_SERVER_MATCH_RULE_TYPE_KEY = "higress.io/mcp-server-match-rule-type";
        
        /**
         * MCP服务器匹配规则值键
         * 用于标识MCP服务器匹配规则值的注解键
         */
        public static final String RESOURCE_MCP_SERVER_MATCH_RULE_VALUE_KEY = "higress.io/mcp-server-match-rule-value";
        
        /**
         * MCP服务器上游类型键
         * 用于标识MCP服务器上游类型的注解键
         */
        public static final String RESOURCE_MCP_SERVER_UPSTREAM_TYPE_KEY = "higress.io/mcp-server-upstream-type";
        
        /**
         * MCP服务器启用路径重写键
         * 用于标识MCP服务器是否启用路径重写的注解键
         */
        public static final String RESOURCE_MCP_SERVER_ENABLE_REWRITE_KEY = "higress.io/mcp-server-enable-path-rewrite";
        
        /**
         * MCP服务器路径重写前缀键
         * 用于标识MCP服务器路径重写前缀的注解键
         */
        public static final String RESOURCE_MCP_SERVER_PATH_REWRITE_KEY = "higress.io/mcp-server-path-rewrite-prefix";

    }

    /**
     * 标签常量内部类
     * 定义了MCP服务器使用的标签常量
     */
    public static final class Label {
        /**
         * MCP服务器业务类型值
         * 用于标识MCP服务器业务类型的标签值
         */
        public static final String MCP_SERVER_BIZ_TYPE_VALUE = "mcp-server";
        
        /**
         * MCP服务器类型键
         * 用于标识MCP服务器类型的标签键
         */
        public static final String RESOURCE_MCP_SERVER_TYPE_KEY = "higress.io/mcp-server-type";
    }

}
