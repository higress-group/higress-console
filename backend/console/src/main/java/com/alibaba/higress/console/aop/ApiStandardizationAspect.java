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
 * @author CH3CHO
 */
@Aspect
@Component
@Slf4j
public class ApiStandardizationAspect {

    private SessionService sessionService;

    @Resource
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Around("execution(* com.alibaba.higress.console.controller..*Controller.*(..))")
    public Object intercept(ProceedingJoinPoint point) {
        try {
            MDC.put("traceId", UUID.randomUUID().toString());

            ServletRequestAttributes requestAttributes =
                (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                HttpContext.init(requestAttributes.getRequest(), requestAttributes.getResponse());
            }

            if (isLoginRequired(point)) {
                if (requestAttributes == null) {
                    throw new BusinessException("No valid request context is found.");
                }
                User user = sessionService.validateSession(requestAttributes.getRequest());
                if (user == null) {
                    throw new AuthException("Login required.");
                }
                sessionService.renewSession(requestAttributes.getRequest());
                SessionUserHelper.setCurrentUser(user);
            }
            Object result = point.proceed();
            if (requestAttributes != null && requestAttributes.getResponse() != null && HttpMethod.DELETE.name()
                .equals(requestAttributes.getRequest().getMethod())) {
                requestAttributes.getResponse().setStatus(HttpStatus.NO_CONTENT.value());
            }
            return result;
        } catch (Throwable t) {
            Signature signature = point.getSignature();
            String objectName = signature.getDeclaringTypeName();
            String methodName = signature.getName();
            String msg = t.getClass().getSimpleName() + " occurs when calling " + objectName + "." + methodName;
            if (t instanceof AuthException) {
                // No logging for AuthException
            } else if (t instanceof ValidationException || t instanceof NotFoundException || t instanceof ResourceConflictException) {
                logException(log::warn, msg, t);
            } else {
                logException(log::error, msg, t);
            }
            Response<Object> response = Response.failure(t);
            return ResponseEntity.status(getHttpStatus(t)).body(response);
        } finally {
            SessionUserHelper.clearCurrentUser();
            HttpContext.release();
            MDC.clear();
        }
    }

    private static void logException(BiConsumer<String, Object> logFunction, String msg, Throwable t) {
        logFunction.accept(msg, t);
        Set<Throwable> loggedThrowables = new HashSet<>();
        for (Throwable t1 = t; t1 != null; t1 = t1.getCause()) {
            if (!loggedThrowables.add(t1)) {
                break;
            }
            if (!(t1 instanceof ApiException)) {
                continue;
            }
            ApiException apiException = (ApiException)t1;
            String message = String.format("Related K8s API response: Code=%s Body=%s", apiException.getCode(),
                apiException.getResponseBody());
            logFunction.accept(message, null);
        }
    }

    private static boolean isLoginRequired(ProceedingJoinPoint point) {
        if (point.getTarget() instanceof HealthzController) {
            return false;
        }
        if (point.getTarget() instanceof LandingController) {
            return false;
        }
        if (point.getTarget() instanceof SessionController) {
            return false;
        }
        if (point.getTarget() instanceof SystemController) {
            return false;
        }
        return true;
    }

    private static int getHttpStatus(Throwable t) {
        if (t instanceof ValidationException) {
            return HttpStatus.BAD_REQUEST.value();
        }
        if (t instanceof AuthException) {
            return HttpStatus.UNAUTHORIZED.value();
        }
        if (t instanceof NotFoundException) {
            return HttpStatus.BAD_GATEWAY.value();
        }
        if (t instanceof ResourceConflictException) {
            return HttpStatus.CONFLICT.value();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR.value();
    }
}
