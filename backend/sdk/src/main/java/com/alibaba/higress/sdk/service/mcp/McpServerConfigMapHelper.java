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
package com.alibaba.higress.sdk.service.mcp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import io.kubernetes.client.openapi.models.V1ConfigMap;

/**
 * @author lvshui
 */
public class McpServerConfigMapHelper {

    protected static final String MCP_CONFIG_KEY = "higress";
    protected static final String MCP_SERVER_KEY = "mcpServer";
    protected static final String MATCH_LIST_KEY = "match_list";
    protected static final String MATCH_RULE_PATH_KEY = "match_rule_path";
    private static final String SERVERS_KEY = "servers";
    private static final String SERVERS_NAME_KEY = "name";

    protected static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    static {
        YAML.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        YAML.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    private final KubernetesClientService kubernetesClientService;

    public McpServerConfigMapHelper(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    public static String generateMcpServerPath(String mcpServerName) {
        return String.format("%s/%s", McpConstants.MCP_SERVER_PATH_PRE, mcpServerName);
    }

    public McpServerConfigMap.MatchList generateMatchList(McpServer mcpInstance) {
        McpServerConfigMap.MatchList result = new McpServerConfigMap.MatchList();

        result.setMatchRulePath(generateMcpServerPath(mcpInstance.getName()));
        result.setMatchRuleDomain(Separators.ASTERISK);
        result.setMatchRuleType(RoutePredicateTypeEnum.PRE.getAnnotationPrefix());

        return result;
    }

    public void updateServerConfig(Consumer<List<McpServerConfigMap.Server>> updateFunction) {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG);
            McpServerConfigMap mcpConfig = getMcpConfig(configMap);
            updateFunction.accept(mcpConfig.getServers());

            updateMcpConfig2ConfigMap(configMap, mcpConfig);
        } catch (Exception e) {
            throw new BusinessException("Failed to update " + KubernetesConstants.HIGRESS_CONFIG + " config map.", e);
        }
    }

    /**
     * get mcp config from higress-config configmap
     *
     * @param configMap higress-config configmap
     * @return McpServerConfig
     */
    public static McpServerConfigMap getMcpConfig(V1ConfigMap configMap) {
        try {
            if (configMap != null && configMap.getData() != null) {
                String higressConfigYaml = configMap.getData().get(MCP_CONFIG_KEY);
                Map<String, Object> higressConfig =
                    YAML.readValue(higressConfigYaml, new TypeReference<Map<String, Object>>() {});

                McpServerConfigMap mcpConfig = new McpServerConfigMap();
                if (Objects.nonNull(higressConfig.get(MCP_SERVER_KEY))) {
                    mcpConfig = YAML.readValue(YAML.writeValueAsString(higressConfig.get(MCP_SERVER_KEY)),
                        new TypeReference<McpServerConfigMap>() {});
                }

                return mcpConfig;
            }

            throw new BusinessException("configmap data is null");
        } catch (Exception e) {
            throw new BusinessException("Failed to get mcp config.", e);
        }
    }

