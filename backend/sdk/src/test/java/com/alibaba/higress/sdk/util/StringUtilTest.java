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
package com.alibaba.higress.sdk.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class StringUtilTest {

    @Test
    public void maskTest1() {
        Assertions.assertEquals("t*st", StringUtil.mask("test", '*', 1, 2));
    }

    @Test
    public void maskTest2() {
        Assertions.assertEquals("t*st", StringUtil.mask("test", '*', 2, 2));
    }

    @Test
    public void maskTest3() {
        Assertions.assertEquals("t*st", StringUtil.mask("test", '*', 3, 2));
    }

    @Test
    public void maskTest4() {
        Assertions.assertEquals("", StringUtil.mask("", '*', 1, 2));
    }

    @Test
    public void maskTest5() {
        Assertions.assertEquals("*", StringUtil.mask("a", '*', 1, 2));
    }

    @Test
    public void maskTest6() {
        Assertions.assertEquals("*b", StringUtil.mask("ab", '*', 1, 2));
    }

    @Test
    public void maskTest7() {
        Assertions.assertEquals("a*c", StringUtil.mask("abc", '*', 1, 2));
    }
}
