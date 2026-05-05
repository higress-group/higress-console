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
package com.alibaba.higress.sdk.model;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.UpstreamService;

import static org.junit.jupiter.api.Assertions.*;

class RouteTest {

    @Test
    @DisplayName("validate with non-ASCII header key throws with header context")
    void validate_withNonAsciiHeaderKey_throwsWithHeaderContext() {
        Route route = new Route();
        route.setName("test-route");
        route.setServices(Arrays.asList(
            UpstreamService.builder().name("svc").weight(100).build()
        ));

        KeyedRoutePredicate header = new KeyedRoutePredicate();
        header.setKey("x-custom=中文");
        header.setMatchType("EQUAL");
        header.setMatchValue("test");
        route.setHeaders(Arrays.asList(header));

        ValidationException ex = assertThrows(ValidationException.class,
            () -> route.validate());
        String msg = ex.getMessage();
        assertTrue(msg.contains("header"), "Message should contain 'header': " + msg);
        assertTrue(msg.contains("key"), "Message should contain 'key': " + msg);
        assertTrue(msg.contains("non-ASCII"), "Message should contain 'non-ASCII': " + msg);
    }

    @Test
    @DisplayName("validate with non-ASCII query matchValue throws with query context")
    void validate_withNonAsciiQueryMatchValue_throwsWithQueryContext() {
        Route route = new Route();
        route.setName("test-route");
        route.setServices(Arrays.asList(
            UpstreamService.builder().name("svc").weight(100).build()
        ));

        KeyedRoutePredicate query = new KeyedRoutePredicate();
        query.setKey("name");
        query.setMatchType("EQUAL");
        query.setMatchValue("李四");
        route.setUrlParams(Arrays.asList(query));

        ValidationException ex = assertThrows(ValidationException.class,
            () -> route.validate());
        String msg = ex.getMessage();
        assertTrue(msg.contains("query"), "Message should contain 'query': " + msg);
        assertTrue(msg.contains("matchValue"), "Message should contain 'matchValue': " + msg);
        assertTrue(msg.contains("non-ASCII"), "Message should contain 'non-ASCII': " + msg);
    }
}