package com.alibaba.higress.console.controller;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.MapUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.base.Strings;
import com.google.common.collect.ImmutableSet;
import com.google.common.util.concurrent.ThreadFactoryBuilder;

import io.kubernetes.client.openapi.models.V1Secret;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * AI代理控制器
 * 用于代理AI服务的请求，支持从配置或Kubernetes Secret中获取服务地址和令牌
 *
 * @author CH3CHO
 */
@Slf4j
@RestController("AiProxyController")
@RequestMapping(AiProxyController.BASE_PATH)
public class AiProxyController {

    /**
     * 控制器的基础路径
     */
    static final String BASE_PATH = "/aiproxy";

    /**
     * Kubernetes Secret中AI代理服务URL的键名
     */
    private static final String SERVICE_URL_KEY = "aiProxyServiceUrl";

    /**
     * Kubernetes Secret中AI代理服务令牌的键名
     */
    private static final String SERVICE_TOKEN_KEY = "aiProxyServiceToken";

    /**
     * 从Kubernetes Secret重新加载配置的时间间隔（毫秒）
     */
    private static final long SECRET_RELOAD_INTERVAL = 60 * 1000;

    /**
     * 无效的请求头集合
     * 这些请求头不会被转发到目标服务
     */
    private static final Set<String> INVALID_REQUEST_HEADERS =
        ImmutableSet.of("connection", "content-length", "accept-encoding", "host", "cookie");

    /**
     * 无效的响应头集合
     * 这些响应头不会被转发给客户端
     */
    private static final Set<String> INVALID_RESPONSE_HEADERS =
        ImmutableSet.of("connection", "content-length", "content-encoding", "server", "transfer-encoding");

    /**
     * AI代理服务URL配置
     * 可通过系统配置key ai.proxy.service.url 进行配置
     */
    @Value("${" + SystemConfigKey.AI_PROXY_SERVICE_URL_KEY + ":}")
    private String serviceUrl;

    /**
     * AI代理服务令牌配置
     * 可通过系统配置key ai.proxy.service.token 进行配置
     */
    @Value("${" + SystemConfigKey.AI_PROXY_SERVICE_TOKEN_KEY + ":}")
    private String serviceToken;

    /**
     * 存储AI代理配置的Kubernetes Secret名称
     * 默认值为 higress-console
     */
    @Value("${" + SystemConfigKey.SECRET_NAME_KEY + ":" + SystemConfigKey.SECRET_NAME_DEFAULT + "}")
    private String secretName = SystemConfigKey.SECRET_NAME_DEFAULT;

    /**
     * AI代理连接超时时间（毫秒）
     * 默认值为5000毫秒
     */
    @Value("${" + SystemConfigKey.AI_PROXY_CONNECTION_TIMEOUT_KEY + ":"
        + SystemConfigKey.AI_PROXY_CONNECTION_TIMEOUT_DEFAULT + "}")
    private int connectionTimeout = SystemConfigKey.AI_PROXY_CONNECTION_TIMEOUT_DEFAULT;

    /**
     * AI代理套接字超时时间（毫秒）
     * 默认值为30000毫秒
     */
    @Value("${" + SystemConfigKey.AI_PROXY_SOCKET_TIMEOUT_KEY + ":" + SystemConfigKey.AI_PROXY_SOCKET_TIMEOUT_DEFAULT
        + "}")
    private int socketTimeout = SystemConfigKey.AI_PROXY_SOCKET_TIMEOUT_DEFAULT;

    /**
     * 服务信息持有者
     * 使用原子引用保证线程安全
     */
    private final AtomicReference<ServiceInfo> serviceInfoHolder = new AtomicReference<>();

    /**
     * HTTP客户端实例
     * 用于向目标AI服务发送请求
     */
    private CloseableHttpClient client;

    /**
     * Kubernetes客户端服务
     * 用于读取存储在Kubernetes Secret中的配置信息
     */
    private KubernetesClientService kubernetesClientService;

    /**
     * 注入Kubernetes客户端服务依赖
     *
     * @param kubernetesClientService Kubernetes客户端服务实例
     */
    @Autowired
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    /**
     * 初始化方法
     * 在Bean创建完成后执行，用于初始化HTTP客户端和服务信息
     */
    @PostConstruct
    public void initialize() {
        // 配置HTTP请求参数
        RequestConfig requestConfig =
            RequestConfig.custom().setConnectTimeout(connectionTimeout).setSocketTimeout(socketTimeout).build();
        // 创建HTTP客户端
        client = HttpClients.custom().setDefaultRequestConfig(requestConfig).build();

        // 如果配置了serviceUrl，则直接使用配置值
        if (!Strings.isNullOrEmpty(serviceUrl)) {
            serviceInfoHolder.set(new ServiceInfo(serviceUrl, serviceToken));
        } else {
            // 否则从Kubernetes Secret中加载配置，并定期刷新
            reloadServiceInfoFromK8s();
            ThreadFactory tf =
                new ThreadFactoryBuilder().setDaemon(true).setNameFormat("AiProxyController-SecretLoader-%d").build();
            new ScheduledThreadPoolExecutor(1, tf).scheduleWithFixedDelay(this::reloadServiceInfoFromK8s,
                    SECRET_RELOAD_INTERVAL, SECRET_RELOAD_INTERVAL, TimeUnit.MILLISECONDS);
        }
    }

