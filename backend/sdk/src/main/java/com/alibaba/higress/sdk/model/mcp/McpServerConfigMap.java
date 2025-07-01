/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.model.mcp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * McpServer ConfigMap, Map to the corresponding field in configmap
 *
 * @author hongzhouzi
 */
@Data
public class McpServerConfigMap {

    @JsonProperty("sse_path_suffix")
    private String ssePathSuffix;

    private Boolean enable;

    private RedisConfig redis;

    @JsonProperty("match_list")
    private List<MatchList> matchList;

    private List<Server> servers;

    @Data
    public static class RedisConfig {
        private String address;
        private String password;
        private Integer db;
        private String username;
        private String secret;
    }

    @Data
    public static class MatchList {
        @JsonProperty("match_rule_domain")
        private String matchRuleDomain;

        @JsonProperty("match_rule_path")
        private String matchRulePath;

        @JsonProperty("match_rule_type")
        private String matchRuleType;

        @JsonProperty("upstream_type")
        private String upstreamType;

        @JsonProperty("enable_path_rewrite")
        private Boolean enablePathRewrite;

        @JsonProperty("path_rewrite_prefix")
        private String pathRewritePrefix;

        public Map<String, Object> fillMap(Map<String, Object> map) {
            if (map == null) {
                map = new HashMap<>();
            }

            putIfNotEmpty(map, "match_rule_domain", matchRuleDomain);
            putIfNotEmpty(map, "match_rule_path", matchRulePath);
            putIfNotEmpty(map, "match_rule_type", matchRuleType);
            putIfNotEmpty(map, "upstream_type", upstreamType);
            putIfNotEmpty(map, "path_rewrite_prefix", pathRewritePrefix);
            if (enablePathRewrite != null) {
                map.put("enable_path_rewrite", enablePathRewrite);
            }
            return map;
        }

        private void putIfNotEmpty(Map<String, Object> map, String key, String value) {
            if (StringUtils.isNotEmpty(value)) {
                map.put(key, value);
            }
        }

    }

    @Data
    public static class Server {
        private String name;
        private String path;
        private String type;
        private DBServerConfig config;

        public Map<String, Object> fillMap(Map<String, Object> map) {
            if (map == null) {
                map = new HashMap<>();
            }
            if (StringUtils.isNotEmpty(name)) {
                map.put("name", name);
            }
            if (StringUtils.isNotEmpty(path)) {
                map.put("path", path);
            }
            if (StringUtils.isNotEmpty(type)) {
                map.put("type", type);
            }
            if (config != null) {
                map.put("config", config.buildMap());
            }

            return map;
        }
    }

    @Data
    public static class DBServerConfig {
        private String dsn;
        private String dbType;

        public Map<String, Object> buildMap() {
            Map<String, Object> map = new HashMap<>();
            if (StringUtils.isNotEmpty(dsn)) {
                map.put("dsn", dsn);
            }
            if (StringUtils.isNotEmpty(dbType)) {
                map.put("dbType", dbType);
            }

            return map;
        }
    }
}
