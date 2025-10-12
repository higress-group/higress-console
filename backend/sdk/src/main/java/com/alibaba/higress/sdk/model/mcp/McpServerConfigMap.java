package com.alibaba.higress.sdk.model.mcp;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * MCP服务器配置映射类
 * 用于映射ConfigMap中的相应字段，包含MCP服务器的各种配置信息
 */
@Data
public class McpServerConfigMap {

    /**
     * SSE路径后缀
     * 用于指定服务器发送事件的路径后缀
     */
    @JsonProperty("sse_path_suffix")
    private String ssePathSuffix;

    /**
     * 启用状态
     * 指示MCP服务器是否启用
     */
    private Boolean enable;

    /**
     * Redis配置
     * 定义Redis连接的相关配置
     */
    private RedisConfig redis;

    /**
     * 匹配规则列表
     * 定义请求匹配规则的列表
     */
    @JsonProperty("match_list")
    private List<MatchList> matchList;

    /**
     * 服务器列表
     * 定义MCP服务器的集合
     */
    private List<Server> servers = Collections.emptyList();

    /**
     * Redis配置内部类
     * 用于定义Redis连接的详细配置
     */
    @Data
    public static class RedisConfig {
        /**
         * Redis地址
         */
        private String address;
        
        /**
         * Redis密码
         */
        private String password;
        
        /**
         * Redis数据库编号
         */
        private Integer db;
        
        /**
         * Redis用户名
         */
        private String username;
        
        /**
         * Redis密钥
         */
        private String secret;
    }

    /**
     * 匹配规则列表内部类
     * 用于定义单个匹配规则的详细配置
     */
    @Data
    public static class MatchList {
        /**
         * 匹配规则域名
         * 定义匹配规则适用的域名
         */
        @JsonProperty("match_rule_domain")
        private String matchRuleDomain;

        /**
         * 匹配规则路径
         * 定义匹配规则适用的路径
         */
        @JsonProperty("match_rule_path")
        private String matchRulePath;

        /**
         * 匹配规则类型
         * 定义匹配规则的类型
         */
        @JsonProperty("match_rule_type")
        private String matchRuleType;

        /**
         * 上游类型
         * 定义上游服务的类型
         */
        @JsonProperty("upstream_type")
        private String upstreamType;

        /**
         * 是否启用路径重写
         * 指示是否启用路径重写功能
         */
        @JsonProperty("enable_path_rewrite")
        private Boolean enablePathRewrite;

        /**
         * 路径重写前缀
         * 定义路径重写的前缀
         */
        @JsonProperty("path_rewrite_prefix")
        private String pathRewritePrefix;

        /**
         * 填充映射
         * 将匹配规则的配置填充到映射中
         *
         * @param map 目标映射
         * @return 填充后的映射
         */
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

        /**
         * 如果值非空则放入映射
         * 仅当值非空时才将键值对放入映射
         *
         * @param map 目标映射
         * @param key 键
         * @param value 值
         */
        private void putIfNotEmpty(Map<String, Object> map, String key, String value) {
            if (StringUtils.isNotEmpty(value)) {
                map.put(key, value);
            }
        }

    }

    /**
     * 服务器内部类
     * 用于定义单个服务器的配置
     */
    @Data
    public static class Server {
        /**
         * 服务器名称
         */
        private String name;
        
        /**
         * 服务器路径
         */
        private String path;
        
        /**
         * 服务器类型
         */
        private String type;
        
        /**
         * 数据库服务器配置
         */
        private DBServerConfig config;

        /**
         * 填充映射
         * 将服务器配置填充到映射中
         *
         * @param map 目标映射
         * @return 填充后的映射
         */
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

    /**
     * 数据库服务器配置内部类
     * 用于定义数据库服务器的详细配置
     */
    @Data
    public static class DBServerConfig {
        /**
         * 数据源名称
         */
        private String dsn;
        
        /**
         * 数据库类型
         */
        private String dbType;

        /**
         * 构建映射
         * 将数据库配置构建成映射
         *
         * @return 包含数据库配置的映射
         */
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
