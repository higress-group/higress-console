/**
 * OpenAI LLM提供者处理器
 * 
 * 专门处理OpenAI类型的大型语言模型提供者配置，包括：
 * - OpenAI官方API服务的默认配置
 * - 自定义OpenAI兼容服务的支持
 * - 多个自定义URL的配置和管理
 * - 自定义上游服务的直接指定
 * 
 * 支持标准OpenAI API格式，同时兼容OpenAI兼容的第三方服务。
 */
package com.alibaba.higress.sdk.service.ai;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

/**
 * OpenAI LLM提供者处理器实现类
 * 
 * 继承自AbstractLlmProviderHandler，专门处理OpenAI类型的LLM提供者。
 * 支持OpenAI官方API和OpenAI兼容的第三方服务配置。
 */
public class OpenaiLlmProviderHandler extends AbstractLlmProviderHandler {

    /**
     * 自定义URL配置键
     * 
     * 用于指定OpenAI兼容服务的自定义URL地址
     */
    private static final String CUSTOM_URL_KEY = "openaiCustomUrl";

    /**
     * 额外自定义URL配置键
     * 
     * 用于指定多个OpenAI兼容服务的自定义URL地址列表
     */
    private static final String EXTRA_CUSTOM_URLS_KEY = "openaiExtraCustomUrls";

    /**
     * 自定义服务名称配置键
     * 
     * 用于直接指定上游服务的名称，跳过服务源构建
     */
    private static final String CUSTOM_SERVICE_NAME_KEY = "openaiCustomServiceName";

    /**
     * 自定义服务端口配置键
     * 
     * 与自定义服务名称配合使用，指定上游服务的端口
     */
    private static final String CUSTOM_SERVICE_PORT_KEY = "openaiCustomServicePort";

    /**
     * 默认服务域名
     * 
     * OpenAI官方API服务的默认域名
     */
    private static final String DEFAULT_SERVICE_DOMAIN = "api.openai.com";

    /**
     * 默认服务端口
     * 
     * OpenAI官方API服务的默认HTTPS端口
     */
    private static final int DEFAULT_SERVICE_PORT = 443;

    /**
     * 默认服务协议
     * 
     * OpenAI官方API服务的默认协议（HTTPS）
     */
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;

    /**
     * 默认端点列表
     * 
     * OpenAI官方API服务的默认端点配置，使用HTTPS协议和/v1路径
     */
    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS = Collections.singletonList(
        new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/v1"));

/**
     * 获取提供者类型
     * 
     * @return OpenAI类型的标识符
     */
    @Override
    public String getType() {
        return LlmProviderType.OPENAI;
    }

/**
     * 规范化配置
     * 
     * 验证和标准化OpenAI提供者的配置，主要检查自定义URL的格式：
     * - 验证自定义URL是否包含协议方案（scheme）
     * - 验证协议方案是否为有效的HTTP或HTTPS
     * 
     * @param configurations 提供者配置映射
     * @throws ValidationException 如果配置无效
     */
    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }
        
        // 获取自定义URL列表进行验证
        List<URI> customUris = getCustomUris(configurations);
        if (CollectionUtils.isEmpty(customUris)) {
            return;
        }
        
        // 验证每个自定义URL的协议方案
        for (URI uri : customUris) {
            String scheme = uri.getScheme();
            if (StringUtils.isEmpty(scheme)) {
                throw new ValidationException("Custom service URL must have a scheme: " + uri);
            }
            scheme = scheme.toLowerCase(Locale.ROOT);
            if (!scheme.equals(V1McpBridge.PROTOCOL_HTTP) && !scheme.equals(V1McpBridge.PROTOCOL_HTTPS)) {
                throw new ValidationException("Custom service URL must have a valid scheme: " + uri);
            }
        }
    }

/**
     * 是否需要更新后同步路由
     * 
     * OpenAI提供者在更新配置后可能需要同步相关AI路由，因为：
     * - 自定义URL可能发生变化
     * - 自定义服务名称和端口可能发生变化
     * - 这些变化会影响上游服务的配置
     * 
     * @return 始终返回true，表示需要同步
     */
    @Override
    public boolean needSyncRouteAfterUpdate() {
        return true;
    }

/**
     * 构建服务源
     * 
     * 根据OpenAI提供者配置构建服务源对象。处理逻辑：
     * - 如果用户指定了自定义上游服务，直接返回null（不需要创建服务源）
     * - 否则调用父类方法，基于端点配置构建服务源
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建的服务源对象，如果不需要则返回null
     */
    @Override
    public ServiceSource buildServiceSource(String providerName, Map<String, Object> providerConfig) {
        UpstreamService upstreamService = getCustomUpstreamService(providerConfig);
        if (upstreamService != null) {
            // 用户指定了自定义上游服务，直接使用，不需要创建服务源
            return null;
        }
        return super.buildServiceSource(providerName, providerConfig);
    }

