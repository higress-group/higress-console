/**
 * 服务源管理服务模块
 * 提供服务源相关的 API 接口，包括服务源的 CRUD 操作等功能
 * 服务源定义了服务的来源信息，如注册中心、服务发现等配置
 * 基于 HTTP 请求服务封装，提供类型安全的服务源管理操作
 */

// 导入服务源相关的类型定义
import { ServiceSource, ServiceSourceFormProps } from '@/interfaces/service-source';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取服务源列表
 * 从后端 API 获取系统中配置的所有服务源信息
 * 
 * @param payload - 服务源表单参数，用于过滤和查询
 * @returns 返回服务源数组的 Promise，每个元素包含完整的服务源配置信息
 */
export const getServiceSources = (payload: ServiceSourceFormProps): Promise<ServiceSource[]> => {
  return request.get<any, ServiceSource[]>('/v1/service-sources');
};

/**
 * 添加新的服务源
 * 向系统添加一个新的服务源配置
 * 
 * @param payload - 服务源配置对象，包含服务源的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addServiceSource = (payload: ServiceSource): Promise<any> => {
  return request.post<any, any>(`/v1/service-sources`, payload);
};

/**
 * 删除指定的服务源
 * 根据服务源名称删除对应的服务源配置
 * 
 * @param name - 要删除的服务源名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteServiceSource = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/service-sources/${name}`);
};

/**
 * 更新现有的服务源
 * 更新指定名称的服务源配置信息
 * 
 * @param payload - 包含更新信息的服务源对象，name 字段用于指定要更新的服务源
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateServiceSource = (payload: ServiceSource): Promise<any> => {
  return request.put<any, any>(`/v1/service-sources/${payload.name}`, payload);
};
