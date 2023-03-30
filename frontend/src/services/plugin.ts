import request from './request';
import { RouteResponse, Route } from '@/interfaces/route';

// 获取全局的插件配置列表
export const getWasmPlugins = (): Promise<any> => {
  return request.get('/v1/wasm-plugins');
};

// 获取全局的指定插件配置
export const getPluginsDetail = ({ pluginName }): Promise<any> => {
  return request.get(`/v1/global/plugin-instances/${pluginName}`);
};
