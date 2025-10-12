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
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.tomcat.util.http.fileupload.util.Streams;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.client.grafana.GrafanaClient;
import com.alibaba.higress.console.client.grafana.models.Datasource;
import com.alibaba.higress.console.client.grafana.models.DatasourceCreationResult;
import com.alibaba.higress.console.client.grafana.models.GrafanaDashboard;
import com.alibaba.higress.console.client.grafana.models.GrafanaSearchResult;
import com.alibaba.higress.console.client.grafana.models.SearchType;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.model.DashboardInfo;
import com.alibaba.higress.console.model.DashboardType;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.google.common.collect.ImmutableSet;
import com.google.common.util.concurrent.ThreadFactoryBuilder;

import lombok.extern.slf4j.Slf4j;

/**
 * 仪表盘服务实现类，负责管理Grafana仪表盘的配置、初始化和请求转发等功能
 *
 * @author CH3CHO
 */
@Slf4j
@Service
public class DashboardServiceImpl implements DashboardService {

    // 需要忽略的请求头集合
    private static final Set<String> IGNORE_REQUEST_HEADERS =
            ImmutableSet.of("connection", "accept-encoding", "content-length");

    // 需要忽略的响应头集合
    private static final Set<String> IGNORE_RESPONSE_HEADERS =
            ImmutableSet.of("connection", "content-length", "content-encoding", "server", "transfer-encoding");

    // 数据源UID占位符
    private static final String DATASOURCE_UID_PLACEHOLDER = "${datasource.id}";

    // 主仪表盘数据文件路径
    private static final String MAIN_DASHBOARD_DATA_PATH = "/dashboard/main.json";

    // 日志仪表盘数据文件路径
    private static final String LOG_DASHBOARD_DATA_PATH = "/dashboard/logs.json";

    // AI仪表盘数据文件路径
    private static final String AI_DASHBOARD_DATA_PATH = "/dashboard/ai.json";

    // Prometheus数据源类型
    private static final String PROM_DATASOURCE_TYPE = "prometheus";

    // Loki数据源类型
    private static final String LOKI_DATASOURCE_TYPE = "loki";

    // 数据源访问方式
    private static final String DATASOURCE_ACCESS = "proxy";

    // 用于初始化仪表盘的线程池
    private static final ExecutorService EXECUTOR =
            new ThreadPoolExecutor(1, 1, 1, TimeUnit.MINUTES, new SynchronousQueue<>(),
                    new ThreadFactoryBuilder().setDaemon(true).setNameFormat("DashboardService-Initializer-%d").build());

    // 是否在启动时覆盖已存在的仪表盘配置
    @Value("${" + SystemConfigKey.DASHBOARD_OVERWRITE_WHEN_STARTUP_KEY + ":"
            + SystemConfigKey.DASHBOARD_OVERWRITE_WHEN_STARTUP_DEFAULT + "}")
    private boolean overwriteWhenStartUp = SystemConfigKey.DASHBOARD_OVERWRITE_WHEN_STARTUP_DEFAULT;

    // Grafana API基础URL
    @Value("${" + SystemConfigKey.DASHBOARD_BASE_URL_KEY + ":}")
    private String apiBaseUrl;

    // Grafana API基础URL对象
    private URL apiBaseUrlObject;

    // Grafana用户名
    @Value("${" + SystemConfigKey.DASHBOARD_USERNAME_KEY + ":" + SystemConfigKey.DASHBOARD_USERNAME_DEFAULT + "}")
    private String username = SystemConfigKey.DASHBOARD_USERNAME_DEFAULT;

    // Grafana密码
    @Value("${" + SystemConfigKey.DASHBOARD_PASSWORD_KEY + ":" + SystemConfigKey.DASHBOARD_PASSWORD_DEFAULT + "}")
    private String password = SystemConfigKey.DASHBOARD_PASSWORD_DEFAULT;

