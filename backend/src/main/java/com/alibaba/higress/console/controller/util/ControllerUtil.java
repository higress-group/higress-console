package com.alibaba.higress.console.controller.util;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;

public class ControllerUtil {

    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<Response<T>> buildResponseEntity(T result) {
        return (ResponseEntity<Response<T>>) doBuildResponseEntity(result);
    }

    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<PaginatedResponse<T>> buildResponseEntity(PaginatedResult<T> result) {
        return (ResponseEntity<PaginatedResponse<T>>) doBuildResponseEntity(result);
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
                    return ResponseEntity.ok(PaginatedResponse.success((PaginatedResult<?>) result));
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
