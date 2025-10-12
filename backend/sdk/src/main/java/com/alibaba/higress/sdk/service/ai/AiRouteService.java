/**
 * AI路由服务接口
 * 
 * 定义了AI路由相关的核心业务操作，包括：
 * - 添加AI路由：创建新的AI路由配置
 * - 查询AI路由列表：分页查询AI路由配置
 * - 查询单个AI路由：根据名称查询特定的AI路由
 * - 删除AI路由：删除指定的AI路由配置
 * - 更新AI路由：修改现有的AI路由配置
 * 
 * 该接口负责管理AI路由的生命周期，为AI请求提供路由转发功能。
 */
package com.alibaba.higress.sdk.service.ai;

import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.AiRoute;

/**
 * AI路由服务接口定义
 * 
 * 提供了AI路由的完整CRUD操作接口，支持分页查询和精确查询。
 */
public interface AiRouteService {

    /**
     * 添加AI路由
     * 
     * 创建新的AI路由配置，用于将AI请求路由到指定的后端服务。
     * 
     * @param route AI路由对象，包含路由配置信息
     * @return 创建成功的AI路由对象
     */
    AiRoute add(AiRoute route);

    /**
     * 查询AI路由列表
     * 
     * 分页查询AI路由配置列表，支持排序和过滤条件。
     * 
     * @param query 分页查询条件
     * @return 分页查询结果，包含AI路由列表和分页信息
     */
    PaginatedResult<AiRoute> list(CommonPageQuery query);

    /**
     * 查询单个AI路由
     * 
     * 根据路由名称查询特定的AI路由配置。
     * 
     * @param routeName 路由名称
     * @return 查询到的AI路由对象，如果不存在则返回null
     */
    AiRoute query(String routeName);

    /**
     * 删除AI路由
     * 
     * 删除指定名称的AI路由配置。
     * 
     * @param routeName 要删除的路由名称
     */
    void delete(String routeName);

    /**
     * 更新AI路由
     * 
     * 修改现有的AI路由配置信息。
     * 
     * @param route 包含更新信息的AI路由对象
     * @return 更新后的AI路由对象
     */
    AiRoute update(AiRoute route);
}
