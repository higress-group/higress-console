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

@Slf4j
@Service
public class ConfigServiceImpl implements ConfigService {

    @Value("${" + SystemConfigKey.CONFIG_MAP_NAME_KEY + ":" + SystemConfigKey.CONFIG_MAP_NAME_KEY_DEFAULT + "}")
    private String configMapName = SystemConfigKey.CONFIG_MAP_NAME_KEY_DEFAULT;

    private KubernetesClientService kubernetesClientService;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public String getString(String key) {
        if (StringUtils.isEmpty(key)) {
            return null;
        }
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return null;
        }
        String value = configMap.getData().get(key);
        return value != null ? value.trim() : null;
    }

    @Override
    public String getString(String key, String defaultValue) {
        String value = getString(key);
        return StringUtils.isNotEmpty(value) ? value : defaultValue;
    }

    @Override
    public Boolean getBoolean(String key) {
        String value = getString(key);
        return StringUtils.isNotEmpty(value) ? Boolean.parseBoolean(value) : null;
    }

    @Override
    public boolean getBoolean(String key, boolean defaultValue) {
        Boolean value = getBoolean(key);
        return value != null ? value : defaultValue;
    }

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

    @Override
    public int getInteger(String key, int defaultValue) {
        Integer value = getInteger(key);
        return value != null ? value : defaultValue;
    }

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

    @Override
    public long getLong(String key, long defaultValue) {
        Long value = getLong(key);
        return value != null ? value : defaultValue;
    }

    @Override
    public void setConfig(String key, String value) {
        setConfigs(Collections.singletonMap(key, value));
    }

    @Override
    public void setConfig(String key, boolean value) {
        setConfig(key, String.valueOf(value));
    }

    @Override
    public void setConfig(String key, int value) {
        setConfig(key, String.valueOf(value));
    }

    @Override
    public void setConfig(String key, long value) {
        setConfig(key, String.valueOf(value));
    }

    @Override
    public void setConfig(String key, Object value) {
        if (value == null) {
            removeConfig(key);
        } else {
            setConfig(key, value.toString());
        }
    }

    @Override
    public void setConfigs(Map<String, Object> configs) {
        if (MapUtils.isEmpty(configs)) {
            return;
        }

        V1ConfigMap configMap = getConfigMap();
        if (configMap == null) {
            configMap = initConfigMap();
        }
        Map<String, String> data = configMap.getData();
        if (data == null) {
            data = new HashMap<>();
            configMap.setData(data);
        }
        for (Map.Entry<String, Object> config : configs.entrySet()) {
            if (config.getValue() == null) {
                data.remove(config.getKey());
            } else {
                data.put(config.getKey(), config.getValue().toString());
            }
        }
        try {
            kubernetesClientService.replaceConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when updating ConfigMap.", e);
        }
    }

    @Override
    public void removeConfig(String key) {
        if (StringUtils.isEmpty(key)) {
            return;
        }
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return;
        }
        configMap.getData().remove(key);
        try {
            kubernetesClientService.replaceConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when updating ConfigMap.", e);
        }
    }

    @Override
    public List<String> getConfigKeys() {
        V1ConfigMap configMap = getConfigMap();
        if (configMap == null || MapUtils.isEmpty(configMap.getData())) {
            return Collections.emptyList();
        }
        return ImmutableList.copyOf(configMap.getData().keySet());
    }

    private V1ConfigMap getConfigMap() {
        try {
            return kubernetesClientService.readConfigMap(configMapName);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw new BusinessException("Error occurs when reading ConfigMap " + configMapName, e);
        }
    }

    private V1ConfigMap initConfigMap() {
        V1ConfigMap configMap = new V1ConfigMap();
        V1ObjectMeta metadata = new V1ObjectMeta();
        configMap.metadata(metadata);
        metadata.setName(configMapName);
        configMap.setData(Collections.emptyMap());
        try {
            return kubernetesClientService.createConfigMap(configMap);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when creating ConfigMap " + configMapName, e);
        }
    }
}
