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

import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.ALLOW;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_HEADER;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_QUERY;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.KEYS;
import static com.alibaba.higress.sdk.model.mcp.McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RouteAuthConfig;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap.MatchList;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap.Server;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationOfKeyAuthServiceImpl;
import com.alibaba.higress.sdk.service.authorization.AuthorizationService;
import com.alibaba.higress.sdk.service.authorization.RelationshipConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.util.ConverterUtil;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.google.common.collect.Lists;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

/**
 * @author HecarimV
 */
@Slf4j
public abstract class AbstractMcpServerServiceImpl implements McpServerService {

    protected static final String HIGRESS_CONFIG = "higress-config";
    protected static final String MCP_CONFIG_KEY = "higress";
    protected static final String MCP_SERVER_KEY = "mcpServer";
    protected static final String MATCH_LIST_KEY = "match_list";
    protected static final String MATCH_RULE_PATH_KEY = "match_rule_path";
    private static final String SERVERS_KEY = "servers";
    private static final String SERVERS_NAME_KEY = "name";
    private static final String MCP_SERVER_PATH_PRE = "/mcp-servers";

    protected static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    static {
        YAML.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    protected final KubernetesClientService kubernetesClientService;
    protected final KubernetesModelConverter kubernetesModelConverter;
    protected final WasmPluginInstanceService wasmPluginInstanceService;
    protected final RouteService routeService;
    protected final AuthorizationService authorizationService;

    public AbstractMcpServerServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        this.authorizationService = new AuthorizationOfKeyAuthServiceImpl(wasmPluginInstanceService);
        this.routeService = routeService;
    }

    /**
     * <p>
     * saveRoute - route info <br>
     * buildMcpServer - mcp server info <br>
     * buildAuthentication - auth info <br>
     * buildAuthorization - authorization info <br>
     * </p>
     * 
     * @param mcpInstance
     */
    @Override
    public McpServer addOrUpdate(McpServer mcpInstance) {
        saveRoute(mcpInstance);
        buildMcpServer(mcpInstance);
        buildAuthentication(mcpInstance);
        // buildAuthorization(mcpInstance);
        return mcpInstance;
    }

    @Override
    public PaginatedResult<McpServer> list(McpServerPageQuery query) {
        List<McpServer> resultList;

        Map<String, String> labelMap =
            MapUtil.of(KubernetesConstants.Label.RESOURCE_BIZ_TYPE_KEY, MCP_SERVER_BIZ_TYPE_VALUE);
        try {
            List<V1Ingress> v1Ingresses = kubernetesClientService.listIngress(labelMap);
            List<Route> routeList = ConverterUtil.toList(v1Ingresses, kubernetesModelConverter::ingress2Route);
            resultList = ConverterUtil.toList(routeList, this::routeToMcpServer);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing Ingresses.", e);
        }

        filterMcpServers(resultList, query);
        sortMcpServers(resultList);
        return PaginatedResult.createFromFullList(resultList, query);
    }

    @Override
    public void delete(String name) {
        routeService.delete(name);
        deleteMatchRulePath(name);
        deleteServersConfig(name);
    }

    @Override
    public void addAllowConsumers(McpServerConsumers consumers) {
        Route route = routeService.query(consumers.getMcpServerName());
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        authorizationService.bindList(RelationshipConverter.convert(consumers));
    }

    @Override
    public void deleteAllowConsumers(McpServerConsumers consumers) {
        Route route = routeService.query(consumers.getMcpServerName());
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        authorizationService.unbindList(RelationshipConverter.convert(consumers));
    }

    @Override
    public PaginatedResult<McpServerConsumerDetail> listAllowConsumers(McpServerConsumersPageQuery query) {
        Route route = routeService.query(query.getMcpServerName());
        if (Objects.isNull(route)) {
            throw new BusinessException("bound route not found!");
        }
        List<String> allowedConsumers =
            Optional.ofNullable(route.getAuthConfig().getAllowedConsumers()).orElse(new ArrayList<>());
        List<McpServerConsumerDetail> resultList = allowedConsumers.stream().filter(consumer -> {
            String searchTerm = query.getConsumerName();
            if (StringUtils.isBlank(searchTerm)) {
                return true;
            }
            return consumer.contains(searchTerm);
        }).map(consumer -> McpServerConsumerDetail.builder().mcpServerName(route.getName()).consumerName(consumer)
            .type(CredentialType.KEY_AUTH).build()).collect(Collectors.toList());
        return PaginatedResult.createFromFullList(resultList, query);
    }

