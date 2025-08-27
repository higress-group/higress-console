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

import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import com.alibaba.higress.sdk.model.mcp.McpServerDBConfig;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;

public class McpServerDBConfigDsnConverter {

    // Convert configuration to DSN/connection string according to database type
    public static String toDsn(McpServerDBConfig config, McpServerDBTypeEnum type) {
        if (config == null || type == null) {
            throw new IllegalArgumentException("config and type must not be null");
        }
        switch (type) {
            case MYSQL:
                return buildMySqlDsn(config);
            case POSTGRESQL:
                return buildPostgresDsn(config);
            case CLICKHOUSE:
                return buildClickhouseDsn(config);
            case SQLITE:
                return buildSqliteDsn(config);
            default:
                throw new IllegalArgumentException("Unsupported database type: " + type);
        }
    }

    // Parse DSN string into config according to database type
    public static McpServerDBConfig fromDsn(String dsn, McpServerDBTypeEnum type) {
        if (dsn == null || type == null) {
            throw new IllegalArgumentException("dsn and type must not be null");
        }
        switch (type) {
            case MYSQL:
                return parseMySqlDsn(dsn);
            case POSTGRESQL:
                return parsePostgresDsn(dsn);
            case CLICKHOUSE:
                return parseClickhouseDsn(dsn);
            case SQLITE:
                return parseSqliteDsn(dsn);
            default:
                throw new IllegalArgumentException("Unsupported database type: " + type);
        }
    }

    // =============== Parsers ===============
    private static McpServerDBConfig parseMySqlDsn(String dsn) {
        // Expected: [user[:pass]@]tcp(host[:port])/dbname[?k=v]
        McpServerDBConfig cfg = new McpServerDBConfig();
        String s = dsn.trim();
        String beforeTcp;
        String afterTcp;
        int atIdx = s.indexOf('@');
        int tcpIdx = s.indexOf("tcp(");
        if (tcpIdx < 0) {
            throw new IllegalArgumentException("Invalid MySQL DSN: missing tcp(");
        }
        if (atIdx >= 0 && atIdx < tcpIdx) {
            beforeTcp = s.substring(0, atIdx);
            afterTcp = s.substring(atIdx + 1);
            String[] up = beforeTcp.split(":", 2);
            cfg.setUsername(up.length > 0 ? urlDecode(up[0]) : null);
            if (up.length > 1) {
                cfg.setPassword(urlDecode(up[1]));
            }
        } else {
            afterTcp = s;
        }

        int lpar = afterTcp.indexOf('(');
        int rpar = afterTcp.indexOf(')', lpar + 1);
        if (lpar < 0 || rpar < 0) {
            throw new IllegalArgumentException("Invalid MySQL DSN: invalid tcp(host:port)");
        }
        String address = afterTcp.substring(lpar + 1, rpar).trim();
        // host may be [ipv6] or hostname or ipv4
        String hostPart = address;
        String portPart = null;
        if (hostPart.startsWith("[") && hostPart.endsWith("]")) {
            hostPart = hostPart.substring(1, hostPart.length() - 1);
            // port may follow after rpar via :port? not in Go style; in our format port is inside
        }
        int colon = address.lastIndexOf(':');
        if (colon > -1 && colon > address.lastIndexOf(']')) {
            hostPart = address.substring(0, colon);
            portPart = address.substring(colon + 1);
            if (hostPart.startsWith("[") && hostPart.endsWith("]")) {
                hostPart = hostPart.substring(1, hostPart.length() - 1);
            }
        }
        cfg.setHost(hostPart.isEmpty() ? null : hostPart);
        cfg.setPort(portPart);

        String afterParen = afterTcp.substring(rpar + 1); // )/dbname?params
        if (afterParen.startsWith("/")) {
            afterParen = afterParen.substring(1);
        }
        String dbPart = afterParen;
        String queryPart = null;
        int qIdx = afterParen.indexOf('?');
        if (qIdx >= 0) {
            dbPart = afterParen.substring(0, qIdx);
            queryPart = afterParen.substring(qIdx + 1);
        }
        cfg.setDbname(dbPart.isEmpty() ? null : dbPart);
        if (queryPart != null) {
            cfg.setOtherParams(parseQuery(queryPart));
        }
        return cfg;
    }

