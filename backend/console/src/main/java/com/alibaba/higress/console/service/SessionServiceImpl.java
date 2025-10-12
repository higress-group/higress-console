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
 * 会话管理服务实现类，负责管理员用户的认证、会话管理和密码修改等功能
 *
 * @author CH3CHO
 */
@Slf4j
@Service
public class SessionServiceImpl implements SessionService {

    // 配置键常量定义
    private static final String USERNAME_KEY = "adminUsername";           // 用户名键
    private static final String DISPLAY_NAME_KEY = "adminDisplayName";   // 显示名称键
    private static final String PASSWORD_KEY = "adminPassword";          // 密码键
    private static final String ENCRYPT_KEY_KEY = "key";                 // 加密密钥键
    private static final int ENCRYPT_KEY_LENGTH = 32;                    // 加密密钥长度
    private static final String ENCRYPT_IV_KEY = "iv";                   // 初始化向量键
    private static final int ENCRYPT_IV_LENGTH = 16;                     // 初始化向量长度
    private static final String TOKEN_PART_SEPARATOR = "\1";             // Token分隔符

    // 从配置文件读取Cookie相关配置
    @Value("${" + SystemConfigKey.ADMIN_COOKIE_NAME_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT + "}")
    private String cookieName = SystemConfigKey.ADMIN_COOKIE_NAME_DEFAULT;  // Cookie名称

    @Value("${" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_KEY + ":" + SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT + "}")
    private int cookieMaxAge = SystemConfigKey.ADMIN_COOKIE_MAX_AGE_DEFAULT; // Cookie最大存活时间

    @Value("${" + SystemConfigKey.SECRET_NAME_KEY + ":" + SystemConfigKey.SECRET_NAME_DEFAULT + "}")
    private String secretName = SystemConfigKey.SECRET_NAME_DEFAULT;       // Kubernetes Secret名称

    @Value("${" + SystemConfigKey.ADMIN_CONFIG_TTL_KEY + ":" + SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT + "}")
    private long configTtl = SystemConfigKey.ADMIN_CONFIG_TTL_DEFAULT;     // 配置缓存过期时间

    // 依赖注入的服务
    private ConfigService configService;
    private KubernetesClientService kubernetesClientService;

    // 管理员配置缓存，使用原子引用保证线程安全
    private final AtomicReference<AdminConfig> adminConfigCache = new AtomicReference<>();

    // 注入ConfigService
    @Resource
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    // 注入KubernetesClientService
    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    /**
     * 检查管理员是否已经初始化
     *
     * @return true表示已初始化，false表示未初始化
     */
    @Override
    public boolean isAdminInitialized() {
        return tryGetAdminConfig() != null;
    }

    /**
     * 初始化管理员账户
     *
     * @param user 管理员用户信息
     */
    @Override
    public void initializeAdmin(User user) {
        boolean initialized = isAdminInitialized();
        if (initialized) {
            throw new IllegalStateException("Admin user is already initialized.");
        }

        // 从Kubernetes读取Secret
        V1Secret secret;
        try {
            secret = kubernetesClientService.readSecret(secretName);
        } catch (ApiException e) {
            throw new BusinessException("Unable to load secret from K8s.", e);
        }

        // 准备管理员数据
        Map<String, byte[]> data = new HashMap<>();
        data.put(USERNAME_KEY, user.getName().getBytes());
        data.put(PASSWORD_KEY, user.getPassword().getBytes());
        data.put(DISPLAY_NAME_KEY, user.getDisplayName().getBytes());
        data.put(ENCRYPT_KEY_KEY, RandomStringUtils.randomGraph(ENCRYPT_KEY_LENGTH).getBytes());
        data.put(ENCRYPT_IV_KEY, RandomStringUtils.randomGraph(ENCRYPT_IV_LENGTH).getBytes());

        if (secret == null) {
            // 创建新的Secret
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
            // 更新现有Secret
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

        // 清除缓存
        adminConfigCache.set(null);
    }

    /**
     * 用户登录验证
     *
     * @param username 用户名
     * @param password 密码
     * @return 验证成功的用户对象，失败返回null
     */
    @Override
    public User login(String username, String password) {
        AdminConfig config = getAdminConfig();
        if (!config.getUsername().equals(username) || !config.getPassword().equals(password)) {
            return null;
        }
        return config.toUser();
    }

    /**
     * 保存用户会话信息到Cookie
     *
     * @param response HTTP响应对象
     * @param user 用户对象
     * @param persistent 是否持久化Cookie
     */
    @Override
    public void saveSession(HttpServletResponse response, User user, boolean persistent) {
        Cookie cookie = buildEmptyCookie();
        cookie.setValue(generateToken(user));
        if (persistent) {
            cookie.setMaxAge(cookieMaxAge);
        }
        response.addCookie(cookie);
    }

    /**
     * 清除用户会话
     *
     * @param response HTTP响应对象
     */
    @Override
    public void clearSession(HttpServletResponse response) {
        Cookie cookie = buildEmptyCookie();
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    /**
     * 验证用户会话
     *
     * @param request HTTP请求对象
     * @return 验证成功的用户对象，失败返回null
     */
    @Override
    public User validateSession(HttpServletRequest request) {
        User user = tryExtractUserFromCookie(request);
        if (user != null) {
            return user;
        }
        return tryExtractUserFromAuthHeader(request);
    }

    /**
     * 从Cookie中尝试提取用户信息
     *
     * @param request HTTP请求对象
     * @return 提取到的用户对象，失败返回null
     */
    private User tryExtractUserFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null || cookies.length == 0) {
            return null;
        }
        // 查找指定名称的Cookie
        String token = Arrays.stream(cookies).filter(c -> cookieName.equals(c.getName())).map(Cookie::getValue)
            .findFirst().orElse(null);
        if (Strings.isNullOrEmpty(token)) {
            return null;
        }

        AdminConfig config = tryGetAdminConfig();
        if (config == null) {
            return null;
        }

        // 解密Token
        String rawToken;
        try {
            rawToken = AesUtil.decrypt(config.getEncryptKey(), config.getEncryptIv(), token);
        } catch (GeneralSecurityException e) {
            log.warn("Error occurs when decrypting token: " + token, e);
            return null;
        }

        // 解析Token内容
        String[] segments = rawToken.split(TOKEN_PART_SEPARATOR);
        if (segments.length < 3) {
            return null;
        }
        return validateCredential(segments[0], segments[1]);
    }

