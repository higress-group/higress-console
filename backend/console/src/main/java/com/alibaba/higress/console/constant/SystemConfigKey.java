package com.alibaba.higress.console.constant;

/**
 * 定义 Higress 控制台系统的配置键常量类。
 * 该类集中管理所有与系统运行相关的配置项名称及默认值。
 */
public class SystemConfigKey {

    /**
     * 配置键前缀，用于区分不同模块或组件的配置。
     */
    private static final String CONFIG_KEY_PREFIX = "higress-console.";

    // ==================== 构建信息相关配置 ====================

    /** 版本号配置键 */
    public static final String VERSION_KEY = CONFIG_KEY_PREFIX + "build.version";

    /** 是否是开发构建版本的配置键 */
    public static final String DEV_BUILD_KEY = CONFIG_KEY_PREFIX + "build.dev";

    /** 开发构建版本的默认值 */
    public static final boolean DEV_BUILD_DEFAULT = true;

    // ==================== Kubernetes 相关配置 ====================

    /** 命名空间配置键 */
    public static final String NS_KEY = CONFIG_KEY_PREFIX + "ns";

    /** Kubernetes 配置文件路径配置键 */
    public static final String KUBE_CONFIG_KEY = CONFIG_KEY_PREFIX + "kube-config";

    // ==================== 控制器访问配置 ====================

    /** 控制器访问令牌配置键 */
    public static final String CONTROLLER_ACCESS_TOKEN_KEY = CONFIG_KEY_PREFIX + "controller.access-token";

    /** JWT 策略配置键 */
    public static final String CONTROLLER_JWT_POLICY_KEY = CONFIG_KEY_PREFIX + "controller.jwt-policy";

    /** 控制器服务端口配置键 */
    public static final String CONTROLLER_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "controller.service.port";

    /** 控制器服务主机地址配置键 */
    public static final String CONTROLLER_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "controller.service.host";

    /** 控制器监听命名空间配置键 */
    public static final String CONTROLLER_WATCHED_NAMESPACE_KEY = CONFIG_KEY_PREFIX + "controller.watched-namespace";

    /** Ingress 类型名称配置键 */
    public static final String CONTROLLER_INGRESS_CLASS_NAME_KEY = CONFIG_KEY_PREFIX + "controller.ingress-class-name";

    /** 控制器服务名称配置键 */
    public static final String CONTROLLER_SERVICE_NAME_KEY = CONFIG_KEY_PREFIX + "controller.service.name";

    // ==================== 控制台服务配置 ====================

    /** 控制台服务主机地址配置键 */
    public static final String CONSOLE_SERVICE_HOST_KEY = CONFIG_KEY_PREFIX + "service.host";

    /** 默认控制台服务主机地址 */
    public static final String DEFAULT_CONSOLE_SERVICE_HOST = "higress-console.higress-system.svc.cluster.local";

    /** 控制台服务端口配置键 */
    public static final String CONSOLE_SERVICE_PORT_KEY = CONFIG_KEY_PREFIX + "service.port";

    /** 默认控制台服务端口号 */
    public static final int DEFAULT_CONSOLE_SERVICE_PORT = 8080;

    // ==================== ConfigMap 和 Secret 配置 ====================

    /** ConfigMap 名称配置键 */
    public static final String CONFIG_MAP_NAME_KEY = CONFIG_KEY_PREFIX + "config-map.name";

    /** 默认 ConfigMap 名称 */
    public static final String CONFIG_MAP_NAME_KEY_DEFAULT = "higress-console";

    /** Secret 名称配置键 */
    public static final String SECRET_NAME_KEY = CONFIG_KEY_PREFIX + "secret.name";

    /** 默认 Secret 名称 */
    public static final String SECRET_NAME_DEFAULT = "higress-console";

    // ==================== 管理员会话 Cookie 配置 ====================

    /** 管理员 Cookie 名称配置键 */
    public static final String ADMIN_COOKIE_NAME_KEY = CONFIG_KEY_PREFIX + "admin.cookie.name";

    /** 默认管理员 Cookie 名称 */
    public static final String ADMIN_COOKIE_NAME_DEFAULT = "_hi_sess";

    /** 管理员 Cookie 最大存活时间（秒）配置键 */
    public static final String ADMIN_COOKIE_MAX_AGE_KEY = CONFIG_KEY_PREFIX + "admin.cookie.max-age";

    /** 默认管理员 Cookie 最大存活时间为30天 */
    public static final int ADMIN_COOKIE_MAX_AGE_DEFAULT = 30 * 24 * 60 * 60;

    /** 管理员配置缓存超时时间（毫秒）配置键 */
    public static final String ADMIN_CONFIG_TTL_KEY = CONFIG_KEY_PREFIX + "admin.config-ttl";

