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
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.Cookie;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;

class SessionServiceImplTest {

    private static final String ADMIN = "admin";
    private static final String OLD_PASSWORD = "old-password";

    private MutableClock clock;
    private InMemorySessionStore sessionStore;
    private SessionServiceImpl sessionService;

    @BeforeEach
    void setUp() throws ApiException {
        clock = new MutableClock(1_700_000_000_000L, ZoneOffset.UTC);
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
    void sessionCreatedWithOldCredentialVersionIsRejectedAfterBump() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);
        SessionData staleSession = sessionStore.find(sessionCookie.getValue());

        sessionStore.bumpCredentialVersion(ADMIN);
        sessionStore.create(sessionCookie.getValue(), staleSession);

        assertNull(sessionService.validateSession(requestWith(sessionCookie)));
        assertNull(sessionStore.find(sessionCookie.getValue()));
    }

    @Test
    void failedSessionRevocationAfterPasswordCommitStillInvalidatesOldCredentialVersion() throws ApiException {
        InMemorySessionStore store = spy(new InMemorySessionStore());
        V1Secret adminSecret = adminSecret();
        KubernetesClientService client = mock(KubernetesClientService.class);
        when(client.readSecret(SystemConfigKey.SECRET_NAME_DEFAULT)).thenReturn(adminSecret);
        SessionServiceImpl service = newService(store, client);
        Cookie sessionCookie = createSession(service, ADMIN, false);
        doThrow(new IllegalStateException("Revocation failed.")).when(store).deleteByUsername(ADMIN);

        assertThrows(IllegalStateException.class, () -> service.changePassword(ADMIN, OLD_PASSWORD, "new-password"));

        assertNull(service.validateSession(requestWith(sessionCookie)));
        assertNull(service.login(ADMIN, OLD_PASSWORD));
        assertNotNull(service.login(ADMIN, "new-password"));
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
        User user = User.builder().name(username).displayName("Administrator").build();
        service.saveSession(request(false), response, user, persistent);
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
        return request;
    }

    private static MockHttpServletRequest basicRequest(String username, String password) {
        MockHttpServletRequest request = request(false);
        String credentials = Base64.getEncoder()
            .encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
        request.addHeader(HttpHeaders.AUTHORIZATION, "Basic " + credentials);
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

    private static final class MutableClock extends Clock {

        private long millis;
        private final ZoneId zone;

        private MutableClock(long millis, ZoneId zone) {
            this.millis = millis;
            this.zone = zone;
        }

        private void advance(Duration duration) {
            millis += duration.toMillis();
        }

        @Override
        public ZoneId getZone() {
            return zone;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return new MutableClock(millis, zone);
        }

        @Override
        public Instant instant() {
            return Instant.ofEpochMilli(millis);
        }
    }

    /** Test-only store shared explicitly between service instances. */
    private static class InMemorySessionStore implements SessionStore {

        private final Map<String, SessionData> sessions = new ConcurrentHashMap<>();
        private final Map<String, String> credentialVersions = new ConcurrentHashMap<>();

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
        public String getCredentialVersion(String username) {
            return credentialVersions.computeIfAbsent(username, key -> UUID.randomUUID().toString());
        }

        @Override
        public void bumpCredentialVersion(String username) {
            credentialVersions.put(username, UUID.randomUUID().toString());
        }

        private static SessionData copy(SessionData session) {
            if (session == null) {
                return null;
            }
            return SessionData.builder().username(session.getUsername()).createdAt(session.getCreatedAt())
                .lastAccessAt(session.getLastAccessAt()).credentialVersion(session.getCredentialVersion()).build();
        }
    }
}
