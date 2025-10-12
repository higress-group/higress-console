package com.alibaba.higress.console.model;

/**
 * 仪表板类型枚举
 * 定义了系统支持的不同类型的仪表板
 */
public enum DashboardType {

    /**
     * 主仪表板
     * 用于展示系统核心指标和总体运行状态
     */
    MAIN,

    /**
     * AI网关仪表板
     * 专门用于展示AI网关相关的监控指标和性能数据
     */
    AI,

    /**
     * 访问日志仪表板
     * 用于展示和分析系统访问日志相关的统计信息
     */
    LOG
}
