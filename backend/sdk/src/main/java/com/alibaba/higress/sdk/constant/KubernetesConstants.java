package com.alibaba.higress.sdk.constant;

/**
 * Kubernetes相关常量类
 * 定义了与Kubernetes资源操作相关的常量配置
 */
public class KubernetesConstants {

    /**
     * Kubernetes系统命名空间
     * 用于标识Kubernetes系统级别的命名空间
     */
    public static final String KUBE_SYSTEM_NS = "kube-system";

    /**
     * 证书注解键
     * 用于标识TLS证书相关的注解
     */
    public static final String K8S_CERT = "cert";

    /**
     * 启用HTTPS注解键
     * 用于控制是否启用HTTPS的注解
     */
    public static final String K8S_ENABLE_HTTPS = "enableHttps";

    /**
     * 数据字段名
     * Kubernetes资源中数据字段的标准名称
     */
    public static final String DATA_FIELD = "data";

    /**
     * 类型字段名
     * Kubernetes资源中类型字段的标准名称
     */
    public static final String TYPE_FIELD = "type";

    /**
     * TLS密钥类型
     * Kubernetes Secret资源中TLS密钥的标准类型
     */
    public static final String SECRET_TYPE_TLS = "kubernetes.io/tls";

    /**
     * TLS证书字段名
     * TLS Secret中证书数据的字段名
     */
    public static final String SECRET_TLS_CRT_FIELD = "tls.crt";

    /**
     * TLS私钥字段名
     * TLS Secret中私钥数据的字段名
     */
    public static final String SECRET_TLS_KEY_FIELD = "tls.key";

    /**
     * YAML分隔符
     * 用于分隔多个YAML文档的分隔符
     */
    public static final String YAML_SEPARATOR = "---\n";

    /**
     * Higress配置名称
     * Higress主配置资源的名称
     */
    public static final String HIGRESS_CONFIG = "higress-config";

    /**
     * 注解常量内部类
     * 定义了Higress使用的Kubernetes注解相关常量
     */
    public static class Annotation {
        /**
         * Higress注解键前缀
         * 所有Higress自定义注解的统一前缀
         */
        public static final String KEY_PREFIX = "higress.io/";

        /**
         * Nginx Ingress注解键前缀
         * 兼容Nginx Ingress Controller的注解前缀
         */
        public static final String NGINX_INGRESS_KEY_PREFIX = "nginx.ingress.kubernetes.io/";

        /**
         * 禁用注解额外前缀
         * 用于标识被禁用功能的注解前缀
         */
        public static final String DISABLED_KEY_EXTRA_PREFIX = "disabled.";

        /**
         * 布尔值true的字符串表示
         * 注解中表示开启状态的标准值
         */
        public static final String TRUE_VALUE = "true";

        /**
         * 使用正则表达式注解键
         * 控制路径匹配是否使用正则表达式的注解
         */
        public static final String USE_REGEX_KEY = "higress.io/use-regex";

        /**
         * 目标服务注解键
         * 指定请求目标服务的注解
         */
        public static final String DESTINATION_KEY = "higress.io/destination";

        /**
         * SSL重定向注解键
         * 控制HTTP到HTTPS重定向的注解
         */
        public static final String SSL_REDIRECT_KEY = "higress.io/ssl-redirect";

        /**
         * 重写启用注解键
         * 控制是否启用路径重写的注解
         */
        public static final String REWRITE_ENABLED_KEY = "higress.io/enable-rewrite";

        /**
         * 重写路径注解键
         * 指定重写后路径的注解
         */
        public static final String REWRITE_PATH_KEY = "higress.io/rewrite-path";

        /**
         * 上游虚拟主机注解键
         * 设置上游服务虚拟主机名的注解
         */
        public static final String UPSTREAM_VHOST_KEY = "higress.io/upstream-vhost";

        /**
         * 下一上游代理启用注解键
         * 控制是否启用下一上游代理功能的注解
         */
        public static final String PROXY_NEXT_UPSTREAM_ENABLED_KEY = "higress.io/enable-proxy-next-upstream";

        /**
         * 下一上游代理尝试次数注解键
         * 设置下一上游代理尝试次数的注解
         */
        public static final String PROXY_NEXT_UPSTREAM_TRIES_KEY = "higress.io/proxy-next-upstream-tries";

        /**
         * 下一上游代理超时注解键
         * 设置下一上游代理超时时间的注解
         */
        public static final String PROXY_NEXT_UPSTREAM_TIMEOUT_KEY = "higress.io/proxy-next-upstream-timeout";

