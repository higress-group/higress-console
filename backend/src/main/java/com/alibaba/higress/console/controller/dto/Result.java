package com.alibaba.higress.console.controller.dto;

import io.kubernetes.client.openapi.ApiException;
import net.bytebuddy.implementation.bytecode.Throw;

import java.io.Serializable;
import java.util.List;
import java.util.function.Function;

/**
 * {
 * "success": true,
 * "code": "OK",
 * "status": 200,
 * "data": {
 * "Name": "rick"
 * },
 * "message": ""
 * }
 *
 * @param <T>
 */
public class Result<T> implements Serializable {

    private boolean success = true;

    private String code;

    private int status = 200;

    private String message;

    private T data;

    public static <T> Result<T> successReturn(T data) {
        Result<T> restResult = new Result<T>();
        restResult.setData(data);
        restResult.setCode("OK");
        return restResult;
    }

    public static <T> Result<PageResult<T>> successPageReturn(List<T> contents,
                                                              int page, int size, int totalSize) {
        Result<PageResult<T>> restResult = new Result<>();
        PageResult<T> pageResult = new PageResult<>();
        pageResult.setPageNumber(page);
        pageResult.setPageSize(size);
        pageResult.setTotalSize(totalSize);
        List<T> list = contents;
        if (size > 0 && (page != 0 || size < totalSize)) {
            int startIndex = page * size;
            list = contents.subList(startIndex, startIndex + size);
        }
        pageResult.setList(list);
        restResult.setCode("OK");
        restResult.setData(pageResult);
        return restResult;
    }

    public static <T, V> Result<PageResult<V>> successPageReturn(List<T> contents,
                                                                 int page, int size, int totalSize, Function<T, V> converter) {
        Result<PageResult<V>> restResult = new Result<>();
        PageResult<V> pageResult = new PageResult<>();
        pageResult.setPageNumber(page);
        pageResult.setPageSize(size);
        pageResult.setTotalSize(totalSize);
        page = Math.max(0, page);
        if (size <= 0) {
            size = Integer.MAX_VALUE;
        }
        pageResult.setList((contents.stream().skip((long) page * size).limit(size).map(converter).toList()));
        restResult.setCode("OK");
        restResult.setData(pageResult);
        return restResult;
    }

    public static <T> Result<T> failureReturn(Throwable t) {
        Result<T> restResult = new Result<T>();
        restResult.setSuccess(false);
        restResult.setStatus(500);
        restResult.setCode("Error");
        restResult.setMessage(t.getClass().getName() + ": " + t.getMessage());
        return restResult;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
