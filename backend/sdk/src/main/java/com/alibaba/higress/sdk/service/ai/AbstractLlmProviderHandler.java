package com.alibaba.higress.sdk.service.ai;

/**
 * 抽象LLM提供者处理器
 * 
 * 该类提供了LLM（大型语言模型）提供者配置的通用处理逻辑，包括：
 * - 配置加载和保存
 * - 服务源构建
 * - 上游服务构建
 * - 令牌故障转移配置处理
 * 
 * 作为所有具体LLM提供者处理器的基类，定义了标准处理流程和通用方法。
 */

import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_FAILURE_THRESHOLD;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_INTERVAL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_MODEL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_HEALTH_CHECK_TIMEOUT;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.FAILOVER_SUCCESS_THRESHOLD;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROTOCOL;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_API_TOKENS;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_ID;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_TYPE;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ENABLED;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.RETRY_ON_FAILURE;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.TokenFailoverConfig;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.MapUtil;
import com.alibaba.higress.sdk.util.ValidateUtil;

/**
 * 抽象LLM提供者处理器实现类
 * 
 * 实现了LlmProviderHandler接口的通用功能，为具体的LLM提供者处理器提供基础实现。
 * 处理配置加载、服务源构建、上游服务构建等核心功能。
 */
abstract class AbstractLlmProviderHandler implements LlmProviderHandler {

    @Override
    public abstract String getType();

/**
     * 加载LLM提供者配置
     * 
     * 从配置映射中加载LLM提供者的各项配置信息，包括：
     * - 提供者ID：必需字段，用于标识提供者
     * - API令牌列表：可选的API访问令牌集合
     * - 故障转移配置：可选的令牌故障转移设置
     * - 协议类型：通信协议，如OpenAI、Azure等
     * 
     * @param provider LLM提供者对象，用于存储加载的配置
     * @param configurations 配置映射，包含提供者的各项配置参数
     * @return 如果成功加载配置返回true，如果缺少必需字段返回false
     */
    @Override
    @SuppressWarnings("unchecked")
    public boolean loadConfig(LlmProvider provider, Map<String, Object> configurations) {
        // 获取提供者ID，这是必需字段
        String id = MapUtils.getString(configurations, PROVIDER_ID);
        if (StringUtils.isBlank(id)) {
            return false; // 缺少必需字段，加载失败
        }

        // 处理API令牌列表
        Object tokensObj = configurations.get(PROVIDER_API_TOKENS);
        List<String> tokens = null;
        if (tokensObj instanceof List<?>) {
            List<?> tokensList = (List<?>)tokensObj;
            tokens = new ArrayList<>(tokensList.size());
            for (Object tokenObj : tokensList) {
                if (tokenObj instanceof String) {
                    tokens.add((String)tokenObj);
                }
            }
        }

        // 处理故障转移配置
        TokenFailoverConfig failoverConfig = null;
        Object failoverObj = configurations.get(FAILOVER);
        if (failoverObj instanceof Map<?, ?>) {
            failoverConfig = buildTokenFailoverConfig((Map<String, Object>)failoverObj);
        }

        // 处理协议类型
        LlmProviderProtocol protocol =
            LlmProviderProtocol.fromPluginValue(MapUtils.getString(configurations, PROTOCOL));
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT; // 默认协议
        }
        provider.setProtocol(protocol.getValue());

        // 设置提供者基本信息
        provider.setName(id);
        provider.setType(getType());
        provider.setTokens(tokens);
        provider.setTokenFailoverConfig(failoverConfig);
        provider.setRawConfigs(new HashMap<>(configurations));
        return true;
    }

/**
     * 保存LLM提供者配置
     * 
     * 将LLM提供者对象的配置信息保存到配置映射中，包括：
     * - 提供者ID和类型：基本信息标识
     * - 协议类型：通信协议设置
     * - API令牌列表：可选的访问令牌
     * - 故障转移配置：可选的故障转移设置
     * - 重试配置：基于故障转移的重试设置
     * 
     * @param provider LLM提供者对象，包含要保存的配置信息
     * @param configurations 目标配置映射，用于存储配置信息
     */
    @Override
    public void saveConfig(LlmProvider provider, Map<String, Object> configurations) {
        // 保存基本信息
        configurations.put(PROVIDER_ID, provider.getName());
        configurations.put(PROVIDER_TYPE, getType());

        // 处理协议类型
        LlmProviderProtocol protocol = LlmProviderProtocol.fromValue(provider.getProtocol());
        if (protocol == null) {
            protocol = LlmProviderProtocol.DEFAULT;
            configurations.put(PROTOCOL, protocol.getPluginValue());
        }

        // 处理API令牌
        List<String> tokens = provider.getTokens();
        if (CollectionUtils.isNotEmpty(tokens)) {
            configurations.put(PROVIDER_API_TOKENS, tokens);
        } else {
            configurations.remove(PROVIDER_API_TOKENS);
        }

        // 处理故障转移配置
        TokenFailoverConfig failoverConfig = provider.getTokenFailoverConfig();
        if (failoverConfig == null) {
            // 移除故障转移相关配置
            configurations.remove(FAILOVER);
            configurations.remove(RETRY_ON_FAILURE);
        } else {
            // 保存故障转移配置
            Map<String, Object> failoverMap = new HashMap<>();
            saveTokenFailoverConfig(failoverConfig, failoverMap);
            configurations.put(FAILOVER, failoverMap);
            // 设置重试配置
            Map<String, Object> retryOnFailureMap = MapUtil.of(RETRY_ENABLED, failoverConfig.getEnabled());
            configurations.put(RETRY_ON_FAILURE, retryOnFailureMap);
        }
    }

