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

import static com.alibaba.higress.sdk.constant.HigressConstants.VALID_FALLBACK_RESPONSE_CODES;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI Route fallback configuration")
public class AiRouteFallbackConfig {

    @Schema(description = "Whether fallback is enabled")
    private Boolean enabled;
    @Schema(description = "Fallback upstreams. Only one upstream is allowed when fallbackStrategy is SEQ.")
    private List<AiUpstream> upstreams;
    @Schema(description = "Fallback strategy", ref = "AiRouteFallbackStrategy")
    private String fallbackStrategy;
    @Schema(description = "response codes that need fallback")
    private List<String> responseCodes;

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
        if (CollectionUtils.isEmpty(responseCodes)) {
            throw new ValidationException("response codes cannot be empty when fallback is enabled.");
        } else {
            // HttpResponseStatusCodeClassMatchInput is used to match the status code category, such as 4xx and 5xx.
            // to match exact status codes, change HttpResponseStatusCodeClassMatchInput in the template to
            // HttpResponseStatusCodeMatchInput.
            responseCodes = responseCodes.stream().distinct().collect(Collectors.toList());
            for (String code : responseCodes) {
                if (!VALID_FALLBACK_RESPONSE_CODES.contains(code)) {
                    throw new ValidationException("invalid response code:" + code);
                }
            }
        }
        upstreams.forEach(AiUpstream::validate);
    }
}
