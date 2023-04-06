import request from './request';
import { RouteResponse, Route, WasmPluginData } from '@/interfaces/route';

// 获取全局的插件配置列表
export const getWasmPlugins = (): Promise<any> => {
  return request.get('/v1/wasm-plugins');
};

// 获取全局的指定插件配置
export const getPluginsDetail = ({ pluginName }): Promise<any> => {
  return request.get(`/v1/global/plugin-instances/${pluginName}`);
};

export const createWasmPlugin = (payload: WasmPluginData) => {
  return request.post<any, any>('/v1/wasm-plugins', payload);
};

export const updateWasmPlugin = (name: string, payload: WasmPluginData) => {
  return request.put<any, any>(`/v1/wasm-plugins/${name}`, payload);
};

export const deleteWasmPlugin = (name: string) => {
  return request.delete<any, any>(`/v1/wasm-plugins/${name}`);
};

// 获取指定插件的运行时配置数据格式
export const getWasmPluginsConfig = (name: string) => {
  return request.get<any, any>(`/v1/wasm-plugins/${name}/config`);
};

// 获取全局的指定插件配置
export const getGlobalPluginInstances = (pluginName: string) => {
  return request.get<any, any>(`/v1/global/plugin-instances/${pluginName}`);
};

// 修改全局的指定插件配置
export const updateGlobalPluginInstances = (pluginName: string, payload) => {
  return request.put<any, any>(`/v1/global/plugin-instances/${pluginName}`, payload);
};

// 获取指定路由的指定插件配置
export const getRoutePluginInstances = (params: { routeName: string; pluginName: string }) => {
  const { routeName, pluginName } = params;
  return request.get<any, any>(`/v1/routes/${routeName}/plugin-instances/${pluginName}`);
};

// 修改指定路由的指定插件配置
export const updateRoutePluginInstances = (params: { routeName: string; pluginName: string }, payload) => {
  const { routeName, pluginName } = params;
  return request.put<any, any>(`/v1/routes/${routeName}/plugin-instances/${pluginName}`, payload);
};
