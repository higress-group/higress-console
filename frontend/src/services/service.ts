/**
 * 网关服务管理服务模块
 * 提供网关服务相关的 API 接口，包括服务列表获取等功能
 * 基于 HTTP 请求服务封装，提供类型安全的服务管理操作
 */

// 导入服务相关的类型定义
import { Service } from '@/interfaces/service';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取网关服务列表
 * 从后端 API 获取系统中配置的所有网关服务信息
 * 
 * @returns 返回服务数组的 Promise，每个元素包含完整的服务配置信息
 */
export const getGatewayServices = (): Promise<Service[]> => {
  return request.get<any, Service[]>('/v1/services');
};
