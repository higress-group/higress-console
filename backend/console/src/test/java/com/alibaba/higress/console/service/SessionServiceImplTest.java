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
package com.alibaba.higress.console.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.http.Cookie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import com.alibaba.higress.console.controller.exception.LoginRateLimitException;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.models.V1Secret;

class SessionServiceImplTest {

    private static final String ADMIN = "admin";
    private static final String PASSWORD = "correct-password";
    private static final String CLIENT_IP = "192.0.2.10";

    private SessionServiceImpl sessionService;

    @BeforeEach
    void setUp() throws Exception {
        KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
        when(kubernetesClientService.readSecret(anyString())).thenReturn(adminSecret());
        MutableClock clock = new MutableClock(1_000_000L);
        LoginFailureBudgetService budgetService = LoginFailureBudgetServiceTest
            .createService(new InMemoryLoginAttemptStore(), clock);
        sessionService = new SessionServiceImpl();
        sessionService.setKubernetesClientService(kubernetesClientService);
        sessionService.setLoginFailureBudgetService(budgetService);
    }

    @Test
    void saveSessionOverHttpUsesLaxHttpOnlyCookieWithoutSecure() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.saveSession(request(false), response, user(), false);

        String setCookie = setCookie(response);
        assertTrue(setCookie.startsWith(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "="));
        assertTrue(setCookie.contains("Path=/"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("SameSite=Lax"));
        assertFalse(setCookie.contains("Secure"));
        assertFalse(setCookie.contains("Max-Age"));
    }

    @Test
    void saveSessionOverHttpsAddsSecure() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.saveSession(request(true), response, user(), false);

