import { Service } from '@/interfaces/service';
// import request from './request';
import bffRequest from './bffRequest';

export const getGatewayServices = (): Promise<Service[]> => {
  // return request.get<any, Service[]>('/v1/services');
  return bffRequest.get<any, Service[]>('/bff/v1/services');
};
