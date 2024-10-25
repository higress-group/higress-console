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

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRouteFallbackConfig {

    private Boolean enabled;
    private List<AiUpstream> upstreams;
    private String fallbackStrategy;

    public void validate() {
        if (!Boolean.TRUE.equals(enabled)) {
            return;
        }
        if (StringUtils.isNotEmpty(fallbackStrategy)) {
            switch (fallbackStrategy) {
                case AiRouteFallbackStrategy.RANDOM:
                case AiRouteFallbackStrategy.SEQUENCE:
                    break;
                default:
                    throw new ValidationException("unknown fallback strategy: " + fallbackStrategy);
            }
        }
        if (CollectionUtils.isEmpty(upstreams)) {
            throw new ValidationException("upstreams cannot be empty when fallback is enabled.");
        }
        upstreams.forEach(AiUpstream::validate);
    }
}
