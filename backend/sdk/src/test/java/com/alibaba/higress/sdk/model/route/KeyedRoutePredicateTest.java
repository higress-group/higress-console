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

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.exception.ValidationException;

class KeyedRoutePredicateTest {

    @Test
    @DisplayName("validate with ASCII key and value succeeds")
    void validate_withAsciiKeyAndValue_succeeds() {
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setMatchType("EQUAL");
        predicate.setMatchValue("test");
        predicate.setKey("name");

        assertDoesNotThrow(() -> predicate.validate());
    }

    @Test
    @DisplayName("validate with non-ASCII key throws exception with both fields in message")
    void validate_withNonAsciiKey_throwsException() {
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setMatchType("EQUAL");
        predicate.setMatchValue("John Doe");
        predicate.setKey("姓名");

        ValidationException exception = assertThrows(ValidationException.class, () -> predicate.validate());
        String msg = exception.getMessage();
        assertTrue(msg.contains("non-ASCII"));
        assertTrue(msg.contains("key=姓名"));
        assertTrue(msg.contains("matchValue=John Doe"));
    }

    @Test
    @DisplayName("validate with non-ASCII matchValue throws exception with both fields in message")
    void validate_withNonAsciiMatchValue_throwsException() {
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setMatchType("EQUAL");
        predicate.setMatchValue("李四");
        predicate.setKey("name");

        ValidationException exception = assertThrows(ValidationException.class, () -> predicate.validate());
        String msg = exception.getMessage();
        assertTrue(msg.contains("non-ASCII"));
        assertTrue(msg.contains("key=name"));
        assertTrue(msg.contains("matchValue=李四"));
    }

    @Test
    @DisplayName("validate with null location error message contains both field values")
    void validate_withNullLocation_errorMessageContainsFieldValues() {
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setMatchType("EQUAL");
        predicate.setMatchValue("test");
        predicate.setKey("中文key");

        ValidationException exception = assertThrows(ValidationException.class, () -> predicate.validate());
        String msg = exception.getMessage();
        assertTrue(msg.contains("non-ASCII"));
        assertTrue(msg.contains("key=中文key"));
        assertTrue(msg.contains("matchValue=test"));
    }

    @Test
    @DisplayName("validate with header location error message contains header context")
    void validate_withHeaderLocation_errorMessageContainsHeaderContext() {
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setMatchType("EQUAL");
        predicate.setMatchValue("李四");
        predicate.setKey("name");

        ValidationException exception = assertThrows(ValidationException.class, () -> predicate.validate("header"));
        String msg = exception.getMessage();
        assertTrue(msg.contains("header"));
        assertTrue(msg.contains("non-ASCII"));
        assertTrue(msg.contains("key=name"));
        assertTrue(msg.contains("matchValue=李四"));
    }
}