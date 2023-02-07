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

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.exception.AlreadyExistedException;
import com.alibaba.higress.console.controller.exception.NotFoundException;
import com.alibaba.higress.console.controller.exception.ValidationException;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class ApiStandardizationAspect {

    @Around("execution(* com.alibaba.higress.console.controller.*Controller.*(..))")
    public Object intercept(ProceedingJoinPoint point) {
        ServletRequestAttributes requestAttributes =
            (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        if (requestAttributes != null) {
            HttpContext.init(requestAttributes.getRequest(), requestAttributes.getResponse());
        }

        try {
            return point.proceed();
        } catch (Throwable t) {
            Signature signature = point.getSignature();
            String objectName = signature.getDeclaringTypeName();
            String methodName = signature.getName();
            String msg = t.getClass().getSimpleName() + " occurs when calling " + objectName + "." + methodName;
            if (t instanceof ValidationException || t instanceof NotFoundException
                || t instanceof AlreadyExistedException) {
                log.warn(msg, t);
            } else {
                log.error(msg, t);
            }
            Response<Object> response = Response.failure(t);
            return ResponseEntity.status(getHttpStatus(t)).body(response);
        } finally {
            HttpContext.release();
        }
    }

    private static int getHttpStatus(Throwable t) {
        if (t instanceof NotFoundException) {
            return HttpStatus.BAD_GATEWAY.value();
        }
        if (t instanceof ValidationException) {
            return HttpStatus.BAD_REQUEST.value();
        }
        if (t instanceof AlreadyExistedException) {
            return HttpStatus.CONFLICT.value();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR.value();
    }
}
