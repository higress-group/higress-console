import request from "./request";
import { ServiceItem } from '@/interfaces/service';

// export const doLogin = (user: API.User) => {
//   return request.post<any, API.Response, API.User>('/login', user);
// };


export const getGatewayServices = (
  payload: Service.Factor = { pageNum: 1, pageSize: 10 }
) : Promise<ServiceItem[]> => {
  return request.get<any, ServiceItem[]>("/v1/service/list", {
    params: payload
  });
};