    /**
     * 从Authorization头中尝试提取用户信息
     *
     * @param request HTTP请求对象
     * @return 提取到的用户对象，失败返回null
     */
    private User tryExtractUserFromAuthHeader(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isBlank(header)) {
            return null;
        }
        String[] parts = header.split(" ");
        if (parts.length != 2 || !"Basic".equals(parts[0])) {
            return null;
        }
        // 解码Basic认证信息
        String decoded = new String(Base64.getDecoder().decode(parts[1]));
        String[] credentials = decoded.split(":");
        if (credentials.length != 2) {
            return null;
        }
        return validateCredential(credentials[0], credentials[1]);
    }

    /**
     * 验证用户凭证
     *
     * @param username 用户名
     * @param password 密码
     * @return 验证成功的用户对象，失败返回null
     */
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

    /**
     * 修改管理员密码
     *
     * @param username 用户名
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     */
    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        // 检查密码修改是否被禁用
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

        // 从Kubernetes读取Secret并更新密码
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

        // 清除缓存
        adminConfigCache.set(null);
    }

    /**
     * 构建空的Cookie对象
     *
     * @return Cookie对象
     */
    private Cookie buildEmptyCookie() {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setPath("/");        // 设置Cookie路径
        cookie.setHttpOnly(true);   // 设置HttpOnly标志，防止XSS攻击
        return cookie;
    }

    /**
     * 生成用户Token
     *
     * @param user 用户对象
     * @return 生成的Token字符串
     */
    private String generateToken(User user) {
        AdminConfig config = getAdminConfig();
        if (!config.getUsername().equals(user.getName())) {
            return null;
        }
        // 构造原始Token：用户名+密码+时间戳
        String rawToken = String.join(TOKEN_PART_SEPARATOR, config.getUsername(), config.getPassword(),
            String.valueOf(System.currentTimeMillis()));
        try {
            // AES加密Token
            return AesUtil.encrypt(config.getEncryptKey(), config.getEncryptIv(), rawToken);
        } catch (GeneralSecurityException e) {
            throw new BusinessException("Error occurs when generating token for user " + user.getName(), e);
        }
    }

    /**
     * 获取管理员配置（必须存在）
     *
     * @return AdminConfig对象
     */
    private AdminConfig getAdminConfig() {
        AdminConfig config = tryGetAdminConfig();
        if (config == null) {
            throw new IllegalStateException("No valid admin config is available.");
        }
        return config;
    }

    /**
     * 尝试获取管理员配置（可为空）
     *
     * @return AdminConfig对象或null
     */
    private AdminConfig tryGetAdminConfig() {
        AdminConfig localAdminConfig = adminConfigCache.get();
        // 检查缓存是否过期
        if (localAdminConfig == null || !localAdminConfig.isExpired(configTtl)) {
            localAdminConfig = loadAdminConfig();
            if (localAdminConfig != null && localAdminConfig.isValid()) {
                localAdminConfig.setLastUpdateTimestamp(System.currentTimeMillis());
                adminConfigCache.set(localAdminConfig);
            }
        }
        return localAdminConfig;
    }

    /**
     * 从Kubernetes加载管理员配置
     *
     * @return AdminConfig对象或null
     */
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
        // 构建AdminConfig对象
        AdminConfig adminConfig = AdminConfig.builder().username(getString(data, USERNAME_KEY))
            .displayName(getString(data, DISPLAY_NAME_KEY)).password(getString(data, PASSWORD_KEY))
            .encryptKey(getString(data, ENCRYPT_KEY_KEY)).encryptIv(getString(data, ENCRYPT_IV_KEY)).build();
        return adminConfig.isValid() ? adminConfig : null;
    }

    /**
     * 从Map中获取字符串值
     *
     * @param map 数据Map
     * @param key 键
     * @return 字符串值或null
     */
    private static String getString(Map<String, byte[]> map, String key) {
        byte[] value = map.get(key);
        return value != null ? new String(value) : null;
    }

    /**
     * 管理员配置内部类，使用Builder模式构建
     */
    @Data
    @Builder
    private static class AdminConfig {

        private String username;              // 用户名
        private String displayName;          // 显示名称
        private String password;             // 密码
        private String encryptKey;           // 加密密钥
        private String encryptIv;            // 加密初始化向量
        private long lastUpdateTimestamp;    // 最后更新时间戳

        /**
         * 检查配置是否有效
         *
         * @return true表示有效，false表示无效
         */
        public boolean isValid() {
            return StringUtils.isNoneBlank(username, password, encryptKey, encryptIv);
        }

        /**
         * 检查配置是否过期
         *
         * @param ttl 过期时间（毫秒）
         * @return true表示过期，false表示未过期
         */
        public boolean isExpired(long ttl) {
            return System.currentTimeMillis() - lastUpdateTimestamp >= ttl;
        }

        /**
         * 转换为User对象
         *
         * @return User对象
         */
        public User toUser() {
            return User.builder().name(username).displayName(displayName).build();
        }
    }
}
