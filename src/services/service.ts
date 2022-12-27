import request from "./request";

// export const doLogin = (user: API.User) => {
//   return request.post<any, API.Response, API.User>('/login', user);
// };


export const getGatewayServices = (
  payload: Service.Factor = { pageNum: 1, pageSize: 10 }
) : Promise<Service.Item[]> => {
  return request.get<any, Service.Item[]>("/v1/service/list", {
    params: payload
  });
};