        /**
         * 下一上游代理策略注解键
         * 设置下一上游代理策略的注解
         */
        public static final String PROXY_NEXT_UPSTREAM_KEY = "higress.io/proxy-next-upstream";

        /**
         * 头部控制启用注解键
         * 控制是否启用HTTP头部控制功能的注解
         */
        public static final String HEADER_CONTROL_ENABLED_KEY = "higress.io/enable-header-control";

        /**
         * 请求头部添加控制注解键
         * 控制添加请求头部的注解
         */
        public static final String REQUEST_HEADER_CONTROL_ADD_KEY = "higress.io/request-header-control-add";

        /**
         * 请求头部更新控制注解键
         * 控制更新请求头部的注解
         */
        public static final String REQUEST_HEADER_CONTROL_UPDATE_KEY = "higress.io/request-header-control-update";

        /**
         * 请求头部移除控制注解键
         * 控制移除请求头部的注解
         */
        public static final String REQUEST_HEADER_CONTROL_REMOVE_KEY = "higress.io/request-header-control-remove";

        /**
         * 响应头部添加控制注解键
         * 控制添加响应头部的注解
         */
        public static final String RESPONSE_HEADER_CONTROL_ADD_KEY = "higress.io/response-header-control-add";

        /**
         * 响应头部更新控制注解键
         * 控制更新响应头部的注解
         */
        public static final String RESPONSE_HEADER_CONTROL_UPDATE_KEY = "higress.io/response-header-control-update";

        /**
         * 响应头部移除控制注解键
         * 控制移除响应头部的注解
         */
        public static final String RESPONSE_HEADER_CONTROL_REMOVE_KEY = "higress.io/response-header-control-remove";

        /**
         * CORS启用注解键
         * 控制是否启用跨域资源共享的注解
         */
        public static final String CORS_ENABLED_KEY = "higress.io/enable-cors";

        /**
         * CORS允许来源注解键
         * 设置CORS允许的请求来源的注解
         */
        public static final String CORS_ALLOW_ORIGIN_KEY = "higress.io/cors-allow-origin";

        /**
         * CORS允许方法注解键
         * 设置CORS允许的HTTP方法的注解
         */
        public static final String CORS_ALLOW_METHODS_KEY = "higress.io/cors-allow-methods";

        /**
         * CORS允许头部注解键
         * 设置CORS允许的请求头部的注解
         */
        public static final String CORS_ALLOW_HEADERS_KEY = "higress.io/cors-allow-headers";

        /**
         * CORS暴露头部注解键
         * 设置CORS暴露给客户端的响应头部的注解
         */
        public static final String CORS_EXPOSE_HEADERS_KEY = "higress.io/cors-expose-headers";

        /**
         * CORS允许凭证注解键
         * 控制CORS是否允许携带凭证的注解
         */
        public static final String CORS_ALLOW_CREDENTIALS_KEY = "higress.io/cors-allow-credentials";

        /**
         * CORS最大年龄注解键
         * 设置CORS预检请求缓存时间的注解
         */
        public static final String CORS_MAX_AGE_KEY = "higress.io/cors-max-age";

        /**
         * 查询参数匹配关键字
         * 用于构建查询参数匹配注解键的关键字
         */
        public static final String QUERY_MATCH_KEYWORD = "-match-query-";

        /**
         * 查询参数匹配注解键格式
         * 查询参数匹配注解键的格式化字符串
         */
        public static final String QUERY_MATCH_KEY_FORMAT = "higress.io/%s" + QUERY_MATCH_KEYWORD + "%s";

        /**
         * 头部匹配关键字
         * 用于构建HTTP头部匹配注解键的关键字
         */
        public static final String HEADER_MATCH_KEYWORD = "-match-header-";

        /**
         * 头部匹配注解键格式
         * HTTP头部匹配注解键的格式化字符串
         */
        public static final String HEADER_MATCH_KEY_FORMAT = "higress.io/%s" + HEADER_MATCH_KEYWORD + "%s";

        /**
         * 伪头部匹配关键字
         * 用于构建伪头部匹配注解键的关键字
         */
        public static final String PSEUDO_HEADER_MATCH_KEYWORD = "-match-pseudo-header-";

        /**
         * 伪头部匹配注解键格式
         * 伪头部匹配注解键的格式化字符串
         */
        public static final String PSEUDO_HEADER_MATCH_KEY_FORMAT =
            "higress.io/%s" + PSEUDO_HEADER_MATCH_KEYWORD + "%s";

        /**
         * 方法匹配注解键
         * 设置HTTP方法匹配规则的注解
         */
        public static final String METHOD_KEY = "higress.io/match-method";

