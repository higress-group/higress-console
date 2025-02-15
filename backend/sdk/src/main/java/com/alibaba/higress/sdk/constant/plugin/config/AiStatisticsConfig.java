/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.constant.plugin.config;

import java.util.HashMap;
import java.util.Map;

public class AiStatisticsConfig {

    public static final String ATTRIBUTES = "attributes";

    public static final String KEY = "key";
    public static final String VALUE_SOURCE = "value_source";
    public static final String VALUE = "value";
    public static final String RULE = "rule";
    public static final String APPLY_TO_LOG = "apply_to_log";
    public static final String APPLY_TO_SPAN = "apply_to_span";

    public static class ValueSource {

        public static final String FIXED_VALUE = "fixed_value";
        public static final String REQUEST_HEADER = "request_header";
        public static final String REQUEST_BODY = "request_body";
        public static final String RESPONSE_HEADER = "response_header";
        public static final String RESPONSE_BODY = "response_body";
        public static final String RESPONSE_STREAMING_BODY = "response_streaming_body";
    }

    public static class Rule {

        public static final String FIRST = "first";
        public static final String REPLACE = "replace";
        public static final String APPEND = "append";
    }

    public static Map<String, Object> buildAttribute(String key, String valueSource, String value, String rule,
        Boolean applyToLog, Boolean applyToSpan) {
        Map<String, Object> attribute = new HashMap<>();
        if (key != null) {
            key = key.trim();
            attribute.put(KEY, key);
        }
        if (valueSource != null) {
            attribute.put(VALUE_SOURCE, valueSource);
        }
        if (value != null) {
            attribute.put(VALUE, value);
        }
        if (rule != null) {
            attribute.put(RULE, rule);
        }
        if (applyToLog != null) {
            attribute.put(APPLY_TO_LOG, applyToLog);
        }
        if (applyToSpan != null) {
            attribute.put(APPLY_TO_SPAN, applyToSpan);
        }
        return attribute;
    }
}
