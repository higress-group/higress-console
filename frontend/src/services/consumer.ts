/**
 * 消费者管理服务模块
 * 提供消费者相关的 API 接口，包括消费者的 CRUD 操作等功能
 * 消费者通常指 API 的调用方，需要进行认证和授权管理
 * 基于 HTTP 请求服务封装，提供类型安全的消费者管理操作
 */

// 导入 HTTP 请求服务
import request from './request';

// 导入消费者相关的类型定义
import { Consumer } from '@/interfaces/consumer';

/**
 * 获取消费者列表
 * 从后端 API 获取系统中配置的所有消费者信息
 * 
 * @returns 返回消费者数组的 Promise，每个元素包含完整的消费者配置信息
 */
export const getConsumers = (): Promise<Consumer[]> => {
  return request.get<any, Consumer[]>('/v1/consumers');
};

/**
 * 添加新的消费者
 * 向系统添加一个新的消费者配置
 * 消费者配置通常包含认证信息、权限设置等
 * 
 * @param payload - 消费者配置对象，包含消费者的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addConsumer = (payload: Consumer): Promise<any> => {
  return request.post<any, any>('/v1/consumers', payload);
};

/**
 * 删除指定的消费者
 * 根据消费者名称删除对应的消费者配置
 * 
 * @param name - 要删除的消费者名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteConsumer = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/consumers/${name}`);
};

/**
 * 更新现有的消费者
 * 更新指定名称的消费者配置信息
 * 可以更新消费者的认证信息、权限设置等
 * 
 * @param payload - 包含更新信息的消费者对象，name 字段用于指定要更新的消费者
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateConsumer = (payload: Consumer): Promise<any> => {
  return request.put<any, any>(`/v1/consumers/${payload.name}`, payload);
};
