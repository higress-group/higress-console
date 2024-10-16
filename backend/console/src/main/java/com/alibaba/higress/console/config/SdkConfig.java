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

import com.alibaba.higress.sdk.service.OpenAPIService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.HigressServiceProvider;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.ServiceService;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.TlsCertificateService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

@Configuration
public class SdkConfig {

    @Value("${" + SystemConfigKey.KUBE_CONFIG_KEY + ":}")
    private String kubeConfig;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_NAME_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT
        + "}")
    private String controllerServiceName = HigressConstants.CONTROLLER_SERVICE_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.NS_KEY + ":" + HigressConstants.NS_DEFAULT + "}")
    private String controllerNamespace = HigressConstants.NS_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_INGRESS_CLASS_NAME_KEY + ":"
        + HigressConstants.CONTROLLER_INGRESS_CLASS_NAME_DEFAULT + "}")
    private String controllerIngressClassName = HigressConstants.CONTROLLER_INGRESS_CLASS_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_HOST_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT
        + "}")
    private String controllerServiceHost = HigressConstants.CONTROLLER_SERVICE_HOST_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_SERVICE_PORT_KEY + ":" + HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT
        + "}")
    private int controllerServicePort = HigressConstants.CONTROLLER_SERVICE_PORT_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_JWT_POLICY_KEY + ":" + HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT
        + "}")
    private String controllerJwtPolicy = HigressConstants.CONTROLLER_JWT_POLICY_DEFAULT;

    @Value("${" + SystemConfigKey.CONTROLLER_ACCESS_TOKEN_KEY + ":}")
    private String controllerAccessToken;

    private HigressServiceProvider serviceProvider;

    @PostConstruct
    public void initialize() throws IOException {
        HigressServiceConfig config = HigressServiceConfig.builder().withKubeConfigPath(kubeConfig).withIngressClassName(controllerIngressClassName)
            .withControllerNamespace(controllerNamespace).withControllerServiceName(controllerServiceName)
            .withControllerServiceHost(controllerServiceHost).withControllerServicePort(controllerServicePort)
            .withControllerJwtPolicy(controllerJwtPolicy).withControllerAccessToken(controllerAccessToken).build();
        serviceProvider = HigressServiceProvider.create(config);
    }

    @Bean
    public KubernetesClientService kubernetesClientService() {
        return serviceProvider.kubernetesClientService();
    }

    @Bean
    public KubernetesModelConverter kubernetesModelConverter() {
        return serviceProvider.kubernetesModelConverter();
    }

    @Bean
    public DomainService domainService() {
        return serviceProvider.domainService();
    }

    @Bean
    public RouteService routeService() {
        return serviceProvider.routeService();
    }

    @Bean
    public ServiceService serviceService() {
        return serviceProvider.serviceService();
    }

    @Bean
    public ServiceSourceService serviceSourceService() {
        return serviceProvider.serviceSourceService();
    }

    @Bean
    public TlsCertificateService tlsCertificateService() {
        return serviceProvider.tlsCertificateService();
    }

    @Bean
    public WasmPluginService wasmPluginService() {
        return serviceProvider.wasmPluginService();
    }

    @Bean
    public WasmPluginInstanceService wasmPluginInstanceService() {
        return serviceProvider.wasmPluginInstanceService();
    }

    @Bean
    public OpenAPIService openApiService() {
        return serviceProvider.openApiService();
    }
}
