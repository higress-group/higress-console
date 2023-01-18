import request from './request';
import { DomainItem, DomainResponse } from '@/interfaces/domain';

export const getGatewayDomain = (
  payload: any = { }
) : Promise<DomainResponse> => {
  return request.post<any, DomainResponse>("/v1/domain/list", payload);
};

export const addGatewayDomain = (
  payload: DomainItem
) : Promise<any> => {
  return request.post<any, any>("/v1/domain/add", payload);
};

export const deleteGatewayDomain = (
  payload: { name: string | undefined }
) : Promise<any> => {
  return request.get<any, any>("/v1/domain/delete", {
    params: payload
  });
};

export const updateGatewayDoamin = (
  payload: DomainItem
) : Promise<any> => {
  return request.post<any, any>("/v1/domain/update", payload);
};
