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
package com.alibaba.higress.sdk.model.route;

import com.alibaba.higress.sdk.exception.ValidationException;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutePredicate {

    /**
     * @see RoutePredicateTypeEnum
     */
    private String matchType;

    private String matchValue;

    private Boolean caseSensitive;

    public void validate() {
        if (this.getMatchType() == null) {
            throw new ValidationException("matchType is required");
        }
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.fromName(this.getMatchType());
        if (predicateType == null) {
            throw new ValidationException("Unknown matchType: " + this.getMatchType());
        }
        if (this.getMatchValue() == null) {
            throw new ValidationException("matchValue is required");
        }
    }
}