    /**
     * update mcp config to higress-config configmap, Only update the match list and servers in mcp config.
     *
     * @param configMap higress-config configmap
     * @param mcpConfig mcp config
     */
    protected void updateMcpConfig2ConfigMap(V1ConfigMap configMap, McpServerConfigMap mcpConfig) {
        try {
            // For safety, the mapped fields in the object are handled separately
            // to prevent manually configured fields from being cleared

            String higressConfigYaml = Objects.requireNonNull(configMap.getData()).get(MCP_CONFIG_KEY);
            Map<String, Object> higressConfig =
                YAML.readValue(higressConfigYaml, new TypeReference<Map<String, Object>>() {});

            Map<String, Object> mcpConfigFromK8s = new HashMap<>();
            if (Objects.nonNull(higressConfig.get(MCP_SERVER_KEY))) {
                mcpConfigFromK8s = YAML.readValue(YAML.writeValueAsString(higressConfig.get(MCP_SERVER_KEY)),
                    new TypeReference<Map<String, Object>>() {});
            }

            // update match list
            List<Map<String, Object>> matchListsFromK8s = new LinkedList<>();
            if (Objects.nonNull(mcpConfigFromK8s.get(MATCH_LIST_KEY))) {
                matchListsFromK8s = YAML.readValue(YAML.writeValueAsString(mcpConfigFromK8s.get(MATCH_LIST_KEY)),
                    new TypeReference<List<Map<String, Object>>>() {});
            }
            boolean matchListUpdated = false;
            Map<String, Map<String, Object>> matchListsMapFromK8s = matchListsFromK8s.stream()
                .collect(Collectors.toMap(rule -> (String)rule.get(MATCH_RULE_PATH_KEY), v -> v));
            // add, update
            for (McpServerConfigMap.MatchList obj : mcpConfig.getMatchList()) {
                Map<String, Object> matchListMapFromK8s = matchListsMapFromK8s.get(obj.getMatchRulePath());
                matchListsFromK8s.removeIf(rule -> obj.getMatchRulePath().equals(rule.get(MATCH_RULE_PATH_KEY)));
                matchListsFromK8s.add(obj.fillMap(matchListMapFromK8s));
                matchListUpdated = true;
            }
            // delete
            Set<String> matchListPathSet = mcpConfig.getMatchList().stream()
                .map(McpServerConfigMap.MatchList::getMatchRulePath).collect(Collectors.toSet());
            boolean matchListRemoved = matchListsFromK8s
                .removeIf(matchList -> !matchListPathSet.contains(String.valueOf(matchList.get(MATCH_RULE_PATH_KEY))));
            if (matchListUpdated || matchListRemoved) {
                mcpConfigFromK8s.put(MATCH_LIST_KEY, matchListsFromK8s);
            }

            // update servers
            List<Map<String, Object>> serversFromK8s = new LinkedList<>();
            if (Objects.nonNull(mcpConfigFromK8s.get(SERVERS_KEY))) {
                serversFromK8s = YAML.readValue(YAML.writeValueAsString(mcpConfigFromK8s.get(SERVERS_KEY)),
                    new TypeReference<List<Map<String, Object>>>() {});
            }
            // add, update
            Map<String, Map<String, Object>> serversMapFromK8s =
                serversFromK8s.stream().collect(Collectors.toMap(rule -> (String)rule.get(SERVERS_NAME_KEY), v -> v));
            boolean serversUpdated = false;
            for (McpServerConfigMap.Server obj : mcpConfig.getServers()) {
                Map<String, Object> serverFromK8s = serversMapFromK8s.get(obj.getName());
                serversFromK8s.removeIf(rule -> obj.getName().equals(rule.get(SERVERS_NAME_KEY)));
                serversFromK8s.add(obj.fillMap(serverFromK8s));
                serversUpdated = true;
            }
            // delete
            Set<String> serversNameSet =
                mcpConfig.getServers().stream().map(McpServerConfigMap.Server::getName).collect(Collectors.toSet());
            boolean serversRemoved = serversFromK8s
                .removeIf(server -> !serversNameSet.contains(String.valueOf(server.get(SERVERS_NAME_KEY))));
            if (serversUpdated || serversRemoved) {
                mcpConfigFromK8s.put(SERVERS_KEY, serversFromK8s);
            }

            higressConfig.put(MCP_SERVER_KEY, mcpConfigFromK8s);
            String updatedHigressConfigYaml = YAML.writeValueAsString(higressConfig);
            Objects.requireNonNull(configMap.getData()).put(MCP_CONFIG_KEY, updatedHigressConfigYaml);

            kubernetesClientService.replaceConfigMap(configMap);
        } catch (Exception e) {
            throw new BusinessException("Failed to update " + KubernetesConstants.HIGRESS_CONFIG + " config map.", e);
        }
    }

    public void addOrUpdateMatchRulePath(McpServerConfigMap.MatchList matchItem) {
        updateMatchList(matchList -> {
            matchList.removeIf(rule -> matchItem.getMatchRulePath().equals(rule.get(MATCH_RULE_PATH_KEY)));
            try {
                String matchItemString = YAML.writeValueAsString(matchItem);
                Map<String, Object> map = YAML.readValue(matchItemString, new TypeReference<Map<String, Object>>() {});
                matchList.add(map);
            } catch (JsonProcessingException e) {
                throw new BusinessException("Error occurs when converting object to map: " + e.getMessage(), e);
            }
        });
    }

