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
package com.alibaba.higress.sdk.service.mcp;

import java.util.Map;

import com.alibaba.higress.sdk.model.mcp.McpServerDBConfig;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;

public class McpServerDBConfigValidator {

    /**
     * Validate configuration and throw IllegalArgumentException on invalid input. - Enforces printable ASCII only
     * (rejects control characters) and length limits - Enforces required fields by database type
     */
    public static void validate(McpServerDBConfig config, McpServerDBTypeEnum type) {
        if (config == null) {
            throw new IllegalArgumentException("config must not be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("type must not be null");
        }

        switch (type) {
            case MYSQL:
                validateCommonHost(config.getHost());
                validateCommonPort(config.getPort());
                // MySQL username max length: 32 characters
                validateUsernameRequired(config.getUsername(), 32);
                // MySQL database name allows broader charset (DSN may encode). Only length/printable checks here
                validateDbNameRequired(config.getDbname(), 64, false);
                validatePasswordOptional(config.getPassword(), 256);
                validateOtherParams(config.getOtherParams());
                break;
            case POSTGRESQL:
                validateCommonHost(config.getHost());
                validateCommonPort(config.getPort());
                // PostgreSQL role name max 63 bytes (ASCII assumed here = 63 chars)
                validateUsernameRequired(config.getUsername(), 63);
                // PostgreSQL identifiers max 63 bytes; broader charset allowed. Only length/printable checks here
                validateDbNameRequired(config.getDbname(), 63, false);
                validatePasswordOptional(config.getPassword(), 256);
                validateOtherParams(config.getOtherParams());
                break;
            case CLICKHOUSE:
                validateCommonHost(config.getHost());
                validateCommonPort(config.getPort());
                // ClickHouse allows anonymous; validate when provided
                validateUsernameOptional(config.getUsername(), 256);
                validateDbNameOptional(config.getDbname(), 255, false);
                validatePasswordOptional(config.getPassword(), 256);
                validateOtherParams(config.getOtherParams());
                break;
            case SQLITE:
                // SQLite uses file path as "dbname"; required, printable ASCII, with length limit
                requireNotBlank(config.getDbname(), "dbname must not be empty for sqlite");
                ensureAsciiPrintable(config.getDbname(), "dbname contains non-printable characters");
                ensureMaxLength(config.getDbname(), 1024, "dbname length must be <= 1024 for sqlite");
                // Other fields, if present, are validated leniently
                if (config.getUsername() != null) {
                    validateUsernameOptional(config.getUsername(), 128);
                }
                if (config.getPassword() != null) {
                    validatePasswordOptional(config.getPassword(), 256);
                }
                validateOtherParams(config.getOtherParams());
                break;
            default:
                throw new IllegalArgumentException("Unsupported database type: " + type);
        }
    }

    // Common: host validation (hostname, IPv4, and a relaxed IPv6 check)
    private static void validateCommonHost(String host) {
        requireNotBlank(host, "host must not be empty");
        String h = host.trim();
        ensureAsciiPrintable(h, "host contains non-printable characters");
        ensureMaxLength(h, 253, "host length must be <= 253");
        if (!(isHostname(h) || isIpv4(h) || isPotentialIpv6(h))) {
            throw new IllegalArgumentException("host must be a valid hostname or IP address");
        }
    }

    // Common: port validation
    private static void validateCommonPort(String portStr) {
        requireNotBlank(portStr, "port must not be empty");
        int p = parsePort(portStr);
        if (p < 1 || p > 65535) {
            throw new IllegalArgumentException("port must be an integer in 1..65535");
        }
    }

    private static void validateUsernameRequired(String username, int maxLen) {
        requireNotBlank(username, "username must not be empty");
        validateUsernameOptional(username, maxLen);
    }

    private static void validateUsernameOptional(String username, int maxLen) {
        if (username == null) {
            return;
        }
        String u = username.trim();
        ensureAsciiPrintable(u, "username contains non-printable characters");
        ensureMaxLength(u, maxLen, "username length must be <= " + maxLen);
        // Databases generally accept wide character sets; drivers handle quoting/encoding. No whitelist here
    }

    private static void validatePasswordOptional(String password, int maxLen) {
        if (password == null) {
            return;
        }
        String p = password;
        ensureAsciiPrintable(p, "password contains non-printable characters");
        ensureMaxLength(p, maxLen, "password length must be <= " + maxLen);
    }

    private static void validateDbNameRequired(String dbname, int maxLen, boolean restrictChars) {
        requireNotBlank(dbname, "dbname must not be empty");
        validateDbNameOptional(dbname, maxLen, restrictChars);
    }

    private static void validateDbNameOptional(String dbname, int maxLen, boolean restrictChars) {
        if (dbname == null) {
            return;
        }
        String d = dbname.trim();
        ensureAsciiPrintable(d, "dbname contains non-printable characters");
        ensureMaxLength(d, maxLen, "dbname length must be <= " + maxLen);
        // No character whitelist; upper layers may enforce stricter policies if needed
    }

    private static void validateOtherParams(Map<String, Object> params) {
        if (params == null || params.isEmpty()) {
            return;
        }
        if (params.size() > 64) {
            throw new IllegalArgumentException("too many otherParams entries (max 64)");
        }
        for (Map.Entry<String, Object> e : params.entrySet()) {
            String key = e.getKey();
            Object val = e.getValue();
            if (key == null || key.trim().isEmpty()) {
                throw new IllegalArgumentException("otherParams key must not be empty");
            }
            String k = key.trim();
            ensureAsciiPrintable(k, "otherParams key contains non-printable characters");
            ensureMaxLength(k, 64, "otherParams key length must be <= 64");
            if (!k.matches("[A-Za-z0-9._-]+")) {
                throw new IllegalArgumentException("otherParams key may only contain letters, digits, '.', '_' or '-'");
            }
            if (val == null) {
                throw new IllegalArgumentException("otherParams value for '" + k + "' must not be null");
            }
            String v = String.valueOf(val);
            ensureAsciiPrintable(v, "otherParams value contains non-printable characters");
            ensureMaxLength(v, 512, "otherParams value length must be <= 512");
        }
    }

    // ========= Utility methods =========
    private static void requireNotBlank(String s, String message) {
        if (s == null || s.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
    }

    private static void ensureAsciiPrintable(String s, String message) {
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c < 32 || c > 126) {
                throw new IllegalArgumentException(message);
            }
        }
    }

    private static void ensureMaxLength(String s, int maxLen, String message) {
        if (s.length() > maxLen) {
            throw new IllegalArgumentException(message);
        }
    }

    private static int parsePort(String portStr) {
        try {
            return Integer.parseInt(portStr.trim());
        } catch (Exception ex) {
            return -1;
        }
    }

    private static boolean isHostname(String host) {
        // Simplified hostname check: label 1-63, total <=253, alnum and hyphen, starts/ends with alnum
        if (host.endsWith(".")) {
            host = host.substring(0, host.length() - 1);
        }
        String labelRegex = "[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?";
        String hostnameRegex = labelRegex + "(?:\\." + labelRegex + ")*";
        return host.matches(hostnameRegex);
    }

    private static boolean isIpv4(String host) {
        String ipv4Regex = "^(25[0-5]|2[0-4]\\d|1?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|1?\\d?\\d)){3}$";
        return host.matches(ipv4Regex);
    }

    private static boolean isPotentialIpv6(String host) {
        // Relaxed detection: contains colon or wrapped in [...]
        boolean validateBoundary = host.startsWith("[") && host.endsWith("]");
        return host.contains(":") || validateBoundary;
    }
}
