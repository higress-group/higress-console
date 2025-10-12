package com.alibaba.higress.sdk.constant.plugin;

/**
 * 内置插件名称常量类
 * 定义了Higress平台所有内置插件的名称常量，按功能类别进行分组
 */
public final class BuiltInPluginName {

    // AI相关插件
    /** AI提示装饰器插件 */
    public static final String AI_PROMPT_DECORATOR = "ai-prompt-decorator";

    /** AI提示模板插件 */
    public static final String AI_PROMPT_TEMPLATE = "ai-prompt-template";

    /** AI检索增强生成(RAG)插件 */
    public static final String AI_RAG = "ai-rag";

    /** AI安全防护插件 */
    public static final String AI_SECURITY_GUARD = "ai-security-guard";

    /** AI统计插件 */
    public static final String AI_STATISTICS = "ai-statistics";

    /** AI令牌限流插件 */
    public static final String AI_TOKEN_RATELIMIT = "ai-token-ratelimit";

    /** AI转换器插件 */
    public static final String AI_TRANSFORMER = "ai-transformer";

    /** AI缓存插件 */
    public static final String AI_CACHE = "ai-cache";

    /** AI代理插件 */
    public static final String AI_PROXY = "ai-proxy";

    /** AI历史记录插件 */
    public static final String AI_HISTORY = "ai-history";

    /** AI意图识别插件 */
    public static final String AI_INTENT = "ai-intent";

    /** AI配额管理插件 */
    public static final String AI_QUOTA = "ai-quota";

    /** AI代理插件 */
    public static final String AI_AGENT = "ai-agent";

    /** 模型路由插件 */
    public static final String MODEL_ROUTER = "model-router";

    /** 模型映射插件 */
    public static final String MODEL_MAPPER = "model-mapper";

    /** 默认MCP服务器插件 */
    public static final String DEFAULT_MCP_PLUGIN = "mcp-server";

    // 认证相关插件
    /** 基础认证插件 */
    public static final String BASIC_AUTH = "basic-auth";

    /** 密钥认证插件 */
    public static final String KEY_AUTH = "key-auth";

    /** OIDC认证插件 */
    public static final String OIDC = "oidc";

    /** JWT认证插件 */
    public static final String JWT_AUTH = "jwt-auth";

    /** HMAC认证插件 */
    public static final String HMAC_AUTH = "hmac-auth";

    /** 外部认证插件 */
    public static final String EXT_AUTH = "ext-auth";

    // 转换相关插件
    /** 自定义响应插件 */
    public static final String CUSTOM_RESPONSE = "custom-response";

    /** 数据转换器插件 */
    public static final String TRANSFORMER = "transformer";

    /** 缓存控制插件 */
    public static final String CACHE_CONTROL = "cache-control";

    /** GraphQL去封装插件 */
    public static final String DE_GRAPHQL = "de-graphql";

    /** 地理位置IP插件 */
    public static final String GEO_IP = "geo-ip";

    /** 前端灰度发布插件 */
    public static final String FRONTEND_GRAY = "frontend-gray";

    // 流量控制相关插件
    /** 请求拦截插件 */
    public static final String REQUEST_BLOCK = "request-block";

    /** 密钥限流插件 */
    public static final String KEY_RATE_LIMIT = "key-rate-limit";

    /** 集群密钥限流插件 */
    public static final String CLUSTER_KEY_RATE_LIMIT = "cluster-key-rate-limit";

    /** IP限制插件 */
    public static final String IP_RESTRICTION = "ip-restriction";

    /** 请求验证插件 */
    public static final String REQUEST_VALIDATION = "request-validation";

    // 安全相关插件
    /** 机器人检测插件 */
    public static final String BOT_DETECT = "bot-detect";

    /** Web应用防火墙插件 */
    public static final String WAF = "waf";

    /** 跨域资源共享插件 */
    public static final String CORS = "cors";
}
