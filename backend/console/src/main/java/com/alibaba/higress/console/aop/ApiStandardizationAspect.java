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
package com.alibaba.higress.console.aop;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.HealthzController;
import com.alibaba.higress.console.controller.LandingController;
import com.alibaba.higress.console.controller.SessionController;
import com.alibaba.higress.console.controller.SystemController;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.exception.AuthException;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.service.SessionService;
import com.alibaba.higress.console.service.SessionUserHelper;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.exception.ValidationException;
import io.kubernetes.client.openapi.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.function.BiConsumer;

/**
 * API标准化切面类，用于统一处理控制器层的异常、日志记录、权限验证等通用逻辑
 *
 * @author CH3CHO
 */
@Aspect
@Component
@Slf4j
public class ApiStandardizationAspect {

    // 会话服务，用于验证用户身份
    private SessionService sessionService;

    // 注入SessionService
    @Resource
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * 环绕通知，拦截所有控制器方法的执行
     *
     * @param point 连接点对象，包含被拦截方法的信息
     * @return 方法执行结果或异常响应
     */
    @Around("execution(* com.alibaba.higress.console.controller..*Controller.*(..))")
    public Object intercept(ProceedingJoinPoint point) {
        try {
            // 设置追踪ID，用于日志追踪
            MDC.put("traceId", UUID.randomUUID().toString());

            // 获取HTTP请求上下文
            ServletRequestAttributes requestAttributes =
                (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                HttpContext.init(requestAttributes.getRequest(), requestAttributes.getResponse());
            }

            // 检查是否需要登录验证
            if (isLoginRequired(point)) {
                if (requestAttributes == null) {
                    throw new BusinessException("No valid request context is found.");
                }
                // 验证用户会话
                User user = sessionService.validateSession(requestAttributes.getRequest());
                if (user == null) {
                    throw new AuthException("Login required.");
                }
                // 设置当前用户到线程上下文
                SessionUserHelper.setCurrentUser(user);
            }

            // 执行目标方法
            Object result = point.proceed();

            // 处理DELETE请求的响应状态码
            if (requestAttributes != null && requestAttributes.getResponse() != null && HttpMethod.DELETE.name()
                .equals(requestAttributes.getRequest().getMethod())) {
                requestAttributes.getResponse().setStatus(HttpStatus.NO_CONTENT.value());
            }
            return result;
        } catch (Throwable t) {
            // 异常处理逻辑
            Signature signature = point.getSignature();
            String objectName = signature.getDeclaringTypeName();
            String methodName = signature.getName();
            String msg = t.getClass().getSimpleName() + " occurs when calling " + objectName + "." + methodName;

            // 根据异常类型决定日志级别
            if (t instanceof AuthException) {
                // 认证异常不记录日志
            } else if (t instanceof ValidationException || t instanceof NotFoundException || t instanceof ResourceConflictException) {
                logException(log::warn, msg, t);
            } else {
                logException(log::error, msg, t);
            }

            // 构造统一的错误响应
            Response<Object> response = Response.failure(t);
            return ResponseEntity.status(getHttpStatus(t)).body(response);
        } finally {
            // 清理线程上下文
            SessionUserHelper.clearCurrentUser();
            HttpContext.release();
            MDC.clear();
        }
    }

    /**
     * 记录异常日志，包括异常链中的Kubernetes API异常详情
     *
     * @param logFunction 日志记录函数
     * @param msg 错误消息
     * @param t 异常对象
     */
    private static void logException(BiConsumer<String, Object> logFunction, String msg, Throwable t) {
        logFunction.accept(msg, t);
        Set<Throwable> loggedThrowables = new HashSet<>();
        // 遍历异常链
        for (Throwable t1 = t; t1 != null; t1 = t1.getCause()) {
            if (!loggedThrowables.add(t1)) {
                break;
            }
            // 如果是Kubernetes API异常，记录详细的响应信息
            if (!(t1 instanceof ApiException)) {
                continue;
            }
            ApiException apiException = (ApiException)t1;
            String message = String.format("Related K8s API response: Code=%s Body=%s", apiException.getCode(),
                apiException.getResponseBody());
            logFunction.accept(message, null);
        }
    }

    /**
     * 判断指定的控制器方法是否需要登录验证
     *
     * @param point 连接点对象
     * @return true表示需要登录验证，false表示不需要
     */
    private static boolean isLoginRequired(ProceedingJoinPoint point) {
        // 健康检查控制器不需要登录
        if (point.getTarget() instanceof HealthzController) {
            return false;
        }
        // 登陆页面控制器不需要登录
        if (point.getTarget() instanceof LandingController) {
            return false;
        }
        // 会话控制器不需要登录（处理登录逻辑本身）
        if (point.getTarget() instanceof SessionController) {
            return false;
        }
        // 系统控制器不需要登录
        if (point.getTarget() instanceof SystemController) {
            return false;
        }
        // 其他控制器都需要登录验证
        return true;
    }

    /**
     * 根据异常类型获取对应的HTTP状态码
     *
     * @param t 异常对象
     * @return HTTP状态码
     */
    private static int getHttpStatus(Throwable t) {
        if (t instanceof ValidationException) {
            return HttpStatus.BAD_REQUEST.value();        // 400 - 请求参数验证失败
        }
        if (t instanceof AuthException) {
            return HttpStatus.UNAUTHORIZED.value();       // 401 - 未授权
        }
        if (t instanceof NotFoundException) {
            return HttpStatus.BAD_GATEWAY.value();        // 502 - 资源未找到
        }
        if (t instanceof ResourceConflictException) {
            return HttpStatus.CONFLICT.value();           // 409 - 资源冲突
        }
        return HttpStatus.INTERNAL_SERVER_ERROR.value(); // 500 - 服务器内部错误
    }
}
