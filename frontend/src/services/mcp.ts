/**
 * MCP (Model Context Protocol) 服务器管理服务模块
 * 提供 MCP 服务器相关的 API 接口，包括服务器的 CRUD 操作、消费者管理等功能
 * MCP 服务器用于提供 AI 模型可以调用的工具和 API 接口
 * 基于 HTTP 请求服务封装，提供类型安全的 MCP 服务器管理操作
 */

// 导入 HTTP 请求服务
import request from '@/services/request';

// 导入 MCP 相关的类型定义
import {
  McpServer,              // MCP 服务器对象
  McpServerPageQuery,     // MCP 服务器分页查询参数
  McpServerConsumers,     // MCP 服务器消费者对象
  McpServerConsumerDetail, // MCP 服务器消费者详情
} from '@/interfaces/mcp';

/**
 * MCP 服务器 API 基础路径
 */
const BASE_URL = '/v1/mcpServer';

/**
 * 获取 MCP 服务器列表
 * 根据查询条件获取 MCP 服务器列表，支持分页查询
 * 
 * @param query - MCP 服务器分页查询参数
 * @returns 返回 MCP 服务器数组的 Promise
 */
export const listMcpServers = (query: McpServerPageQuery): Promise<McpServer[]> => {
  return request.get<any, McpServer[]>(BASE_URL, { params: query });
};

/**
 * 获取指定的 MCP 服务器详情
 * 根据服务器名称获取特定 MCP 服务器的详细信息
 * 
 * @param name - MCP 服务器名称
 * @returns 返回 MCP 服务器详情的 Promise
 */
export const getMcpServer = (name: string): Promise<McpServer> => {
  return request.get<any, McpServer>(`${BASE_URL}/${name}`);
};

/**
 * 创建或更新 MCP 服务器
 * 根据是否提供名称来判断是创建新服务器还是更新现有服务器
 * 有名称时执行更新操作，无名称时执行创建操作
 * 
 * @param payload - MCP 服务器配置对象
 * @returns 返回创建或更新后的 MCP 服务器对象
 */
export const createOrUpdateMcpServer = (payload: McpServer): Promise<McpServer> => {
  return payload.name ?
    request.put<any, McpServer>(BASE_URL, payload) :
    request.post<any, McpServer>(BASE_URL, payload);
};

/**
 * 删除指定的 MCP 服务器
 * 根据服务器名称删除对应的 MCP 服务器配置
 * 
 * @param name - 要删除的 MCP 服务器名称
 * @returns 返回操作结果的 Promise
 */
export const deleteMcpServer = (name: string): Promise<any> => {
  return request.delete<any, any>(`${BASE_URL}/${name}`);
};

/**
 * 添加 MCP 服务器消费者
 * 为指定的 MCP 服务器添加消费者授权，允许特定消费者访问服务器
 * 
 * @param payload - 包含消费者列表和服务器名称的参数对象
 * @returns 返回操作结果的 Promise
 */
export const addMcpConsumers = (payload: { consumers: undefined[]; mcpServerName: string }): Promise<any> => {
  return request.put<any, any>(`${BASE_URL}/consumers`, payload);
};

/**
 * 移除 MCP 服务器消费者
 * 从指定的 MCP 服务器中移除消费者授权
 * 
 * @param payload - 包含要移除的消费者信息的参数对象
 * @returns 返回操作结果的 Promise
 */
export const removeMcpConsumers = (payload: McpServerConsumers): Promise<any> => {
  return request.delete<any, any>(`${BASE_URL}/consumers`, { data: payload });
};

/**
 * 获取 MCP 服务器消费者列表
 * 获取指定 MCP 服务器的消费者详情列表，支持查询参数过滤
 * 
 * @param query - 查询参数对象
 * @returns 返回 MCP 服务器消费者详情数组的 Promise
 */
export const listMcpConsumers = (
  query: any,
): Promise<McpServerConsumerDetail[]> => {
  return request.get<any, McpServerConsumerDetail[]>(`${BASE_URL}/consumers`, {
    params: query,
  });
};

/**
 * 将 Swagger API 文档转换为 MCP 配置
 * 解析 Swagger 文档内容并生成对应的 MCP 服务器配置
 * 
 * @param payload - 包含 Swagger 文档内容的对象
 * @returns 返回转换后的 MCP 配置信息
 */
export const swaggerToMcpConfig = (payload: { content: string }): Promise<any> => {
  return request.post<any, any>(`${BASE_URL}/swaggerToMcpConfig`, payload);
};
