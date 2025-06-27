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
package com.alibaba.higress.sdk.service.mcp.save;

import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.ALLOW;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_HEADER;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_QUERY;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.KEYS;
import static com.alibaba.higress.sdk.model.mcp.McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.TreeMap;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationOfKeyAuthServiceImpl;
import com.alibaba.higress.sdk.service.authorization.AuthorizationService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.google.common.collect.Lists;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

/**
 * @author HecarimV
 */
@Slf4j
public abstract class AbstractMcpServerSaveStrategy implements McpServerSaveStrategy {

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
    protected final McpServerConfigMapHelper mcpServerConfigMapHelper;

    public AbstractMcpServerSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        this.authorizationService = new AuthorizationOfKeyAuthServiceImpl(wasmPluginInstanceService);
        this.routeService = routeService;
        this.mcpServerConfigMapHelper = new McpServerConfigMapHelper(kubernetesClientService);

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
    public McpServer save(McpServer mcpInstance) {
        saveRoute(mcpInstance);
        buildMcpServer(mcpInstance);
        buildAuthentication(mcpInstance);
        return mcpInstance;
    }

    @Override
    public McpServer saveWithAuthorization(McpServer mcpInstance) {
        saveRoute(mcpInstance);
        buildMcpServer(mcpInstance);
        buildAuthentication(mcpInstance);
        buildAuthorization(mcpInstance);
        return mcpInstance;
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
            .matchValue(McpServerConfigMapHelper.generateMcpServerPath(mcpInstance.getName())).build());
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

}