        String setCookie = setCookie(response);
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("SameSite=Lax"));
    }

    @Test
    void saveSessionAddsSecureWhenExplicitlyConfigured() {
        ReflectionTestUtils.setField(sessionService, "cookieSecure", true);
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.saveSession(request(false), response, user(), false);

        assertTrue(setCookie(response).contains("Secure"));
    }

    @Test
    void persistentSessionKeepsConfiguredMaxAge() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.saveSession(request(false), response, user(), true);

        assertTrue(setCookie(response).contains("Max-Age=" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT));
    }

    @Test
    void clearSessionUsesSameAttributesAndExpiresCookie() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.clearSession(request(true), response);

        String setCookie = setCookie(response);
        assertTrue(setCookie.startsWith(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "=;"));
        assertTrue(setCookie.contains("Max-Age=0"));
        assertTrue(setCookie.contains("Path=/"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("SameSite=Lax"));
        assertTrue(setCookie.contains("Secure"));
    }

    @Test
    void basicAuthIsIgnoredByDefault() {
        assertNull(sessionService.validateSession(basicRequest(ADMIN, PASSWORD)));
    }

    @Test
    void basicAuthWorksWhenExplicitlyEnabled() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);

        User user = sessionService.validateSession(basicRequest(ADMIN, PASSWORD));

        assertNotNull(user);
        assertEquals(ADMIN, user.getName());
        assertNull(sessionService.validateSession(basicRequest(ADMIN, "incorrect-password")));
    }

    @Test
    void cookieSessionWorksWhenBasicAuthIsDisabled() {
        MockHttpServletResponse loginResponse = new MockHttpServletResponse();
        sessionService.saveSession(request(false), loginResponse, user(), false);

        MockHttpServletRequest cookieRequest = request(false);
        cookieRequest
            .setCookies(new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, cookieValue(loginResponse)));

        User user = sessionService.validateSession(cookieRequest);

        assertNotNull(user);
        assertEquals(ADMIN, user.getName());
    }

    private static MockHttpServletRequest request(boolean secure) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSecure(secure);
        request.setRemoteAddr(CLIENT_IP);
        return request;
    }

    private static MockHttpServletRequest request() {
        return request(false);
    }

    @Test
    void basicLockDoesNotAffectFormLogin() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);
        for (int i = 0; i < 5; i++) {
            failedBasic();
        }
        assertThrows(LoginRateLimitException.class, this::failedBasic);

        assertNotNull(sessionService.login(ADMIN, PASSWORD, request()));
    }

    @Test
    void formLockDoesNotAffectBasicLogin() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);
        for (int i = 0; i < 5; i++) {
            failedLogin();
        }
        assertThrows(LoginRateLimitException.class, this::failedLogin);

        assertNotNull(sessionService.validateSession(basicRequest(ADMIN, PASSWORD)));
    }

    @Test
    void successfulFormLoginResetsOnlyFormBudget() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);
        for (int i = 0; i < 4; i++) {
            failedLogin();
            failedBasic();
        }

        assertNotNull(sessionService.login(ADMIN, PASSWORD, request()));

        failedLogin();
        failedBasic();
        assertThrows(LoginRateLimitException.class, this::failedBasic);
        for (int i = 0; i < 3; i++) {
            failedLogin();
        }
        failedLogin();
        assertThrows(LoginRateLimitException.class, this::failedLogin);
    }

    @Test
    void successfulBasicLoginResetsOnlyBasicBudget() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);
        for (int i = 0; i < 4; i++) {
            failedLogin();
            failedBasic();
        }

        assertNotNull(sessionService.validateSession(basicRequest(ADMIN, PASSWORD)));

        failedBasic();
        failedLogin();
        assertThrows(LoginRateLimitException.class, this::failedLogin);
        for (int i = 0; i < 3; i++) {
            failedBasic();
        }
        failedBasic();
        assertThrows(LoginRateLimitException.class, this::failedBasic);
    }

    @Test
    void missingAndMalformedCredentialsDoNotConsumeBudget() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);
        assertNull(sessionService.login("", PASSWORD, request()));
        assertNull(sessionService.login(ADMIN, "", request()));
        assertNull(sessionService.validateSession(request()));
        assertNull(sessionService.validateSession(authorizationRequest("Basic not-base64")));
        assertNull(sessionService.validateSession(basicValueRequest("missing-separator")));
        assertNull(sessionService.validateSession(basicValueRequest(":password")));
        assertNull(sessionService.validateSession(basicValueRequest("admin:")));
        assertNull(sessionService.validateSession(authorizationRequest("Bearer credentials")));

        for (int i = 0; i < 4; i++) {
            failedBasic();
        }
        failedBasic();
        assertThrows(LoginRateLimitException.class, this::failedBasic);
    }

    @Test
    void forwardedHeadersDoNotChangeTheDirectPeerBudgetWhenForwardingIsDisabled() throws Exception {
        Properties properties = PropertiesLoaderUtils.loadProperties(new ClassPathResource("application.properties"));
        assertEquals("none", properties.getProperty("server.forward-headers-strategy"));

        for (int i = 0; i < 4; i++) {
            MockHttpServletRequest request = request();
            request.addHeader("X-Forwarded-For", "198.51.100." + i);
            assertNull(sessionService.login(ADMIN, "incorrect", request));
        }
        MockHttpServletRequest request = request();
        request.addHeader("X-Forwarded-For", "203.0.113.100");
        assertNull(sessionService.login(ADMIN, "incorrect", request));

        MockHttpServletRequest spoofedRequest = request();
        spoofedRequest.addHeader("X-Forwarded-For", "203.0.113.101");
        assertThrows(LoginRateLimitException.class,
            () -> sessionService.login(ADMIN, PASSWORD, spoofedRequest));
    }

    @Test
    void sequentialCorrectLoginsNeverConsumeFailureBudget() {
        for (int i = 0; i < 4; i++) {
            failedLogin();
        }
        for (int i = 0; i < 20; i++) {
            assertNotNull(sessionService.login(ADMIN, PASSWORD, request()));
        }

        for (int i = 0; i < 4; i++) {
            failedLogin();
        }
        assertNotNull(sessionService.login(ADMIN, PASSWORD, request()));
        for (int i = 0; i < 5; i++) {
            failedLogin();
        }
        assertThrows(LoginRateLimitException.class, () -> sessionService.login(ADMIN, PASSWORD, request()));
    }

    @Test
    void parallelCorrectLoginsNeverConsumeFailureBudget() throws Exception {
        int taskCount = 12;
        LoginFailureBudgetService budgetService = LoginFailureBudgetServiceTest
            .createService(new InMemoryLoginAttemptStore(), new MutableClock(1_000_000L));
        sessionService.setLoginFailureBudgetService(budgetService);
        for (int i = 0; i < 4; i++) {
            failedLogin();
        }

        LoginFailureBudgetService concurrentBudgetService = spy(budgetService);
        CountDownLatch successfulResets = new CountDownLatch(taskCount);
        doAnswer(invocation -> {
            successfulResets.countDown();
            assertTrue(successfulResets.await(10, TimeUnit.SECONDS));
            invocation.callRealMethod();
            return null;
        }).when(concurrentBudgetService).reset(any(LoginAttemptKey.class));
        sessionService.setLoginFailureBudgetService(concurrentBudgetService);

        ExecutorService executor = Executors.newFixedThreadPool(taskCount);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<User>> results = new ArrayList<>();
        try {
            for (int i = 0; i < taskCount; i++) {
                results.add(executor.submit(() -> {
                    start.await();
                    return sessionService.login(ADMIN, PASSWORD, request());
                }));
            }
            start.countDown();
            for (Future<User> result : results) {
                assertNotNull(result.get(15, TimeUnit.SECONDS));
            }
        } finally {
            executor.shutdownNow();
        }

        for (int i = 0; i < 5; i++) {
            failedLogin();
        }
        assertThrows(LoginRateLimitException.class, () -> sessionService.login(ADMIN, PASSWORD, request()));
    }

    @Test
    void blankAndNullRemoteAddressesShareAFailureBudget() {
        MockHttpServletRequest blankRequest = request();
        blankRequest.setRemoteAddr("  ");
        MockHttpServletRequest nullRequest = request();
        nullRequest.setRemoteAddr(null);

        for (int i = 0; i < 2; i++) {
            assertNull(sessionService.login(ADMIN, "incorrect", blankRequest));
        }
        for (int i = 0; i < 3; i++) {
            assertNull(sessionService.login(ADMIN, "incorrect", nullRequest));
        }

        assertThrows(LoginRateLimitException.class, () -> sessionService.login(ADMIN, PASSWORD, blankRequest));
        assertThrows(LoginRateLimitException.class, () -> sessionService.login(ADMIN, PASSWORD, nullRequest));
    }

    @Test
    void concurrentFailuresAreCountedAfterCredentialVerification() throws Exception {
        KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
        AtomicInteger verifications = new AtomicInteger();
        int taskCount = 8;
        CountDownLatch verificationsStarted = new CountDownLatch(taskCount);
        when(kubernetesClientService.readSecret(anyString())).thenAnswer(invocation -> {
            verifications.incrementAndGet();
            verificationsStarted.countDown();
            assertTrue(verificationsStarted.await(10, TimeUnit.SECONDS));
            return adminSecret();
        });
        SessionServiceImpl concurrentService = new SessionServiceImpl();
        concurrentService.setKubernetesClientService(kubernetesClientService);
        concurrentService.setLoginFailureBudgetService(LoginFailureBudgetServiceTest
            .createService(new InMemoryLoginAttemptStore(), new MutableClock(1_000_000L)));

        ExecutorService executor = Executors.newFixedThreadPool(taskCount);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<>();
        try {
            for (int i = 0; i < taskCount; i++) {
                results.add(executor.submit(() -> {
                    start.await();
                    try {
                        concurrentService.login(ADMIN, "incorrect", request());
                        return true;
                    } catch (LoginRateLimitException e) {
                        return false;
                    }
                }));
            }
            start.countDown();
            for (Future<Boolean> result : results) {
                assertTrue(result.get(15, TimeUnit.SECONDS));
            }
        } finally {
            executor.shutdownNow();
        }

        assertEquals(taskCount, verifications.get());
        assertThrows(LoginRateLimitException.class, () -> concurrentService.login(ADMIN, PASSWORD, request()));
    }

    private void failedLogin() {
        assertNull(sessionService.login(ADMIN, "incorrect", request()));
    }

    private void failedBasic() {
        assertNull(sessionService.validateSession(basicRequest(ADMIN, "incorrect")));
    }

    private static MockHttpServletRequest basicRequest(String username, String password) {
        return basicValueRequest(username + ":" + password);
    }

    private static MockHttpServletRequest basicValueRequest(String value) {
        String encoded = Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
        return authorizationRequest("Basic " + encoded);
    }

    private static MockHttpServletRequest authorizationRequest(String value) {
        MockHttpServletRequest request = request();
        request.addHeader(HttpHeaders.AUTHORIZATION, value);
        return request;
    }

    private static User user() {
        return User.builder().name(ADMIN).displayName("Administrator").build();
    }

    private static String setCookie(MockHttpServletResponse response) {
        String setCookie = response.getHeader(HttpHeaders.SET_COOKIE);
        assertNotNull(setCookie);
        return setCookie;
    }

    private static String cookieValue(MockHttpServletResponse response) {
        String setCookie = setCookie(response);
        String prefix = SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "=";
        int end = setCookie.indexOf(';');
        return setCookie.substring(prefix.length(), end >= 0 ? end : setCookie.length());
    }

    private static V1Secret adminSecret() {
        Map<String, byte[]> data = new HashMap<>();
        data.put("adminUsername", ADMIN.getBytes(StandardCharsets.UTF_8));
        data.put("adminPassword", PASSWORD.getBytes(StandardCharsets.UTF_8));
        data.put("adminDisplayName", "Administrator".getBytes(StandardCharsets.UTF_8));
        data.put("key", "01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8));
        data.put("iv", "0123456789012345".getBytes(StandardCharsets.UTF_8));
        return new V1Secret().data(data);
    }
}
