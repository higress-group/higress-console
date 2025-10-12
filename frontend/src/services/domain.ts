/**
 * 域名管理服务模块
 * 提供网关域名相关的 API 接口，包括域名的 CRUD 操作等功能
 * 基于 HTTP 请求服务封装，提供类型安全的域名管理操作
 */

// 导入域名相关的类型定义
import { Domain } from '@/interfaces/domain';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取网关域名列表
 * 从后端 API 获取系统中配置的所有域名信息
 * 
 * @returns 返回域名数组的 Promise，每个元素包含完整的域名配置信息
 */
export const getGatewayDomains = (): Promise<Domain[]> => {
  return request.get<any, Domain[]>('/v1/domains');
};

/**
 * 添加新的网关域名
 * 向系统添加一个新的域名配置
 * 
 * @param payload - 域名配置对象，包含域名的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addGatewayDomain = (payload: Domain): Promise<any> => {
  return request.post<any, any>('/v1/domains', payload);
};

/**
 * 删除指定的网关域名
 * 根据域名名称删除对应的域名配置
 * 
 * @param name - 要删除的域名名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteGatewayDomain = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/domains/${name}`);
};

/**
 * 更新现有的网关域名
 * 更新指定名称的域名配置信息
 * 
 * @param payload - 包含更新信息的域名对象，name 字段用于指定要更新的域名
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateGatewayDomain = (payload: Domain): Promise<any> => {
  return request.put<any, any>(`/v1/domains/${payload.name}`, payload);
};
