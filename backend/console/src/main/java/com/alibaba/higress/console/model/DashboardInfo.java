package com.alibaba.higress.console.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 仪表板信息数据模型
 * 用于封装仪表板的基本信息，包括是否为内置仪表板、唯一标识符和访问URL
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardInfo {

    /**
     * 是否为内置仪表板
     * true表示使用系统内置的仪表板，false表示使用自定义仪表板
     */
    private Boolean builtIn;

    /**
     * 仪表板唯一标识符
     * 通常用于Grafana等监控系统中标识特定仪表板
     */
    private String uid;

    /**
     * 仪表板访问URL
     * 用户可以直接访问此URL来查看仪表板内容
     */
    private String url;
}
