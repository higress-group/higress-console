/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

// 包声明：定义当前类所属的包路径
package com.alibaba.higress.console.context;

// 导入Java Servlet API中的HttpServletRequest和HttpServletResponse类，
// 这些类用于处理HTTP请求和响应
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * HttpContext 类用于封装当前线程的HTTP请求和响应对象。
 * 使用ThreadLocal确保每个线程拥有独立的HttpContext实例，实现线程安全。
 */
public class HttpContext {

    /**
     * 使用ThreadLocal存储当前线程的HttpContext实例。
     * ThreadLocal提供了线程局部变量，每个线程都会持有自己独立的变量副本。
     */
    private static final ThreadLocal<HttpContext> INSTANCE = new ThreadLocal<>();

    // 存储当前线程的HTTP请求对象
    private final HttpServletRequest request;

    // 存储当前线程的HTTP响应对象
    private final HttpServletResponse response;

    /**
     * 私有构造函数，防止外部直接实例化。
     * @param request HTTP请求对象
     * @param response HTTP响应对象
     */
    private HttpContext(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
    }

    /**
     * 初始化并设置当前线程的HttpContext实例。
     * @param request HTTP请求对象
     * @param response HTTP响应对象
     * @return 创建的HttpContext实例
     */
    public static HttpContext init(HttpServletRequest request, HttpServletResponse response) {
        HttpContext context = new HttpContext(request, response);
        INSTANCE.set(context);  // 将创建的实例存储到ThreadLocal中
        return context;
    }

    /**
     * 获取当前线程的HttpContext实例。
     * @return 当前线程的HttpContext实例，如果未初始化则返回null
     */
    public static HttpContext getCurrent() {
        return INSTANCE.get();
    }

    /**
     * 清理当前线程的HttpContext实例。
     * 需要在请求处理完成后调用此方法，避免内存泄漏。
     */
    public static void release() {
        INSTANCE.remove();  // 移除当前线程的实例
    }

    /**
     * 获取当前线程的HTTP请求对象。
     * @return HttpServletRequest对象
     */
    public HttpServletRequest getRequest() {
        return request;
    }

    /**
     * 获取当前线程的HTTP响应对象。
     * @return HttpServletResponse对象
     */
    public HttpServletResponse getResponse() {
        return response;
    }
}
