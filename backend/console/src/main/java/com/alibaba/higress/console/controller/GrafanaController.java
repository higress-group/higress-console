package com.alibaba.higress.console.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.higress.console.service.DashboardService;

/**
 * Grafana控制器
 * 用于转发Grafana相关的请求到实际的仪表板服务
 */
@Controller
@RequestMapping(value = "/grafana/**")
public class GrafanaController {

    /**
     * 仪表板服务实例
     * 用于处理Grafana仪表板相关的业务逻辑和请求转发
     */
    private DashboardService dashboardService;

    /**
     * 注入仪表板服务依赖
     *
     * @param dashboardService 仪表板服务实例
     */
    @Autowired
    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 转发Grafana请求
     * 将所有匹配 /grafana/** 路径的请求转发到仪表板服务进行处理
     *
     * @param request  HTTP请求对象，包含客户端发送的请求信息
     * @param response HTTP响应对象，用于向客户端发送响应
     * @throws IOException 当IO操作出现异常时抛出
     */
    @RequestMapping
    public void forward(HttpServletRequest request, HttpServletResponse response) throws IOException {
        dashboardService.forwardDashboardRequest(request, response);
    }
}
