package com.alibaba.higress.console.controller.dto;

import com.alibaba.higress.console.controller.exception.BusinessException;
import io.kubernetes.client.openapi.ApiException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;

/**
 * {
 * "success": true,
 * "data": {
 * "Name": "rick"
 * },
 * "message": ""
 * }
 *
 * @param <T>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response<T> implements Serializable {

    private boolean success = true;

    private String message;

    private T data;

    public static <T> Response<T> success(T data) {
        Response<T> response = new Response<T>();
        response.setData(data);
        return response;
    }

    public static <T> Response<T> failure(Throwable t) {
        Response<T> response = new Response<T>();
        response.setSuccess(false);
        response.setMessage(getErrorMessage(t));
        return response;
    }

    private static String getErrorMessage(Throwable throwable) {
        if (throwable instanceof BusinessException && throwable.getCause() != null) {
            return getErrorMessage(throwable.getCause());
        }
        String message = throwable.getMessage();
        if (throwable instanceof ApiException && StringUtils.isEmpty(throwable.getMessage())) {
            message = ((ApiException) throwable).getResponseBody();
        }
        return throwable.getClass().getName() + ": " + message;
    }
}