    // Prometheus数据源名称
    @Value("${" + SystemConfigKey.DASHBOARD_DATASOURCE_PROM_NAME_KEY + ":"
            + SystemConfigKey.DASHBOARD_DATASOURCE_PROM_NAME_DEFAULT + "}")
    private String promDatasourceName = SystemConfigKey.DASHBOARD_DATASOURCE_PROM_NAME_DEFAULT;

    // Prometheus数据源URL
    @Value("${" + SystemConfigKey.DASHBOARD_DATASOURCE_PROM_URL_KEY + ":}")
    private String promDatasourceUrl;

    // Loki数据源名称
    @Value("${" + SystemConfigKey.DASHBOARD_DATASOURCE_LOKI_NAME_KEY + ":"
            + SystemConfigKey.DASHBOARD_DATASOURCE_LOKI_NAME_DEFAULT + "}")
    private String lokiDatasourceName = SystemConfigKey.DASHBOARD_DATASOURCE_LOKI_NAME_DEFAULT;

    // Loki数据源URL
    @Value("${" + SystemConfigKey.DASHBOARD_DATASOURCE_LOKI_URL_KEY + ":}")
    private String lokiDatasourceUrl;

    // 代理连接超时时间（毫秒）
    @Value("${" + SystemConfigKey.DASHBOARD_PROXY_CONNECTION_TIMEOUT_KEY + ":"
            + SystemConfigKey.DASHBOARD_PROXY_CONNECTION_TIMEOUT_DEFAULT + "}")
    private int proxyConnectionTimeout = SystemConfigKey.DASHBOARD_PROXY_CONNECTION_TIMEOUT_DEFAULT;

    // 代理Socket超时时间（毫秒）
    @Value("${" + SystemConfigKey.DASHBOARD_PROXY_SOCKET_TIMEOUT_KEY + ":"
            + SystemConfigKey.DASHBOARD_PROXY_SOCKET_TIMEOUT_DEFAULT + "}")
    private int proxySocketTimeout = SystemConfigKey.DASHBOARD_PROXY_SOCKET_TIMEOUT_DEFAULT;

    // 配置服务
    private ConfigService configService;

    // Grafana客户端
    private GrafanaClient grafanaClient;

    // 用于访问真实服务器的HTTP客户端
    private CloseableHttpClient realServerClient;

    // 真实服务器基础URL
    private String realServerBaseUrl;

    // 仪表盘配置映射表
    private Map<DashboardType, DashboardConfiguration> dashboardConfigurations;

    // 注入配置服务
    @Resource
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    /**
     * 初始化方法，在Bean创建后执行
     */
    @PostConstruct
    public void initialize() {
        // 加载仪表盘配置
        Map<DashboardType, DashboardConfiguration> dashboardConfigurations = new HashMap<>();
        try {
            dashboardConfigurations.put(DashboardType.MAIN,
                    new DashboardConfiguration(DashboardType.MAIN, MAIN_DASHBOARD_DATA_PATH));
            dashboardConfigurations.put(DashboardType.AI,
                    new DashboardConfiguration(DashboardType.AI, AI_DASHBOARD_DATA_PATH));
            dashboardConfigurations.put(DashboardType.LOG,
                    new DashboardConfiguration(DashboardType.LOG, LOG_DASHBOARD_DATA_PATH));
        } catch (IOException e) {
            throw new IllegalStateException("Error occurs when loading dashboard configurations from resource.", e);
        }
        this.dashboardConfigurations = Collections.unmodifiableMap(dashboardConfigurations);

        // 如果是内置仪表盘模式
        if (isBuiltIn()) {
            try {
                apiBaseUrlObject = new URL(apiBaseUrl);
            } catch (MalformedURLException e) {
                throw new IllegalArgumentException("Invalid dashboard base url: " + apiBaseUrl, e);
            }

            // 配置HTTP客户端请求参数
            RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(proxyConnectionTimeout)
                    .setSocketTimeout(proxySocketTimeout).build();
            realServerClient =
                    HttpClients.custom().setDefaultRequestConfig(requestConfig).disableRedirectHandling().build();
            // 构造真实服务器基础URL
            realServerBaseUrl = apiBaseUrl.substring(0, apiBaseUrl.length() - apiBaseUrlObject.getPath().length());

            // 初始化Grafana客户端
            grafanaClient = new GrafanaClient(apiBaseUrl, username, password);
            // 提交仪表盘初始化任务
            EXECUTOR.submit(new DashboardInitializer(overwriteWhenStartUp));
        }
    }

