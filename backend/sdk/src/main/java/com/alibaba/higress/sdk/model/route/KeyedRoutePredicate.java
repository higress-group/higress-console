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

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Route Predicate with a Key")
public class KeyedRoutePredicate extends RoutePredicate {

    private String key;

    @Override
    public void validate() {
        validate(null);
    }

    public void validate(String location) {
        super.validate();

        String keyValue = this.key;
        String matchValue = this.getMatchValue();

        if (keyValue != null && !StringUtils.isAsciiPrintable(keyValue)) {
            throw new ValidationException(buildNonAsciiErrorMessage(location));
        }

        if (matchValue != null && !StringUtils.isAsciiPrintable(matchValue)) {
            throw new ValidationException(buildNonAsciiErrorMessage(location));
        }
    }

    private String buildNonAsciiErrorMessage(String location) {
        if (location != null) {
            return String.format("Route %s predicate contains non-ASCII characters: key=%s, matchValue=%s",
                location, getKey(), getMatchValue());
        }
        return String.format("Route predicate contains non-ASCII characters: key=%s, matchValue=%s", getKey(),
            getMatchValue());
    }
}
