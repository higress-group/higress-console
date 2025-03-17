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
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI Route")
public class AiRoute {

    @Schema(description = "Route name")
    private String name;
    @Schema(description = "Route version. Required when updating.")
    private String version;
    @Schema(description = "Domains that the route applies to. If empty, the route applies to all domains.")
    private List<String> domains;
    @Schema(description = "Path predicate")
    private RoutePredicate pathPredicate;
    @Schema(description = "Header predicates")
    private List<KeyedRoutePredicate> headerPredicates;
    @Schema(description = "URL parameter predicates")
    private List<KeyedRoutePredicate> urlParamPredicates;
    @Schema(description = "Route upstreams")
    private List<AiUpstream> upstreams;
    @Schema(description = "Model predicates")
    private List<AiModelPredicate> modelPredicates;
    @Schema(description = "Route auth configuration")
    private AiRouteAuthConfig authConfig;
    @Schema(description = "Route fallback configuration")
    private AiRouteFallbackConfig fallbackConfig;

    public void validate() {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }
        if (CollectionUtils.isEmpty(upstreams)) {
            throw new ValidationException("upstreams cannot be empty.");
        }
        if (pathPredicate != null) {
            pathPredicate.validate();
            if (pathPredicate.getPredicateType() != RoutePredicateTypeEnum.PRE) {
                throw new ValidationException("pathPredicate must be of type PRE.");
            }
        }
        if (CollectionUtils.isNotEmpty(headerPredicates)) {
            headerPredicates.forEach(KeyedRoutePredicate::validate);
            if (headerPredicates.stream()
                .anyMatch(p -> HigressConstants.MODEL_ROUTING_HEADER.equalsIgnoreCase(p.getKey()))) {
                throw new ValidationException("headerPredicates cannot contain the model routing header.");
            }
        }
        if (CollectionUtils.isNotEmpty(urlParamPredicates)) {
            urlParamPredicates.forEach(KeyedRoutePredicate::validate);
        }
        upstreams.forEach(AiUpstream::validate);
        int weightSum = upstreams.stream().mapToInt(AiUpstream::getWeight).sum();
        if (weightSum != 100) {
            throw new ValidationException("The sum of upstream weights must be 100.");
        }
        if (authConfig != null) {
            authConfig.validate();
        }
        if (fallbackConfig != null) {
            fallbackConfig.validate();
        }
        if (CollectionUtils.isNotEmpty(modelPredicates)) {
            modelPredicates.forEach(AiModelPredicate::validate);
        }
    }
}
