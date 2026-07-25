/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.higress.console.security;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Regression guard for fastjson 1.2.83_noneautotype dependency pin.
 *
 * The 1.2.83_noneautotype build replaces {@code ParserConfig.checkAutoType}
 * with a blanket throw — any class name passed via {@code @type} triggers
 * a {@code JSONException} whose message contains "autoType". This test fails
 * the build if the dependency is ever downgraded or replaced with a fastjson
 * variant that re-enables autoType, which would re-introduce the historical
 * RCE gadgets.
 *
 * <p><b>Probe class selection rationale:</b> {@code java.util.HashMap} and
 * {@code java.util.LinkedHashMap} are handled by a HARDCODED branch in
 * {@code DefaultJSONParser} (around line 327-330) that runs BEFORE
 * {@code checkAutoType} in BOTH 1.2.83 and 1.2.83_noneautotype. Using
 * HashMap/LinkedHashMap as the {@code @type} target would NOT discriminate
 * between the two versions — both would silently instantiate via the
 * hardcoded branch.
 *
 * <p>{@code java.util.Date} is a basic JDK class that is not in the hardcoded
 * branch, not in fastjson's deny list, and has a no-arg constructor, so it
 * exercises the {@code checkAutoType} path:
 * <ul>
 *   <li>1.2.83: {@code checkAutoType} allows Date → instance is created via
 *       reflection → no exception (RED — test fails because no throw)</li>
 *   <li>1.2.83_noneautotype: {@code checkAutoType} throws
 *       {@code JSONException("safeMode not support autoType : java.util.Date")}
 *       (GREEN — test passes because throw is expected)</li>
 * </ul>
 */
class FastjsonAutotypeGuardTest {

    @Test
    void parseObject_withTypeField_throwsOnAutoType() {
        String json = "{\"@type\":\"java.util.Date\",\"foo\":\"bar\"}";

        // 1.2.83_noneautotype: throws JSONException("safeMode not support autoType : java.util.Date").
        // 1.2.83: throws JSONException("syntax error, ...") — checkAutoType allows Date (basic JDK class,
        //         not in the deny list), a Date instance is constructed via reflection, then setting the
        //         unknown "foo" property fails and the parser surfaces a "syntax error". The discriminator
        //         is the exception message: 1.2.83's message lacks "autoType", 1.2.83_noneautotype's
        //         message contains "autoType".
        JSONException ex = assertThrows(JSONException.class, () -> JSON.parseObject(json));
        assertTrue(
            ex.getMessage() != null && ex.getMessage().toLowerCase().contains("autotype"),
            "Expected error message to mention autoType, got: " + ex.getMessage()
        );
    }

    @Test
    void parseObjectWithClass_withTypeField_throwsOnAutoType() {
        String json = "{\"@type\":\"java.util.Date\",\"foo\":\"bar\"}";

        // Same discriminator as above: 1.2.83_noneautotype throws with "autoType" in the message,
        // 1.2.83 throws "syntax error" (Date allowed, reflection succeeds, "foo" setter fails).
        JSONException ex = assertThrows(JSONException.class, () -> JSON.parseObject(json, Object.class));
        assertTrue(
            ex.getMessage() != null && ex.getMessage().toLowerCase().contains("autotype"),
            "Expected error message to mention autoType, got: " + ex.getMessage()
        );
    }
}