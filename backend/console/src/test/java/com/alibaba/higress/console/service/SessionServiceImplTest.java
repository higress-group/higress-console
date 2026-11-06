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
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.models.V1Secret;

class SessionServiceImplTest {

    private static final String ADMIN = "admin";
    private static final String PASSWORD = "correct-password";

    private SessionServiceImpl sessionService;

    @BeforeEach
    void setUp() throws Exception {
        KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
        when(kubernetesClientService.readSecret(anyString())).thenReturn(adminSecret());
        sessionService = new SessionServiceImpl();
        sessionService.setKubernetesClientService(kubernetesClientService);
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
