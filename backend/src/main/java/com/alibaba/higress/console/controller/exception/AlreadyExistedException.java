package com.alibaba.higress.console.controller.exception;

public class AlreadyExistedException extends RuntimeException {

    public AlreadyExistedException() {
    }

    public AlreadyExistedException(String message) {
        super(message);
    }
}