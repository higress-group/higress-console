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
package com.alibaba.higress.sdk.model.ai;

public enum LlmProviderProtocol {

    /**
     * OpenAI v1
     */
    OPENAI_V1("openai/v1", "openai"),
    /**
     * Original
     */
    ORIGINAL("original", "original"),;

    public static final LlmProviderProtocol DEFAULT = OPENAI_V1;

    private final String value;
    private final String pluginValue;

    LlmProviderProtocol(String value, String pluginValue) {
        this.value = value;
        this.pluginValue = pluginValue;
    }

    public String getValue() {
        return value;
    }

    public String getPluginValue() {
        return pluginValue;
    }

    public static LlmProviderProtocol fromValue(String value) {
        for (LlmProviderProtocol protocol : LlmProviderProtocol.values()) {
            if (protocol.getValue().equals(value)) {
                return protocol;
            }
        }
        return null;
    }

    public static LlmProviderProtocol fromPluginValue(String pluginValue) {
        for (LlmProviderProtocol protocol : LlmProviderProtocol.values()) {
            if (protocol.getPluginValue().equals(pluginValue)) {
                return protocol;
            }
        }
        return null;
    }
}
