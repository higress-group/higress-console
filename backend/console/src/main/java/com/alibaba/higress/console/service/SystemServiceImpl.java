/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyPair;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.cert.X509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.CapabilityKey;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.model.SystemInfo;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.util.CertificateUtil;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.TlsCertificate;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.TlsCertificateService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SystemServiceImpl implements SystemService {

    private static final String DEFAULT_TLS_CERTIFICATE_NAME = "default";
    private static final String DEFAULT_TLS_CERTIFICATE_HOST = "higress-gateway";
    private static final long DEFAULT_TLS_CERTIFICATE_DURATION = 1000L * 60 * 60 * 24 * 365;
    private static final String DEFAULT_ROUTE_NAME = "default";
    private static final String UNKNOWN = "unknown";
    private static final String COMMIT_ID;

    static {
        String commitId = null;
        try {
            commitId = loadGitCommitId();
        } catch (Exception ex) {
            log.error("Failed to load git properties.", ex);
        }
        if (StringUtils.isBlank(commitId)) {
            commitId = UNKNOWN;
        }
        COMMIT_ID = commitId;
    }

    @Value("${" + SystemConfigKey.VERSION_KEY + ":}")
    private String version;

    @Value("${" + SystemConfigKey.DEV_BUILD_KEY + ":" + SystemConfigKey.DEV_BUILD_DEFAULT + "}")
    private boolean devBuild = SystemConfigKey.DEV_BUILD_DEFAULT;

    @Value("${" + SystemConfigKey.CONSOLE_SERVICE_HOST_KEY + ":" + SystemConfigKey.DEFAULT_CONSOLE_SERVICE_HOST + "}")
    private String consoleServiceHost = SystemConfigKey.DEFAULT_CONSOLE_SERVICE_HOST;

    @Value("${" + SystemConfigKey.CONSOLE_SERVICE_PORT_KEY + ":" + SystemConfigKey.DEFAULT_CONSOLE_SERVICE_PORT + "}")
    private int consoleServicePort = SystemConfigKey.DEFAULT_CONSOLE_SERVICE_PORT;

    private String fullVersion;
    private List<String> capabilities;

    private DashboardService dashboardService;
    private SessionService sessionService;
    private ConfigService configService;
    private TlsCertificateService tlsCertificateService;
    private DomainService domainService;
    private RouteService routeService;
    private KubernetesClientService kubernetesClientService;

    @Autowired
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Autowired
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Autowired
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    @Autowired
    public void setTlsCertificateService(TlsCertificateService tlsCertificateService) {
        this.tlsCertificateService = tlsCertificateService;
    }

    @Autowired
    public void setDomainService(DomainService domainService) {
        this.domainService = domainService;
    }

    @Autowired
    public void setRouteService(RouteService routeService) {
        this.routeService = routeService;
    }

    @Autowired
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @PostConstruct
    private void initInternalState() {
        fullVersion = StringUtils.isNotBlank(version) ? version : UNKNOWN;
        if (devBuild) {
            fullVersion += "-dev-" + COMMIT_ID;
        }

        List<String> capabilities = new ArrayList<>();
        if (kubernetesClientService.isIngressV1Supported()) {
            capabilities.add(CapabilityKey.CONFIG_INGRESS_V1);
        }
        this.capabilities = capabilities;

        Map<String, Object> configs = Map.of(UserConfigKey.SYSTEM_INITIALIZED, sessionService.isAdminInitialized(),
            UserConfigKey.DASHBOARD_BUILTIN, dashboardService.isBuiltIn());
        configService.setConfigs(configs);

        initDefaultRoutes();
    }

    @Override
    public void initSystem(User adminUser, Map<String, Object> configs) {
        if (configService.getBoolean(UserConfigKey.SYSTEM_INITIALIZED)) {
            throw new IllegalStateException("System already initialized.");
        }

        initAdminUser(adminUser);
        initConfigs(configs);
    }

    private void initAdminUser(User adminUser) {
        if (!sessionService.isAdminInitialized()) {
            sessionService.initializeAdmin(adminUser);
        }
    }

    private void initDefaultRoutes() {
        boolean defaultRouteInitialized = configService.getBoolean(UserConfigKey.DEFAULT_ROUTE_INITIALIZED, false);
        if (defaultRouteInitialized) {
            return;
        }

        List<V1Ingress> ingresses;
        try {
            ingresses = kubernetesClientService.listAllIngresses();
        } catch (ApiException e) {
            log.error("Failed to list all ingresses. Skip default route initialization.", e);
            return;
        }

        if (CollectionUtils.isNotEmpty(ingresses)) {
            log.info("Skip default route initialization because there are existing ingresses.");
            configService.setConfig(UserConfigKey.DEFAULT_ROUTE_INITIALIZED, true);
            return;
        }

        try {
            KeyPair keyPair = CertificateUtil.generateRsaKeyPair(4096);
            X509CertificateHolder certificateHolder = CertificateUtil.generateSelfSignedCertificate(keyPair,
                DEFAULT_TLS_CERTIFICATE_HOST, DEFAULT_TLS_CERTIFICATE_DURATION);

            TlsCertificate defaultCertificate = new TlsCertificate();
            defaultCertificate.setName(DEFAULT_TLS_CERTIFICATE_NAME);
            defaultCertificate.setDomains(List.of(DEFAULT_TLS_CERTIFICATE_HOST));
            defaultCertificate.setKey(
                CertificateUtil.toPem(CertificateUtil.RSA_PRIVATE_KEY_PEM_TYPE, keyPair.getPrivate().getEncoded()));
            defaultCertificate
                .setCert(CertificateUtil.toPem(CertificateUtil.CERTIFICATE_PEM_TYPE, certificateHolder.getEncoded()));
            tlsCertificateService.add(defaultCertificate);

            Domain domain = new Domain();
            domain.setName(HigressConstants.DEFAULT_DOMAIN);
            domain.setEnableHttps(Domain.EnableHttps.ON);
            domain.setCertIdentifier(DEFAULT_TLS_CERTIFICATE_NAME);
            domainService.add(domain);
        } catch (ResourceConflictException e) {
            // Ignore it.
        } catch (Exception ex) {
            log.error("Failed to init the default TLS certificate.", ex);
        }

        try {
            Route route = new Route();
            route.setName(DEFAULT_ROUTE_NAME);
            RoutePredicate routePredicate =
                RoutePredicate.builder().matchType(RoutePredicateTypeEnum.EQUAL.name()).matchValue("/").build();
            route.setPath(routePredicate);
            route.setServices(List.of(new UpstreamService(consoleServiceHost, consoleServicePort, null, null)));
            route.setRewrite(new RewriteConfig(true, "/landing", null));
            routeService.add(route);

            configService.setConfig(UserConfigKey.DEFAULT_ROUTE_INITIALIZED, true);
        } catch (Exception ex) {
            log.error("Failed to init the default route.", ex);
        }
    }

    private void initConfigs(Map<String, Object> configs) {
        Map<String, Object> fullConfigs = new HashMap<>();
        if (MapUtils.isNotEmpty(configs)) {
            fullConfigs.putAll(configs);
        }
        fullConfigs.put(UserConfigKey.SYSTEM_INITIALIZED, true);
        configService.setConfigs(fullConfigs);
    }

    @Override
    public SystemInfo getSystemInfo() {
        return new SystemInfo(fullVersion, capabilities);
    }

    private static String loadGitCommitId() throws IOException {
        try (InputStream input = SystemServiceImpl.class.getResourceAsStream("/git.properties")) {
            if (input == null) {
                log.warn("git.properties not found.");
                return null;
            }
            Properties properties = new Properties();
            properties.load(input);
            String commitId = properties.getProperty("git.commit.id");
            if (commitId != null && commitId.length() > 7) {
                commitId = commitId.substring(0, 7);
            }
            return commitId;
        }
    }
}
