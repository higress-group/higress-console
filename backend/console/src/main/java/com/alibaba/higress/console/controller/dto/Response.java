package com.alibaba.higress.console.controller.dto;

import java.io.Serializable;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;

import io.kubernetes.client.openapi.ApiException;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 通用响应数据传输对象
 * 用于封装API接口的统一响应格式
 * 响应格式示例: { "success": true, "data": { "Name": "rick" }, "message": "" }
 *
 * @param <T> 响应数据的类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> implements Serializable {

    /**
     * 请求是否成功标识
     * true表示请求处理成功，false表示请求处理失败
     */
    @Schema(description = "Whether the request is successful.")
    private boolean success = true;

    /**
     * 错误信息
     * 当请求失败时，包含具体的错误描述信息
     */
    @Schema(description = "Error message.")
    private String message;

    /**
     * 响应数据
     * 包含接口返回的具体业务数据
     */
    @Schema(description = "Response data.")
    private T data;

    /**
     * 创建成功的响应对象
     *
     * @param <T> 数据类型
     * @param data 响应数据
     * @return 成功的响应对象
     */
    public static <T> Response<T> success(T data) {
        Response<T> response = new Response<T>();
        response.setData(data);
        return response;
    }

    /**
     * 创建失败的响应对象
     *
     * @param <T> 数据类型
     * @param message 错误信息
     * @return 失败的响应对象
     */
    public static <T> Response<T> failure(String message) {
        Response<T> response = new Response<T>();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    /**
     * 创建失败的响应对象，基于异常对象
     *
     * @param <T> 数据类型
     * @param t 异常对象
     * @return 失败的响应对象
     */
    public static <T> Response<T> failure(Throwable t) {
        return failure(getErrorMessage(t));
    }

    /**
     * 获取异常的错误信息
     *
     * @param throwable 异常对象
     * @return 格式化的错误信息字符串
     */
    private static String getErrorMessage(Throwable throwable) {
        // 如果是业务异常且有cause，则递归获取cause的错误信息
        if (throwable instanceof BusinessException && throwable.getCause() != null) {
            return getErrorMessage(throwable.getCause());
        }

        String message = throwable.getMessage();

        // 如果是API异常，追加响应体内容到错误信息中
        if (throwable instanceof ApiException) {
            if (StringUtils.isNotEmpty(message)) {
                message += " - ";
            }
            message += ((ApiException)throwable).getResponseBody();
        }

        // 返回完整的异常类名和错误信息
        return throwable.getClass().getName() + ": " + message;
    }
}
