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

import java.security.GeneralSecurityException;
import java.util.Arrays;
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
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.util.AesUtil;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.util.Strings;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * @author CH3CHO
 */
@Slf4j
@Service
public class SessionServiceImpl implements SessionService {

    private static final String USERNAME_KEY = "adminUsername";
    private static final String DISPLAY_NAME_KEY = "adminDisplayName";
    private static final String PASSWORD_KEY = "adminPassword";
    private static final String ENCRYPT_KEY_KEY = "key";
    private static final int ENCRYPT_KEY_LENGTH = 32;
    private static final String ENCRYPT_IV_KEY = "iv";
    private static final int ENCRYPT_IV_LENGTH = 16;
    private static final String TOKEN_PART_SEPARATOR= "\1";

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_NAME_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "}")
    private String cookieName = SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT + "}")
    private int cookieMaxAge = SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT;

    @Value("${" + SystemConfigKey.SECRET_NAME_KEY + ":" + SystemConfigKey.SECRET_NAME_DEFAULT + "}")
    private String secretName = SystemConfigKey.SECRET_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_CONFIG_TTL_KEY + ":" + SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT + "}")
    private long configTtl = SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT;

    private ConfigService configService;
    private KubernetesClientService kubernetesClientService;

    private final AtomicReference<AdminConfig> adminConfigCache = new AtomicReference<>();

    @Resource
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
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
    public User login(String username, String password) {
        AdminConfig config = getAdminConfig();
        if (!config.getUsername().equals(username) || !config.getPassword().equals(password)) {
            return null;
        }
        return config.toUser();
    }

    @Override
    public void saveSession(HttpServletResponse response, User user, boolean persistent) {
        Cookie cookie = buildEmptyCookie();
        cookie.setValue(generateToken(user));
        if (persistent) {
            cookie.setMaxAge(cookieMaxAge);
        }
        response.addCookie(cookie);
    }

    @Override
    public void clearSession(HttpServletResponse response) {
        Cookie cookie = buildEmptyCookie();
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    @Override
    public User validateSession(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return null;
        }
        String token = Arrays.stream(cookies).filter(c -> cookieName.equals(c.getName())).map(Cookie::getValue)
            .findFirst().orElse(null);
        if (Strings.isNullOrEmpty(token)) {
            return null;
        }

        AdminConfig config = tryGetAdminConfig();
        if (config == null) {
            return null;
        }

        String rawToken;
        try {
            rawToken = AesUtil.decrypt(config.getEncryptKey(), config.getEncryptIv(), token);
        } catch (GeneralSecurityException e) {
            log.warn("Error occurs when decrypting token: " + token, e);
            return null;
        }

        String[] segments = rawToken.split(TOKEN_PART_SEPARATOR);
        if (segments.length < 3) {
            return null;
        }
        if (!config.getUsername().equals(segments[0]) || !config.getPassword().equals(segments[1])) {
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
    }

    private Cookie buildEmptyCookie() {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }

    private String generateToken(User user) {
        AdminConfig config = getAdminConfig();
        if (!config.getUsername().equals(user.getName())) {
            return null;
        }
        String rawToken = String.join(TOKEN_PART_SEPARATOR, config.getUsername(), config.getPassword(),
            String.valueOf(System.currentTimeMillis()));
        try {
            return AesUtil.encrypt(config.getEncryptKey(), config.getEncryptIv(), rawToken);
        } catch (GeneralSecurityException e) {
            throw new BusinessException("Error occurs when generating token for user " + user.getName(), e);
        }
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
        if (localAdminConfig == null || !localAdminConfig.isExpired(configTtl)) {
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
