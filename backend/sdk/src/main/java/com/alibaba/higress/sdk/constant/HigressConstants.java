package com.alibaba.higress.sdk.constant;

import java.util.Set;

import com.google.common.collect.Sets;

/**
 * Higress系统常量类
 * 定义了Higress平台使用的核心常量配置
 */
public class HigressConstants {

    /**
     * 默认命名空间
     * Higress控制器默认部署的Kubernetes命名空间
     */
    public static final String NS_DEFAULT = "higress-system";

    /**
     * 默认控制器服务名称
     * Higress控制器在Kubernetes中的服务名称
     */
    public static final String CONTROLLER_SERVICE_NAME_DEFAULT = "higress-controller";

    /**
     * 默认控制器Ingress类名称
     * 用于标识Higress控制器的IngressClass资源名称
     */
    public static final String CONTROLLER_INGRESS_CLASS_NAME_DEFAULT = "higress";

    /**
     * Nginx Ingress类名称
     * 用于标识Nginx Ingress控制器的类名称
     */
    public static final String NGINX_INGRESS_CLASS_NAME = "nginx";

    /**
     * 默认控制器服务主机地址
     * 控制器服务监听的默认主机地址
     */
    public static final String CONTROLLER_SERVICE_HOST_DEFAULT = "localhost";

    /**
     * 默认控制器服务端口
     * 控制器服务监听的默认端口号
     */
    public static final int CONTROLLER_SERVICE_PORT_DEFAULT = 15014;

    /**
     * 默认JWT策略
     * 控制器使用的默认JWT认证策略，设置为第三方JWT
     */
    public static final String CONTROLLER_JWT_POLICY_DEFAULT = KubernetesConstants.JwtPolicy.THIRD_PARTY_JWT;

    /**
     * 默认域名
     * 系统使用的默认域名标识
     */
    public static final String DEFAULT_DOMAIN = "higress-default-domain";

    /**
     * 内部资源名称后缀
     * 用于标识系统内部管理资源的名称后缀
     */
    public static final String INTERNAL_RESOURCE_NAME_SUFFIX = ".internal";

    /**
     * 回退路由名称后缀
     * 用于标识回退路由资源的名称后缀
     */
    public static final String FALLBACK_ROUTE_NAME_SUFFIX = ".fallback";

    /**
     * 回退来源头部字段
     * 用于标识请求回退来源的HTTP头部字段名
     */
    public static final String FALLBACK_FROM_HEADER = "x-higress-fallback-from";

    /**
     * 模型路由头部字段
     * 用于LLM模型路由的HTTP头部字段名
     */
    public static final String MODEL_ROUTING_HEADER = "x-higress-llm-model";

    /**
     * 内部资源注释
     * 标识资源由Higress管理的注释内容，提示用户不要直接编辑
     */
    public static final String INTERNAL_RESOURCE_COMMENT =
        "PLEASE DO NOT EDIT DIRECTLY. This resource is managed by Higress.";

    /**
     * 有效的回退响应码集合
     * 定义了允许触发回退机制的HTTP响应码范围
     */
    public static final Set<String> VALID_FALLBACK_RESPONSE_CODES = Sets.newHashSet("4xx", "5xx");

    /**
     * 服务列表支持注册表默认值
     * 控制服务列表是否默认支持注册表发现功能
     */
    public static final Boolean SERVICE_LIST_SUPPORT_REGISTRY_DEFAULT = Boolean.TRUE;

    /**
     * 集群域名后缀默认值
     * Kubernetes集群内部服务域名的默认后缀
     */
    public static final String CLUSTER_DOMAIN_SUFFIX_DEFAULT = "cluster.local";
}
