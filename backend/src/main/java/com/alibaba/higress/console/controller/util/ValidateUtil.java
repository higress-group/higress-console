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
package com.alibaba.higress.console.controller.util;

import org.apache.commons.lang3.StringUtils;

import java.util.regex.Pattern;

public class ValidateUtil {

    private static final Pattern DOMAIN_PATTERN =
        Pattern.compile("^(?:(?!-)[a-z0-9-]{0,62}[a-z0-9]\\.)+[a-z]{2,6}$");
    private static final Pattern IPV4_ADDRESS_PATTERN = Pattern
        .compile("(\\b25[0-5]|\\b2[0-4][0-9]|\\b[01]?[0-9][0-9]?)(\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}");

    /**
     * Validate port number: 1 ~ 65535
     * 
     * @param port
     * @return
     */
    public static boolean checkPort(Integer port) {
        if (null == port) {
            return false;
        }
        return port > 1 && port < 65535;
    }

    public static boolean checkDomain(String domain) {
        return StringUtils.isNotEmpty(domain) && DOMAIN_PATTERN.matcher(domain).matches();
    }

    public static boolean checkIpAddress(String ipAddress) {
        return StringUtils.isNotEmpty(ipAddress) && IPV4_ADDRESS_PATTERN.matcher(ipAddress).matches();
    }
}
