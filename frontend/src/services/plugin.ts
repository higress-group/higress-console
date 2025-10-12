/**
 * 插件管理服务模块
 * 提供 WASM 插件和插件实例相关的 API 接口，包括插件的 CRUD 操作、配置管理等功能
 * 插件用于扩展网关功能，支持全局、路由级别和域名级别的插件配置
 * 基于 HTTP 请求服务封装，提供类型安全的插件管理操作
 */

// 导入 WASM 插件相关的类型定义
import { WasmPluginData } from '@/interfaces/wasm-plugin';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取全局 WASM 插件配置列表
 * 获取系统中所有可用的 WASM 插件信息，支持语言本地化
 * 
 * @param lang - 语言代码，用于返回对应语言的插件信息
 * @returns 返回插件列表的 Promise
 */
export const getWasmPlugins = (lang: string): Promise<any> => {
  return request.get('/v1/wasm-plugins', { params: { lang } });
};

/**
 * 获取全局指定插件的详细配置
 * 根据插件名称获取全局级别的插件实例配置信息
 * 
 * @param pluginName - 插件名称
 * @returns 返回插件详细配置信息
 */
export const getPluginsDetail = ({ pluginName }): Promise<any> => {
  return request.get(`/v1/global/plugin-instances/${pluginName}`);
};

/**
 * 创建新的 WASM 插件
 * 向系统添加一个新的 WASM 插件配置
 * 
 * @param payload - WASM 插件数据对象，包含插件的所有配置信息
 * @returns 返回操作结果的 Promise
 */
export const createWasmPlugin = (payload: WasmPluginData) => {
  return request.post<any, any>('/v1/wasm-plugins', payload);
};

/**
 * 更新现有的 WASM 插件
 * 更新指定名称的 WASM 插件配置信息
 * 
 * @param name - 插件名称
 * @param payload - 更新后的插件数据对象
 * @returns 返回操作结果的 Promise
 */
export const updateWasmPlugin = (name: string, payload: WasmPluginData) => {
  return request.put<any, any>(`/v1/wasm-plugins/${name}`, payload);
};

/**
 * 删除指定的 WASM 插件
 * 根据插件名称删除对应的 WASM 插件配置
 * 
 * @param name - 要删除的插件名称
 * @returns 返回操作结果的 Promise
 */
export const deleteWasmPlugin = (name: string) => {
  return request.delete<any, any>(`/v1/wasm-plugins/${name}`);
};

/**
 * 获取指定插件的运行时配置数据格式
 * 获取插件的配置模板或默认配置格式，用于前端表单生成
 * 
 * @param name - 插件名称
 * @returns 返回插件配置数据格式的 Promise
 */
export const getWasmPluginsConfig = (name: string) => {
  return request.get<any, any>(`/v1/wasm-plugins/${name}/config`);
};

/**
 * 获取全局指定插件实例配置
 * 获取全局级别的插件实例配置信息
 * 
 * @param pluginName - 插件名称
 * @returns 返回插件实例配置的 Promise
 */
export const getGlobalPluginInstance = (pluginName: string) => {
  return request.get<any, any>(`/v1/global/plugin-instances/${pluginName}`);
};

/**
 * 更新全局指定插件实例配置
 * 更新全局级别的插件实例配置信息
 * 
 * @param pluginName - 插件名称
 * @param payload - 插件实例配置数据
 * @returns 返回操作结果的 Promise
 */
export const updateGlobalPluginInstance = (pluginName: string, payload) => {
  return request.put<any, any>(`/v1/global/plugin-instances/${pluginName}`, payload);
};

/**
 * 获取指定路由的插件配置列表
 * 获取特定路由上配置的所有插件实例信息
 * 
 * @param name - 路由名称
 * @returns 返回插件实例列表的 Promise
 */
export const getRoutePluginInstances = (name: string) => {
  return request.get<any, any>(`/v1/routes/${name}/plugin-instances`);
};

/**
 * 获取指定路由的指定插件配置
 * 获取特定路由上特定插件的实例配置信息
 * 
 * @param params - 包含路由名称和插件名称的参数对象
 * @returns 返回插件实例配置的 Promise
 */
export const getRoutePluginInstance = (params: { name: string; pluginName: string }) => {
  const { name, pluginName } = params;
  return request.get<any, any>(`/v1/routes/${name}/plugin-instances/${pluginName}`);
};

/**
 * 更新指定路由的指定插件配置
 * 更新特定路由上特定插件的实例配置信息
 * 
 * @param params - 包含路由名称和插件名称的参数对象
 * @param payload - 插件实例配置数据
 * @returns 返回操作结果的 Promise
 */
export const updateRoutePluginInstance = (params: { name: string; pluginName: string }, payload) => {
  const { name, pluginName } = params;
  return request.put<any, any>(`/v1/routes/${name}/plugin-instances/${pluginName}`, payload);
};

/**
 * 获取指定域名的插件配置列表
 * 获取特定域名上配置的所有插件实例信息
 * 
 * @param name - 域名
 * @returns 返回插件实例列表的 Promise
 */
export const getDomainPluginInstances = (name: string) => {
  return request.get<any, any>(`/v1/domains/${name}/plugin-instances`);
};

/**
 * 获取指定域名的指定插件配置
 * 获取特定域名上特定插件的实例配置信息
 * 
 * @param params - 包含域名和插件名称的参数对象
 * @returns 返回插件实例配置的 Promise
 */
export const getDomainPluginInstance = (params: { name: string; pluginName: string }) => {
  const { name, pluginName } = params;
  return request.get<any, any>(`/v1/domains/${name}/plugin-instances/${pluginName}`);
};

/**
 * 更新指定域名的指定插件配置
 * 更新特定域名上特定插件的实例配置信息
 * 
 * @param params - 包含域名和插件名称的参数对象
 * @param payload - 插件实例配置数据
 * @returns 返回操作结果的 Promise
 */
export const updateDomainPluginInstance = (params: { name: string; pluginName: string }, payload) => {
  const { name, pluginName } = params;
  return request.put<any, any>(`/v1/domains/${name}/plugin-instances/${pluginName}`, payload);
};
