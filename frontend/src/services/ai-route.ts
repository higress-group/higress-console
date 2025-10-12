/**
 * AI 路由管理服务模块
 * 提供 AI 路由的 CRUD 操作接口，包括获取、添加、删除和更新 AI 路由配置
 * 基于 HTTP 请求服务封装，提供类型安全的 API 调用
 */

// 导入 HTTP 请求服务
import request from './request';

// 导入 AI 路由接口类型定义
import { AiRoute } from '@/interfaces/ai-route';

/**
 * 获取所有 AI 路由列表
 * 从后端 API 获取系统中配置的所有 AI 路由信息
 * 
 * @returns 返回 AI 路由数组的 Promise，每个元素包含完整的 AI 路由配置信息
 */
export const getAiRoutes = (): Promise<AiRoute[]> => {
  return request.get<any, AiRoute[]>('/v1/ai/routes');
};

/**
 * 添加新的 AI 路由
 * 向系统添加一个新的 AI 路由配置
 * 
 * @param payload - AI 路由配置对象，包含路由的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addAiRoute = (payload: AiRoute): Promise<any> => {
  return request.post<any, any>('/v1/ai/routes', payload);
};

/**
 * 删除指定的 AI 路由
 * 根据路由名称删除对应的 AI 路由配置
 * 
 * @param name - 要删除的 AI 路由名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteAiRoute = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/ai/routes/${name}`);
};

/**
 * 更新现有的 AI 路由
 * 更新指定名称的 AI 路由配置信息
 * 
 * @param payload - 包含更新信息的 AI 路由对象，name 字段用于指定要更新的路由
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateAiRoute = (payload: AiRoute): Promise<any> => {
  return request.put<any, any>(`/v1/ai/routes/${payload.name}`, payload);
};