    /**
     * 判断是否为内置仪表盘模式
     *
     * @return true表示使用内置仪表盘，false表示使用外部配置的仪表盘
     */
    public boolean isBuiltIn() {
        return StringUtils.isNoneBlank(apiBaseUrl, promDatasourceUrl, lokiDatasourceUrl);
    }

    /**
     * 获取主仪表盘信息
     *
     * @return 仪表盘信息对象
     */
    @Override
    public DashboardInfo getDashboardInfo() {
        return getDashboardInfo(DashboardType.MAIN);
    }

    /**
     * 获取指定类型的仪表盘信息
     *
     * @param type 仪表盘类型
     * @return 仪表盘信息对象
     */
    @Override
    public DashboardInfo getDashboardInfo(DashboardType type) {
        return isBuiltIn() ? getBuiltInDashboardInfo(type) : getConfiguredDashboardInfo(type);
    }

    /**
     * 初始化仪表盘
     *
     * @param overwrite 是否覆盖已存在的仪表盘
     */
    @Override
    public void initializeDashboard(boolean overwrite) {
        if (!isBuiltIn()) {
            throw new IllegalStateException("No built-in dashboard is available.");
        }

        // 获取现有的数据源
        List<Datasource> datasources;
        try {
            datasources = grafanaClient.getDatasources();
        } catch (IOException e) {
            throw new BusinessException("Error occurs when loading datasources from Grafana.", e);
        }

        // 配置Prometheus和Loki数据源
        String promDatasourceUid = configurePrometheusDatasource(datasources);
        String lokiDatasourceUid = configureLokiDatasource(datasources);

        // 获取现有的仪表盘
        List<GrafanaSearchResult> results;
        try {
            results = grafanaClient.search(null, SearchType.DB, null, null);
        } catch (IOException e) {
            throw new BusinessException("Error occurs when loading dashboard info from Grafana.", e);
        }

        // 配置各个仪表盘
        for (DashboardConfiguration configuration : dashboardConfigurations.values()) {
            String datasourceId = configuration.getType() == DashboardType.LOG ? lokiDatasourceUid : promDatasourceUid;
            configureDashboard(results, configuration.getDashboard().getTitle(), configuration.getRaw(), datasourceId,
                    overwrite);
        }
    }

    /**
     * 设置仪表盘URL
     *
     * @param url 仪表盘URL
     */
    @Override
    public void setDashboardUrl(String url) {
        setDashboardUrl(DashboardType.MAIN, url);
    }

    /**
     * 设置指定类型的仪表盘URL
     *
     * @param type 仪表盘类型
     * @param url 仪表盘URL
     */
    @Override
    public void setDashboardUrl(DashboardType type, String url) {
        if (StringUtils.isBlank(url)) {
            throw new IllegalArgumentException("url cannot be null or blank.");
        }
        if (isBuiltIn()) {
            throw new IllegalStateException("Manual dashboard configuration is disabled.");
        }
        DashboardConfiguration configuration = getDashboardConfiguration(type);
        configService.setConfig(configuration.getConfigKey(), url);
    }

    /**
     * 构建配置数据
     *
     * @param datasourceUid 数据源UID
     * @return 配置数据字符串
     */
    @Override
    public String buildConfigData(String datasourceUid) {
        return buildConfigData(DashboardType.MAIN, datasourceUid);
    }

    /**
     * 构建指定类型的配置数据
     *
     * @param type 仪表盘类型
     * @param datasourceUid 数据源UID
     * @return 配置数据字符串
     */
    @Override
    public String buildConfigData(DashboardType type, String datasourceUid) {
        DashboardConfiguration configuration = getDashboardConfiguration(type);
        return buildConfigData(configuration.getRaw(), datasourceUid);
    }

