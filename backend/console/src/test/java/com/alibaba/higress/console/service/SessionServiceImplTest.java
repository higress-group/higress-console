/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
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
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.Cookie;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
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
    void logoutRevokesPresentedSessionAndReplayReturnsUnauthorized() {
        Cookie sessionCookie = createSession(sessionService, ADMIN, false);
        MockHttpServletResponse logoutResponse = new MockHttpServletResponse();
        sessionService.clearSession(requestWith(sessionCookie), logoutResponse);
        assertEquals(0, logoutResponse.getCookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT).getMaxAge());
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

    private SessionServiceImpl newService(SessionStore store) throws ApiException {
        SessionServiceImpl service = new SessionServiceImpl();
        service.setClock(clock);
        service.setSessionStore(store);
        service.setConfigService(mock(ConfigService.class));
        service.setKubernetesClientService(kubernetesClientService());
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
        service.saveSession(response, User.builder().name(username).displayName("Administrator").build(), persistent);
        return response.getCookie(SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT);
    }

    private static MockHttpServletRequest requestWith(Cookie sessionCookie) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie(sessionCookie.getName(), sessionCookie.getValue()));
        return request;
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
    private static final class InMemorySessionStore implements SessionStore {

        private final Map<String, SessionData> sessions = new ConcurrentHashMap<>();

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

        private static SessionData copy(SessionData session) {
            if (session == null) {
                return null;
            }
            return SessionData.builder().username(session.getUsername()).createdAt(session.getCreatedAt())
                .lastAccessAt(session.getLastAccessAt()).build();
        }
    }
}
