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
package com.alibaba.higress.console.controller.util;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;

public class ControllerUtil {

    public static ResponseEntity<?> buildSuccessResponseEntity() {
        return ResponseEntity.ok(Response.success(null));
    }

    public static ResponseEntity<?> buildFalureResponseEntity(String message) {
        return ResponseEntity.ok(Response.failure(message));
    }

    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<Response<T>> buildResponseEntity(T result) {
        return (ResponseEntity<Response<T>>)doBuildResponseEntity(result);
    }

    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<PaginatedResponse<T>> buildResponseEntity(PaginatedResult<T> result) {
        return (ResponseEntity<PaginatedResponse<T>>)doBuildResponseEntity(result);
    }

    private static ResponseEntity<?> doBuildResponseEntity(Object result) {
        if (result instanceof ResponseEntity<?>) {
            return ResponseEntity.ok(result);
        }
        HttpContext httpContext = HttpContext.getCurrent();
        if (httpContext == null) {
            return ResponseEntity.ok(result);
        }
        HttpServletRequest request = httpContext.getRequest();
        if (request == null) {
            return ResponseEntity.ok(result);
        }
        HttpMethod method = HttpMethod.resolve(request.getMethod());
        if (method == null) {
            return ResponseEntity.ok(result);
        }
        switch (method) {
            case GET:
                if (result == null) {
                    return ResponseEntity.notFound().build();
                }
                if (result instanceof PaginatedResult<?>) {
                    return ResponseEntity.ok(PaginatedResponse.success((PaginatedResult<?>)result));
                }
                return ResponseEntity.ok(Response.success(result));
            case POST:
                return ResponseEntity.status(HttpStatus.CREATED).body(result);
            case DELETE:
                return result != null ? ResponseEntity.ok(result) : ResponseEntity.noContent().build();
            default:
                return ResponseEntity.ok(result);
        }
    }
}
