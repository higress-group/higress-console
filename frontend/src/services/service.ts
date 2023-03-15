import { Service } from '@/interfaces/service';
import request from './request';

export const getGatewayServices = (): Promise<Service[]> => {
  return request.get<any, Service[]>('/v1/services');
};
