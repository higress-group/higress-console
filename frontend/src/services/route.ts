import request from './request';
import { RouteResponse, RouteItem } from '@/interfaces/route';


export const getGatewayRoute = (
  payload: any = { }
) : Promise<RouteResponse> => {
  return request.post<any, RouteResponse>("/v1/route/list", payload);
};


export const addGatewayRoute = (
  payload: RouteItem
) : Promise<any> => {
  return request.post<any, any>("/v1/route/add", payload);
};


export const deleteGatewayRoute = (
  payload: { name: string | undefined }
) : Promise<any> => {
  return request.get<any, any>("/v1/route/delete", {
    params: payload
  });
};

export const updateGatewayRoute = (
  payload: RouteItem
) : Promise<any> => {
  return request.post<any, any>("/v1/route/update", payload);
};