    /**
     * 转发仪表盘请求到真实服务器
     *
     * @param request HTTP请求对象
     * @param response HTTP响应对象
     * @throws IOException IO异常
     */
    @Override
    public void forwardDashboardRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (!isBuiltIn()) {
            throw new IllegalStateException(
                    "Dashboard request forward function is only available for built-in dashboard.");
        }

        // 构建转发请求
        HttpUriRequest proxyRequest = buildRealServerRequest(request);
        try (CloseableHttpResponse proxyResponse = realServerClient.execute(proxyRequest)) {
            // 转发响应
            forwardResponse(response, proxyResponse);
        }
    }

    /**
     * 配置Prometheus数据源
     *
     * @param existedDatasources 已存在的数据源列表
     * @return Prometheus数据源UID
     */
    private String configurePrometheusDatasource(List<Datasource> existedDatasources) {
        String datasourceUid = null;
        // 检查是否已存在相同URL的数据源
        if (CollectionUtils.isNotEmpty(existedDatasources)) {
            datasourceUid = existedDatasources.stream().filter(ds -> promDatasourceUrl.equals(ds.getUrl())).findFirst()
                    .map(Datasource::getUid).orElse(null);
        }
        // 如果不存在则创建新的数据源
        if (datasourceUid == null) {
            Datasource datasource = new Datasource();
            datasource.setType(PROM_DATASOURCE_TYPE);
            datasource.setName(promDatasourceName);
            datasource.setUrl(promDatasourceUrl);
            datasource.setAccess(DATASOURCE_ACCESS);
            try {
                DatasourceCreationResult result = grafanaClient.createDatasource(datasource);
                if (result.getDatasource() == null) {
                    throw new BusinessException("Creating data source call returns success but no datasource object."
                            + " Message=" + result.getMessage());
                }
                datasourceUid = result.getDatasource().getUid();
            } catch (IOException e) {
                throw new BusinessException("Error occurs when creating Prometheus datasource in Grafana.", e);
            }
        }
        return datasourceUid;
    }

    /**
     * 配置Loki数据源
     *
     * @param existedDatasources 已存在的数据源列表
     * @return Loki数据源UID
     */
    private String configureLokiDatasource(List<Datasource> existedDatasources) {
        String datasourceUid = null;
        // 检查是否已存在相同URL的数据源
        if (CollectionUtils.isNotEmpty(existedDatasources)) {
            datasourceUid = existedDatasources.stream().filter(ds -> lokiDatasourceUrl.equals(ds.getUrl())).findFirst()
                    .map(Datasource::getUid).orElse(null);
        }
        // 如果不存在则创建新的数据源
        if (datasourceUid == null) {
            Datasource datasource = new Datasource();
            datasource.setType(LOKI_DATASOURCE_TYPE);
            datasource.setName(lokiDatasourceName);
            datasource.setUrl(lokiDatasourceUrl);
            datasource.setAccess(DATASOURCE_ACCESS);
            try {
                DatasourceCreationResult result = grafanaClient.createDatasource(datasource);
                if (result.getDatasource() == null) {
                    throw new BusinessException("Creating data source call returns success but no datasource object."
                            + " Message=" + result.getMessage());
                }
                datasourceUid = result.getDatasource().getUid();
            } catch (IOException e) {
                throw new BusinessException("Error occurs when creating Loki datasource in Grafana.", e);
            }
        }
        return datasourceUid;
    }

    /**
     * 配置仪表盘
     *
     * @param results 已存在的仪表盘列表
     * @param title 仪表盘标题
     * @param configuration 仪表盘配置数据
     * @param datasourceUid 数据源UID
     * @param overwrite 是否覆盖已存在的仪表盘
     */
    private void configureDashboard(List<GrafanaSearchResult> results, String title, String configuration,
                                    String datasourceUid, boolean overwrite) {
        if (StringUtils.isEmpty(title)) {
            throw new IllegalStateException("No title is found in the configured dashboard.");
        }

        // 检查是否已存在相同标题的仪表盘
        String existedDashboardUid = results.stream().filter(r -> title.equals(r.getTitle()))
                .map(GrafanaSearchResult::getUid).findFirst().orElse(null);
        if (StringUtils.isNotEmpty(existedDashboardUid) && !overwrite) {
            return;
        }

        // 构建仪表盘数据并解析
        String dashboardData = buildConfigData(configuration, datasourceUid);
        GrafanaDashboard dashboard;
        try {
            dashboard = GrafanaClient.parseDashboardData(dashboardData);
            dashboard.setId(null);
            dashboard.setUid(null);
            dashboard.setVersion(null);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to parse the configured dashboard data.", e);
        }

        try {
            // 如果已存在则更新，否则创建新的仪表盘
            if (StringUtils.isNotEmpty(existedDashboardUid)) {
                GrafanaDashboard existedDashboard = grafanaClient.getDashboard(existedDashboardUid);
                if (existedDashboard != null) {
                    dashboard.setId(existedDashboard.getId());
                    dashboard.setUid(existedDashboardUid);
                    dashboard.setVersion(existedDashboard.getVersion());
                }
            }
            if (dashboard.getId() == null) {
                grafanaClient.createDashboard(dashboard);
            } else {
                grafanaClient.updateDashboard(dashboard);
            }
        } catch (IOException e) {
            throw new BusinessException("Error occurs when creating Higress dashboard in Grafana.", e);
        }
    }

    /**
     * 获取内置仪表盘信息
     *
     * @param type 仪表盘类型
     * @return 仪表盘信息对象
     */
    private DashboardInfo getBuiltInDashboardInfo(DashboardType type) {
        DashboardConfiguration configuration = dashboardConfigurations.get(type);
        if (configuration == null) {
            throw new IllegalArgumentException("Invalid dashboard type: " + type);
        }
        List<GrafanaSearchResult> results;
        try {
            results = grafanaClient.search(null, SearchType.DB, null, null);
        } catch (IOException e) {
            throw new BusinessException("Error occurs when loading dashboard info from Grafana.", e);
        }
        if (CollectionUtils.isEmpty(results)) {
            return new DashboardInfo(true, null, null);
        }
        String expectedTitle = configuration.getDashboard().getTitle();
        if (StringUtils.isEmpty(expectedTitle)) {
            throw new IllegalStateException("No title is found in the configured dashboard.");
        }
        Optional<GrafanaSearchResult> result =
                results.stream().filter(r -> expectedTitle.equals(r.getTitle())).findFirst();
        return result.map(r -> new DashboardInfo(true, r.getUid(), r.getUrl())).orElse(null);
    }

    /**
     * 获取配置的仪表盘信息
     *
     * @param type 仪表盘类型
     * @return 仪表盘信息对象
     */
    private DashboardInfo getConfiguredDashboardInfo(DashboardType type) {
        DashboardConfiguration configuration = dashboardConfigurations.get(type);
        String url = configService.getString(configuration.getConfigKey());
        return new DashboardInfo(false, null, url);
    }

    /**
     * 构建配置数据，替换数据源占位符
     *
     * @param dashboardConfiguration 仪表盘配置数据
     * @param datasourceUid 数据源UID
     * @return 替换后的配置数据
     */
    private String buildConfigData(String dashboardConfiguration, String datasourceUid) {
        return dashboardConfiguration.replace(DATASOURCE_UID_PLACEHOLDER, datasourceUid);
    }

    /**
     * 构建转发到真实服务器的请求
     *
     * @param originalRequest 原始请求对象
     * @return 转发请求对象
     * @throws IOException IO异常
     */
    private HttpUriRequest buildRealServerRequest(HttpServletRequest originalRequest) throws IOException {
        String servletPath = originalRequest.getServletPath();
        if (!servletPath.startsWith(apiBaseUrlObject.getPath())) {
            throw new IllegalArgumentException("Invalid dashboard request path: " + servletPath);
        }

        // 构造目标URL
        String url = realServerBaseUrl + servletPath;
        if (originalRequest.getQueryString() != null) {
            url = url + "?" + originalRequest.getQueryString();
        }

        // 构造请求实体
        HttpEntity entity = new BufferedHttpEntity(
                new InputStreamEntity(originalRequest.getInputStream(), originalRequest.getContentLength()));
        HttpUriRequest request =
                RequestBuilder.create(originalRequest.getMethod()).setEntity(entity).setUri(url).build();

        // 复制请求头，忽略指定的头
        Collections.list(originalRequest.getHeaderNames()).stream()
                .filter(name -> !IGNORE_REQUEST_HEADERS.contains(name.toLowerCase()))
                .forEach(name -> request.setHeader(new BasicHeader(name, originalRequest.getHeader(name))));

        return request;
    }

    /**
     * 转发响应到客户端
     *
     * @param response 客户端响应对象
     * @param forwardResponse 转发响应对象
     * @throws IOException IO异常
     */
    private void forwardResponse(HttpServletResponse response, HttpResponse forwardResponse) throws IOException {
        // 复制响应头，忽略指定的头
        Arrays.stream(forwardResponse.getAllHeaders())
                .filter(header -> !IGNORE_RESPONSE_HEADERS.contains(header.getName().toLowerCase()))
                .forEach(header -> response.setHeader(header.getName(), header.getValue()));
        // 设置响应状态码
        response.setStatus(forwardResponse.getStatusLine().getStatusCode());
        // 复制响应体
        Streams.copy(forwardResponse.getEntity().getContent(), response.getOutputStream(), false);
    }

    /**
     * 仪表盘初始化器，用于在后台初始化仪表盘
     */
    private class DashboardInitializer implements Runnable {

        private final boolean overwrite;

        private DashboardInitializer(boolean overwrite) {
            this.overwrite = overwrite;
        }

        @Override
        public void run() {
            // 循环尝试初始化，直到成功或线程被中断
            while (!Thread.interrupted()) {
                try {
                    initializeDashboard(overwrite);
                    return;
                } catch (Exception ex) {
                    log.error("Error occurs when trying to initialize the dashboard.", ex);
                    try {
                        TimeUnit.SECONDS.sleep(5);
                    } catch (InterruptedException e) {
                        log.warn("Initialization thread is interrupted.", e);
                    }
                }
            }
        }
    }

    /**
     * 获取指定类型的仪表盘配置
     *
     * @param type 仪表盘类型
     * @return 仪表盘配置对象
     */
    private @NotNull DashboardConfiguration getDashboardConfiguration(DashboardType type) {
        DashboardConfiguration configuration = dashboardConfigurations.get(type);
        if (configuration == null) {
            throw new IllegalArgumentException("Invalid dashboard type: " + type);
        }
        return configuration;
    }

    /**
     * 仪表盘配置内部类，封装仪表盘的相关配置信息
     */
    @lombok.Value
    private static class DashboardConfiguration {

        DashboardType type;           // 仪表盘类型
        String configKey;             // 配置键
        String resourcePath;          // 资源路径
        String raw;                   // 原始配置数据
        GrafanaDashboard dashboard;   // 解析后的仪表盘对象

        /**
         * 构造函数
         *
         * @param type 仪表盘类型
         * @param resourcePath 资源路径
         * @throws IOException IO异常
         */
        public DashboardConfiguration(DashboardType type, String resourcePath) throws IOException {
            this.type = type;
            // 根据类型生成配置键
            this.configKey = type == DashboardType.MAIN ? UserConfigKey.DASHBOARD_URL
                    : UserConfigKey.DASHBOARD_URL_PREFIX + type.toString().toLowerCase(Locale.ROOT);
            this.resourcePath = resourcePath;
            // 从资源文件加载原始数据
            this.raw = IOUtils.resourceToString(resourcePath, StandardCharsets.UTF_8);
            // 解析仪表盘数据
            this.dashboard = GrafanaClient.parseDashboardData(this.raw);
        }
    }
}
