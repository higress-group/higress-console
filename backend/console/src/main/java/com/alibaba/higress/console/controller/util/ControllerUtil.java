package com.alibaba.higress.console.controller.util;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;

/**
 * 控制器工具类
 * 提供构建HTTP响应实体的通用方法，用于统一API响应格式
 */
public class ControllerUtil {

    /**
     * 构建成功的响应实体（无数据）
     *
     * @return HTTP 200状态的空成功响应
     */
    public static ResponseEntity<?> buildSuccessResponseEntity() {
        return ResponseEntity.ok(Response.success(null));
    }

    /**
     * 构建失败的响应实体
     *
     * @param message 错误信息
     * @return HTTP 200状态的失败响应，包含错误信息
     */
    public static ResponseEntity<?> buildFalureResponseEntity(String message) {
        return ResponseEntity.ok(Response.failure(message));
    }

    /**
     * 构建通用响应实体
     *
     * @param <T> 响应数据类型
     * @param result 响应数据
     * @return 根据HTTP方法和数据类型构建的响应实体
     */
    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<Response<T>> buildResponseEntity(T result) {
        return (ResponseEntity<Response<T>>)doBuildResponseEntity(result);
    }

    /**
     * 构建分页响应实体
     *
     * @param <T> 分页数据元素类型
     * @param result 分页结果数据
     * @return 根据HTTP方法和分页数据构建的响应实体
     */
    @SuppressWarnings("unchecked")
    public static <T> ResponseEntity<PaginatedResponse<T>> buildResponseEntity(PaginatedResult<T> result) {
        return (ResponseEntity<PaginatedResponse<T>>)doBuildResponseEntity(result);
    }

    /**
     * 实际构建响应实体的核心方法
     * 根据当前HTTP请求的方法和结果数据类型，构建相应的响应实体
     *
     * @param result 响应结果数据
     * @return 构建好的响应实体
     */
    private static ResponseEntity<?> doBuildResponseEntity(Object result) {
        // 如果结果已经是ResponseEntity类型，直接返回
        if (result instanceof ResponseEntity<?>) {
            return ResponseEntity.ok(result);
        }

        // 获取当前HTTP上下文
        HttpContext httpContext = HttpContext.getCurrent();
        if (httpContext == null) {
            return ResponseEntity.ok(result);
        }

        // 获取HTTP请求对象
        HttpServletRequest request = httpContext.getRequest();
        if (request == null) {
            return ResponseEntity.ok(result);
        }

        // 解析HTTP方法
        HttpMethod method = HttpMethod.resolve(request.getMethod());
        if (method == null) {
            return ResponseEntity.ok(result);
        }

        // 根据不同的HTTP方法构建相应的响应
        switch (method) {
            case GET:
                // GET请求处理
                if (result == null) {
                    // 结果为空时返回404
                    return ResponseEntity.notFound().build();
                }
                if (result instanceof PaginatedResult<?>) {
                    // 分页结果返回分页响应
                    return ResponseEntity.ok(PaginatedResponse.success((PaginatedResult<?>)result));
                }
                // 普通结果返回普通响应
                return ResponseEntity.ok(Response.success(result));
            case POST:
                // POST请求返回201状态码
                return ResponseEntity.status(HttpStatus.CREATED).body(result);
            case DELETE:
                // DELETE请求根据结果是否存在决定返回200或204
                return result != null ? ResponseEntity.ok(result) : ResponseEntity.noContent().build();
            default:
                // 其他方法返回默认200状态
                return ResponseEntity.ok(result);
        }
    }
}
