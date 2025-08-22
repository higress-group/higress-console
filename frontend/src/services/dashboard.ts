import { DashboardInfo, DashboardType } from '@/interfaces/dashboard';
import request from './request';
import bffRequest from './bffRequest';

export const getDashboardInfo = (type: DashboardType): Promise<DashboardInfo> => {
  // return request.get<any, DashboardInfo>("/dashboard/info", { params: { type } });
  return bffRequest.get<any, DashboardInfo>(`/bff/dashboard/info`, { params: { type } });
};

// 初始化仪表板，不知道怎么触发
export const initDashboard = (): Promise<DashboardInfo> => {
  return request.get<any, DashboardInfo>("/dashboard/init");
  // return bffRequest.get<any, DashboardInfo>(`/bff/dashboard/init`);
}

export const setDashboardUrl = (url: string): Promise<DashboardInfo> => {
  // return request.put<any, DashboardInfo>("/dashboard/info", { url });
  return bffRequest.put<any, DashboardInfo>(`/bff/dashboard/info`, { url });
}

export const getDashboardConfigData = (dataSourceUid: string, type: string): Promise<string> => {
  // return request.get<any, string>("/dashboard/configData", {
  //   params: { dataSourceUid, type },
  // });
  return bffRequest.get<any, string>(`/bff/dashboard/configData`, {
    params: { dataSourceUid, type },
  });
}
