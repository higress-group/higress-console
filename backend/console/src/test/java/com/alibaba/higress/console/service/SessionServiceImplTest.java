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

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.http.Cookie;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.higress.console.aop.ApiStandardizationAspect;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.controller.UserController;
import com.alibaba.higress.console.controller.exception.LoginRateLimitException;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;

class SessionServiceImplTest {

    private static final String ADMIN = "admin";
    private static final String OLD_PASSWORD = "old-password";
    private static final String PASSWORD = OLD_PASSWORD;
    private static final String CLIENT_IP = "192.0.2.10";

    private MutableClock clock;
    private InMemorySessionStore sessionStore;
    private SessionServiceImpl sessionService;

    @BeforeEach
    void setUp() throws ApiException {
        clock = new MutableClock(1_700_000_000_000L);
        sessionStore = new InMemorySessionStore();
        sessionService = newService(sessionStore);
    }

    @AfterEach
    void tearDown() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void idleTimeoutExpiresAfterInactivityDespiteEarlierActivity() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);

        clock.advance(Duration.ofMinutes(29));
        assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));
        clock.advance(Duration.ofMinutes(29));
        assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));

        clock.advance(Duration.ofMinutes(30));
        assertNull(sessionService.validateSession(requestWith(sessionCookie)));
        assertNull(sessionStore.find(sessionCookie.getValue()));
    }

    @Test
    void absoluteTimeoutAppliesDespiteActivityAndAutoLogin() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, true);
        assertEquals(SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT, sessionCookie.getMaxAge());

        for (int i = 0; i < 47; i++) {
            clock.advance(Duration.ofMinutes(10));
            assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));
        }

        clock.advance(Duration.ofMinutes(10));
        assertNull(sessionService.validateSession(requestWith(sessionCookie)));
        assertNull(sessionStore.find(sessionCookie.getValue()));
    }

    @Test
    void zeroIdleTimeoutDisablesIdleExpiry() {
        sessionService.setIdleTimeout(0);
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);

        clock.advance(Duration.ofHours(1));

        assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));
    }

    @Test
    void zeroAbsoluteTimeoutDisablesAbsoluteExpiry() {
        sessionService.setIdleTimeout(Duration.ofDays(1).toMillis());
        sessionService.setAbsoluteTimeout(0);
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);

        clock.advance(Duration.ofHours(9));

        assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));
    }

    @Test
    void negativeTimeoutsAreRejected() {
        IllegalArgumentException idleException =
            assertThrows(IllegalArgumentException.class, () -> sessionService.setIdleTimeout(-1));
        IllegalArgumentException absoluteException =
            assertThrows(IllegalArgumentException.class, () -> sessionService.setAbsoluteTimeout(-1));

        assertTrue(idleException.getMessage().contains(SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_KEY));
        assertTrue(absoluteException.getMessage().contains(SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_KEY));
    }

    @Test
    void logoutRevokesPresentedSessionAndReplayReturnsUnauthorized() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);
        MockHttpServletResponse logoutResponse = new MockHttpServletResponse();
        sessionService.clearSession(requestWith(sessionCookie), logoutResponse);
        assertTrue(setCookie(logoutResponse).contains("Max-Age=0"));
        assertNull(sessionStore.find(sessionCookie.getValue()));

        MockHttpServletRequest replayRequest = requestWith(sessionCookie);
        RequestContextHolder.setRequestAttributes(
            new ServletRequestAttributes(replayRequest, new MockHttpServletResponse()));
        ApiStandardizationAspect aspect = new ApiStandardizationAspect();
        aspect.setSessionService(sessionService);
        ProceedingJoinPoint point = mock(ProceedingJoinPoint.class);
        MethodSignature signature = mock(MethodSignature.class);
        when(point.getTarget()).thenReturn(new UserController());
        when(point.getSignature()).thenReturn(signature);
        when(signature.getName()).thenReturn("getUserInfo");
        when(signature.toShortString()).thenReturn("UserController.getUserInfo(..)");
        when(signature.getParameterTypes()).thenReturn(new Class<?>[0]);

        Object result = aspect.intercept(point);

        assertEquals(HttpStatus.UNAUTHORIZED, ((ResponseEntity<?>)result).getStatusCode());
    }

    @Test
    void successfulPasswordChangeRevokesAllSessionsForUser() {
        Cookie first = createSession(sessionService, ADMIN, false);
        Cookie second = createSession(sessionService, ADMIN, true);

        sessionService.changePassword(ADMIN, OLD_PASSWORD, "new-password");

        assertNull(sessionStore.find(first.getValue()));
        assertNull(sessionStore.find(second.getValue()));
        assertNull(sessionService.validateSession(requestWith(first)));
        assertNull(sessionService.validateSession(requestWith(second)));
    }

    @Test
    void sessionCreatedWithOldCredentialFingerprintIsRejectedAfterUpdate() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);
        SessionData staleSession = sessionStore.find(sessionCookie.getValue());

        sessionStore.updateCredentialFingerprint(ADMIN,
            SessionServiceImpl.credentialFingerprint(ADMIN, "new-password"));
        sessionStore.create(sessionCookie.getValue(), staleSession);

        assertNull(sessionService.validateSession(requestWith(sessionCookie)));
        assertNull(sessionStore.find(sessionCookie.getValue()));
    }

    @Test
    void failedSessionRevocationAfterPasswordCommitStillInvalidatesOldCredentialFingerprint() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        V1Secret adminSecret = adminSecret();
        KubernetesClientService client = mock(KubernetesClientService.class);
        when(client.readSecret(SystemConfigKey.SECRET_NAME_DEFAULT)).thenReturn(adminSecret);
        SessionServiceImpl service = newService(store, client);
        Cookie sessionCookie = createSession(service, ADMIN, false);
        doThrow(new IllegalStateException("Revocation failed.")).when(store).deleteByUsername(ADMIN);

        assertThrows(IllegalStateException.class, () -> service.changePassword(ADMIN, OLD_PASSWORD, "new-password"));

        assertNull(service.validateSession(requestWith(sessionCookie)));
        assertNull(service.login(ADMIN, OLD_PASSWORD, request(false), new MockHttpServletResponse(), false));
        assertNotNull(service.login(ADMIN, "new-password", request(false), new MockHttpServletResponse(), false));
        assertAll(() -> verify(client).replaceSecret(any(V1Secret.class)),
            () -> assertEquals("new-password",
                new String(adminSecret.getData().get("adminPassword"), StandardCharsets.UTF_8)));
    }

    @Test
    void touchFailureDoesNotFailAuthentication() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        Cookie sessionCookie = createSession(service, ADMIN, false);
        doThrow(new IllegalStateException("CAS retries exhausted")).when(store).update(any(), any());
        clock.advance(Duration.ofMillis(SessionServiceImpl.SESSION_TOUCH_INTERVAL_MILLIS + 1));

        assertNotNull(service.validateSession(requestWith(sessionCookie)));
    }

    @Test
    void touchesAreThrottledToOncePerInterval() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        Cookie sessionCookie = createSession(service, ADMIN, false);

        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        clock.advance(Duration.ofSeconds(30));
        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        verify(store, never()).update(any(), any());

        clock.advance(Duration.ofSeconds(31));
        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        verify(store).update(any(), any());
    }

    @Test
    void activeSessionIsTouchedWithinShortIdleTimeout() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        service.setIdleTimeout(Duration.ofSeconds(45).toMillis());
        Cookie sessionCookie = createSession(service, ADMIN, false);

        clock.advance(Duration.ofSeconds(30));
        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        assertEquals(clock.millis(), store.find(sessionCookie.getValue()).getLastAccessAt());
        verify(store).update(any(), any());

        clock.advance(Duration.ofSeconds(30));
        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        assertEquals(clock.millis(), store.find(sessionCookie.getValue()).getLastAccessAt());
        verify(store, times(2)).update(any(), any());
    }

    @Test
    void loginRejectsStaleAdminConfigWhenStoredFingerprintHasChanged() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        String oldFingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, OLD_PASSWORD);
        String newFingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, "new-password");
        doReturn(newFingerprint).when(store).getOrCreateCredentialFingerprint(ADMIN, oldFingerprint);
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertNull(service.login(ADMIN, OLD_PASSWORD, request(false), response, false));

        assertNull(response.getHeader(HttpHeaders.SET_COOKIE));
        verify(store, never()).create(any(), any());
        verify(store).getOrCreateCredentialFingerprint(ADMIN, oldFingerprint);
    }

    @Test
    void sessionCreatedDuringFingerprintChangeUsesAuthenticatedFingerprint() throws ApiException {
        InMemorySessionStore store = new InMemorySessionStore() {
            @Override
            public void create(String sessionId, SessionData session) {
                updateCredentialFingerprint(session.getUsername(),
                    SessionServiceImpl.credentialFingerprint(session.getUsername(), "new-password"));
                super.create(sessionId, session);
            }
        };
        SessionServiceImpl service = newService(store);
        MockHttpServletResponse response = new MockHttpServletResponse();

        assertNotNull(service.login(ADMIN, OLD_PASSWORD, request(false), response, false));

        Cookie sessionCookie = new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, cookieValue(response));
        SessionData session = store.find(sessionCookie.getValue());
        assertNotNull(session);
        String currentFingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, "new-password");
        assertNotEquals(store.getOrCreateCredentialFingerprint(ADMIN, currentFingerprint),
            session.getCredentialFingerprint());
        assertNull(service.validateSession(requestWith(sessionCookie)));
        assertNull(store.find(sessionCookie.getValue()));
    }

    @Test
    void sessionWithOldFingerprintIsRejectedAfterStaleCacheRefreshes() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        String oldFingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, OLD_PASSWORD);
        String newFingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, "new-password");
        doReturn(oldFingerprint, oldFingerprint, newFingerprint).when(store)
            .getOrCreateCredentialFingerprint(ADMIN, oldFingerprint);
        Cookie sessionCookie = createSession(service, ADMIN, false);

        assertNotNull(service.validateSession(requestWith(sessionCookie)));
        assertNull(service.validateSession(requestWith(sessionCookie)));
        assertNull(store.find(sessionCookie.getValue()));
    }

    @Test
    void normalLoginCreatesSessionWithVerifiedCredentialFingerprint() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        SessionServiceImpl service = newService(store);
        MockHttpServletResponse response = new MockHttpServletResponse();
        String fingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, OLD_PASSWORD);

        User user = service.login(ADMIN, OLD_PASSWORD, request(false), response, false);

        assertNotNull(user);
        assertEquals(ADMIN, user.getName());
        verify(store).getOrCreateCredentialFingerprint(ADMIN, fingerprint);
        Cookie sessionCookie = new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, cookieValue(response));
        assertEquals(fingerprint, store.find(sessionCookie.getValue()).getCredentialFingerprint());
        assertNotNull(service.validateSession(requestWith(sessionCookie)));
    }

    @Test
    void fingerprintIsNotExposedInResponsesCookiesOrSessionStrings() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        User user = sessionService.login(ADMIN, OLD_PASSWORD, request(false), response, false);
        String fingerprint = SessionServiceImpl.credentialFingerprint(ADMIN, OLD_PASSWORD);
        Cookie sessionCookie = new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, cookieValue(response));
        SessionData session = sessionStore.find(sessionCookie.getValue());
        ObjectMapper objectMapper = new ObjectMapper();

        assertNotNull(user);
        assertAll(() -> assertFalse(objectMapper.writeValueAsString(user).contains(fingerprint)),
            () -> assertFalse(objectMapper.writeValueAsString(session).contains(fingerprint)),
            () -> assertFalse(setCookie(response).contains(fingerprint)),
            () -> assertFalse(session.toString().contains(fingerprint)));
    }

    @Test
    void twoServiceInstancesShareSessionStateThroughStore() throws ApiException {
        SessionServiceImpl secondService = newService(sessionStore);
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);

        clock.advance(Duration.ofMinutes(5));
        assertNotNull(secondService.validateSession(requestWith(sessionCookie)));
        assertEquals(clock.millis(), sessionStore.find(sessionCookie.getValue()).getLastAccessAt());

        clock.advance(Duration.ofMinutes(5));
        assertNotNull(sessionService.validateSession(requestWith(sessionCookie)));
    }

    @Test
    void sessionIdsAreOpaqueAndLegacyCookieValuesAreNotAccepted() {
        Cookie first = createSession(sessionService, ADMIN, false);
        Cookie second = createSession(sessionService, ADMIN, false);

        assertEquals(-1, first.getMaxAge());
        assertTrue(first.getValue().matches("[A-Za-z0-9_-]{43}"));
        assertTrue(Base64.getUrlDecoder().decode(first.getValue()).length * 8 >= 256);
        assertFalse(first.getValue().contains(ADMIN));
        assertFalse(first.getValue().contains(OLD_PASSWORD));
        assertNotEquals(first.getValue(), second.getValue());

        String legacyValue = Base64.getEncoder().encodeToString("legacy-cookie".getBytes(StandardCharsets.UTF_8));
        Cookie legacyCookie = new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, legacyValue);
        assertNull(sessionService.validateSession(requestWith(legacyCookie)));
    }

    @Test
    void saveSessionOverHttpUsesLaxHttpOnlyCookieWithoutSecure() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.login(ADMIN, OLD_PASSWORD, request(false), response, false);

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

        sessionService.login(ADMIN, OLD_PASSWORD, request(true), response, false);

        String setCookie = setCookie(response);
        assertTrue(setCookie.contains("Secure"));
        assertTrue(setCookie.contains("HttpOnly"));
        assertTrue(setCookie.contains("SameSite=Lax"));
    }

    @Test
    void saveSessionAddsSecureWhenExplicitlyConfigured() {
        ReflectionTestUtils.setField(sessionService, "cookieSecure", true);
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.login(ADMIN, OLD_PASSWORD, request(false), response, false);

        assertTrue(setCookie(response).contains("Secure"));
    }

    @Test
    void persistentSessionKeepsConfiguredMaxAge() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        sessionService.login(ADMIN, OLD_PASSWORD, request(false), response, true);

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
        assertNull(sessionService.validateSession(basicRequest(ADMIN, OLD_PASSWORD)));
    }

    @Test
    void basicAuthWorksWhenExplicitlyEnabled() {
        ReflectionTestUtils.setField(sessionService, "basicAuthEnabled", true);

        User user = sessionService.validateSession(basicRequest(ADMIN, OLD_PASSWORD));

        assertNotNull(user);
        assertEquals(ADMIN, user.getName());
        assertNull(sessionService.validateSession(basicRequest(ADMIN, "incorrect-password")));
    }

    @Test
    void cookieSessionWorksWhenBasicAuthIsDisabled() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);

        User user = sessionService.validateSession(requestWith(sessionCookie));

        assertNotNull(user);
        assertEquals(ADMIN, user.getName());
    }

    private SessionServiceImpl newService(SessionStore store) throws ApiException {
        return newService(store, kubernetesClientService());
    }

    private SessionServiceImpl newService(SessionStore store, KubernetesClientService client) {
        SessionServiceImpl service = new SessionServiceImpl();
        service.setClock(clock);
        service.setSessionStore(store);
        service.setConfigService(mock(ConfigService.class));
        service.setKubernetesClientService(client);
        service.setLoginFailureBudgetService(
            LoginFailureBudgetServiceTest.createService(new InMemoryLoginAttemptStore(), clock));
        return service;
    }

    private static KubernetesClientService kubernetesClientService() throws ApiException {
        KubernetesClientService service = mock(KubernetesClientService.class);
        when(service.readSecret(SystemConfigKey.SECRET_NAME_DEFAULT)).thenReturn(adminSecret());
        return service;
    }

    private static V1Secret adminSecret() {
        Map<String, byte[]> data = new HashMap<>();
        data.put("adminUsername", ADMIN.getBytes(StandardCharsets.UTF_8));
        data.put("adminDisplayName", "Administrator".getBytes(StandardCharsets.UTF_8));
        data.put("adminPassword", OLD_PASSWORD.getBytes(StandardCharsets.UTF_8));
        data.put("key", "01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8));
        data.put("iv", "0123456789012345".getBytes(StandardCharsets.UTF_8));
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta().name(SystemConfigKey.SECRET_NAME_DEFAULT));
        secret.setData(data);
        return secret;
    }

    private static Cookie createSession(SessionServiceImpl service, String username, boolean persistent) {
        MockHttpServletResponse response = new MockHttpServletResponse();
        assertNotNull(service.login(username, OLD_PASSWORD, request(false), response, persistent));
        Cookie cookie = new Cookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT, cookieValue(response));
        String setCookie = setCookie(response);
        String maxAgeAttribute = "Max-Age=";
        int maxAgeStart = setCookie.indexOf(maxAgeAttribute);
        if (maxAgeStart >= 0) {
            int valueStart = maxAgeStart + maxAgeAttribute.length();
            int valueEnd = setCookie.indexOf(';', valueStart);
            String maxAge = setCookie.substring(valueStart, valueEnd >= 0 ? valueEnd : setCookie.length());
            cookie.setMaxAge(Integer.parseInt(maxAge));
        }
        return cookie;
    }

    private static MockHttpServletRequest requestWith(Cookie sessionCookie) {
        MockHttpServletRequest request = request(false);
        request.setCookies(new Cookie(sessionCookie.getName(), sessionCookie.getValue()));
        return request;
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

        assertNotNull(formLogin(ADMIN, PASSWORD, request()));
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

        assertNotNull(formLogin(ADMIN, PASSWORD, request()));

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
        assertNull(formLogin("", PASSWORD, request()));
        assertNull(formLogin(ADMIN, "", request()));
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
            assertNull(formLogin(ADMIN, "incorrect", request));
        }
        MockHttpServletRequest request = request();
        request.addHeader("X-Forwarded-For", "203.0.113.100");
        assertNull(formLogin(ADMIN, "incorrect", request));

        MockHttpServletRequest spoofedRequest = request();
        spoofedRequest.addHeader("X-Forwarded-For", "203.0.113.101");
        assertThrows(LoginRateLimitException.class,
            () -> formLogin(ADMIN, PASSWORD, spoofedRequest));
    }

    @Test
    void sequentialCorrectLoginsNeverConsumeFailureBudget() {
        for (int i = 0; i < 4; i++) {
            failedLogin();
        }
        for (int i = 0; i < 20; i++) {
            assertNotNull(formLogin(ADMIN, PASSWORD, request()));
        }

        for (int i = 0; i < 4; i++) {
            failedLogin();
        }
        assertNotNull(formLogin(ADMIN, PASSWORD, request()));
        for (int i = 0; i < 5; i++) {
            failedLogin();
        }
        assertThrows(LoginRateLimitException.class, () -> formLogin(ADMIN, PASSWORD, request()));
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
                    return formLogin(ADMIN, PASSWORD, request());
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
        assertThrows(LoginRateLimitException.class, () -> formLogin(ADMIN, PASSWORD, request()));
    }

    @Test
    void blankAndNullRemoteAddressesShareAFailureBudget() {
        MockHttpServletRequest blankRequest = request();
        blankRequest.setRemoteAddr("  ");
        MockHttpServletRequest nullRequest = request();
        nullRequest.setRemoteAddr(null);

        for (int i = 0; i < 2; i++) {
            assertNull(formLogin(ADMIN, "incorrect", blankRequest));
        }
        for (int i = 0; i < 3; i++) {
            assertNull(formLogin(ADMIN, "incorrect", nullRequest));
        }

        assertThrows(LoginRateLimitException.class, () -> formLogin(ADMIN, PASSWORD, blankRequest));
        assertThrows(LoginRateLimitException.class, () -> formLogin(ADMIN, PASSWORD, nullRequest));
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
                        formLogin(concurrentService, ADMIN, "incorrect", request());
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
        assertThrows(LoginRateLimitException.class,
            () -> formLogin(concurrentService, ADMIN, PASSWORD, request()));
    }

    private void failedLogin() {
        assertNull(formLogin(ADMIN, "incorrect", request()));
    }

    private User formLogin(String username, String password, MockHttpServletRequest request) {
        return formLogin(sessionService, username, password, request);
    }

    private static User formLogin(SessionServiceImpl service, String username, String password,
        MockHttpServletRequest request) {
        return service.login(username, password, request, new MockHttpServletResponse(), false);
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

    /** Test-only store shared explicitly between service instances. */
    private static class InMemorySessionStore implements SessionStore {

        private final Map<String, SessionData> sessions = new ConcurrentHashMap<>();
        private final Map<String, String> credentialFingerprints = new ConcurrentHashMap<>();

        @Override
        public void create(String sessionId, SessionData session) {
            sessions.put(sessionId, copy(session));
        }

        @Override
        public SessionData find(String sessionId) {
            return copy(sessions.get(sessionId));
        }

        @Override
        public void update(String sessionId, SessionData session) {
            sessions.put(sessionId, copy(session));
        }

        @Override
        public void delete(String sessionId) {
            sessions.remove(sessionId);
        }

        @Override
        public void deleteByUsername(String username) {
            sessions.entrySet().removeIf(entry -> username.equals(entry.getValue().getUsername()));
        }

        @Override
        public String getOrCreateCredentialFingerprint(String username, String bootstrapFingerprint) {
            return credentialFingerprints.computeIfAbsent(username, key -> bootstrapFingerprint);
        }

        @Override
        public void updateCredentialFingerprint(String username, String credentialFingerprint) {
            credentialFingerprints.put(username, credentialFingerprint);
        }

        private static SessionData copy(SessionData session) {
            if (session == null) {
                return null;
            }
            return SessionData.builder().username(session.getUsername()).createdAt(session.getCreatedAt())
                .lastAccessAt(session.getLastAccessAt()).credentialFingerprint(session.getCredentialFingerprint())
                .build();
        }
    }
}
