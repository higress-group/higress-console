import { WasmPluginData } from '@/interfaces/wasm-plugin';
// import request from './request';
import bffRequest from './bffRequest';

// 获取全局的插件配置列表
export const getWasmPlugins = (lang: string): Promise<any> => {
  // return request.get('/v1/wasm-plugins', { params: { lang } });
  return bffRequest.get<any, any>(`/bff/v1/wasm-plugins`, { params: { lang } });
};

// 获取全局的指定插件配置
export const getPluginsDetail = ({ pluginName }): Promise<any> => {
  // return request.get(`/v1/global/plugin-instances/${pluginName}`);
  return bffRequest.get<any, any>(`/bff/v1/global/plugin-instances/${pluginName}`);
};

export const createWasmPlugin = (payload: WasmPluginData) => {
  // return request.post<any, any>('/v1/wasm-plugins', payload);
  return bffRequest.post<any, any>(`/bff/v1/wasm-plugins`, payload);
};

// 更新WASM插件(非自定义)
export const updateWasmPlugin = (name: string, payload: WasmPluginData) => {
  // return request.put<any, any>(`/v1/wasm-plugins/${name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/wasm-plugins/${name}`, payload);
};

export const deleteWasmPlugin = (name: string) => {
  // return request.delete<any, any>(`/v1/wasm-plugins/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/wasm-plugins/${name}`);
};

// 获取指定插件的运行时配置数据格式
export const getWasmPluginsConfig = (name: string) => {
  // return request.get<any, any>(`/v1/wasm-plugins/${name}/config`);
  return bffRequest.get<any, any>(`/bff/v1/wasm-plugins/${name}/config`);
};

// 获取全局的指定插件配置
export const getGlobalPluginInstance = (pluginName: string) => {
  // return request.get<any, any>(`/v1/global/plugin-instances/${pluginName}`);
  return bffRequest.get<any, any>(`/bff/v1/global/plugin-instances/${pluginName}`);
};

// 修改全局的指定插件配置
export const updateGlobalPluginInstance = (pluginName: string, payload) => {
  // return request.put<any, any>(`/v1/global/plugin-instances/${pluginName}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/global/plugin-instances/${pluginName}`, payload);
};

// 获取指定路由的插件配置列表
export const getRoutePluginInstances = (name: string) => {
  // return request.get<any, any>(`/v1/routes/${name}/plugin-instances`);
  return bffRequest.get<any, any>(`/bff/v1/routes/${name}/plugin-instances`);
};

// 获取指定路由的指定插件配置
export const getRoutePluginInstance = (params: { name: string; pluginName: string }) => {
  const { name, pluginName } = params;
  // return request.get<any, any>(`/v1/routes/${name}/plugin-instances/${pluginName}`);
  return bffRequest.get<any, any>(`/bff/v1/routes/${name}/plugin-instances/${pluginName}`);
};

// 修改指定路由的指定插件配置
export const updateRoutePluginInstance = (params: { name: string; pluginName: string }, payload) => {
  const { name, pluginName } = params;
  // return request.put<any, any>(`/v1/routes/${name}/plugin-instances/${pluginName}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/routes/${name}/plugin-instances/${pluginName}`, payload);
};

// 获取指定域名的插件配置列表
export const getDomainPluginInstances = (name: string) => {
  // return request.get<any, any>(`/v1/domains/${name}/plugin-instances`);
  return bffRequest.get<any, any>(`/bff/v1/domains/${name}/plugin-instances`);
};

// 获取指定域名的指定插件配置
export const getDomainPluginInstance = (params: { name: string; pluginName: string }) => {
  const { name, pluginName } = params;
  // return request.get<any, any>(`/v1/domains/${name}/plugin-instances/${pluginName}`);
  return bffRequest.get<any, any>(`/bff/v1/domains/${name}/plugin-instances/${pluginName}`);
};

// 修改指定域名的指定插件配置
export const updateDomainPluginInstance = (params: { name: string; pluginName: string }, payload) => {
  const { name, pluginName } = params;
  // return request.put<any, any>(`/v1/domains/${name}/plugin-instances/${pluginName}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/domains/${name}/plugin-instances/${pluginName}`, payload);
};
