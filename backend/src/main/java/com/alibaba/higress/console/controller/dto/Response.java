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
package com.alibaba.higress.console.controller.dto;

import java.io.Serializable;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.console.controller.exception.BusinessException;

import io.kubernetes.client.openapi.ApiException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * { "success": true, "data": { "Name": "rick" }, "message": "" }
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
        if (throwable instanceof ApiException) {
            if (StringUtils.isNotEmpty(message)) {
                message += " - ";
            }
            message += ((ApiException)throwable).getResponseBody();
        }
        return throwable.getClass().getName() + ": " + message;
    }
}
