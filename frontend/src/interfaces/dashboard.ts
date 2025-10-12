/**
 * 仪表板相关接口定义文件
 * 定义了仪表板信息、仪表板类型等相关的数据结构
 * 这些接口用于描述系统监控仪表板的配置信息
 */

/**
 * 仪表板信息接口
 * 定义了仪表板的基本信息数据结构
 */
export interface DashboardInfo {
  builtIn: boolean;  // 是否为内置仪表板，true 表示系统内置，false 表示用户自定义
  url: string;        // 仪表板的访问 URL 地址
}

/**
 * 仪表板类型枚举
 * 定义了系统支持的仪表板类型
 */
export enum DashboardType {
  MAIN = "MAIN",  // 主仪表板，显示系统的整体监控信息
  AI = "AI",      // AI 仪表板，显示 AI 相关的监控指标
  LOG = "LOG",    // 日志仪表板，显示日志相关的监控信息
}
