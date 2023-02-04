package com.alibaba.higress.console.context;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HttpContext {

    private static final ThreadLocal<HttpContext> instance = new ThreadLocal<>();

    private final HttpServletRequest request;
    private final HttpServletResponse response;

    private HttpContext(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
    }

    public static HttpContext init(HttpServletRequest request, HttpServletResponse response) {
        HttpContext context = new HttpContext(request, response);
        instance.set(context);
        return context;
    }

    public static HttpContext getCurrent() {
        return instance.get();
    }

    public static void release() {
        instance.remove();
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public HttpServletResponse getResponse() {
        return response;
    }
}