        /**
         * 忽略路径大小写注解键
         * 控制路径匹配是否忽略大小写的注解
         */
        public static final String IGNORE_PATH_CASE_KEY = "higress.io/ignore-path-case";

        /**
         * WASM插件标题注解键
         * 存储WASM插件标题信息的注解
         */
        public static final String WASM_PLUGIN_TITLE_KEY = "higress.io/wasm-plugin-title";

        /**
         * WASM插件描述注解键
         * 存储WASM插件描述信息的注解
         */
        public static final String WASM_PLUGIN_DESCRIPTION_KEY = "higress.io/wasm-plugin-description";

        /**
         * WASM插件图标注解键
         * 存储WASM插件图标信息的注解
         */
        public static final String WASM_PLUGIN_ICON_KEY = "higress.io/wasm-plugin-icon";

        /**
         * 注释注解键
         * 存储资源注释信息的注解
         */
        public static final String COMMENT_KEY = "higress.io/comment";
    }

    /**
     * 标签常量内部类
     * 定义了Higress使用的Kubernetes标签相关常量
     */
    public static class Label {
        /**
         * 域名标签键前缀
         * 域名相关标签的统一前缀
         */
        public static final String DOMAIN_KEY_PREFIX = "higress.io/domain_";

        /**
         * 域名标签值占位符
         * 域名标签的默认值
         */
        public static final String DOMAIN_VALUE_DUMMY = "true";

        /**
         * 配置映射类型标签键
         * 标识ConfigMap资源类型的标签
         */
        public static final String CONFIG_MAP_TYPE_KEY = "higress.io/config-map-type";

        /**
         * 域名配置映射类型标签值
         * 标识域名类型ConfigMap的标签值
         */
        public static final String CONFIG_MAP_TYPE_VALUE_DOMAIN = "domain";

        /**
         * AI路由配置映射类型标签值
         * 标识AI路由类型ConfigMap的标签值
         */
        public static final String CONFIG_MAP_TYPE_VALUE_AI_ROUTE = "ai-route";

        /**
         * 资源定义者标签键
         * 标识资源创建者的标签
         */
        public static final String RESOURCE_DEFINER_KEY = "higress.io/resource-definer";

        /**
         * 内部资源标签键
         * 标识内部资源的标签
         */
        public static final String INTERNAL_KEY = "higress.io/internal";

        /**
         * 资源定义者标签值
         * Higress作为资源定义者的标签值
         */
        public static final String RESOURCE_DEFINER_VALUE = "higress";

        /**
         * WASM插件名称标签键
         * 标识WASM插件名称的标签
         */
        public static final String WASM_PLUGIN_NAME_KEY = "higress.io/wasm-plugin-name";

        /**
         * WASM插件版本标签键
         * 标识WASM插件版本的标签
         */
        public static final String WASM_PLUGIN_VERSION_KEY = "higress.io/wasm-plugin-version";

        /**
         * WASM插件内置标签键
         * 标识WASM插件是否为内置插件的标签
         */
        public static final String WASM_PLUGIN_BUILT_IN_KEY = "higress.io/wasm-plugin-built-in";

        /**
         * WASM插件分类标签键
         * 标识WASM插件分类的标签
         */
        public static final String WASM_PLUGIN_CATEGORY_KEY = "higress.io/wasm-plugin-category";

        /**
         * 资源业务类型标签键
         * 标识资源业务类型的标签
         */
        public static final String RESOURCE_BIZ_TYPE_KEY = "higress.io/biz-type";
    }

    /**
     * Ingress路径类型常量内部类
     * 定义了Kubernetes Ingress路径匹配类型常量
     */
    public static class IngressPathType {
        /**
         * 精确匹配类型
         * 路径必须完全匹配
         */
        public static final String EXACT = "Exact";

        /**
         * 前缀匹配类型
         * 路径前缀匹配
         */
        public static final String PREFIX = "Prefix";

        /**
         * 实现特定匹配类型
         * 由具体实现决定匹配规则
         */
        public static final String IMPLEMENTATION_SPECIFIC = "ImplementationSpecific";
    }

    /**
     * JWT策略常量内部类
     * 定义了JWT认证策略相关常量
     */
    public static class JwtPolicy {
        /**
         * 第一方JWT策略
         * 使用第一方JWT认证
         */
        public static final String FIRST_PARTY_JWT = "first-party-jwt";

        /**
         * 第三方JWT策略
         * 使用第三方JWT认证
         */
        public static final String THIRD_PARTY_JWT = "third-party-jwt";
    }
}
