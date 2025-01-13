import request from './request';
import { RouteResponse, Route } from '@/interfaces/route';

export const getGatewayRoutes = (): Promise<RouteResponse> => {
  return request.get<any, RouteResponse>('/v1/routes');
};

// 获取指定路由
export const getGatewayRouteDetail = (routeName): Promise<RouteResponse> => {
  return request.get<any, RouteResponse>(`/v1/routes/${routeName}`);
};

export const addGatewayRoute = (payload: Route): Promise<any> => {
  return request.post<any, any>('/v1/routes', payload);
};

export const deleteGatewayRoute = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/routes/${name}`);
};

export const updateGatewayRoute = (payload: Route): Promise<any> => {
  return request.put<any, any>(`/v1/routes/${payload.name}`, payload);
};

export const updateRouteConfig = (name, params): Promise<any> => {
  return request.put<any, any>(`/v1/routes/${name}`, params);
};
