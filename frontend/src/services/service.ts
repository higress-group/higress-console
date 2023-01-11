import request from './request';
import { ServiceItem, ServiceFactor } from '@/interfaces/service';


export const getGatewayServices = (
  payload: ServiceFactor = { }
) : Promise<ServiceItem[]> => {
  return request.get<any, ServiceItem[]>("/v1/service/list", {
    params: payload
  });
};

