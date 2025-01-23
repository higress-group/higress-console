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

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("AI Route")
public class AiRoute {

    private String name;
    private String version;
    private List<String> domains;
    private RoutePredicate pathPredicate;
    private List<KeyedRoutePredicate> headerPredicates;
    private List<KeyedRoutePredicate> urlParamPredicates;
    private List<AiUpstream> upstreams;
    private List<AiModelPredicate> modelPredicates;
    private AiRouteAuthConfig authConfig;
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
