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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.google.common.collect.ImmutableList;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.extern.slf4j.Slf4j;

/**
 * 配置服务实现类，基于Kubernetes ConfigMap实现配置的存储和读取
 *
 * @author Alibaba Group Holding Ltd.
 */
@Slf4j
@Service
public class ConfigServiceImpl implements ConfigService {

    /**
     * 从配置文件中读取ConfigMap名称，如果未配置则使用默认值
     */
    @Value("${" + SystemConfigKey.CONFIG_MAP_NAME_KEY + ":" + SystemConfigKey.CONFIG_MAP_NAME_KEY_DEFAULT + "}")
    private String configMapName = SystemConfigKey.CONFIG_MAP_NAME_KEY_DEFAULT;

    /**
     * Kubernetes客户端服务，用于与Kubernetes API交互
     */
    private KubernetesClientService kubernetesClientService;

    /**
     * 注入Kubernetes客户端服务
     *
     * @param kubernetesClientService Kubernetes客户端服务实例
     */
    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    /**
     * 获取指定键的字符串配置值
     *
     * @param key 配置键名
     * @return 配置值，如果键不存在或值为空则返回null，否则返回去除首尾空白字符的值
     */
    @Override
    public String getString(String key) {
        // 检查键是否为空或空白
        if (StringUtils.isEmpty(key)) {
            return null;
        }
        // 获取ConfigMap配置
        V1ConfigMap configMap = getConfigMap();
        // 检查ConfigMap是否存在且包含数据
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return null;
        }
        // 从ConfigMap数据中获取指定键的值
        String value = configMap.getData().get(key);
        // 如果值存在则去除首尾空白字符，否则返回null
        return value != null ? value.trim() : null;
    }

    /**
     * 获取指定键的字符串配置值，支持默认值
     *
     * @param key 配置键名
     * @param defaultValue 默认值
     * @return 配置值，如果键不存在或值为空则返回默认值
     */
    @Override
    public String getString(String key, String defaultValue) {
        String value = getString(key);
        return StringUtils.isNotEmpty(value) ? value : defaultValue;
    }

    /**
     * 获取指定键的布尔配置值
     *
     * @param key 配置键名
     * @return 布尔配置值，如果键不存在或值为空则返回null
     */
    @Override
    public Boolean getBoolean(String key) {
        String value = getString(key);
        return StringUtils.isNotEmpty(value) ? Boolean.parseBoolean(value) : null;
    }

    /**
     * 获取指定键的布尔配置值，支持默认值
     *
     * @param key 配置键名
     * @param defaultValue 默认值
     * @return 布尔配置值，如果键不存在或值为空则返回默认值
     */
    @Override
    public boolean getBoolean(String key, boolean defaultValue) {
        Boolean value = getBoolean(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取指定键的整数配置值
     *
     * @param key 配置键名
     * @return 整数配置值，如果键不存在、值为空或解析失败则返回null
     */
    @Override
    public Integer getInteger(String key) {
        String value = getString(key);
        if (StringUtils.isEmpty(value)) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * 获取指定键的整数配置值，支持默认值
     *
     * @param key 配置键名
     * @param defaultValue 默认值
     * @return 整数配置值，如果键不存在、值为空或解析失败则返回默认值
     */
    @Override
    public int getInteger(String key, int defaultValue) {
        Integer value = getInteger(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 获取指定键的长整数配置值
     *
     * @param key 配置键名
     * @return 长整数配置值，如果键不存在、值为空或解析失败则返回null
     */
    @Override
    public Long getLong(String key) {
        String value = getString(key);
        if (StringUtils.isEmpty(value)) {
            return null;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    /**
     * 获取指定键的长整数配置值，支持默认值
     *
     * @param key 配置键名
     * @param defaultValue 默认值
     * @return 长整数配置值，如果键不存在、值为空或解析失败则返回默认值
     */
    @Override
    public long getLong(String key, long defaultValue) {
        Long value = getLong(key);
        return value != null ? value : defaultValue;
    }

    /**
     * 设置字符串类型的配置项
     *
     * @param key 配置键名
     * @param value 配置值
     */
    @Override
    public void setConfig(String key, String value) {
        setConfigs(Collections.singletonMap(key, value));
    }

    /**
     * 设置布尔类型的配置项
     *
     * @param key 配置键名
     * @param value 配置值
     */
    @Override
    public void setConfig(String key, boolean value) {
        setConfig(key, String.valueOf(value));
    }

    /**
     * 设置整数类型的配置项
     *
     * @param key 配置键名
     * @param value 配置值
     */
    @Override
    public void setConfig(String key, int value) {
        setConfig(key, String.valueOf(value));
    }

    /**
     * 设置长整数类型的配置项
     *
     * @param key 配置键名
     * @param value 配置值
     */
    @Override
    public void setConfig(String key, long value) {
        setConfig(key, String.valueOf(value));
    }

    /**
     * 设置对象类型的配置项
     *
     * @param key 配置键名
     * @param value 配置值，如果为null则删除该配置项
     */
    @Override
    public void setConfig(String key, Object value) {
        if (value == null) {
            removeConfig(key);
        } else {
            setConfig(key, value.toString());
        }
    }

    /**
     * 批量设置配置项
     *
     * @param configs 配置项映射表
     */
    @Override
    public void setConfigs(Map<String, Object> configs) {
        // 检查配置映射表是否为空
        if (MapUtils.isEmpty(configs)) {
            return;
        }

        // 获取现有的ConfigMap或初始化新的ConfigMap
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null) {
            configMap = initConfigMap();
        }

        // 获取ConfigMap的数据部分
        Map<String, String> data = configMap.getData();
        if (data == null) {
            data = new HashMap<>();
            configMap.setData(data);
        }

        // 更新配置数据
        for (Map.Entry<String, Object> config : configs.entrySet()) {
            if (config.getValue() == null) {
                // 如果值为null，则删除该配置项
                data.remove(config.getKey());
            } else {
                // 否则更新或添加配置项
                data.put(config.getKey(), config.getValue().toString());
            }
        }

        // 更新ConfigMap到Kubernetes
        try {
            kubernetesClientService.replaceConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when updating ConfigMap.", e);
        }
    }

    /**
     * 删除指定键的配置项
     *
     * @param key 要删除的配置键名
     */
    @Override
    public void removeConfig(String key) {
        // 检查键是否为空
        if (StringUtils.isEmpty(key)) {
            return;
        }

        // 获取现有的ConfigMap
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return;
        }

        // 从数据中移除指定键
        configMap.getData().remove(key);

        // 更新ConfigMap到Kubernetes
        try {
            kubernetesClientService.replaceConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when updating ConfigMap.", e);
        }
    }

    /**
     * 获取所有配置键的列表
     *
     * @return 配置键列表，如果无配置则返回空列表
     */
    @Override
    public List<String> getConfigKeys() {
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return Collections.emptyList();
        }
        return ImmutableList.copyOf(configMap.getData().keySet());
    }

    /**
     * 从Kubernetes获取ConfigMap
     *
     * @return ConfigMap对象，如果不存在则返回null
     */
    private V1ConfigMap getConfigMap() {
        try {
            return kubernetesClientService.readConfigMap(configMapName);
        } catch (ApiException e) {
            // 如果ConfigMap不存在，返回null
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            // 其他异常则抛出业务异常
            throw new BusinessException("Error occurs when reading ConfigMap " + configMapName, e);
        }
    }

    /**
     * 初始化新的ConfigMap
     *
     * @return 新创建的ConfigMap对象
     */
    private V1ConfigMap initConfigMap() {
        // 创建ConfigMap对象
        V1ConfigMap configMap = new V1ConfigMap();
        V1ObjectMeta metadata = new V1ObjectMeta();
        configMap.metadata(metadata);
        metadata.setName(configMapName);
        configMap.setData(Collections.emptyMap());

        // 创建ConfigMap到Kubernetes
        try {
            return kubernetesClientService.createConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when creating ConfigMap " + configMapName, e);
        }
    }
}