    public void updateMatchList(Consumer<List<Map<String, Object>>> updateFunction) {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG);
            if (configMap != null && configMap.getData() != null) {
                String higressConfigYaml = configMap.getData().get(MCP_CONFIG_KEY);
                Map<String, Object> higressConfig =
                    YAML.readValue(higressConfigYaml, new TypeReference<Map<String, Object>>() {});
                Map<String, Object> mcpConfig = new HashMap<>();
                if (Objects.nonNull(higressConfig.get(MCP_SERVER_KEY))) {
                    mcpConfig = YAML.readValue(YAML.writeValueAsString(higressConfig.get(MCP_SERVER_KEY)),
                        new TypeReference<Map<String, Object>>() {});
                }
                List<Map<String, Object>> matchList = getExistMatchListValue(mcpConfig);
                updateFunction.accept(matchList);
                mcpConfig.put(MATCH_LIST_KEY, matchList);

                higressConfig.put(MCP_SERVER_KEY, mcpConfig);
                String updatedHigressConfigYaml = YAML.writeValueAsString(higressConfig);
                configMap.getData().put(MCP_CONFIG_KEY, updatedHigressConfigYaml);
                kubernetesClientService.replaceConfigMap(configMap);
            }
        } catch (Exception e) {
            throw new BusinessException("Failed to update " + KubernetesConstants.HIGRESS_CONFIG + " config map.", e);
        }
    }

    private List<Map<String, Object>> getExistMatchListValue(Map<String, Object> mcpConfig) {
        List<Map<String, Object>> matchList = new ArrayList<>();
        if (Objects.nonNull(mcpConfig.get(MATCH_LIST_KEY))) {
            try {
                return YAML.readValue(YAML.writeValueAsString(mcpConfig.get(MATCH_LIST_KEY)),
                    new TypeReference<List<Map<String, Object>>>() {});
            } catch (JsonProcessingException e) {
                throw new BusinessException("parse configMap:higress-config match_list failed!");
            }
        }
        return matchList;
    }

    public void initMcpServerConfig() {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG);
            if (Objects.isNull(configMap) || Objects.isNull(configMap.getData())) {
                throw new NotFoundException("configMap is empty for name = " + KubernetesConstants.HIGRESS_CONFIG);
            }

            String higressConfigYaml = configMap.getData().get(MCP_CONFIG_KEY);
            Map<String, Object> higressConfig =
                YAML.readValue(higressConfigYaml, new TypeReference<Map<String, Object>>() {});
            McpServerConfigMap mcpConfig;
            if (Objects.nonNull(higressConfig.get(MCP_SERVER_KEY))) {
                mcpConfig = YAML.readValue(YAML.writeValueAsString(higressConfig.get(MCP_SERVER_KEY)),
                    McpServerConfigMap.class);
            } else {
                mcpConfig = new McpServerConfigMap();
            }
            boolean needInit = false;

            if (StringUtils.isBlank(mcpConfig.getSsePathSuffix())) {
                needInit = true;
                mcpConfig.setSsePathSuffix("/sse");
            }
            if (Objects.isNull(mcpConfig.getEnable())) {
                needInit = true;
                mcpConfig.setEnable(Boolean.TRUE);
            }
            if (Objects.isNull(mcpConfig.getRedis())) {
                needInit = true;

                McpServerConfigMap.RedisConfig redisConfig = new McpServerConfigMap.RedisConfig();
                redisConfig.setDb(0);
                redisConfig.setAddress("your.redis.host:6379");
                redisConfig.setPassword("your_password");
                redisConfig.setUsername("your_username");
                mcpConfig.setRedis(redisConfig);
            }
            if (!needInit) {
                return;
            }

            if (CollectionUtils.isEmpty(mcpConfig.getServers())) {
                mcpConfig.setServers(Collections.emptyList());
            }
            higressConfig.put(MCP_SERVER_KEY, mcpConfig);
            String updatedHigressConfigYaml = YAML.writeValueAsString(higressConfig);
            Objects.requireNonNull(configMap.getData()).put(MCP_CONFIG_KEY, updatedHigressConfigYaml);
            kubernetesClientService.replaceConfigMap(configMap);
        } catch (Exception e) {
            throw new BusinessException("Failed to update " + KubernetesConstants.HIGRESS_CONFIG + " config map.", e);
        }
    }
}
