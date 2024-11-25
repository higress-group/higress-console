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

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("LLM Service Provider")
public class LlmProvider {

    private String name;
    private String type;
    private String protocol;
    private List<String> tokens;
    private TokenFailoverConfig tokenFailoverConfig;
    private Map<String, Object> rawConfigs;

    public void validate(boolean forUpdate) {
        if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("name cannot be blank.");
        }
        if (StringUtils.isBlank(type)) {
            throw new IllegalArgumentException("type cannot be blank.");
        }
        if (StringUtils.isBlank(protocol)) {
            protocol = LlmProviderProtocol.DEFAULT.getValue();
        } else if (null == LlmProviderProtocol.fromValue(protocol)) {
            throw new IllegalArgumentException("Unknown protocol: " + protocol);
        }
    }
}