    /** 默认管理员配置缓存超时时间为10秒 */
    public static final long ADMIN_CONFIG_TTL_DEFAULT = 10 * 1000;

    // ==================== Dashboard 配置 ====================

    /** 启动时是否覆盖已有仪表盘配置的标志配置键 */
    public static final String DASHBOARD_OVERWRITE_WHEN_STARTUP_KEY =
            CONFIG_KEY_PREFIX + "dashboard.overwrite-when-startup";

    /** 启动时覆盖仪表盘配置的默认值 */
    public static final boolean DASHBOARD_OVERWRITE_WHEN_STARTUP_DEFAULT = true;

    /** 仪表盘基础 URL 配置键 */
    public static final String DASHBOARD_BASE_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.base-url";

    /** 仪表盘登录用户名配置键 */
    public static final String DASHBOARD_USERNAME_KEY = CONFIG_KEY_PREFIX + "dashboard.username";

    /** 仪表盘默认登录用户名 */
    public static final String DASHBOARD_USERNAME_DEFAULT = "admin";

    /** 仪表盘登录密码配置键 */
    public static final String DASHBOARD_PASSWORD_KEY = CONFIG_KEY_PREFIX + "dashboard.password";

    /** 仪表盘默认登录密码 */
    public static final String DASHBOARD_PASSWORD_DEFAULT = "admin";

    // ==================== 数据源配置 ====================

    /** Prometheus 数据源名称配置键 */
    public static final String DASHBOARD_DATASOURCE_PROM_NAME_KEY =
            CONFIG_KEY_PREFIX + "dashboard.datasource.prom.name";

    /** 默认 Prometheus 数据源名称 */
    public static final String DASHBOARD_DATASOURCE_PROM_NAME_DEFAULT = "Prometheus";

    /** Prometheus 数据源 URL 配置键 */
    public static final String DASHBOARD_DATASOURCE_PROM_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.prom.url";

    /** Loki 数据源名称配置键 */
    public static final String DASHBOARD_DATASOURCE_LOKI_NAME_KEY =
            CONFIG_KEY_PREFIX + "dashboard.datasource.loki.name";

    /** 默认 Loki 数据源名称 */
    public static final String DASHBOARD_DATASOURCE_LOKI_NAME_DEFAULT = "Loki";

    /** Loki 数据源 URL 配置键 */
    public static final String DASHBOARD_DATASOURCE_LOKI_URL_KEY = CONFIG_KEY_PREFIX + "dashboard.datasource.loki.url";

    // ==================== 代理连接超时设置 ====================

    /** 仪表盘代理连接超时时间（秒）配置键 */
    public static final String DASHBOARD_PROXY_CONNECTION_TIMEOUT_KEY =
            CONFIG_KEY_PREFIX + "dashboard.proxy.connection-timeout";

    /** 默认仪表盘代理连接超时时间为1200秒 */
    public static final int DASHBOARD_PROXY_CONNECTION_TIMEOUT_DEFAULT = 1200;

    /** 仪表盘代理 Socket 超时时间（毫秒）配置键 */
    public static final String DASHBOARD_PROXY_SOCKET_TIMEOUT_KEY =
            CONFIG_KEY_PREFIX + "dashboard.proxy.socket-timeout";

    /** 默认仪表盘代理 Socket 超时时间为2分钟 */
    public static final int DASHBOARD_PROXY_SOCKET_TIMEOUT_DEFAULT = 2 * 60 * 1000;

    // ==================== AI 代理服务配置 ====================

    /** AI 代理服务 URL 配置键 */
    public static final String AI_PROXY_SERVICE_URL_KEY = CONFIG_KEY_PREFIX + "ai-proxy.service.url";

    /** AI 代理服务 Token 配置键 */
    public static final String AI_PROXY_SERVICE_TOKEN_KEY = CONFIG_KEY_PREFIX + "ai-proxy.service.token";

    /** AI 代理连接超时时间（秒）配置键 */
    public static final String AI_PROXY_CONNECTION_TIMEOUT_KEY = CONFIG_KEY_PREFIX + "ai-proxy.connection-timeout";

    /** 默认 AI 代理连接超时时间为1200秒 */
    public static final int AI_PROXY_CONNECTION_TIMEOUT_DEFAULT = 1200;

    /** AI 代理 Socket 超时时间（毫秒）配置键 */
    public static final String AI_PROXY_SOCKET_TIMEOUT_KEY = CONFIG_KEY_PREFIX + "ai-proxy.socket-timeout";

    /** 默认 AI 代理 Socket 超时时间为2分钟 */
    public static final int AI_PROXY_SOCKET_TIMEOUT_DEFAULT = 2 * 60 * 1000;

    // ==================== 集群域名后缀 ====================

    /** 集群域名后缀环境变量名 */
    public static final String CLUSTER_DOMAIN_SUFFIX = "CLUSTER_DOMAIN_SUFFIX";
}
