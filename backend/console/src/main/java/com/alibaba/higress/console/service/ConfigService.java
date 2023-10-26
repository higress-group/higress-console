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

import java.util.List;
import java.util.Map;

public interface ConfigService {

    String getString(String key);

    String getString(String key, String defaultValue);

    Boolean getBoolean(String key);

    boolean getBoolean(String key, boolean defaultValue);

    Integer getInteger(String key);

    int getInteger(String key, int defaultValue);

    Long getLong(String key);

    long getLong(String key, long defaultValue);

    void setConfig(String key, String value);

    void setConfig(String key, boolean value);

    void setConfig(String key, int value);

    void setConfig(String key, long value);

    void setConfig(String key, Object value);

    void setConfigs(Map<String, Object> configs);

    void removeConfig(String key);

    List<String> getConfigKeys();
}
