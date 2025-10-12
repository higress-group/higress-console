package com.alibaba.higress.sdk.constant;

/**
 * 通用键常量类
 * 定义了系统中使用的通用键名常量
 */
public class CommonKey {

    /**
     * 协议关键字分隔符
     * 用于标识协议名称和内容的分隔符，通常为 "://"
     */
    public static final String PROTOCOL_KEYWORD = "://";

    /**
     * OCI协议前缀
     * 用于标识OCI（Open Container Initiative）协议，格式为 "oci://"
     */
    public static final String OCI_PROTOCOL = "oci" + PROTOCOL_KEYWORD;

    /**
     * MCP命名空间
     * 用于标识MCP（Multi-Cluster Platform）相关的命名空间
     */
    public static final String MCP_NAMESPACE = "mcp";

    /**
     * 通配符常量
     * 用于表示通配符匹配模式
     */
    public static final String WILDCARD = "wildcard";

    /**
     * 域名常量
     * 用于表示域名相关的标识
     */
    public static final String DOMAIN = "domain";

    /**
     * 域名前缀
     * 域名标识加上分隔符的前缀形式，用于构建域名相关的键名
     */
    public static final String DOMAIN_PREFIX = DOMAIN + Separators.DASH;

    /**
     * AI路由常量
     * 用于标识AI相关的路由配置
     */
    public static final String AI_ROUTE = "ai-route";

    /**
     * AI路由前缀
     * AI路由标识加上分隔符的前缀形式，用于构建AI路由相关的键名
     */
    public static final String AI_ROUTE_PREFIX = AI_ROUTE + Separators.DASH;

    /**
     * LLM服务名称前缀
     * 用于标识大语言模型（LLM）服务名称的前缀
     */
    public static final String LLM_SERVICE_NAME_PREFIX = "llm-";

    /**
     * MCP服务器路由前缀
     * 用于标识MCP服务器路由的前缀
     */
    public static final String MCP_SERVER_ROUTE_PREFIX = "mcp-server" + Separators.DASH;
}
