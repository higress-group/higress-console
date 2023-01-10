package com.alibaba.higress.console.controller.dto;

import java.io.Serializable;
import java.util.List;

/**
 * {
 *   "success": true,
 *   "code": "OK",
 *   "status": 200,
 *   "data": {
 *     "Name": "rick"
 *   },
 *   "message": ""
 * }
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
        pageResult.setList(contents);
        restResult.setCode("OK");
        restResult.setData(pageResult);
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
