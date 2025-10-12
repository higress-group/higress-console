/**
 * 网关路由服务模块
 * 提供网关路由相关的 API 接口，包括路由的 CRUD 操作、配置更新等功能
 * 基于 HTTP 请求服务封装，提供类型安全的路由管理操作
 */

// 导入 HTTP 请求服务
import request from './request';

// 导入路由相关的类型定义
import { RouteResponse, Route } from '@/interfaces/route';

/**
 * 获取网关路由列表
 * 从后端 API 获取系统中配置的所有网关路由信息
 * 
 * @returns 返回路由响应对象，包含路由列表和分页信息
 */
export const getGatewayRoutes = (): Promise<RouteResponse> => {
  return request.get<any, RouteResponse>('/v1/routes');
};

/**
 * 获取指定路由详情
 * 根据路由名称获取特定路由的详细信息
 * 
 * @param routeName - 路由名称，用于指定要获取的路由
 * @returns 返回指定路由的详细信息对象
 */
export const getGatewayRouteDetail = (routeName): Promise<Route> => {
  return request.get<any, Route>(`/v1/routes/${routeName}`);
};

/**
 * 添加新的网关路由
 * 向系统添加一个新的网关路由配置
 * 
 * @param payload - 路由配置对象，包含路由的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addGatewayRoute = (payload: Route): Promise<any> => {
  return request.post<any, any>('/v1/routes', payload);
};

/**
 * 删除指定的网关路由
 * 根据路由名称删除对应的路由配置
 * 
 * @param name - 要删除的路由名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteGatewayRoute = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/routes/${name}`);
};

/**
 * 更新现有的网关路由
 * 更新指定名称的路由配置信息
 * 
 * @param payload - 包含更新信息的路由对象，name 字段用于指定要更新的路由
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateGatewayRoute = (payload: Route): Promise<any> => {
  return request.put<any, any>(`/v1/routes/${payload.name}`, payload);
};

/**
 * 更新路由配置
 * 更新指定名称的路由配置参数
 * 
 * @param name - 要更新的路由名称
 * @param params - 要更新的配置参数
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateRouteConfig = (name, params): Promise<any> => {
  return request.put<any, any>(`/v1/routes/${name}`, params);
};
