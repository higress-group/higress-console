/**
 * 代理服务器管理服务模块
 * 提供代理服务器相关的 API 接口，包括代理服务器的 CRUD 操作等功能
 * 代理服务器用于配置上游服务的代理设置，包括负载均衡、健康检查等
 * 基于 HTTP 请求服务封装，提供类型安全的代理服务器管理操作
 */

// 导入代理服务器相关的类型定义
import { ProxyServer } from '@/interfaces/proxy-server';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取代理服务器列表
 * 从后端 API 获取系统中配置的所有代理服务器信息
 * 
 * @returns 返回代理服务器数组的 Promise，每个元素包含完整的代理服务器配置信息
 */
export const getProxyServers = (): Promise<ProxyServer[]> => {
  return request.get<any, ProxyServer[]>('/v1/proxy-servers');
};

/**
 * 添加新的代理服务器
 * 向系统添加一个新的代理服务器配置
 * 代理服务器配置通常包含上游服务地址、负载均衡策略、健康检查设置等
 * 
 * @param payload - 代理服务器配置对象，包含代理服务器的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addProxyServer = (payload: ProxyServer): Promise<any> => {
  return request.post<any, any>(`/v1/proxy-servers`, payload);
};

/**
 * 删除指定的代理服务器
 * 根据代理服务器名称删除对应的代理服务器配置
 * 
 * @param name - 要删除的代理服务器名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteProxyServer = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/proxy-servers/${name}`);
};

/**
 * 更新现有的代理服务器
 * 更新指定名称的代理服务器配置信息
 * 可以更新代理服务器的上游服务、负载均衡策略、健康检查等配置
 * 
 * @param payload - 包含更新信息的代理服务器对象，name 字段用于指定要更新的代理服务器
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateProxyServer = (payload: ProxyServer): Promise<any> => {
  return request.put<any, any>(`/v1/proxy-servers/${payload.name}`, payload);
};
