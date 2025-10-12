/**
 * 系统管理服务模块
 * 提供系统相关的 API 接口，包括系统信息获取、配置管理、初始化等功能
 * 基于 HTTP 请求服务封装，提供类型安全的系统管理操作
 */

// 导入系统相关的类型定义
import { InitParams } from '@/interfaces/system';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取系统信息
 * 从服务器获取系统的基本信息，包括版本、状态等
 * 
 * @returns 返回系统信息对象
 */
export async function getSystemInfo(): Promise<any> {
  return await request.get('/system/info');
}

/**
 * 获取系统配置
 * 获取系统的配置信息，包括功能开关、参数设置等
 * 
 * @returns 返回系统配置对象
 */
export async function getConfigs(): Promise<any> {
  return await request.get('/system/config');
}

/**
 * 系统初始化
 * 初始化系统，设置必要的参数和配置
 * 
 * @param payload - 初始化参数，包含系统初始化所需的信息
 * @returns 返回初始化操作结果
 */
export async function initialize(payload: InitParams): Promise<any> {
  return request.post<any, any>('/system/init', payload);
}

/**
 * 获取 Higress 配置
 * 获取 Higress 网关的特定配置信息
 * 
 * @returns 返回 Higress 配置对象
 */
export async function getHigressConfig(): Promise<any> {
  return await request.get('/system/higress-config');
}

/**
 * 更新 Higress 配置
 * 更新 Higress 网关的配置信息
 * 
 * @param config - 新的配置内容（字符串格式）
 * @returns 返回配置更新操作结果
 */
export async function updateHigressConfig(config: string): Promise<any> {
  return request.put<any, any>('/system/higress-config', { config });
}
