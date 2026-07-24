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
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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
    private static final String TOKEN_PART_SEPARATOR = "\1";
    private static final String ADMIN_USERNAME = "admin";
    private static final String SECRET_NAME_USER_PREFIX = "higress-console-user-";

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_NAME_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "}")
    private String cookieName = SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT + "}")
    private int cookieMaxAge = SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT;

    @Value("${" + SystemConfigKey.SECRET_NAME_KEY + ":" + SystemConfigKey.SECRET_NAME_DEFAULT + "}")
    private String defaultSecretName = SystemConfigKey.SECRET_NAME_DEFAULT;

    @Value("${" + SystemConfigKey.ADMIN_CONFIG_TTL_KEY + ":" + SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT + "}")
    private long configTtl = SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT;

    private ConfigService configService;
    private KubernetesClientService kubernetesClientService;

    // 多用户缓存：key=用户名，value=该用户的AdminConfig
    private final Map<String, AdminConfig> adminConfigCache = new ConcurrentHashMap<>();

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
        // 仅检查admin账号是否初始化
        return tryGetAdminConfig(ADMIN_USERNAME) != null;
    }

    @Override
    public void initializeAdmin(User user) {
        String username = user.getName();
        String targetSecretName = getSecretNameByUsername(username);

        // 检查目标用户是否已初始化
        if (tryGetAdminConfig(username) != null) {
            throw new IllegalStateException(String.format("User [%s] is already initialized.", username));
        }

        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(targetSecretName);
        } catch (ApiException e) {
            throw new BusinessException(String.format("Unable to load secret [%s] from K8s.", targetSecretName), e);
        }

        Map<String, byte[]> data = new HashMap<>();
        data.put(USERNAME_KEY, username.getBytes());
        data.put(PASSWORD_KEY, user.getPassword().getBytes());
        data.put(DISPLAY_NAME_KEY, user.getDisplayName().getBytes());
        data.put(ENCRYPT_KEY_KEY, RandomStringUtils.randomGraph(ENCRYPT_KEY_LENGTH).getBytes());
        data.put(ENCRYPT_IV_KEY, RandomStringUtils.randomGraph(ENCRYPT_IV_LENGTH).getBytes());

        if (secret == null) {
            secret = new V1Secret();
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(targetSecretName);
            secret.setMetadata(metadata);
            secret.setData(data);
            try {
                kubernetesClientService.createSecret(secret);
            } catch (ApiException e) {
                throw new BusinessException(String.format("Error occurs when trying to add secret [%s].", targetSecretName), e);
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
                throw new BusinessException(String.format("Error occurs when trying to update secret [%s].", targetSecretName), e);
            }
        }

        // 清除该用户的缓存
        adminConfigCache.remove(username);
    }

    @Override
    public User login(String username, String password) {
        AdminConfig config = getAdminConfig(username);
        if (config != null && config.getUsername().equals(username) && config.getPassword().equals(password)) {
            return config.toUser();
        }
        return null;
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
        User user = tryExtractUserFromCookie(request);
        if (user != null) {
            return user;
        }
        return tryExtractUserFromAuthHeader(request);
    }

    private User tryExtractUserFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return null;
        }
        String token = Arrays.stream(cookies)
                .filter(c -> cookieName.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
        if (Strings.isNullOrEmpty(token)) {
            return null;
        }

        // 解密token获取用户名，再加载对应用户的配置
        String rawToken = null;
        String username = null;
        try {
            // 先遍历缓存找能解密token的用户（兜底方案，建议token中包含用户名）
            for (Map.Entry<String, AdminConfig> entry : adminConfigCache.entrySet()) {
                AdminConfig config = entry.getValue();
                try {
                    rawToken = AesUtil.decrypt(config.getEncryptKey(), config.getEncryptIv(), token);
                    username = entry.getKey();
                    break;
                } catch (GeneralSecurityException e) {
                    continue;
                }
            }
            if (rawToken == null) {
                return null;
            }
        } catch (Exception e) {
            log.warn("Error occurs when decrypting token: " + token, e);
            return null;
        }

        String[] segments = rawToken.split(TOKEN_PART_SEPARATOR);
        if (segments.length < 3) {
            return null;
        }
        return validateCredential(segments[0], segments[1]);
    }

    private User tryExtractUserFromAuthHeader(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isBlank(header)) {
            return null;
        }
        String[] parts = header.split(" ");
        if (parts.length != 2 || !"Basic".equals(parts[0])) {
            return null;
        }
        String decoded = new String(Base64.getDecoder().decode(parts[1]));
        String[] credentials = decoded.split(":");
        if (credentials.length != 2) {
            return null;
        }
        return validateCredential(credentials[0], credentials[1]);
    }

    private User validateCredential(String username, String password) {
        AdminConfig config = tryGetAdminConfig(username);
        if (config == null) {
            return null;
        }
        if (config.getUsername().equals(username) && config.getPassword().equals(password)) {
            return config.toUser();
        }
        return null;
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        boolean disabled = configService.getBoolean(UserConfigKey.ADMIN_PASSWORD_CHANGE_DISABLED, false);
        if (disabled) {
            throw new IllegalStateException("Password change is disabled.");
        }

        AdminConfig adminConfig = getAdminConfig(username);
        if (!adminConfig.getUsername().equals(username)) {
            throw new ValidationException("Unknown username: " + username);
        }
        if (!adminConfig.getPassword().equals(oldPassword)) {
            throw new ValidationException("Incorrect old password.");
        }

        String targetSecretName = getSecretNameByUsername(username);
        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(targetSecretName);
        } catch (ApiException e) {
            throw new BusinessException(String.format("Unable to load secret [%s] from K8s.", targetSecretName), e);
        }

        if (secret == null || MapUtils.isEmpty(secret.getData())) {
            throw new BusinessException(String.format("Secret [%s] is not exist or empty.", targetSecretName));
        }

        Map<String, byte[]> newData = new HashMap<>(secret.getData());
        newData.put(PASSWORD_KEY, newPassword.getBytes());
        secret.setData(newData);

        try {
            kubernetesClientService.replaceSecret(secret);
        } catch (ApiException e) {
            throw new BusinessException(String.format("Error occurs when trying to update secret [%s].", targetSecretName), e);
        }

        // 清除该用户的缓存
        adminConfigCache.remove(username);
    }

    private Cookie buildEmptyCookie() {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }

    private String generateToken(User user) {
        String username = user.getName();
        AdminConfig config = getAdminConfig(username);
        if (config == null || !config.getUsername().equals(username)) {
            return null;
        }
        String rawToken = String.join(TOKEN_PART_SEPARATOR,
                config.getUsername(), config.getPassword(), String.valueOf(System.currentTimeMillis()));
        try {
            return AesUtil.encrypt(config.getEncryptKey(), config.getEncryptIv(), rawToken);
        } catch (GeneralSecurityException e) {
            throw new BusinessException("Error occurs when generating token for user " + username, e);
        }
    }

    private AdminConfig getAdminConfig(String username) {
        AdminConfig config = tryGetAdminConfig(username);
        if (config == null) {
            throw new IllegalStateException(String.format("No valid config for user [%s] is available.", username));
        }
        return config;
    }

    // 兼容无参调用（仅用于admin）
    private AdminConfig getAdminConfig() {
        return getAdminConfig(ADMIN_USERNAME);
    }

    // 核心改造：根据用户名加载对应Secret
    private AdminConfig tryGetAdminConfig(String username) {
        if (StringUtils.isBlank(username)) {
            return null;
        }

        // 1. 先查缓存
        AdminConfig localAdminConfig = adminConfigCache.get(username);
        // 2. 缓存不存在/过期，重新加载
        if (localAdminConfig == null || localAdminConfig.isExpired(configTtl)) {
            localAdminConfig = loadAdminConfig(username);
            if (localAdminConfig != null && localAdminConfig.isValid()) {
                localAdminConfig.setLastUpdateTimestamp(System.currentTimeMillis());
                adminConfigCache.put(username, localAdminConfig);
            } else {
                adminConfigCache.remove(username);
            }
        }
        return localAdminConfig;
    }

    // 兼容原无参方法（仅用于admin）
    private AdminConfig tryGetAdminConfig() {
        return tryGetAdminConfig(ADMIN_USERNAME);
    }

    // 根据用户名加载对应Secret
    private AdminConfig loadAdminConfig(String username) {
        log.info("用户名：" + username);
        String targetSecretName = getSecretNameByUsername(username);
        log.info("目标用户名：" + targetSecretName);
        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(targetSecretName);
        } catch (ApiException e) {
            log.warn(String.format("Load secret [%s] failed: %s", targetSecretName, e.getMessage()));
            return null;
        }
        if (secret == null) {
            return null;
        }
        Map<String, byte[]> data = secret.getData();
        if (MapUtils.isEmpty(data)) {
            return null;
        }
        AdminConfig adminConfig = AdminConfig.builder()
                .username(getString(data, USERNAME_KEY))
                .displayName(getString(data, DISPLAY_NAME_KEY))
                .password(getString(data, PASSWORD_KEY))
                .encryptKey(getString(data, ENCRYPT_KEY_KEY))
                .encryptIv(getString(data, ENCRYPT_IV_KEY))
                .build();
        return adminConfig.isValid() ? adminConfig : null;
    }

    // 核心方法：根据用户名生成Secret名称
    private String getSecretNameByUsername(String username) {
        if (ADMIN_USERNAME.equals(username)) {
            return defaultSecretName; // admin用默认名称
        }
        return SECRET_NAME_USER_PREFIX + username; // 普通用户用前缀+用户名
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