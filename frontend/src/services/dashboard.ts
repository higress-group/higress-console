import { DashboardInfo } from '@/interfaces/dashboard';
import request from './request';

export const getDashboardInfo = (): Promise<DashboardInfo> => {
  return request.get<any, DashboardInfo>("/dashboard/info");
};

export const initDashboard = (): Promise<DashboardInfo> => {
  return request.get<any, DashboardInfo>("/dashboard/init");
}

export const setDashboardUrl = (url: string): Promise<DashboardInfo> => {
  return request.put<any, DashboardInfo>("/dashboard/info", { url });
}

export const getDashboardConfigData = (dataSourceUid: string): Promise<string> => {
  return request.get<any, string>("/dashboard/configData", {
    params: { dataSourceUid },
  });
}