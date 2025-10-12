package com.alibaba.higress.console.controller.exception;

/**
 * 认证异常类
 * 用于处理用户认证相关的异常情况，如登录失败、权限不足等
 *
 * @author CH3CHO
 */
public class AuthException extends RuntimeException {

    /**
     * 无参构造函数
     * 创建一个空的认证异常实例
     */
    public AuthException() {}

    /**
     * 带消息的构造函数
     * 创建一个包含指定错误消息的认证异常实例
     *
     * @param message 异常的详细错误信息
     */
    public AuthException(String message) {
        super(message);
    }
}