    private static McpServerDBConfig parsePostgresDsn(String dsn) {
        McpServerDBConfig cfg = new McpServerDBConfig();
        URI uri = URI.create(dsn);
        String userInfo = uri.getUserInfo();
        if (userInfo != null) {
            String[] up = userInfo.split(":", 2);
            cfg.setUsername(urlDecode(up[0]));
            if (up.length > 1) {
                cfg.setPassword(urlDecode(up[1]));
            }
        }
        String host = uri.getHost();
        if (host == null) {
            // java.net.URI may not parse host when IPv6 without brackets; fallback
            String authority = uri.getRawAuthority();
            if (authority != null) {
                // remove userinfo if present
                int at = authority.lastIndexOf('@');
                String hostPort = at >= 0 ? authority.substring(at + 1) : authority;
                if (hostPort.startsWith("[")) {
                    int end = hostPort.indexOf(']');
                    host = end > 0 ? hostPort.substring(1, end) : hostPort;
                } else {
                    int c = hostPort.indexOf(':');
                    host = c > 0 ? hostPort.substring(0, c) : hostPort;
                }
                String port = null;
                if (hostPort.startsWith("[")) {
                    int end = hostPort.indexOf(']');
                    int c = hostPort.indexOf(':', end);
                    if (c > 0) {
                        port = hostPort.substring(c + 1);
                    }
                } else {
                    int c = hostPort.indexOf(':');
                    if (c > 0) {
                        port = hostPort.substring(c + 1);
                    }
                }
                cfg.setPort(port);
            }
        } else {
            int port = uri.getPort();
            cfg.setPort(port >= 0 ? String.valueOf(port) : null);
        }
        cfg.setHost(host);
        String path = uri.getPath();
        if (path != null && path.length() > 1) {
            cfg.setDbname(urlDecode(path.substring(1)));
        }
        String query = uri.getRawQuery();
        if (query != null && !query.isEmpty()) {
            cfg.setOtherParams(parseQuery(query));
        }
        return cfg;
    }

    private static McpServerDBConfig parseClickhouseDsn(String dsn) {
        McpServerDBConfig cfg = new McpServerDBConfig();
        URI uri = URI.create(dsn);
        String host = uri.getHost();
        if (host == null) {
            String authority = uri.getRawAuthority();
            if (authority != null && authority.startsWith("[")) {
                int end = authority.indexOf(']');
                host = end > 0 ? authority.substring(1, end) : authority;
            } else {
                host = authority;
                int c = host != null ? host.indexOf(':') : -1;
                if (c > 0) {
                    host = host.substring(0, c);
                }
            }
        }
        cfg.setHost(host);
        int port = uri.getPort();
        cfg.setPort(port >= 0 ? String.valueOf(port) : null);

        String query = uri.getRawQuery();
        Map<String, Object> params = query != null ? parseQuery(query) : new LinkedHashMap<>();
        if (params.containsKey("username")) {
            cfg.setUsername(String.valueOf(params.remove("username")));
        }
        if (params.containsKey("password")) {
            cfg.setPassword(String.valueOf(params.remove("password")));
        }
        if (params.containsKey("database")) {
            cfg.setDbname(String.valueOf(params.remove("database")));
        }
        cfg.setOtherParams(params.isEmpty() ? null : params);
        return cfg;
    }

    private static McpServerDBConfig parseSqliteDsn(String dsn) {
        McpServerDBConfig cfg = new McpServerDBConfig();
        cfg.setDbname(dsn);
        return cfg;
    }

