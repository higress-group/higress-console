/**
 * 通义千问LLM提供者处理器
 * 
 * 专门处理通义千问（Qwen）类型的大型语言模型提供者配置，包括：
 * - 通义千问官方API服务的默认配置
 * - 自定义域名支持
 * - 搜索功能配置
 * - 兼容模式配置
 * - 文件ID列表配置
 * 
 * 支持通义千问的各种高级功能，如联网搜索、兼容模式等。
 */
package com.alibaba.higress.sdk.service.ai;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Map;


/**
 * 通义千问LLM提供者处理器实现类
 * 
 * 继承自AbstractLlmProviderHandler，专门处理通义千问类型的LLM提供者。
 * 支持通义千问官方API和各种高级功能配置。
 */
public class QwenLlmProviderHandler extends AbstractLlmProviderHandler{

    /**
     * 默认服务端口
     * 
     * 通义千问官方API服务的默认HTTPS端口
     */
    private static final int DEFAULT_SERVICE_PORT = 443;

    /**
     * 默认服务协议
     * 
     * 通义千问官方API服务的默认协议（HTTPS）
     */
    private static final String DEFAULT_SERVICE_PROTOCOL = V1McpBridge.PROTOCOL_HTTPS;

    /**
     * 默认服务域名
     * 
     * 通义千问官方API服务的默认域名
     */
    private static final String DEFAULT_SERVICE_DOMAIN = "dashscope.aliyuncs.com";

    /**
     * 自定义域名配置键
     * 
     * 用于指定通义千问服务的自定义域名
     */
    private static final String CUSTOM_DOMAIN_KEY = "qwenDomain";

    /**
     * 默认端点列表
     * 
     * 通义千问官方API服务的默认端点配置，使用HTTPS协议和根路径
     */
    private static final List<LlmProviderEndpoint> DEFAULT_ENDPOINTS =
            Collections.singletonList(new LlmProviderEndpoint(DEFAULT_SERVICE_PROTOCOL, DEFAULT_SERVICE_DOMAIN, DEFAULT_SERVICE_PORT, "/"));

    /**
     * 启用搜索配置键
     * 
     * 控制是否启用通义千问的联网搜索功能
     */
    private static final String ENABLE_SEARCH_KEY = "qwenEnableSearch";

    /**
     * 启用兼容模式配置键
     * 
     * 控制是否启用通义千问的兼容模式
     */
    private static final String ENABLE_COMPATIBLE_KEY = "qwenEnableCompatible";

    /**
     * 文件ID列表配置键
     * 
     * 指定通义千问使用的文件ID列表
     */
    private static final String FILE_IDS_KEY = "qwenFileIds";

/**
     * 规范化配置
     * 
     * 验证和标准化通义千问提供者的配置，执行以下操作：
     * 1. 验证配置不为空
     * 2. 设置搜索功能的默认值（false）
     * 3. 设置兼容模式的默认值（false）
     * 4. 验证文件ID列表配置的类型（如果存在）
     * 
     * @param configurations 提供者配置映射
     * @throws ValidationException 如果配置无效
     */
    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            throw new ValidationException("Missing Qwen specific configurations.");
        }

        // 设置搜索功能的默认值
        Boolean searchVal = MapUtils.getBoolean(configurations, ENABLE_SEARCH_KEY, Boolean.FALSE);
        configurations.put(ENABLE_SEARCH_KEY, searchVal);

        // 设置兼容模式的默认值
        Boolean compatibleVal = MapUtils.getBoolean(configurations, ENABLE_COMPATIBLE_KEY, Boolean.FALSE);
        configurations.put(ENABLE_COMPATIBLE_KEY, compatibleVal);

        // 验证文件ID列表配置
        if (configurations.containsKey(FILE_IDS_KEY)) {
            Object fileIdsVal = configurations.get(FILE_IDS_KEY);
            if (!(fileIdsVal instanceof List)) {
                throw new ValidationException("Invalid configuration: " + FILE_IDS_KEY);
            }
        }
    }


/**
     * 获取提供者类型
     * 
     * @return 通义千问类型的标识符
     */
    @Override
    public String getType() {
        return LlmProviderType.QWEN;
    }

/**
     * 获取提供者端点列表
     * 
     * 根据配置获取通义千问提供者的端点信息。处理逻辑：
     * - 如果有自定义域名，使用该域名构建端点
     * - 如果没有自定义域名，返回默认端点
     * 
     * @param providerConfig 提供者配置映射
     * @return 端点对象列表
     */
    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        URI customUrl = getCustomUrl(providerConfig);
        if(customUrl != null){
            // 有自定义域名，使用该域名构建端点
            return Collections.singletonList(LlmProviderEndpoint.fromUri(customUrl));
        }
        // 没有自定义域名，返回默认端点
        return DEFAULT_ENDPOINTS;
    }
/**
     * 获取自定义URL
     * 
     * 从配置中提取自定义域名并构建URI对象。使用HTTPS协议和根路径，
     * 只支持自定义域名而不支持完整的URL格式。
     * 
     * @param providerConfig 提供者配置映射
     * @return 自定义URI对象，如果没有配置则返回null
     * @throws ValidationException 如果域名格式无效
     */
    private URI getCustomUrl(Map<String, Object> providerConfig) {
        // 获取自定义域名
        Object rawCustomDomainObject = providerConfig.get(CUSTOM_DOMAIN_KEY);
        if (!(rawCustomDomainObject instanceof String)) {
            return null;
        }
        String rawCustomDomain = ((String) rawCustomDomainObject).trim();
        if (StringUtils.isEmpty(rawCustomDomain)) {
            return null;
        }

        // 使用HTTPS协议和根路径构建URI
        String scheme = V1McpBridge.PROTOCOL_HTTPS;
        String path = "/";

        try {
            return new URI(scheme, rawCustomDomain, path, null);
        } catch (URISyntaxException e) {
            throw new ValidationException(CUSTOM_DOMAIN_KEY + " contains an invalid domain name: " + rawCustomDomain, e);
        }
    }

}
