/**
 * LLM提供者服务接口
 * 
 * 定义了LLM（大型语言模型）提供者的核心业务操作，包括：
 * - 添加或更新提供者：创建新的提供者或更新现有提供者配置
 * - 查询提供者列表：分页查询所有LLM提供者
 * - 查询单个提供者：根据名称查询特定的LLM提供者
 * - 删除提供者：删除指定的LLM提供者
 * - 构建上游服务：根据提供者配置生成负载均衡所需的上游服务
 * 
 * 该接口负责管理LLM提供者的完整生命周期，为AI路由提供后端服务支持。
 */
package com.alibaba.higress.sdk.service.ai;

import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.route.UpstreamService;

/**
 * LLM提供者服务接口定义
 * 
 * 提供了LLM提供者的完整CRUD操作接口，支持分页查询和上游服务构建。
 */
public interface LlmProviderService {

    /**
     * 添加或更新提供者
     * 
     * 创建新的LLM提供者或更新现有提供者的配置信息。
     * 如果提供者名称已存在则执行更新操作，否则创建新的提供者。
     * 
     * @param provider LLM提供者对象，包含提供者配置信息
     * @return 创建或更新成功的LLM提供者对象
     */
    LlmProvider addOrUpdate(LlmProvider provider);

    /**
     * 查询提供者列表
     * 
     * 分页查询所有LLM提供者的配置列表，支持排序和过滤条件。
     * 
     * @param query 分页查询条件
     * @return 分页查询结果，包含LLM提供者列表和分页信息
     */
    PaginatedResult<LlmProvider> list(CommonPageQuery query);

    /**
     * 查询单个提供者
     * 
     * 根据提供者名称查询特定的LLM提供者配置。
     * 
     * @param providerName 提供者名称
     * @return 查询到的LLM提供者对象，如果不存在则返回null
     */
    LlmProvider query(String providerName);

    /**
     * 删除提供者
     * 
     * 删除指定名称的LLM提供者配置。
     * 
     * @param providerName 要删除的提供者名称
     */
    void delete(String providerName);

    /**
     * 构建上游服务
     * 
     * 根据提供者配置生成负载均衡所需的上游服务对象。
     * 该服务用于将AI请求路由到对应的后端LLM服务。
     * 
     * @param providerName 提供者名称
     * @return 构建的上游服务对象
     */
    UpstreamService buildUpstreamService(String providerName);
}
