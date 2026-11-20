/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.aop;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.alibaba.higress.console.controller.SessionController;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.exception.AuthException;
import com.alibaba.higress.console.controller.exception.LoginRateLimitException;

class ApiStandardizationAspectTest {

    private final ApiStandardizationAspect aspect = new ApiStandardizationAspect();

    @Test
    void rateLimitResponseIncludesStatusAndRetryAfter() throws Throwable {
        ResponseEntity<?> response = intercept(new LoginRateLimitException(61));

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("61", response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER));
        Response<?> body = (Response<?>)response.getBody();
        assertFalse(body.isSuccess());
    }

    @Test
    void ordinaryAuthenticationFailureRemainsUnauthorized() throws Throwable {
        ResponseEntity<?> response = intercept(new AuthException("Incorrect username or password"));

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER));
        Response<?> body = (Response<?>)response.getBody();
        assertFalse(body.isSuccess());
    }

    @Test
    void fullAttemptStoreReturnsServiceUnavailable() throws Throwable {
        ResponseEntity<?> response = intercept(
            new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Login attempt store is full."));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNull(response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER));
    }

    private ResponseEntity<?> intercept(Throwable throwable) throws Throwable {
        ProceedingJoinPoint point = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class);
        when(point.getTarget()).thenReturn(new SessionController());
        when(point.getSignature()).thenReturn(signature);
        when(signature.getDeclaringTypeName()).thenReturn(SessionController.class.getName());
        when(signature.getName()).thenReturn("login");
        when(point.proceed()).thenThrow(throwable);
        return (ResponseEntity<?>)aspect.intercept(point);
    }
}
