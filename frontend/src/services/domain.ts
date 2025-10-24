import { Domain } from '@/interfaces/domain';
// import request from './request';
import bffRequest from './bffRequest';

export const getGatewayDomains = (): Promise<Domain[]> => {
  // return request.get<any, Domain[]>('/v1/domains');
  return bffRequest.get<any, Domain[]>(`/bff/v1/domains`);
};

export const addGatewayDomain = (payload: Domain): Promise<any> => {
  // return request.post<any, any>('/v1/domains', payload);
  return bffRequest.post<any, any>(`/bff/v1/domains`, payload);
};

export const deleteGatewayDomain = (name: string): Promise<any> => {
  // return request.delete<any, any>(`/v1/domains/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/domains/${name}`);
};

export const updateGatewayDomain = (payload: Domain): Promise<any> => {
  // return request.put<any, any>(`/v1/domains/${payload.name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/domains/${payload.name}`, payload);
};