    protected abstract void buildMcpServer(McpServer mcpInstance);

    /**
     * build and save route info
     * 
     * @param mcpInstance
     */
    private Route saveRoute(McpServer mcpInstance) {
        Route routeRequest = buildRouteRequest(mcpInstance);
        routeRequest.validate();
        V1Ingress ingress = kubernetesModelConverter.route2Ingress(routeRequest);

        Route existRoute = routeService.query(mcpInstance.getName());
        if (Objects.isNull(existRoute)) {
            // create route
            V1Ingress newIngress;
            try {
                newIngress = kubernetesClientService.createIngress(ingress);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                    "Error occurs when updating the ingress generated by route with name: " + existRoute.getName(), e);
            }
            return kubernetesModelConverter.ingress2Route(newIngress);
        }

        // update route
        V1Ingress updatedIngress;
        try {
            updatedIngress = kubernetesClientService.replaceIngress(ingress);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when updating the ingress generated by route with name: " + existRoute.getName(), e);
        }
        return kubernetesModelConverter.ingress2Route(updatedIngress);
    }

    private void buildAuthentication(McpServer mcpInstance) {
        // global key-auth init
        WasmPluginInstance globalKeyAuth =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, BuiltInPluginName.KEY_AUTH, true);
        if (globalKeyAuth == null) {
            WasmPluginInstance keyAuthRequest = buildGlobalKeyAuthRequest();
            wasmPluginInstanceService.addOrUpdate(keyAuthRequest);
        }

        initMcpServerAuthentication(mcpInstance);
    }

    private void buildAuthorization(McpServer mcpServer) {
        if (Objects.isNull(mcpServer.getConsumerAuthInfo())) {
            return;
        }
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, mcpServer.getName());
        WasmPluginInstance instance = wasmPluginInstanceService.query(targets, BuiltInPluginName.KEY_AUTH, true);
        Objects.requireNonNull(instance);
        ConsumerAuthInfo consumerAuthInfo = mcpServer.getConsumerAuthInfo();

        if (CollectionUtils.isEmpty(consumerAuthInfo.getAllowedConsumers())) {
            instance.getConfigurations().put(ALLOW, Collections.emptyList());
        } else {
            instance.getConfigurations().put(ALLOW, consumerAuthInfo.getAllowedConsumers());
        }
        wasmPluginInstanceService.addOrUpdate(instance);
    }

    private WasmPluginInstance initMcpServerAuthentication(McpServer mcpInstance) {
        if (Objects.isNull(mcpInstance.getConsumerAuthInfo())) {
            return null;
        }
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, mcpInstance.getName());
        WasmPluginInstance instance =
            wasmPluginInstanceService.query(targets, BuiltInPluginName.KEY_AUTH, Boolean.TRUE);
        if (Objects.isNull(instance)) {
            instance = wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.KEY_AUTH);
            instance.setInternal(Boolean.TRUE);
            instance.setTargets(targets);
            instance.setConfigurations(MapUtil.of(ALLOW, Collections.emptyList()));
        }
        instance.setEnabled(mcpInstance.getConsumerAuthInfo().getEnable());
        return wasmPluginInstanceService.addOrUpdate(instance);
    }

    private void sortMcpServers(List<McpServer> mcpServers) {
        if (CollectionUtils.isEmpty(mcpServers)) {
            return;
        }
        mcpServers.sort(Comparator.comparing(McpServer::getName));
    }

    private void deleteMatchRulePath(String name) {
        updateMatchList(matchList -> matchList
            .removeIf(rule -> (generateMcpServerPath(name)).equals(rule.get(MATCH_RULE_PATH_KEY))));
    }

    private void deleteServersConfig(String name) {
        updateServerConfig(servers -> servers.removeIf(server -> server.getName().equals(name)));
    }

    /**
     * get mcp config from higress-config configmap
     *
     * @param configMap higress-config configmap
     * @return McpServerConfig
     */
    protected McpServerConfigMap getMcpConfig(V1ConfigMap configMap) {
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
            for (MatchList obj : mcpConfig.getMatchList()) {
                Map<String, Object> matchListMapFromK8s = matchListsMapFromK8s.get(obj.getMatchRulePath());
                matchListsFromK8s.removeIf(rule -> obj.getMatchRulePath().equals(rule.get(MATCH_RULE_PATH_KEY)));
                matchListsFromK8s.add(obj.fillMap(matchListMapFromK8s));
                matchListUpdated = true;
            }
            // delete
            Set<String> matchListPathSet =
                mcpConfig.getMatchList().stream().map(MatchList::getMatchRulePath).collect(Collectors.toSet());
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
            for (Server obj : mcpConfig.getServers()) {
                Map<String, Object> serverFromK8s = serversMapFromK8s.get(obj.getName());
                serversFromK8s.removeIf(rule -> obj.getName().equals(rule.get(SERVERS_NAME_KEY)));
                serversFromK8s.add(obj.fillMap(serverFromK8s));
                serversUpdated = true;
            }
            // delete
            Set<String> serversNameSet =
                mcpConfig.getServers().stream().map(Server::getName).collect(Collectors.toSet());
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
            throw new BusinessException("Failed to update " + HIGRESS_CONFIG + " config map.", e);
        }
    }

    protected void updateServerConfig(Consumer<List<McpServerConfigMap.Server>> updateFunction) {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
            McpServerConfigMap mcpConfig = getMcpConfig(configMap);
            updateFunction.accept(mcpConfig.getServers());

            updateMcpConfig2ConfigMap(configMap, mcpConfig);
        } catch (Exception e) {
            throw new BusinessException("Failed to update " + HIGRESS_CONFIG + " config map.", e);
        }
    }

    protected void addOrUpdateMatchRulePath(McpServerConfigMap.MatchList matchItem) {
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

    private void updateMatchList(Consumer<List<Map<String, Object>>> updateFunction) {
        try {
            V1ConfigMap configMap = kubernetesClientService.readConfigMap(HIGRESS_CONFIG);
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
            throw new BusinessException("Failed to update " + HIGRESS_CONFIG + " config map.", e);
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

    private WasmPluginInstance buildGlobalKeyAuthRequest() {
        WasmPluginInstance keyAuthInstance =
            WasmPluginInstance.builder().pluginName(BuiltInPluginName.KEY_AUTH).enabled(true).build();
        keyAuthInstance.setGlobalTarget();
        keyAuthInstance.setInternal(true);
        Map<String, Object> configurations = new HashMap<>();
        configurations.put(GLOBAL_AUTH, false);
        configurations.put(IN_HEADER, true);
        configurations.put(IN_QUERY, false);
        configurations.put(KEYS, Lists.newArrayList("Authorization", "x-api-key"));
        keyAuthInstance.setConfigurations(configurations);
        return keyAuthInstance;
    }

    protected Route buildRouteRequest(McpServer mcpInstance) {
        Route route = Route.builder().name(mcpInstance.getName()).build();
        route.setServices(mcpInstance.getServices());
        route.setPath(RoutePredicate.builder().matchType(RoutePredicateTypeEnum.PRE.name())
            .matchValue(generateMcpServerPath(mcpInstance.getName())).build());
        route.setDomains(mcpInstance.getDomains());

        setDefaultConfigs(route, mcpInstance);
        setDefaultLabels(route, mcpInstance);

        route.validate();
        return route;
    }

    private void setDefaultConfigs(Route route, McpServer mcpInstance) {
        Map<String, String> annotationsMap = new TreeMap<>();
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_DESCRIPTION_KEY, mcpInstance.getDescription());
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_KEY, Boolean.TRUE.toString());
        Optional.ofNullable(route.getDomains()).ifPresent(domains -> annotationsMap
            .put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_DOMAINS_KEY, domains.get(0)));
        RoutePredicateTypeEnum predicateTypeEnum = RoutePredicateTypeEnum.fromName(route.getPath().getMatchType());
        Objects.requireNonNull(predicateTypeEnum, "Unknown matchType: " + route.getPath().getMatchType());
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_TYPE_KEY,
            predicateTypeEnum.getAnnotationPrefix());

        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_VALUE_KEY,
            route.getPath().getMatchValue());
        if (StringUtils.isNotBlank(mcpInstance.getUpstreamPathPrefix())) {
            annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_UPSTREAM_TYPE_KEY, "sse");
            annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_ENABLE_REWRITE_KEY,
                Boolean.TRUE.toString());
            annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_PATH_REWRITE_KEY,
                mcpInstance.getUpstreamPathPrefix());
            RewriteConfig rewriteConfig =
                RewriteConfig.builder().path(mcpInstance.getUpstreamPathPrefix()).enabled(Boolean.TRUE).build();
            route.setRewrite(rewriteConfig);
        }

        route.setCustomConfigs(annotationsMap);
    }

    private void setDefaultLabels(Route route, McpServer mcpInstance) {
        Map<String, String> labelsMap = new TreeMap<>();
        labelsMap.put(KubernetesConstants.Label.RESOURCE_DEFINER_KEY, KubernetesConstants.Label.RESOURCE_DEFINER_VALUE);
        labelsMap.put(KubernetesConstants.Label.INTERNAL_KEY, Boolean.TRUE.toString());
        labelsMap.put(KubernetesConstants.Label.RESOURCE_BIZ_TYPE_KEY, MCP_SERVER_BIZ_TYPE_VALUE);
        labelsMap.put(McpServerConstants.Label.RESOURCE_MCP_SERVER_TYPE_KEY, mcpInstance.getType().name());
        route.setCustomLabels(labelsMap);
    }

    protected McpServerConfigMap.MatchList generateMatchList(McpServer mcpInstance) {
        McpServerConfigMap.MatchList result = new McpServerConfigMap.MatchList();

        result.setMatchRulePath(generateMcpServerPath(mcpInstance.getName()));
        result.setMatchRuleDomain(Separators.ASTERISK);
        result.setMatchRuleType(RoutePredicateTypeEnum.PRE.getAnnotationPrefix());

        return result;
    }

    protected String generateMcpServerPath(String mcpServerName) {
        return String.format("%s/%s", MCP_SERVER_PATH_PRE, mcpServerName);
    }

    private void filterMcpServers(List<McpServer> resultList, McpServerPageQuery query) {
        if (CollectionUtils.isEmpty(resultList)) {
            return;
        }
        String fuzzyServerName = query.getMcpServerName();
        if (StringUtils.isNotBlank(fuzzyServerName)) {
            resultList.removeIf(mcpServer -> !StringUtils.contains(mcpServer.getName(), fuzzyServerName));
        }

        String type = query.getType();
        if (StringUtils.isNotBlank(type)) {
            McpServerTypeEnum mcpServerTypeEnum = McpServerTypeEnum.fromName(type);
            resultList.removeIf(mcpServer -> !mcpServerTypeEnum.equals(mcpServer.getType()));
        }
    }

    protected McpServer routeToMcpServer(Route route) {
        return McpServiceContextImpl.routeToMcpServer(route);
    }

    protected McpServer routeToMcpServerWithAuth(Route route) {
        WasmPluginInstance instance = wasmPluginInstanceService
            .query(MapUtil.of(WasmPluginInstanceScope.ROUTE, route.getName()), BuiltInPluginName.KEY_AUTH, true);
        route.setAuthConfig(RouteAuthConfig.builder().enabled(false).build());
        if (Objects.nonNull(instance)) {
            route.setAuthConfig(generateAuthConfig(instance));
        }
        return McpServiceContextImpl.routeToMcpServer(route);
    }

    private RouteAuthConfig generateAuthConfig(WasmPluginInstance instance) {
        RouteAuthConfig routeAuthConfig = new RouteAuthConfig();
        routeAuthConfig.setEnabled(instance.getEnabled());

        Map<String, Object> configurations = instance.getConfigurations();
        if (Objects.isNull(configurations)) {
            routeAuthConfig.setAllowedConsumers(Lists.newArrayList());
        } else {
            Object allowObj = instance.getConfigurations().get(ALLOW);
            if (!(allowObj instanceof List<?>)) {
                routeAuthConfig.setAllowedConsumers(Lists.newArrayList());
            } else {
                List<?> allowList = (List<?>)allowObj;
                List<String> collectList = allowList.stream().filter(a -> a instanceof String).map(a -> (String)a)
                    .collect(Collectors.toList());
                routeAuthConfig.setAllowedConsumers(collectList);
            }
        }
        return routeAuthConfig;
    }

}
