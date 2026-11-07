/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.hash.Hashing;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * @author CH3CHO
 */
@Service
@Slf4j
public class SessionServiceImpl implements SessionService {

    private static final String USERNAME_KEY = "adminUsername";
    private static final String DISPLAY_NAME_KEY = "adminDisplayName";
    private static final String PASSWORD_KEY = "adminPassword";
    private static final String ENCRYPT_KEY_KEY = "key";
    private static final int ENCRYPT_KEY_LENGTH = 32;
    private static final String ENCRYPT_IV_KEY = "iv";
    private static final int ENCRYPT_IV_LENGTH = 16;
    private static final int SESSION_ID_BYTES = 32;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String SESSION_COOKIE_SAME_SITE = "Lax";
    static final long SESSION_TOUCH_INTERVAL_MILLIS = 60_000L;
    private static final String UNKNOWN_CLIENT_IP = "unknown";

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_NAME_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "}")
    private String cookieName = SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT + "}")
    private int cookieMaxAge = SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT;

    private long idleTimeout = SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_DEFAULT;

    private long absoluteTimeout = SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_SECURE_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_SECURE_DEFAULT + "}")
    private boolean cookieSecure = SystemConfigKey.ADMIN_COOKIE_SECURE_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_BASIC_AUTH_ENABLED_KEY + ":"
        + SystemConfigKey.ADMIN_BASIC_AUTH_ENABLED_DEFAULT + "}")
    private boolean basicAuthEnabled = SystemConfigKey.ADMIN_BASIC_AUTH_ENABLED_DEFAULT;

    @Value("${" + SystemConfigKey.SECRET_NAME_KEY + ":" + SystemConfigKey.SECRET_NAME_DEFAULT + "}")
    private String secretName = SystemConfigKey.SECRET_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_CONFIG_TTL_KEY + ":" + SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT + "}")
    private long configTtl = SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT;

    private ConfigService configService;
    private KubernetesClientService kubernetesClientService;
    private SessionStore sessionStore;
    private Clock clock = Clock.systemUTC();
    private LoginFailureBudgetService loginFailureBudgetService;

    private final AtomicReference<AdminConfig> adminConfigCache = new AtomicReference<>();

    @Resource
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setSessionStore(SessionStore sessionStore) {
        this.sessionStore = sessionStore;
    }

    @Resource
    public void setClock(Clock clock) {
        this.clock = clock;
    }

    @Value("${" + SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_KEY + ":"
        + SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_DEFAULT + "}")
    public void setIdleTimeout(long idleTimeout) {
        this.idleTimeout = SessionData.validateTimeout(SystemConfigKey.ADMIN_SESSION_IDLE_TIMEOUT_KEY, idleTimeout);
    }

    @Value("${" + SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_KEY + ":"
        + SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_DEFAULT + "}")
    public void setAbsoluteTimeout(long absoluteTimeout) {
        this.absoluteTimeout =
            SessionData.validateTimeout(SystemConfigKey.ADMIN_SESSION_ABSOLUTE_TIMEOUT_KEY, absoluteTimeout);
    }

    @Resource
    public void setLoginFailureBudgetService(LoginFailureBudgetService loginFailureBudgetService) {
        this.loginFailureBudgetService = loginFailureBudgetService;
    }

    @Override
    public boolean isAdminInitialized() {
        return tryGetAdminConfig() != null;
    }

    @Override
    public void initializeAdmin(User user) {
        boolean initialized = isAdminInitialized();
        if (initialized) {
            throw new IllegalStateException("Admin user is already initialized.");
        }
        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(secretName);
        } catch (ApiException e) {
            throw new BusinessException("Unable to load secret from K8s.", e);
        }
        Map<String, byte[]> data = new HashMap<>();
        data.put(USERNAME_KEY, user.getName().getBytes());
        data.put(PASSWORD_KEY, user.getPassword().getBytes());
        data.put(DISPLAY_NAME_KEY, user.getDisplayName().getBytes());
        data.put(ENCRYPT_KEY_KEY, RandomStringUtils.randomGraph(ENCRYPT_KEY_LENGTH).getBytes());
        data.put(ENCRYPT_IV_KEY, RandomStringUtils.randomGraph(ENCRYPT_IV_LENGTH).getBytes());
        if (secret == null) {
            secret = new V1Secret();
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(secretName);
            secret.setMetadata(metadata);
            secret.setData(data);
            try {
                kubernetesClientService.createSecret(secret);
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when trying to add admin secret.", e);
            }
        } else {
            Map<String, byte[]> newData;
            if (MapUtils.isEmpty(secret.getData())) {
                newData = data;
            } else {
                newData = new HashMap<>(secret.getData());
                newData.putAll(data);
            }
            secret.setData(newData);
            try {
                kubernetesClientService.replaceSecret(secret);
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when trying to update admin secret.", e);
            }
        }

        adminConfigCache.set(null);
    }

    @Override
    public User login(String username, String password, HttpServletRequest request, HttpServletResponse response,
        boolean persistent) {
        if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password)) {
            return null;
        }
        LoginAttemptKey key = createLoginAttemptKey(LoginAuthSource.FORM, username, request);
        loginFailureBudgetService.ensureNotLocked(key);
        AdminConfig config = getAdminConfig();
        User user = null;
        String credentialFingerprint = null;
        if (config.getUsername().equals(username) && config.getPassword().equals(password)) {
            credentialFingerprint = credentialFingerprint(username, password);
            String storedFingerprint =
                sessionStore.getOrCreateCredentialFingerprint(config.getUsername(), credentialFingerprint);
            if (fingerprintsMatch(credentialFingerprint, storedFingerprint)) {
                user = config.toUser();
            }
        }
        user = completeAuthentication(key, user);
        if (user != null) {
            saveSession(request, response, user, persistent, credentialFingerprint);
        }
        return user;
    }

    private void saveSession(HttpServletRequest request, HttpServletResponse response, User user, boolean persistent,
        String credentialFingerprint) {
        String sessionId = generateSessionId();
        long now = clock.millis();
        SessionData session = SessionData.builder().username(user.getName()).createdAt(now).lastAccessAt(now)
            .credentialFingerprint(credentialFingerprint).build();
        sessionStore.create(sessionId, session);
        addSessionCookie(request, response, sessionId, persistent ? Long.valueOf(cookieMaxAge) : null);
    }

    @Override
    public void clearSession(HttpServletRequest request, HttpServletResponse response) {
        String sessionId = getSessionId(request);
        if (StringUtils.isNotBlank(sessionId)) {
            sessionStore.delete(sessionId);
        }
        addSessionCookie(request, response, StringUtils.EMPTY, 0L);
    }

    @Override
    public User validateSession(HttpServletRequest request) {
        User user = tryExtractUserFromCookie(request);
        if (user != null) {
            return user;
        }
        return tryExtractUserFromAuthHeader(request);
    }

    private User tryExtractUserFromCookie(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        if (StringUtils.isBlank(sessionId)) {
            return null;
        }

        SessionData session = sessionStore.find(sessionId);
        if (session == null) {
            return null;
        }
        long now = clock.millis();
        if (session.isExpired(now, idleTimeout, absoluteTimeout)) {
            sessionStore.delete(sessionId);
            return null;
        }

        AdminConfig config = tryGetAdminConfig();
        if (config == null || !config.getUsername().equals(session.getUsername())) {
            sessionStore.delete(sessionId);
            return null;
        }
        String currentFingerprint = credentialFingerprint(config.getUsername(), config.getPassword());
        String storedFingerprint =
            sessionStore.getOrCreateCredentialFingerprint(session.getUsername(), currentFingerprint);
        if (!fingerprintsMatch(session.getCredentialFingerprint(), storedFingerprint)) {
            sessionStore.delete(sessionId);
            return null;
        }
        long touchInterval = idleTimeout > 0
            ? Math.min(SESSION_TOUCH_INTERVAL_MILLIS, idleTimeout / 2)
            : SESSION_TOUCH_INTERVAL_MILLIS;
        if (now - session.getLastAccessAt() >= touchInterval) {
            session.setLastAccessAt(Math.max(now, session.getLastAccessAt()));
            try {
                sessionStore.update(sessionId, session);
            } catch (RuntimeException e) {
                log.warn("Unable to update session last access time; authentication will continue.", e);
            }
        }
        return config.toUser();
    }

    private String getSessionId(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return null;
        }
        return Arrays.stream(cookies).filter(c -> cookieName.equals(c.getName())).map(Cookie::getValue).findFirst()
            .orElse(null);
    }

    private User tryExtractUserFromAuthHeader(HttpServletRequest request) {
        if (!basicAuthEnabled) {
            return null;
        }
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isBlank(header)) {
            return null;
        }
        String[] parts = header.split(" ");
        if (parts.length != 2 || !"Basic".equals(parts[0])) {
            return null;
        }
        String decoded;
        try {
            decoded = new String(Base64.getDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return null;
        }
        int separator = decoded.indexOf(':');
        if (separator <= 0 || separator == decoded.length() - 1) {
            return null;
        }
        String username = decoded.substring(0, separator);
        String password = decoded.substring(separator + 1);
        LoginAttemptKey key = createLoginAttemptKey(LoginAuthSource.BASIC, username, request);
        loginFailureBudgetService.ensureNotLocked(key);
        return completeAuthentication(key, validateCredential(username, password));
    }

    private LoginAttemptKey createLoginAttemptKey(LoginAuthSource source, String username,
        HttpServletRequest request) {
        String clientIp = request != null ? request.getRemoteAddr() : null;
        return new LoginAttemptKey(source, username, StringUtils.defaultIfBlank(clientIp, UNKNOWN_CLIENT_IP));
    }

    private User completeAuthentication(LoginAttemptKey key, User user) {
        if (user != null) {
            loginFailureBudgetService.reset(key);
        } else {
            loginFailureBudgetService.recordFailure(key);
        }
        return user;
    }

    private User validateCredential(String username, String password) {
        AdminConfig config = tryGetAdminConfig();
        if (config == null) {
            return null;
        }
        if (!config.getUsername().equals(username) || !config.getPassword().equals(password)) {
            return null;
        }
        return config.toUser();
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        boolean disabled = configService.getBoolean(UserConfigKey.ADMIN_PASSWORD_CHANGE_DISABLED, false);
        if (disabled) {
            throw new IllegalStateException("Password change is disabled.");
        }

        AdminConfig adminConfig = getAdminConfig();
        if (!adminConfig.getUsername().equals(username)) {
            throw new ValidationException("Unknown username: " + username);
        }
        if (!adminConfig.getPassword().equals(oldPassword)) {
            throw new ValidationException("Incorrect old password.");
        }

        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(secretName);
        } catch (ApiException e) {
            throw new BusinessException("Unable to load secret from K8s.", e);
        }

        assert secret != null;
        assert MapUtils.isNotEmpty(secret.getData());

        Map<String, byte[]> newData = new HashMap<>(secret.getData());
        newData.put(PASSWORD_KEY, newPassword.getBytes());
        secret.setData(newData);

        try {
            kubernetesClientService.replaceSecret(secret);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when trying to update admin secret.", e);
        }

        adminConfigCache.set(null);
        sessionStore.updateCredentialFingerprint(username, credentialFingerprint(username, newPassword));
        sessionStore.deleteByUsername(username);
    }

    static String credentialFingerprint(String username, String password) {
        return Hashing.sha256().hashString("v1\0" + username + "\0" + password, StandardCharsets.UTF_8).toString();
    }

    private static boolean fingerprintsMatch(String first, String second) {
        if (first == null || second == null) {
            return false;
        }
        return MessageDigest.isEqual(first.getBytes(StandardCharsets.UTF_8), second.getBytes(StandardCharsets.UTF_8));
    }

    private void addSessionCookie(HttpServletRequest request, HttpServletResponse response, String value,
        Long maxAge) {
        ResponseCookie.ResponseCookieBuilder builder =
            ResponseCookie.from(cookieName, StringUtils.defaultString(value)).httpOnly(true).path("/")
                .sameSite(SESSION_COOKIE_SAME_SITE).secure(cookieSecure || request.isSecure());
        if (maxAge != null) {
            builder.maxAge(maxAge);
        }
        response.addHeader(HttpHeaders.SET_COOKIE, builder.build().toString());
    }

    private static String generateSessionId() {
        byte[] id = new byte[SESSION_ID_BYTES];
        SECURE_RANDOM.nextBytes(id);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(id);
    }

    private AdminConfig getAdminConfig() {
        AdminConfig config = tryGetAdminConfig();
        if (config == null) {
            throw new IllegalStateException("No valid admin config is available.");
        }
        return config;
    }

    private AdminConfig tryGetAdminConfig() {
        AdminConfig localAdminConfig = adminConfigCache.get();
        if (localAdminConfig == null || localAdminConfig.isExpired(configTtl)) {
            localAdminConfig = loadAdminConfig();
            if (localAdminConfig != null && localAdminConfig.isValid()) {
                localAdminConfig.setLastUpdateTimestamp(System.currentTimeMillis());
                adminConfigCache.set(localAdminConfig);
            }
        }
        return localAdminConfig;
    }

    private AdminConfig loadAdminConfig() {
        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(secretName);
        } catch (ApiException e) {
            return null;
        }
        if (secret == null) {
            return null;
        }
        Map<String, byte[]> data = secret.getData();
        if (MapUtils.isEmpty(data)) {
            return null;
        }
        AdminConfig adminConfig = AdminConfig.builder().username(getString(data, USERNAME_KEY))
            .displayName(getString(data, DISPLAY_NAME_KEY)).password(getString(data, PASSWORD_KEY))
            .encryptKey(getString(data, ENCRYPT_KEY_KEY)).encryptIv(getString(data, ENCRYPT_IV_KEY)).build();
        // AdminConfig adminConfig = AdminConfig.builder().name("admin").displayName("Admin").password("123456")
        // .encryptKey("").encryptIv("").build();
        return adminConfig.isValid() ? adminConfig : null;
    }

    private static String getString(Map<String, byte[]> map, String key) {
        byte[] value = map.get(key);
        return value != null ? new String(value) : null;
    }

    @Data
    @Builder
    private static class AdminConfig {

        private String username;

        private String displayName;

        private String password;

        private String encryptKey;

        private String encryptIv;

        private long lastUpdateTimestamp;

        public boolean isValid() {
            return StringUtils.isNoneBlank(username, password, encryptKey, encryptIv);
        }

        public boolean isExpired(long ttl) {
            return System.currentTimeMillis() - lastUpdateTimestamp >= ttl;
        }

        public User toUser() {
            return User.builder().name(username).displayName(displayName).build();
        }
    }
}
