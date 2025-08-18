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
package com.alibaba.higress.sdk.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ValidateUtilTest {

    @Test
    void testCheckServiceName() {
        assertTrue(ValidateUtil.checkServiceName("service-1"));
        assertTrue(ValidateUtil.checkServiceName("abc123"));
        assertFalse(ValidateUtil.checkServiceName("-invalid"));
        assertFalse(ValidateUtil.checkServiceName("invalid-"));
        assertFalse(ValidateUtil.checkServiceName(""));
    }

    @Test
    void testCheckPort() {
        assertTrue(ValidateUtil.checkPort(80));
        assertTrue(ValidateUtil.checkPort(65534));
        assertFalse(ValidateUtil.checkPort(0));
        assertFalse(ValidateUtil.checkPort(65535));
        assertFalse(ValidateUtil.checkPort(null));
        assertFalse(ValidateUtil.checkPort(1));
    }

    @Test
    void testCheckDomain() {
        assertTrue(ValidateUtil.checkDomain("example.com"));
        assertTrue(ValidateUtil.checkDomain("example.internal"));
        assertTrue(ValidateUtil.checkDomain("abc.def.com"));
        assertFalse(ValidateUtil.checkDomain("-abc.com"));
        assertFalse(ValidateUtil.checkDomain("abc-.com"));
        assertFalse(ValidateUtil.checkDomain("abc"));
        assertFalse(ValidateUtil.checkDomain(""));
    }

    @Test
    void testCheckDomainWithWildcard() {
        assertTrue(ValidateUtil.checkDomainWithWildcard("*.example.com"));
        assertTrue(ValidateUtil.checkDomainWithWildcard("example.com"));
        assertFalse(ValidateUtil.checkDomainWithWildcard("*example.com"));
        assertFalse(ValidateUtil.checkDomainWithWildcard("-abc.com"));
        assertFalse(ValidateUtil.checkDomainWithWildcard(""));
    }

    @Test
    void testCheckIpAddress() {
        assertTrue(ValidateUtil.checkIpAddress("192.168.1.1"));
        assertTrue(ValidateUtil.checkIpAddress("255.255.255.255"));
        assertFalse(ValidateUtil.checkIpAddress("256.0.0.1"));
        assertFalse(ValidateUtil.checkIpAddress("abc.def.ghi.jkl"));
        assertFalse(ValidateUtil.checkIpAddress(""));
    }

    @Test
    void testCheckUrlPath() {
        assertTrue(ValidateUtil.checkUrlPath("/api/test"));
        assertFalse(ValidateUtil.checkUrlPath("api/test"));
        assertFalse(ValidateUtil.checkUrlPath("/api/test?param=1"));
        assertFalse(ValidateUtil.checkUrlPath(""));
    }
}