    private static Map<String, Object> parseQuery(String query) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (query == null || query.isEmpty()) {
            return map;
        }
        String[] pairs = query.split("&");
        for (String p : pairs) {
            if (p.isEmpty()) {
                continue;
            }
            int eq = p.indexOf('=');
            String k = eq >= 0 ? p.substring(0, eq) : p;
            String v = eq >= 0 ? p.substring(eq + 1) : "";
            map.put(urlDecode(k), urlDecode(v));
        }
        return map;
    }

    private static String urlDecode(String s) {
        if (s == null) {
            return null;
        }
        try {
            return URLDecoder.decode(s, StandardCharsets.UTF_8.name());
        } catch (Exception ex) {
            return s;
        }
    }

    // MySQL: user:pass@tcp(host:port)/dbname?params
    private static String buildMySqlDsn(McpServerDBConfig c) {
        String user = c.getUsername();
        String pass = c.getPassword();
        String host = c.getHost();
        String port = c.getPort();
        String db = c.getDbname();

        String addressHost = host == null ? "" : host;
        // Bracket IPv6 for MySQL tcp() address if not already bracketed
        if (addressHost.contains(":") && !(addressHost.startsWith("[") && addressHost.endsWith("]"))) {
            addressHost = "[" + addressHost + "]";
        }
        String address = addressHost + (port != null && !port.isEmpty() ? ":" + port : "");

        // For MySQL DSN (go-sql-driver/mysql), username/password are not URL-encoded
        String userInfo = user == null ? "" : user;
        if (pass != null && !pass.isEmpty()) {
            userInfo += ":" + pass;
        }

        StringBuilder sb = new StringBuilder();
        if (!userInfo.isEmpty()) {
            sb.append(userInfo).append("@");
        }
        sb.append("tcp(").append(address).append(")/").append(db == null ? "" : db);

        String query = buildQueryParams(c.getOtherParams());
        if (!query.isEmpty()) {
            sb.append("?").append(query);
        }
        return sb.toString();
    }

    // PostgreSQL: URL form
    private static String buildPostgresDsn(McpServerDBConfig c) {
        String user = c.getUsername();
        String pass = c.getPassword();
        String host = c.getHost();
        String port = c.getPort();
        String db = c.getDbname();

        String hostRaw = host == null ? "" : host;
        // Bracket IPv6 in URL authority
        String hostPart = (hostRaw.contains(":") && !(hostRaw.startsWith("[") && hostRaw.endsWith("]")))
            ? "[" + hostRaw + "]" : hostRaw;
        String hostPort = hostPart + (port != null && !port.isEmpty() ? ":" + port : "");
        String userPart = user != null ? urlEncode(user) : "";
        String passPart = (pass != null && !pass.isEmpty()) ? ":" + urlEncode(pass) : "";

        StringBuilder sb = new StringBuilder();
        sb.append("postgres://");
        if (!userPart.isEmpty()) {
            sb.append(userPart).append(passPart).append("@");
        }
        sb.append(hostPort).append("/").append(db == null ? "" : urlEncode(db));

        String query = buildQueryParams(c.getOtherParams());
        if (!query.isEmpty()) {
            sb.append("?").append(query);
        }
        return sb.toString();
    }

    // ClickHouse: TCP format, e.g., tcp://host:9000?params
    private static String buildClickhouseDsn(McpServerDBConfig c) {
        String host = c.getHost();
        String port = c.getPort();
        String user = c.getUsername();
        String pass = c.getPassword();
        String db = c.getDbname();

        Map<String, Object> params = new LinkedHashMap<>();
        if (c.getOtherParams() != null) {
            params.putAll(c.getOtherParams());
        }
        if (user != null) {
            params.put("username", user);
        }
        if (pass != null) {
            params.put("password", pass);
        }
        if (db != null) {
            params.put("database", db);
        }

        String hostRaw = host == null ? "localhost" : host;
        String hostPart = (hostRaw.contains(":") && !(hostRaw.startsWith("[") && hostRaw.endsWith("]")))
            ? "[" + hostRaw + "]" : hostRaw;
        String address = hostPart + (port != null && !port.isEmpty() ? ":" + port : "");

        StringBuilder sb = new StringBuilder();
        sb.append("tcp://").append(address);
        String query = buildQueryParams(params);
        if (!query.isEmpty()) {
            sb.append("?").append(query);
        }
        return sb.toString();
    }

    // SQLite: typically uses a file path as DSN
    private static String buildSqliteDsn(McpServerDBConfig c) {
        return (c.getDbname() != null) ? c.getDbname() : "";
    }

    // Convert map to URL query string with URL-encoded values
    private static String buildQueryParams(Map<String, Object> params) {
        if (params == null || params.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, Object> e : params.entrySet()) {
            if (e.getKey() == null || e.getValue() == null) {
                continue;
            }
            String key = e.getKey();
            String value = String.valueOf(e.getValue());
            if (value.isEmpty()) {
                continue;
            }
            if (!first) {
                sb.append("&");
            }
            sb.append(urlEncode(key)).append("=").append(urlEncode(value));
            first = false;
        }
        return sb.toString();
    }

    // URL encode using UTF-8
    private static String urlEncode(String s) {
        if (s == null) {
            return "";
        }
        try {
            return URLEncoder.encode(s, StandardCharsets.UTF_8.name()).replace("+", "%20");
        } catch (Exception ex) {
            return s;
        }
    }
}