/**
     * 规范化配置
     * 
     * 对配置进行标准化处理，子类可以重写此方法以实现特定的配置规范化逻辑。
     * 默认实现为空，不执行任何操作。
     * 
     * @param configurations 要规范化的配置映射
     */
    @Override
    public void normalizeConfigs(Map<String, Object> configurations) {}

    @Override
    public final String getServiceSourceName(String providerName) {
        return generateServiceProviderName(providerName);
    }

/**
     * 构建服务源
     * 
     * 根据提供者配置构建服务源对象，用于描述后端服务的连接信息。
     * 处理逻辑包括：
     * - 验证端点信息：确保所有端点有效
     * - 统一协议检查：所有端点必须使用相同协议
     * - 统一路径检查：所有端点必须使用相同上下文路径
     * - 地址类型判断：区分静态IP和DNS域名
     * - 服务源构建：设置类型、协议、域名和端口
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建完成的服务源对象
     * @throws ValidationException 如果配置无效或端点信息冲突
     */
    @Override
    public ServiceSource buildServiceSource(String providerName, Map<String, Object> providerConfig) {
        ServiceSource serviceSource = new ServiceSource();
        serviceSource.setName(generateServiceProviderName(providerName));
        
        // 获取提供者端点列表
        List<LlmProviderEndpoint> endpoints = getProviderEndpoints(providerConfig);
        if (CollectionUtils.isEmpty(endpoints)) {
            throw new ValidationException("No endpoints found for provider: " + providerName);
        }
        
        String type = null, protocol = null, contextPath = null;
        List<String> domains = new ArrayList<>(endpoints.size());
        Integer port = null;
        
        // 遍历处理每个端点
        for (LlmProviderEndpoint endpoint : endpoints) {
            if (endpoint == null) {
                continue;
            }
            endpoint.validate(); // 验证端点信息

            // 检查协议一致性
            if (protocol != null && !protocol.equals(endpoint.getProtocol())) {
                throw new ValidationException("Multiple protocols found in the endpoints of provider: " + providerName);
            }
            protocol = endpoint.getProtocol();

            // 检查上下文路径一致性
            if (contextPath != null && !contextPath.equals(endpoint.getContextPath())) {
                throw new ValidationException(
                    "Multiple context paths found in the endpoints of provider: " + providerName);
            }
            contextPath = endpoint.getContextPath();

            // 判断地址类型并处理
            String endpointSourceType;
            if (ValidateUtil.checkIpAddress(endpoint.getAddress())) {
                // 静态IP地址
                endpointSourceType = V1McpBridge.REGISTRY_TYPE_STATIC;
                domains.add(endpoint.getAddress() + Separators.COLON + endpoint.getPort());
                port = V1McpBridge.STATIC_PORT;
            } else {
                // DNS域名，多个端点时不支持DNS类型
                if (endpoints.size() > 1) {
                    throw new ValidationException(
                        "Multiple endpoints only work with static IP addresses, provider: " + providerName);
                }
                port = endpoint.getPort();
                endpointSourceType = V1McpBridge.REGISTRY_TYPE_DNS;
                domains.add(endpoint.getAddress());
            }
            
            // 检查端点类型一致性
            if (type != null && !type.equals(endpointSourceType)) {
                throw new ValidationException("Multiple types of endpoints found for provider: " + providerName);
            }
            type = endpointSourceType;
        }
        
        // 设置服务源属性
        serviceSource.setType(type);
        serviceSource.setProtocol(protocol);
        serviceSource.setDomain(String.join(Separators.COMMA, domains));
        serviceSource.setPort(port);
        return serviceSource;
    }

/**
     * 构建上游服务
     * 
     * 根据提供者配置构建上游服务对象，用于描述负载均衡中的后端服务实例。
     * 基于服务源信息构建，设置服务名称、端口和权重。
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建完成的上游服务对象
     */
    @Override
    public UpstreamService buildUpstreamService(String providerName, Map<String, Object> providerConfig) {
        // 首先构建服务源
        ServiceSource serviceSource = buildServiceSource(providerName, providerConfig);

        // 构建上游服务
        UpstreamService service = new UpstreamService();
        service.setName(serviceSource.getName() + Separators.DOT + serviceSource.getType());
        service.setPort(serviceSource.getPort());
        service.setWeight(100); // 默认权重100
        return service;
    }

    protected abstract List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig);

