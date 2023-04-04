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
