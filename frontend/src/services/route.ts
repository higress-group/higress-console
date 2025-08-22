import request from './request';
import { RouteResponse, Route } from '@/interfaces/route';
import bffRequest from './bffRequest';

export const getGatewayRoutes = (): Promise<RouteResponse> => {
  // return request.get<any, RouteResponse>('/v1/routes');
  return bffRequest.get<any, RouteResponse>('/bff/v1/routes');
};

// 获取指定路由策略
export const getGatewayRouteDetail = (routeName): Promise<Route> => {
  // return request.get<any, Route>(`/v1/routes/${routeName}`);
  return bffRequest.get<any, Route>(`/bff/v1/routes/${routeName}`);
};

export const addGatewayRoute = (payload: Route): Promise<any> => {
  // return request.post<any, any>('/v1/routes', payload);
  return bffRequest.post<any, any>(`/bff/v1/routes`, payload);
};

export const deleteGatewayRoute = (name: string): Promise<any> => {
  // return request.delete<any, any>(`/v1/routes/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/routes/${name}`);
};

// 编辑路由策略
export const updateGatewayRoute = (payload: Route): Promise<any> => {
  // return request.put<any, any>(`/v1/routes/${payload.name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/routes/${payload.name}`, payload);
};

// 不知道是啥（后面再改）
export const updateRouteConfig = (name, params): Promise<any> => {
  return request.put<any, any>(`/v1/routes/${name}`, params);
};
