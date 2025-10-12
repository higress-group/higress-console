/**
 * 仪表板服务模块
 * 提供仪表板相关的 API 接口，包括仪表板信息获取、初始化、URL 设置和配置数据获取等功能
 * 基于 HTTP 请求服务封装，提供类型安全的仪表板管理操作
 */

// 导入仪表板相关的类型定义
import { DashboardInfo, DashboardType } from '@/interfaces/dashboard';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取仪表板信息
 * 根据仪表板类型获取对应的仪表板配置信息
 * 
 * @param type - 仪表板类型，用于指定要获取哪种类型的仪表板信息
 * @returns 返回仪表板信息对象，包含仪表板的配置和状态信息
 */
export const getDashboardInfo = (type: DashboardType): Promise<DashboardInfo> => {
  return request.get<any, DashboardInfo>("/dashboard/info", { params: { type } });
};

/**
 * 初始化仪表板
 * 初始化仪表板系统，设置默认配置和参数
 * 
 * @returns 返回初始化后的仪表板信息对象
 */
export const initDashboard = (): Promise<DashboardInfo> => {
  return request.get<any, DashboardInfo>("/dashboard/init");
}

/**
 * 设置仪表板 URL
 * 更新仪表板的外部 URL 地址
 * 
 * @param url - 新的仪表板 URL 地址
 * @returns 返回更新后的仪表板信息对象
 */
export const setDashboardUrl = (url: string): Promise<DashboardInfo> => {
  return request.put<any, DashboardInfo>("/dashboard/info", { url });
}

/**
 * 获取仪表板配置数据
 * 根据数据源 UID 和类型获取仪表板的配置数据
 * 
 * @param dataSourceUid - 数据源唯一标识符
 * @param type - 配置数据类型
 * @returns 返回配置数据字符串，通常是 JSON 格式的配置信息
 */
export const getDashboardConfigData = (dataSourceUid: string, type: string): Promise<string> => {
  return request.get<any, string>("/dashboard/configData", {
    params: { dataSourceUid, type },
  });
}