    /**
     * 从Kubernetes Secret重新加载服务信息
     * 读取Secret中的配置并更新到serviceInfoHolder中
     */
    private void reloadServiceInfoFromK8s() {
        try {
            // 读取指定名称的Secret
            V1Secret secret = kubernetesClientService.readSecret(secretName);
            if (secret == null) {
                return;
            }

            // 获取Secret中的数据
            Map<String, byte[]> data = secret.getData();
            if (MapUtils.isEmpty(data)) {
                return;
            }

            // 提取服务URL和令牌数据
            byte[] serviceUrlData = data.get(SERVICE_URL_KEY);
            byte[] serviceTokenData = data.get(SERVICE_TOKEN_KEY);
            if (serviceUrlData == null || serviceUrlData.length == 0 || serviceTokenData == null
                || serviceTokenData.length == 0) {
                return;
            }

            // 更新服务信息
            serviceInfoHolder.set(new ServiceInfo(new String(serviceUrlData), new String(serviceTokenData)));
        } catch (Exception ex) {
            log.error("Failed to reload AI service info from K8s.", ex);
        }
    }

    /**
     * 代理请求处理方法
     * 捕获所有匹配 /aiproxy/** 的请求并转发到目标AI服务
     *
     * @param req HTTP请求对象
     * @param resp HTTP响应对象
     * @return null（响应通过resp直接输出）
     * @throws IOException IO异常
     */
    @RequestMapping("/**")
    public Object proxy(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 获取当前服务信息
        ServiceInfo serviceInfo = serviceInfoHolder.get();
        if (serviceInfo == null || serviceInfo.isInvalid()) {
            throw new IllegalStateException("No valid service info is available for proxying.");
        }

        try {
            // 构建目标请求
            RequestBuilder requestBuilder =
                RequestBuilder.create(req.getMethod()).setUri(buildTargetUrl(serviceInfo, req));

            // 对于POST和PUT请求，设置请求体
            final String method = req.getMethod().toUpperCase(Locale.ROOT);
            if ("POST".equals(method) || "PUT".equals(method)) {
                HttpEntity entity =
                    new BufferedHttpEntity(new InputStreamEntity(req.getInputStream(), req.getContentLength()));
                requestBuilder.setEntity(entity);
            }

            // 设置请求头，过滤掉无效的请求头
            for (Enumeration<String> headerNames = req.getHeaderNames(); headerNames.hasMoreElements();) {
                String name = headerNames.nextElement().toLowerCase();
                String value = req.getHeader(name);
                if (!INVALID_REQUEST_HEADERS.contains(name)) {
                    requestBuilder.setHeader(new BasicHeader(name, value));
                }
            }

            // 设置授权头
            String serviceToken = serviceInfo.getServiceToken();
            if (!Strings.isNullOrEmpty(serviceToken)) {
                requestBuilder.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + serviceToken);
            }

            // 执行请求并转发响应
            try (CloseableHttpResponse response = client.execute(requestBuilder.build())) {
                forwardResponse(resp, response);
            }
        } catch (Exception ex) {
            // 处理异常情况，返回错误响应
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType(ContentType.APPLICATION_JSON.getMimeType());
            Response<Object> response = Response.failure(ex);
            resp.getWriter().write(JSON.toJSONString(response));
        }
        return null;
    }

    /**
     * 构建目标服务URL
     * 将原始请求路径映射到目标服务的对应路径
     *
     * @param serviceInfo 服务信息
     * @param req HTTP请求对象
     * @return 目标服务的完整URL
     */
    private String buildTargetUrl(ServiceInfo serviceInfo, HttpServletRequest req) {
        final String baseUrl = serviceInfo.getServiceUrl();
        if (Strings.isNullOrEmpty(baseUrl)) {
            throw new IllegalStateException("Missing serviceUrl.");
        }

        String url = baseUrl;

        // 提取相对路径部分
        String originalRequestUri = req.getRequestURI();
        int basePathStartIndex = originalRequestUri.indexOf(BASE_PATH);
        String relativePath = originalRequestUri.substring(basePathStartIndex + BASE_PATH.length());
        if (!relativePath.isEmpty()) {
            // 处理路径分隔符
            if (url.endsWith("/") && relativePath.startsWith("/")) {
                relativePath = relativePath.substring(1);
            }
        }
        url = url + "/" + relativePath;

        // 添加查询参数
        if (!Strings.isNullOrEmpty(req.getQueryString())) {
            url = url + "?" + req.getQueryString();
        }

        return url;
    }

    /**
     * 转发目标服务的响应到客户端
     *
     * @param resp 客户端HTTP响应对象
     * @param response 目标服务的HTTP响应对象
     * @throws IOException IO异常
     */
    private void forwardResponse(HttpServletResponse resp, CloseableHttpResponse response) throws IOException {
        // 设置响应状态码
        resp.setStatus(response.getStatusLine().getStatusCode());

        // 设置响应头，过滤掉无效的响应头
        for (Header header : response.getAllHeaders()) {
            String name = header.getName().toLowerCase(Locale.ROOT);
            String value = header.getValue();
            if (!INVALID_RESPONSE_HEADERS.contains(name)) {
                resp.setHeader(name, value);
            }
        }

        // 转发响应体
        try (InputStream input = response.getEntity().getContent()) {
            OutputStream output = resp.getOutputStream();
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
                output.flush();
            }
        }
    }

    /**
     * 服务信息内部类
     * 用于封装AI代理服务的URL和令牌信息
     */
    @Data
    @AllArgsConstructor
    private static class ServiceInfo {

        /**
         * 服务URL
         */
        private String serviceUrl;

        /**
         * 服务令牌
         */
        private String serviceToken;

        /**
         * 检查服务信息是否有效
         *
         * @return 如果serviceUrl为空则返回true，否则返回false
         */
        public boolean isInvalid() {
            return Strings.isNullOrEmpty(serviceUrl);
        }
    }
}
