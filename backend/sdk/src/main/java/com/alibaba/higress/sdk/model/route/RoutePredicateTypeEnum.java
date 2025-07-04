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

import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Route Predicate Types", type = "string", allowableValues = {"EXACT", "PRE", "REGEX"})
public enum RoutePredicateTypeEnum {

    /**
     * Equal
     */
    EQUAL("exact"),
    /**
     * Prefix
     */
    PRE("prefix"),
    /**
     * Regular expression
     */
    REGULAR("regex");

    private final String annotationPrefix;

    private static final Map<String, RoutePredicateTypeEnum> NAME_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(RoutePredicateTypeEnum::name, t -> t));

    private static final Map<String, RoutePredicateTypeEnum> ANNOTATION_PREFIX_MAP =
        Arrays.stream(values()).collect(Collectors.toMap(RoutePredicateTypeEnum::getAnnotationPrefix, t -> t));

    RoutePredicateTypeEnum(String annotationPrefix) {
        this.annotationPrefix = annotationPrefix;
    }

    public String getAnnotationPrefix() {
        return annotationPrefix;
    }

    public static RoutePredicateTypeEnum fromName(String name) {
        return StringUtils.isNotEmpty(name) ? NAME_MAP.get(name.toUpperCase(Locale.ROOT)) : null;
    }

    public static RoutePredicateTypeEnum fromAnnotationPrefix(String annotationPrefix) {
        return StringUtils.isNotEmpty(annotationPrefix) ? ANNOTATION_PREFIX_MAP.get(annotationPrefix) : null;
    }
}
