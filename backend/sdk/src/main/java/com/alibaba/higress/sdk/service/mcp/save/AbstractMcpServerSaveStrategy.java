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

import static com.alibaba.higress.sdk.model.mcp.McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE;

import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.authorization.CredentialTypeEnum;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationService;
import com.alibaba.higress.sdk.service.authorization.AuthorizationServiceFactory;
import com.alibaba.higress.sdk.service.authorization.RelationshipConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

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
    protected final RouteService routeService;
    protected final WasmPluginInstanceService wasmPluginInstanceService;
    protected final AuthorizationServiceFactory authorizationServiceFactory;
    protected final McpServerConfigMapHelper mcpServerConfigMapHelper;

    public AbstractMcpServerSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.routeService = routeService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        this.authorizationServiceFactory = new AuthorizationServiceFactory(wasmPluginInstanceService);
        this.mcpServerConfigMapHelper = new McpServerConfigMapHelper(kubernetesClientService);

    }

    @Override
    public McpServer save(McpServer mcpInstance) {
        saveRoute(mcpInstance);
        buildMcpServer(mcpInstance);
        buildAuthentication(mcpInstance);
        return mcpInstance;
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
    public McpServer saveWithAuthorization(McpServer mcpInstance) {
        saveRoute(mcpInstance);
        buildMcpServer(mcpInstance);
        buildAuthentication(mcpInstance);
        buildAuthorization(mcpInstance);
        return mcpInstance;
    }

    private void buildMcpServer(McpServer mcpInstance) {
        mcpServerConfigMapHelper.initMcpServerConfig();
        saveMcpServerConfig(mcpInstance);
    }

    protected abstract void saveMcpServerConfig(McpServer mcpInstance);

    /**
     * build and save route info
     * 
     * @param mcpInstance
     */
    private Route saveRoute(McpServer mcpInstance) {
        Route routeRequest = buildRouteRequest(mcpInstance);
        routeRequest.validate();
        V1Ingress ingress = kubernetesModelConverter.route2Ingress(routeRequest);

        Route existRoute = routeService.query(routeRequest.getName());
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
                    "Error occurs when updating the ingress generated by route with name: " + routeRequest.getName(),
                    e);
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
        if (Objects.isNull(mcpInstance.getConsumerAuthInfo())) {
            return;
        }
        String type = mcpInstance.getConsumerAuthInfo().getType();
        CredentialTypeEnum credentialTypeEnum =
            StringUtils.isBlank(type) ? CredentialTypeEnum.KEY_AUTH : CredentialTypeEnum.fromType(type);
        AuthorizationService service = authorizationServiceFactory.getService(credentialTypeEnum);

        String routeName = McpServerHelper.mcpServerName2RouteName(mcpInstance.getName());
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName);
        service.changeEnableStatus(targets, mcpInstance.getConsumerAuthInfo().getEnable());
    }

    private void buildAuthorization(McpServer mcpServer) {
        if (Objects.isNull(mcpServer.getConsumerAuthInfo())
            || BooleanUtils.isFalse(mcpServer.getConsumerAuthInfo().getEnable())) {
            return;
        }
        String routeName = McpServerHelper.mcpServerName2RouteName(mcpServer.getName());

        CredentialTypeEnum credentialTypeEnum = CredentialTypeEnum.fromType(mcpServer.getConsumerAuthInfo().getType());
        AuthorizationService authorizationService = authorizationServiceFactory.getService(credentialTypeEnum);
        authorizationService.unbindAll(routeName);
        authorizationService.bindList(RelationshipConverter.convert(routeName, mcpServer.getConsumerAuthInfo()));
    }

    protected Route buildRouteRequest(McpServer mcpInstance) {
        String routeName = McpServerHelper.mcpServerName2RouteName(mcpInstance.getName());
        Route route = Route.builder().name(routeName).build();
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
        String matchRuleDomains = Separators.ASTERISK;
        if (CollectionUtils.isNotEmpty(route.getDomains())) {
            route.getDomains().removeIf(StringUtils::isBlank);
            matchRuleDomains = String.join(Separators.COMMA, route.getDomains());
        }
        annotationsMap.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_DOMAINS_KEY, matchRuleDomains);
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
