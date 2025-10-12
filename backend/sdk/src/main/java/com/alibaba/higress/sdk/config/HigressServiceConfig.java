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
package com.alibaba.higress.sdk.config;

import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;

import lombok.Data;

/**
 * 配置类，用于存储 Higress 服务的相关配置信息。
 * 使用 Lombok 的 @Data 注解自动生成 getter、setter、toString 等方法。
 *
 * @author CH3CHO
 */
@Data
public class HigressServiceConfig {

    // Kubernetes 配置文件路径
    private final String kubeConfigPath;

    // Kubernetes 配置内容（优先级高于 kubeConfigPath）
    private final String kubeConfigContent;

    // 控制器所在的命名空间
    private final String controllerNamespace;

    // 控制器监听的命名空间
    private final String controllerWatchedNamespace;

    // 控制器监听的 Ingress Class 名称
    private final String controllerWatchedIngressClassName;

    // 控制器服务名称
    private final String controllerServiceName;

    // 控制器服务主机地址
    private final String controllerServiceHost;

    // 控制器服务端口
    private final Integer controllerServicePort;

    // 控制器 JWT 策略
    private final String controllerJwtPolicy;

    // 控制器访问令牌
    private final String controllerAccessToken;

    // WASM 插件服务配置
    private final WasmPluginServiceConfig wasmPluginServiceConfig;

    /**
     * 服务列表接口是否支持注册中心。
     *
     * <p>
     * 如果为 null，则使用默认值 {@link HigressConstants#SERVICE_LIST_SUPPORT_REGISTRY_DEFAULT}。
     * </p>
     * <p>
     * 如果为 true，服务列表接口将支持注册中心，并依赖控制器 API。
     * 实现类参考 {@link com.alibaba.higress.sdk.service.ServiceServiceImpl}
     * </p>
     * <p>
     * 如果为 false，服务列表实现将不支持注册中心，直接与 API 服务器交互。
     * 实现类参考 {@link com.alibaba.higress.sdk.service.ServiceServiceByApiServerImpl}。
     * 在这种配置下，不需要服务发现能力，注册中心相关功能将被禁用。
     * </p>
     */
    private final Boolean serviceListSupportRegistry;

    // 集群域名后缀
    private final String clusterDomainSuffix;

    /**
     * 获取 Ingress Class 名称的旧方法（已废弃）。
     *
     * @deprecated 使用 {@link #getControllerWatchedIngressClassName()} 替代
     */
    @Deprecated
    public String getIngressClassName() {
        return controllerWatchedIngressClassName;
    }

    /**
     * 创建 Builder 实例。
     *
     * @return Builder 实例
     */
    public static HigressServiceConfig.Builder builder() {
        return new Builder();
    }

    /**
     * 内部静态 Builder 类，用于构建 HigressServiceConfig 实例。
     */
    public static final class Builder {
        // 各种配置项字段
        private String kubeConfigPath;
        private String kubeConfigContent;
        private String controllerWatchedNamespace;
        private String controllerWatchedIngressClassName = HigressConstants.CONTROLLER_INGRESS_CLASS_NAME_DEFAULT;
        private String controllerNamespace = HigressConstants.NS_DEFAULT;
        private String controllerServiceName = HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT;
        private String controllerServiceHost = HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT;
        private Integer controllerServicePort = HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT;
        private String controllerJwtPolicy = HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT;
        private String controllerAccessToken;
        private WasmPluginServiceConfig wasmPluginServiceConfig;
        private Boolean serviceListSupportRegistry;
        private String clusterDomainSuffix;

        // 私有构造函数，防止外部直接实例化
        private Builder() {}

        // 各种 with 方法用于设置配置项

        public Builder withWasmPluginServiceConfig(WasmPluginServiceConfig wasmPluginServiceConfig) {
            this.wasmPluginServiceConfig = wasmPluginServiceConfig;
            return this;
        }

        public Builder withServiceListSupportRegistry(Boolean serviceListSupportRegistry) {
            this.serviceListSupportRegistry = serviceListSupportRegistry;
            return this;
        }

        public Builder withClusterDomainSuffix(String clusterDomainSuffix) {
            this.clusterDomainSuffix = clusterDomainSuffix;
            return this;
        }

        public Builder withKubeConfigContent(String kubeConfigContent) {
            this.kubeConfigContent = kubeConfigContent;
            return this;
        }

        public Builder withKubeConfigPath(String kubeConfigPath) {
            this.kubeConfigPath = kubeConfigPath;
            return this;
        }

        public Builder withControllerWatchedIngressClassName(String controllerWatchedIngressClassName) {
            this.controllerWatchedIngressClassName = controllerWatchedIngressClassName;
            return this;
        }

        /**
         * 设置 Ingress Class 名称的旧方法（已废弃）。
         *
         * @deprecated 使用 {@link #withControllerWatchedIngressClassName(String)} 替代
         */
        @Deprecated
        public Builder withIngressClassName(String ingressClassName) {
            return withControllerWatchedIngressClassName(ingressClassName);
        }

        public Builder withControllerNamespace(String controllerNamespace) {
            this.controllerNamespace = controllerNamespace;
            return this;
        }

        public Builder withControllerWatchedNamespace(String controllerWatchedNamespace) {
            this.controllerWatchedNamespace = controllerWatchedNamespace;
            return this;
        }

        public Builder withControllerServiceName(String controllerServiceName) {
            this.controllerServiceName = controllerServiceName;
            return this;
        }

        public Builder withControllerServiceHost(String controllerServiceHost) {
            this.controllerServiceHost = controllerServiceHost;
            return this;
        }

        public Builder withControllerServicePort(Integer controllerServicePort) {
            this.controllerServicePort = controllerServicePort;
            return this;
        }

        public Builder withControllerJwtPolicy(String controllerJwtPolicy) {
            this.controllerJwtPolicy = controllerJwtPolicy;
            return this;
        }

        public Builder withControllerAccessToken(String controllerAccessToken) {
            this.controllerAccessToken = controllerAccessToken;
            return this;
        }

        /**
         * 构建 HigressServiceConfig 实例。
         *
         * @return HigressServiceConfig 实例
         */
        public HigressServiceConfig build() {
            return new HigressServiceConfig(
                    kubeConfigPath,
                    kubeConfigContent,
                    // 使用 StringUtils.firstNonEmpty 确保有默认值
                    StringUtils.firstNonEmpty(controllerNamespace, HigressConstants.NS_DEFAULT),
                    controllerWatchedNamespace,
                    controllerWatchedIngressClassName,
                    StringUtils.firstNonEmpty(controllerServiceName, HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT),
                    StringUtils.firstNonEmpty(controllerServiceHost, HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT),
                    // 使用 Optional.ofNullable 设置默认端口
                    Optional.ofNullable(controllerServicePort).orElse(HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT),
                    StringUtils.firstNonEmpty(controllerJwtPolicy, HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT),
                    controllerAccessToken,
                    // 如果 wasmPluginServiceConfig 为 null，则创建新实例
                    Objects.isNull(wasmPluginServiceConfig) ? new WasmPluginServiceConfig() : wasmPluginServiceConfig,
                    // serviceListSupportRegistry 默认值处理
                    Optional.ofNullable(serviceListSupportRegistry)
                            .orElse(HigressConstants.SERVICE_LIST_SUPPORT_REGISTRY_DEFAULT),
                    StringUtils.firstNonEmpty(clusterDomainSuffix, HigressConstants.CLUSTER_DOMAIN_SUFFIX_DEFAULT)
            );
        }
    }
}