/**
     * 构建上游服务
     * 
     * 根据OpenAI提供者配置构建上游服务对象。处理逻辑：
     * - 如果用户指定了自定义上游服务，直接返回该服务
     * - 否则调用父类方法，基于服务源构建上游服务
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建的上游服务对象
     */
    @Override
    public UpstreamService buildUpstreamService(String providerName, Map<String, Object> providerConfig) {
        UpstreamService upstreamService = getCustomUpstreamService(providerConfig);
        if (upstreamService != null) {
            // 用户指定了自定义上游服务，直接使用
            return upstreamService;
        }
        return super.buildUpstreamService(providerName, providerConfig);
    }

/**
     * 获取提供者端点列表
     * 
     * 根据配置获取LLM提供者的端点信息。处理逻辑：
     * - 如果有自定义URL，将URL转换为端点对象
     * - 如果没有自定义URL，返回OpenAI官方API的默认端点
     * 
     * @param providerConfig 提供者配置映射
     * @return 端点对象列表
     */
    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        List<URI> customUris = getCustomUris(providerConfig);
        if (CollectionUtils.isEmpty(customUris)) {
            // 没有自定义URL，返回默认端点
            return DEFAULT_ENDPOINTS;
        }
        // 将自定义URL转换为端点对象
        return customUris.stream().map(LlmProviderEndpoint::fromUri).collect(Collectors.toList());
    }

/**
     * 获取自定义上游服务
     * 
     * 从配置中提取自定义上游服务信息。只有当同时指定了自定义服务名称和端口时，
     * 才会构建上游服务对象。如果任一配置缺失，返回null。
     * 
     * @param providerConfig 提供者配置映射
     * @return 自定义上游服务对象，如果没有配置则返回null
     */
    private UpstreamService getCustomUpstreamService(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        
        // 检查自定义服务名称
        Object rawCustomServiceNameObject = providerConfig.get(CUSTOM_SERVICE_NAME_KEY);
        if (!(rawCustomServiceNameObject instanceof String)) {
            return null;
        }
        
        // 检查自定义服务端口
        Object rawCustomServicePortObject = providerConfig.get(CUSTOM_SERVICE_PORT_KEY);
        if (!(rawCustomServicePortObject instanceof Integer)) {
            return null;
        }
        
        // 构建上游服务对象
        return UpstreamService.builder().name((String)rawCustomServiceNameObject)
            .port((Integer)rawCustomServicePortObject).build();
    }

/**
     * 获取自定义URI列表
     * 
     * 从配置中提取自定义URL并转换为URI对象列表。处理逻辑：
     * 1. 获取主要的自定义URL
     * 2. 获取额外的自定义URL列表
     * 3. 验证所有URL不为空
     * 4. 将字符串URL转换为URI对象
     * 
     * @param providerConfig 提供者配置映射
     * @return 自定义URI列表，如果没有配置则返回null
     * @throws ValidationException 如果URL格式无效或配置错误
     */
    private List<URI> getCustomUris(Map<String, Object> providerConfig) {
        if (MapUtils.isEmpty(providerConfig)) {
            return null;
        }
        
        // 获取主要的自定义URL
        Object rawCustomUrlObject = providerConfig.get(CUSTOM_URL_KEY);
        if (!(rawCustomUrlObject instanceof String)) {
            return null;
        }
        String rawCustomUrl = (String)rawCustomUrlObject;
        if (StringUtils.isEmpty(rawCustomUrl)) {
            throw new ValidationException(CUSTOM_URL_KEY + " cannot be empty.");
        }

        List<String> customUrls = new ArrayList<>();
        customUrls.add(rawCustomUrl);

        // 获取额外的自定义URL
        Object rawExtraCustomUrlsObject = providerConfig.get(EXTRA_CUSTOM_URLS_KEY);
        if (rawExtraCustomUrlsObject instanceof List<?>
            && CollectionUtils.isNotEmpty((List<?>)rawExtraCustomUrlsObject)) {
            for (Object extraUrl : (List<?>)rawExtraCustomUrlsObject) {
                if (extraUrl instanceof String && StringUtils.isNotEmpty((String)extraUrl)) {
                    customUrls.add((String)extraUrl);
                } else {
                    throw new ValidationException(EXTRA_CUSTOM_URLS_KEY + " must contain non-empty strings.");
                }
            }
        }

        // 转换为URI对象
        List<URI> customUris = new ArrayList<>();
        for (String customUrl : customUrls) {
            try {
                customUris.add(new URI(customUrl));
            } catch (URISyntaxException e) {
                throw new ValidationException(CUSTOM_URL_KEY + " contains an invalid URL: " + customUrl, e);
            }
        }
        return customUris;
    }
}
