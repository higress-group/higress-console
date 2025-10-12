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
package com.alibaba.higress.console.constant;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

/**
 * 用户配置键常量类
 *
 * 该类定义了系统中使用的各种用户配置项的键名常量，以及这些配置项值的数据类型。
 * 用于在系统中统一管理用户配置项的键名和类型信息。
 */
public class UserConfigKey {

    /**
     * 私有构造函数，防止实例化该工具类
     */
    private UserConfigKey() {}

    /**
     * 默认路由初始化状态配置键
     *
     * 用于标识系统默认路由是否已经初始化完成
     * 配置值类型: Boolean
     */
    public static final String DEFAULT_ROUTE_INITIALIZED = "route.default.initialized";

    /**
     * 系统初始化状态配置键
     *
     * 用于标识整个系统是否已经初始化完成
     * 配置值类型: Boolean
     */
    public static final String SYSTEM_INITIALIZED = "system.initialized";

    /**
     * 登录页面提示信息配置键
     *
     * 用于存储登录页面显示的提示信息内容
     * 配置值类型: String
     */
    public static final String LOGIN_PAGE_PROMPT_KEY = "login.prompt";

    /**
     * 仪表板URL配置键
     *
     * 用于存储仪表板的访问URL地址
     * 配置值类型: String
     */
    public static final String DASHBOARD_URL = "dashboard.url";

    /**
     * 仪表板URL前缀配置键
     *
     * 用于构建仪表板URL的前缀部分
     * 配置值类型: String
     */
    public static final String DASHBOARD_URL_PREFIX = "dashboard.url.";

    /**
     * 内置仪表板配置键
     *
     * 用于标识是否使用内置仪表板功能
     * 配置值类型: Boolean
     */
    public static final String DASHBOARD_BUILTIN = "dashboard.builtin";

    /**
     * 聊天功能启用配置键
     *
     * 用于控制聊天功能是否启用
     * 配置值类型: Boolean
     */
    public static final String CHAT_ENABLED = "chat.enabled";

    /**
     * 管理员密码修改禁用配置键
     *
     * 用于控制是否禁用管理员密码修改功能
     * 配置值类型: Boolean
     */
    public static final String ADMIN_PASSWORD_CHANGE_DISABLED = "admin.password-change.disabled";

    /**
     * 配置值类型映射表
     *
     * 存储各个配置键与其对应值的数据类型之间的映射关系
     * Key: 配置键名
     * Value: 配置值的数据类型Class对象
     */
    private static final Map<String, Class<?>> CONFIG_VALUE_TYPES = new HashMap<>();

    /**
     * 静态初始化块
     *
     * 在类加载时初始化配置键与值类型的映射关系
     */
    static {
        CONFIG_VALUE_TYPES.put(LOGIN_PAGE_PROMPT_KEY, String.class);
        CONFIG_VALUE_TYPES.put(DASHBOARD_URL, String.class);
        CONFIG_VALUE_TYPES.put(CHAT_ENABLED, Boolean.class);
        CONFIG_VALUE_TYPES.put(ADMIN_PASSWORD_CHANGE_DISABLED, Boolean.class);
        CONFIG_VALUE_TYPES.put(DASHBOARD_BUILTIN, Boolean.class);
        CONFIG_VALUE_TYPES.put(DEFAULT_ROUTE_INITIALIZED, Boolean.class);
        CONFIG_VALUE_TYPES.put(SYSTEM_INITIALIZED, Boolean.class);
    }

    /**
     * 获取指定配置键的值类型
     *
     * @param key 配置键名
     * @return 配置值的数据类型Class对象，如果键名为空或未找到则返回null
     */
    public static Class<?> getConfigValueType(String key) {
        if (StringUtils.isEmpty(key)) {
            return null;
        }
        return CONFIG_VALUE_TYPES.get(key);
    }
}
