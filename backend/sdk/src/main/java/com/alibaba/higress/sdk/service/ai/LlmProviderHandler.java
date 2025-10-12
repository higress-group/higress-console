/**
 * LLM提供者处理器接口
 * 
 * 定义了LLM（大型语言模型）提供者的配置处理逻辑，包括：
 * - 提供者类型识别：获取提供者的类型标识
 * - 配置加载和保存：处理提供者配置的读取和持久化
 * - 配置规范化：验证和标准化配置值
 * - 服务源构建：根据配置生成服务源对象
 * - 上游服务构建：生成负载均衡所需的上游服务配置
 * - 路由同步：判断提供者更新后是否需要同步相关AI路由
 * 
 * 该接口为不同类型的LLM提供者（如OpenAI、Azure、通义千问等）提供统一的处理规范。
 */
package com.alibaba.higress.sdk.service.ai;

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.route.UpstreamService;

/**
 * LLM提供者处理器接口定义
 * 
 * 为不同类型的LLM提供者提供统一的配置处理和服务构建规范。
 */
interface LlmProviderHandler {

    /**
     * 获取提供者类型
     * 
     * @return 提供者的类型标识符
     */
    String getType();

    /**
     * 创建LLM提供者实例
     * 
     * 默认实现创建一个新的LLM提供者对象，子类可以重写以提供自定义的提供者实例。
     * 
     * @return 新创建的LLM提供者对象
     */
    default LlmProvider createProvider() {
        return new LlmProvider();
    }

    /**
     * 加载配置
     * 
     * 从配置映射中加载LLM提供者的配置信息到提供者对象中。
     * 
     * @param provider LLM提供者对象
     * @param configurations 配置映射
     * @return 如果成功加载配置返回true，否则返回false
     */
    boolean loadConfig(LlmProvider provider, Map<String, Object> configurations);

    /**
     * 保存配置
     * 
     * 将LLM提供者对象的配置信息保存到配置映射中。
     * 
     * @param provider LLM提供者对象
     * @param configurations 目标配置映射
     */
    void saveConfig(LlmProvider provider, Map<String, Object> configurations);

    /**
     * 规范化配置
     * 
     * 验证提供者配置并根据提供者类型标准化配置值。
     * 
     * @param configurations 提供者配置映射
     */
    void normalizeConfigs(Map<String, Object> configurations);

    /**
     * 获取服务源名称
     * 
     * 根据提供者名称生成对应的服务源名称。
     * 
     * @param providerName 提供者名称
     * @return 服务源名称
     */
    String getServiceSourceName(String providerName);

    /**
     * 构建服务源
     * 
     * 根据提供者配置构建服务源对象，用于描述后端服务的连接信息。
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建的服务源对象
     */
    ServiceSource buildServiceSource(String providerName, Map<String, Object> providerConfig);

    /**
     * 获取额外的服务源
     * 
     * 某些LLM提供者可能需要额外的服务源，子类可以重写此方法提供额外的服务源列表。
     * 默认实现返回null，表示不需要额外的服务源。
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @param forDelete 是否为删除操作
     * @return 额外的服务源列表，如果没有则返回null
     */
    default List<ServiceSource> getExtraServiceSources(String providerName, Map<String, Object> providerConfig,
        boolean forDelete) {
        return null;
    }

    /**
     * 构建上游服务
     * 
     * 根据提供者配置构建上游服务对象，用于负载均衡配置。
     * 
     * @param providerName 提供者名称
     * @param providerConfig 提供者配置映射
     * @return 构建的上游服务对象
     */
    UpstreamService buildUpstreamService(String providerName, Map<String, Object> providerConfig);

    /**
     * 是否需要更新后同步路由
     * 
     * 对于某些LLM提供者，更新后上游服务名称可能会改变，因此需要在更新提供者后同步相关AI路由的配置。
     * 默认实现返回false，表示不需要同步。
     * 
     * @return 如果需要同步返回true，否则返回false
     */
    default boolean needSyncRouteAfterUpdate() {
        return false;
    }
}
