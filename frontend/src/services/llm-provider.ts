/**
 * LLM 提供商管理服务模块
 * 提供大语言模型（LLM）提供商相关的 API 接口，包括提供商的 CRUD 操作等功能
 * LLM 提供商用于配置 AI 路由的上游服务，如 OpenAI、Azure、Claude 等
 * 基于 HTTP 请求服务封装，提供类型安全的 LLM 提供商管理操作
 */

// 导入 HTTP 请求服务
import request from './request';

// 导入 LLM 提供商相关的类型定义
import { LlmProvider } from '@/interfaces/llm-provider';

/**
 * 获取 LLM 提供商列表
 * 从后端 API 获取系统中配置的所有 LLM 提供商信息
 * 
 * @returns 返回 LLM 提供商数组的 Promise，每个元素包含完整的提供商配置信息
 */
export const getLlmProviders = (): Promise<LlmProvider[]> => {
  return request.get<any, LlmProvider[]>('/v1/ai/providers');
};

/**
 * 添加新的 LLM 提供商
 * 向系统添加一个新的 LLM 提供商配置
 * 提供商配置通常包含 API 地址、认证信息、模型列表等
 * 
 * @param payload - LLM 提供商配置对象，包含提供商的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addLlmProvider = (payload: LlmProvider): Promise<any> => {
  return request.post<any, any>('/v1/ai/providers', payload);
};

/**
 * 删除指定的 LLM 提供商
 * 根据提供商名称删除对应的 LLM 提供商配置
 * 
 * @param name - 要删除的 LLM 提供商名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteLlmProvider = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/ai/providers/${name}`);
};

/**
 * 更新现有的 LLM 提供商
 * 更新指定名称的 LLM 提供商配置信息
 * 可以更新提供商的 API 地址、认证信息、模型配置等
 * 
 * @param payload - 包含更新信息的 LLM 提供商对象，name 字段用于指定要更新的提供商
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateLlmProvider = (payload: LlmProvider): Promise<any> => {
  return request.put<any, any>(`/v1/ai/providers/${payload.name}`, payload);
};
