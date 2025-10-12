/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.config;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.HigressServiceProvider;
import com.alibaba.higress.sdk.service.ProxyServerService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.ServiceService;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.TlsCertificateService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;
import com.alibaba.higress.sdk.service.ai.AiRouteService;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerService;

/**
 * SDK配置类，用于初始化Higress服务提供者和相关Bean
 * 该配置类通过读取系统配置来构建Higress服务配置，并提供各种服务的Bean定义
 */
@Configuration
public class SdkConfig {

    /**
     * Kubernetes配置文件路径
     */
    @Value("${" + SystemConfigKey.KUBE_CONFIG_KEY + ":}")
    private String kubeConfig;

    /**
     * 控制器服务名称，默认值为HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT
     */
    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_NAME_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT
        + "}")
    private String controllerServiceName = HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT;

    /**
     * 控制器命名空间，默认值为HigressConstants.NS_DEFAULT
     */
    @Value("${" + SystemConfigKey.NS_KEY + ":" + HigressConstants.NS_DEFAULT + "}")
    private String controllerNamespace = HigressConstants.NS_DEFAULT;

    /**
     * 控制器监听的命名空间
     */
    @Value("${" + SystemConfigKey.CONTROLLER_WATCHED_NAMESPACE_KEY + ":}")
    private String controllerWatchedNamespace;

    /**
     * 控制器监听的Ingress类名
     */
    @Value("${" + SystemConfigKey.CONTROLLER_INGRESS_CLASS_NAME_KEY + ":}")
    private String controllerWatchedIngressClassName;

    /**
     * 控制器服务主机地址，默认值为HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT
     */
    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_HOST_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT
        + "}")
    private String controllerServiceHost = HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT;

    /**
     * 控制器服务端口，默认值为HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT
     */
    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_PORT_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT
        + "}")
    private int controllerServicePort = HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT;

    /**
     * 控制器JWT策略，默认值为HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT
     */
    @Value("${" + SystemConfigKey.CONTROLLER_JWT_POLICY_KEY + ":" + HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT
        + "}")
    private String controllerJwtPolicy = HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT;

    /**
     * 控制器访问令牌
     */
    @Value("${" + SystemConfigKey.CONTROLLER_ACCESS_TOKEN_KEY + ":}")
    private String controllerAccessToken;

    /**
     * 集群域名后缀，默认值为HigressConstants.CLUSTER_DOMAIN_SUFFIX_DEFAULT
     */
    @Value("${" + SystemConfigKey.CLUSTER_DOMAIN_SUFFIX + ":" + HigressConstants.CLUSTER_DOMAIN_SUFFIX_DEFAULT + "}")
    private String clusterDomainSuffix;

    /**
     * Higress服务提供者实例
     */
    private HigressServiceProvider serviceProvider;

    /**
     * 初始化方法，在Bean创建后执行
     * 构建Higress服务配置并创建服务提供者实例
     *
     * @throws IOException 当读取配置文件或环境变量时发生IO异常
     */
    @PostConstruct
    public void initialize() throws IOException {
        // 构建Higress服务配置
        HigressServiceConfig config = HigressServiceConfig.builder()
            .withKubeConfigPath(kubeConfig)                                    // 设置Kubernetes配置路径
            .withControllerNamespace(controllerNamespace)                      // 设置控制器命名空间
            .withControllerWatchedNamespace(controllerWatchedNamespace)        // 设置控制器监听命名空间
            .withControllerWatchedIngressClassName(controllerWatchedIngressClassName) // 设置控制器监听Ingress类名
            .withControllerServiceName(controllerServiceName)                  // 设置控制器服务名称
            .withControllerServiceHost(controllerServiceHost)                  // 设置控制器服务主机
            .withControllerServicePort(controllerServicePort)                  // 设置控制器服务端口
            .withControllerJwtPolicy(controllerJwtPolicy)                      // 设置控制器JWT策略
            .withControllerAccessToken(controllerAccessToken)                  // 设置控制器访问令牌
            .withClusterDomainSuffix(clusterDomainSuffix)                      // 设置集群域名后缀
            .withWasmPluginServiceConfig(WasmPluginServiceConfig.buildFromEnv()) // 设置WASM插件服务配置
            .build();

        // 创建Higress服务提供者实例
        serviceProvider = HigressServiceProvider.create(config);
    }

    /**
     * 提供Kubernetes客户端服务Bean
     *
     * @return KubernetesClientService实例
     */
    @Bean
    public KubernetesClientService kubernetesClientService() {
        return serviceProvider.kubernetesClientService();
    }

    /**
     * 提供Kubernetes模型转换器Bean
     *
     * @return KubernetesModelConverter实例
     */
    @Bean
    public KubernetesModelConverter kubernetesModelConverter() {
        return serviceProvider.kubernetesModelConverter();
    }

    /**
     * 提供域名服务Bean
     *
     * @return DomainService实例
     */
    @Bean
    public DomainService domainService() {
        return serviceProvider.domainService();
    }

    /**
     * 提供路由服务Bean
     *
     * @return RouteService实例
     */
    @Bean
    public RouteService routeService() {
        return serviceProvider.routeService();
    }

    /**
     * 提供服务发现服务Bean
     *
     * @return ServiceService实例
     */
    @Bean
    public ServiceService serviceService() {
        return serviceProvider.serviceService();
    }

    /**
     * 提供服务源服务Bean
     *
     * @return ServiceSourceService实例
     */
    @Bean
    public ServiceSourceService serviceSourceService() {
        return serviceProvider.serviceSourceService();
    }

    /**
     * 提供代理服务器服务Bean
     *
     * @return ProxyServerService实例
     */
    @Bean
    public ProxyServerService proxyServerService() {
        return serviceProvider.proxyServerService();
    }

    /**
     * 提供TLS证书服务Bean
     *
     * @return TlsCertificateService实例
     */
    @Bean
    public TlsCertificateService tlsCertificateService() {
        return serviceProvider.tlsCertificateService();
    }

    /**
     * 提供WASM插件服务Bean
     *
     * @return WasmPluginService实例
     */
    @Bean
    public WasmPluginService wasmPluginService() {
        return serviceProvider.wasmPluginService();
    }

    /**
     * 提供WASM插件实例服务Bean
     *
     * @return WasmPluginInstanceService实例
     */
    @Bean
    public WasmPluginInstanceService wasmPluginInstanceService() {
        return serviceProvider.wasmPluginInstanceService();
    }

    /**
     * 提供消费者服务Bean
     *
     * @return ConsumerService实例
     */
    @Bean
    public ConsumerService consumerService() {
        return serviceProvider.consumerService();
    }

    /**
     * 提供AI路由服务Bean
     *
     * @return AiRouteService实例
     */
    @Bean
    public AiRouteService aiRouteService() {
        return serviceProvider.aiRouteService();
    }

    /**
     * 提供LLM提供商服务Bean
     *
     * @return LlmProviderService实例
     */
    @Bean
    public LlmProviderService llmProviderService() {
        return serviceProvider.llmProviderService();
    }

    /**
     * 提供MCP服务器服务Bean
     *
     * @return McpServerService实例
     */
    @Bean
    public McpServerService mcpServerService() {
        return serviceProvider.mcpServerService();
    }

    /**
     * 提供MCP服务器助手Bean
     *
     * @return McpServerHelper实例
     */
    @Bean
    public McpServerHelper mcpServerHelper() {
        return new McpServerHelper();
    }
}