/**
     * 获取整数配置值
     * 
     * 从配置映射中获取指定键的整数值，支持Integer类型和String类型的转换。
     * 如果值为字符串类型，会尝试解析为整数；如果解析失败或值类型不支持，抛出验证异常。
     * 
     * @param providerConfig 配置映射
     * @param key 配置键名
     * @return 整数值
     * @throws ValidationException 如果值不是有效的数字
     */
    protected static int getIntConfig(Map<String, Object> providerConfig, String key) {
        Object serverPortObj = providerConfig.get(key);
        
        // 直接返回Integer类型
        if (serverPortObj instanceof Integer) {
            return (Integer)serverPortObj;
        }
        
        // 尝试将字符串转换为整数
        if (serverPortObj instanceof String) {
            try {
                String serverPortStr = (String)serverPortObj;
                return Integer.parseInt(serverPortStr);
            } catch (NumberFormatException e) {
                throw new ValidationException(key + " must be a number.");
            }
        }
        
        // 不支持的类型
        throw new ValidationException(key + " must be a number.");
    }

/**
     * 生成服务提供者名称
     * 
     * 根据LLM提供者名称生成对应的服务提供者名称，使用预定义的前缀和后缀进行格式化。
     * 生成的名称格式为：LLM_SERVICE_NAME_PREFIX + llmProviderName + INTERNAL_RESOURCE_NAME_SUFFIX
     * 
     * @param llmProviderName LLM提供者名称
     * @return 格式化后的服务提供者名称
     */
    protected static String generateServiceProviderName(String llmProviderName) {
        return CommonKey.LLM_SERVICE_NAME_PREFIX + llmProviderName + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }

/**
     * 构建令牌故障转移配置
     * 
     * 从配置映射中构建令牌故障转移配置对象，包含以下参数：
     * - 启用状态：是否启用故障转移功能
     * - 失败阈值：触发故障转移的失败次数阈值
     * - 成功阈值：恢复正常所需的成功次数阈值
     * - 健康检查间隔：健康检查的执行间隔（秒）
     * - 健康检查超时：健康检查的超时时间（秒）
     * - 健康检查模型：用于健康检查的AI模型
     * 
     * @param failoverMap 故障转移配置映射
     * @return 构建的令牌故障转移配置对象，如果配置为空则返回null
     */
    private TokenFailoverConfig buildTokenFailoverConfig(Map<String, Object> failoverMap) {
        if (MapUtils.isEmpty(failoverMap)) {
            return null;
        }
        
        TokenFailoverConfig failoverConfig = new TokenFailoverConfig();
        failoverConfig.setEnabled(MapUtils.getBoolean(failoverMap, FAILOVER_ENABLED, false));
        failoverConfig.setFailureThreshold(MapUtils.getInteger(failoverMap, FAILOVER_FAILURE_THRESHOLD));
        failoverConfig.setSuccessThreshold(MapUtils.getInteger(failoverMap, FAILOVER_SUCCESS_THRESHOLD));
        failoverConfig.setHealthCheckInterval(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_INTERVAL));
        failoverConfig.setHealthCheckTimeout(MapUtils.getInteger(failoverMap, FAILOVER_HEALTH_CHECK_TIMEOUT));
        failoverConfig.setHealthCheckModel(MapUtils.getString(failoverMap, FAILOVER_HEALTH_CHECK_MODEL));
        return failoverConfig;
    }

/**
     * 保存令牌故障转移配置
     * 
     * 将令牌故障转移配置对象的属性保存到配置映射中，包含以下字段：
     * - 启用状态：故障转移功能是否启用
     * - 失败阈值：触发故障转移的失败次数
     * - 成功阈值：恢复正常所需的成功次数
     * - 健康检查间隔：健康检查的执行间隔
     * - 健康检查超时：健康检查的超时时间
     * - 健康检查模型：用于健康检查的AI模型名称
     * 
     * @param failoverConfig 令牌故障转移配置对象
     * @param failoverMap 目标配置映射
     */
    private void saveTokenFailoverConfig(TokenFailoverConfig failoverConfig, Map<String, Object> failoverMap) {
        failoverMap.put(FAILOVER_ENABLED, failoverConfig.getEnabled());
        failoverMap.put(FAILOVER_FAILURE_THRESHOLD, failoverConfig.getFailureThreshold());
        failoverMap.put(FAILOVER_SUCCESS_THRESHOLD, failoverConfig.getSuccessThreshold());
        failoverMap.put(FAILOVER_HEALTH_CHECK_INTERVAL, failoverConfig.getHealthCheckInterval());
        failoverMap.put(FAILOVER_HEALTH_CHECK_TIMEOUT, failoverConfig.getHealthCheckTimeout());
        failoverMap.put(FAILOVER_HEALTH_CHECK_MODEL, failoverConfig.getHealthCheckModel());
    }
}
