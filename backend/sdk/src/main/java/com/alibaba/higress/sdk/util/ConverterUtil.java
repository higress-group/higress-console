/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.util;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;

import com.google.common.base.Function;

/**
 * @author lvshui
 */
public class ConverterUtil {
    public static <T, R> List<R> toList(Collection<T> sourceCollection, Function<T, R> function) {
        if (CollectionUtils.isEmpty(sourceCollection)) {
            return Collections.emptyList();
        }
        return sourceCollection.stream().map(function).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public static Boolean toBoolean(Object value) {
        return toBoolean(value, null);
    }

    public static Boolean toBoolean(Object value, Boolean defaultValue) {
        if (value instanceof Boolean) {
            return (Boolean)value;
        } else if (value instanceof String) {
            String strVal = ((String)value).trim().toLowerCase();
            if ("true".equals(strVal) || "1".equals(strVal) || "yes".equals(strVal)) {
                return Boolean.TRUE;
            }
            if ("false".equals(strVal) || "0".equals(strVal) || "no".equals(strVal) || strVal.isEmpty()) {
                return Boolean.FALSE;
            }
        } else if (value instanceof Number) {
            return ((Number)value).intValue() != 0;
        }
        return defaultValue;
    }
}
