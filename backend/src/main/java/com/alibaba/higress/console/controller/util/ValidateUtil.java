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

import com.google.common.net.InetAddresses;
import org.apache.commons.lang3.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateUtil {
    private static final String DOMAIN_PATTERN_REGEX = "^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$";
    private static final Pattern DOMAIN_PATTERN = Pattern.compile(DOMAIN_PATTERN_REGEX);

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

    public static boolean checkIp(String ip) {
        return InetAddresses.isInetAddress(ip);
    }

    public static boolean checkDomain(String domain) {
        Matcher matcher = DOMAIN_PATTERN.matcher(domain);
        return matcher.matches();
    }

    public static boolean checkZkPath(String zkPath) {
        if (StringUtils.isEmpty(zkPath)) {
            return false;
        }
        return zkPath.startsWith("/");
    }
}
