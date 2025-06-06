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
 * @author CH3CHO
 */
@Data
public class HigressServiceConfig {

    private final String kubeConfigPath;
    private final String controllerNamespace;
    private final String controllerWatchedNamespace;
    private final String controllerWatchedIngressClassName;
    private final String controllerServiceName;
    private final String controllerServiceHost;
    private final Integer controllerServicePort;
    private final String controllerJwtPolicy;
    private final String controllerAccessToken;
    private final WasmPluginServiceConfig wasmPluginServiceConfig;
    /**
     * Regarding the service list interface, does it depend on the controller.
     * <p>
     * If true, the service list interface will depend on the controller api.
     * {@link com.alibaba.higress.sdk.service.ServiceServiceImpl}
     * </p>
     * <p>
     * If false, the service list implementation will interaction with the api server
     * directly.{@link com.alibaba.higress.sdk.service.ServiceServiceByApiServerImpl} Under the current configuration,
     * there is no need for the capability of service discovery. The sources related to the registry in the service
     * sources will be disabled
     * </p>
     */
    private final Boolean serviceListSupportRegistry;

    /**
     * @deprecated use {@link #getControllerWatchedIngressClassName()} instead
     */
    @Deprecated
    public String getIngressClassName() {
        return controllerWatchedIngressClassName;
    }

    public static HigressServiceConfig.Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String kubeConfigPath;
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

        private Builder() {}

        public Builder withWasmPluginServiceConfig(WasmPluginServiceConfig wasmPluginServiceConfig) {
            this.wasmPluginServiceConfig = wasmPluginServiceConfig;
            return this;
        }

        public Builder withServiceListSupportRegistry(Boolean serviceListSupportRegistry) {
            this.serviceListSupportRegistry = serviceListSupportRegistry;
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
         * @deprecated use {@link #withControllerWatchedIngressClassName(String)} instead
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

        public HigressServiceConfig build() {
            return new HigressServiceConfig(kubeConfigPath,
                StringUtils.firstNonEmpty(controllerNamespace, HigressConstants.NS_DEFAULT), controllerWatchedNamespace,
                controllerWatchedIngressClassName,
                StringUtils.firstNonEmpty(controllerServiceName, HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT),
                StringUtils.firstNonEmpty(controllerServiceHost, HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT),
                Optional.ofNullable(controllerServicePort).orElse(HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT),
                StringUtils.firstNonEmpty(controllerJwtPolicy, HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT),
                controllerAccessToken,
                Objects.isNull(wasmPluginServiceConfig) ? new WasmPluginServiceConfig() : wasmPluginServiceConfig,
                Optional.ofNullable(serviceListSupportRegistry)
                    .orElse(HigressConstants.SERVICE_LIST_SUPPORT_REGISTRY_DEFAULT));
        }
    }
}
