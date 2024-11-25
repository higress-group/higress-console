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

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;

public class AiModelPredicate extends RoutePredicate {

    public void validate() {
        super.validate();
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.fromName(this.getMatchType());
        if (predicateType == null) {
            throw new ValidationException("Unknown matchType: " + this.getMatchType());
        }
        if (predicateType == RoutePredicateTypeEnum.REGULAR) {
            throw new ValidationException("AiModelPredicate does not support regular expression matchType");
        }
    }
}
