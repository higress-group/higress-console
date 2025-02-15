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
package com.alibaba.higress.sdk.service.ai;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.constant.plugin.config.AiStatisticsConfig;
import com.alibaba.higress.sdk.constant.plugin.config.ModelMapperConfig;
import com.alibaba.higress.sdk.constant.plugin.config.ModelRouterConfig;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.AiModelPredicate;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.ai.AiRouteAuthConfig;
import com.alibaba.higress.sdk.model.ai.AiRouteFallbackConfig;
import com.alibaba.higress.sdk.model.ai.AiRouteFallbackStrategy;
import com.alibaba.higress.sdk.model.ai.AiUpstream;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;
import com.alibaba.higress.sdk.util.StringUtil;
import com.google.common.annotations.VisibleForTesting;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AiRouteServiceImpl implements AiRouteService {

    private static final String ROUTE_FALLBACK_ENVOY_FILTER_CONFIG_PATH = "/templates/envoyfilter-route-fallback.yaml";

    private static final Map<String, String> AI_ROUTE_LABEL_SELECTORS =
        Map.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY, KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_AI_ROUTE);

    private static final RoutePredicate DEFAULT_PATH_PREDICATE =
        new RoutePredicate(RoutePredicateTypeEnum.PRE.name(), "/", true);

    private final KubernetesModelConverter kubernetesModelConverter;

    private final KubernetesClientService kubernetesClientService;

    private final RouteService routeService;

    private final LlmProviderService llmProviderService;

    private final ConsumerService consumerService;

    private final WasmPluginInstanceService wasmPluginInstanceService;

    private final String routeFallbackEnvoyFilterConfig;

    public AiRouteServiceImpl(KubernetesModelConverter kubernetesModelConverter,
        KubernetesClientService kubernetesClientService, RouteService routeService,
        LlmProviderService llmProviderService, ConsumerService consumerService,
        WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.kubernetesClientService = kubernetesClientService;
        this.routeService = routeService;
        this.llmProviderService = llmProviderService;
        this.consumerService = consumerService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;

        try {
            this.routeFallbackEnvoyFilterConfig =
                IOUtils.resourceToString(ROUTE_FALLBACK_ENVOY_FILTER_CONFIG_PATH, StandardCharsets.UTF_8);
            V1alpha3EnvoyFilter filter =
                kubernetesClientService.loadFromYaml(routeFallbackEnvoyFilterConfig, V1alpha3EnvoyFilter.class);
            assert filter != null;
        } catch (IOException e) {
            throw new IllegalStateException("Error occurs when loading route fallback envoy filter  from resource.", e);
        }
    }

    @Override
    public AiRoute add(AiRoute route) {
        fillDefaultValues(route);

        V1ConfigMap configMap = kubernetesModelConverter.aiRoute2ConfigMap(route);
        V1ConfigMap newConfigMap;
        try {
            newConfigMap = kubernetesClientService.createConfigMap(configMap);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding a new AI route.", e);
        }

        writeAiRouteResources(route);
        writeAiRouteFallbackResources(route);

        return configMap2AiRoute(newConfigMap);
    }

    @Override
    public PaginatedResult<AiRoute> list(CommonPageQuery query) {
        List<V1ConfigMap> configMaps;
        try {
            configMaps = kubernetesClientService.listConfigMap(AI_ROUTE_LABEL_SELECTORS);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing ConfigMap.", e);
        }
        return PaginatedResult.createFromFullList(configMaps, query, this::configMap2AiRoute);
    }

    @Override
    public AiRoute query(String routeName) {
        V1ConfigMap configMap;
        String configMapName = kubernetesModelConverter.aiRouteName2ConfigMapName(routeName);
        try {
            configMap = kubernetesClientService.readConfigMap(configMapName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the ConfigMap with name: " + configMapName, e);
        }
        return Optional.ofNullable(configMap).map(this::configMap2AiRoute).orElse(null);
    }

    @Override
    public void delete(String routeName) {
        deleteAiRouteResources(routeName);

        String configMapName = kubernetesModelConverter.aiRouteName2ConfigMapName(routeName);
        try {
            kubernetesClientService.deleteConfigMap(configMapName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ConfigMap with name: " + configMapName, e);
        }
    }

    @Override
    public AiRoute update(AiRoute route) {
        fillDefaultValues(route);

        V1ConfigMap configMap = kubernetesModelConverter.aiRoute2ConfigMap(route);
        V1ConfigMap updatedConfigMap;
        try {
            updatedConfigMap = kubernetesClientService.replaceConfigMap(configMap);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when replacing the ConfigMap generated by AI route: " + route.getName(), e);
        }

        writeAiRouteResources(route);
        writeAiRouteFallbackResources(route);

        return configMap2AiRoute(updatedConfigMap);
    }

    private AiRoute configMap2AiRoute(V1ConfigMap configMap) {
        AiRoute route = kubernetesModelConverter.configMap2AiRoute(configMap);
        if (route != null) {
            fillDefaultValues(route);
        }
        return route;
    }

    private void fillDefaultValues(AiRoute route) {
        if (route.getPathPredicate() == null) {
            route.setPathPredicate(DEFAULT_PATH_PREDICATE);
        }
        fillDefaultWeights(route.getUpstreams());
        AiRouteFallbackConfig fallbackConfig = route.getFallbackConfig();
        if (fallbackConfig != null && Boolean.TRUE.equals(fallbackConfig.getEnabled())) {
            fillDefaultWeights(fallbackConfig.getUpstreams());
            if (StringUtils.isEmpty(fallbackConfig.getFallbackStrategy())) {
                fallbackConfig.setFallbackStrategy(AiRouteFallbackStrategy.RANDOM);
            }
        }
    }

    private void fillDefaultWeights(List<AiUpstream> upstreams) {
        if (upstreams == null || upstreams.size() != 1) {
            return;
        }
        AiUpstream upstream = upstreams.get(0);
        if (upstream != null) {
            upstream.setWeight(100);
        }
    }

    private void writeAiRouteResources(AiRoute aiRoute) {
        String routeName = buildRouteResourceName(aiRoute.getName());
        Route route = buildRoute(routeName, aiRoute);
        setUpstreams(route, aiRoute.getUpstreams());
        saveRoute(route);
        writeAuthConfigResources(routeName, aiRoute.getAuthConfig());
        writeModelRouteResources(aiRoute.getModelPredicates());
        writeModelMappingResources(routeName, aiRoute.getUpstreams());
        writeAiStatisticsResources(routeName);
    }

    private void writeAiRouteFallbackResources(AiRoute aiRoute) {
        AiRouteFallbackConfig fallbackConfig = aiRoute.getFallbackConfig();
        if (fallbackConfig == null || !Boolean.TRUE.equals(fallbackConfig.getEnabled())
            || CollectionUtils.isEmpty(fallbackConfig.getUpstreams())) {
            deleteFallbackRouteResources(aiRoute.getName());
            return;
        }

        final String originalRouteName = buildRouteResourceName(aiRoute.getName());

        final String fallbackRouteName = buildFallbackRouteResourceName(aiRoute.getName());
        Route route = buildRoute(fallbackRouteName, aiRoute);
        KeyedRoutePredicate fallbackHeaderPredicate = new KeyedRoutePredicate(HigressConstants.FALLBACK_FROM_HEADER);
        fallbackHeaderPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.name());
        fallbackHeaderPredicate.setMatchValue(originalRouteName);
        fallbackHeaderPredicate.setCaseSensitive(true);
        if (route.getHeaders() == null) {
            route.setHeaders(new ArrayList<>());
        } else {
            route.setHeaders(new ArrayList<>(route.getHeaders()));
        }
        route.getHeaders().add(fallbackHeaderPredicate);
        String fallbackStrategy = fallbackConfig.getFallbackStrategy();
        List<AiUpstream> fallbackUpStreams;
        if (StringUtils.isEmpty(fallbackStrategy) || AiRouteFallbackStrategy.RANDOM.equals(fallbackStrategy)) {
            fallbackUpStreams = fallbackConfig.getUpstreams();
            fallbackUpStreams.forEach(upstream -> upstream.setWeight(1));
        } else if (AiRouteFallbackStrategy.SEQUENCE.equals(fallbackStrategy)) {
            fallbackUpStreams = List.of(fallbackConfig.getUpstreams().get(0));
        } else {
            throw new BusinessException("Unknown fallback strategy: " + fallbackStrategy);
        }
        setUpstreams(route, fallbackUpStreams);
        saveRoute(route);

        StringBuilder envoyFilterBuilder = new StringBuilder(routeFallbackEnvoyFilterConfig);
        StringUtil.replace(envoyFilterBuilder, "${name}", originalRouteName);
        StringUtil.replace(envoyFilterBuilder, "${routeName}", originalRouteName);
        StringUtil.replace(envoyFilterBuilder, "${fallbackHeader}", HigressConstants.FALLBACK_FROM_HEADER);
        V1alpha3EnvoyFilter envoyFilter =
            kubernetesClientService.loadFromYaml(envoyFilterBuilder.toString(), V1alpha3EnvoyFilter.class);
        try {
            V1alpha3EnvoyFilter existedFilter =
                kubernetesClientService.readEnvoyFilter(envoyFilter.getMetadata().getName());
            if (existedFilter == null) {
                kubernetesClientService.createEnvoyFilter(envoyFilter);
            } else {
                envoyFilter.getMetadata().setResourceVersion(existedFilter.getMetadata().getResourceVersion());
                kubernetesClientService.replaceEnvoyFilter(envoyFilter);
            }
        } catch (ApiException e) {
            throw new BusinessException(
                "Error occurs when writing the fallback EnvoyFilter for AI route: " + aiRoute.getName(), e);
        }

        writeAuthConfigResources(fallbackRouteName, aiRoute.getAuthConfig());
        writeModelMappingResources(fallbackRouteName, fallbackUpStreams);
        writeAiStatisticsResources(fallbackRouteName);
    }

    private void writeAuthConfigResources(String routeName, AiRouteAuthConfig authConfig) {
        List<String> allowedConsumers = authConfig != null && Boolean.TRUE.equals(authConfig.getEnabled())
            ? authConfig.getAllowedConsumers() : List.of();
        consumerService.updateAllowList(WasmPluginInstanceScope.ROUTE, routeName, allowedConsumers);
    }

    private void writeModelRouteResources(List<AiModelPredicate> modelPredicates) {
        if (CollectionUtils.isEmpty(modelPredicates)) {
            return;
        }

        final String pluginName = BuiltInPluginName.MODEL_ROUTER;
        WasmPluginInstance instance =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, pluginName, true);
        if (instance == null) {
            instance = wasmPluginInstanceService.createEmptyInstance(pluginName);
            instance.setInternal(true);
            instance.setGlobalTarget();
        }
        instance.setEnabled(true);

        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            // Just in case it is a readonly empty map.
            configurations = new HashMap<>();
            instance.setConfigurations(configurations);
        }

        configurations.put(ModelRouterConfig.MODEL_TO_HEADER, HigressConstants.MODEL_ROUTING_HEADER);

        wasmPluginInstanceService.addOrUpdate(instance);
    }

    private void writeModelMappingResources(String routeName, List<AiUpstream> upstreams) {
        if (CollectionUtils.isEmpty(upstreams)) {
            wasmPluginInstanceService.delete(WasmPluginInstanceScope.ROUTE, routeName, BuiltInPluginName.MODEL_MAPPER);
            return;
        }

        final String pluginName = BuiltInPluginName.MODEL_MAPPER;
        for (AiUpstream upstream : upstreams) {
            UpstreamService upstreamService = llmProviderService.buildUpstreamService(upstream.getProvider());

            Map<WasmPluginInstanceScope, String> targets = Map.of(WasmPluginInstanceScope.ROUTE, routeName,
                WasmPluginInstanceScope.SERVICE, upstreamService.getName());

            if (MapUtils.isEmpty(upstream.getModelMapping())) {
                wasmPluginInstanceService.delete(targets, pluginName);
                continue;
            }

            WasmPluginInstance instance = wasmPluginInstanceService.query(targets, pluginName, true);
            if (instance == null) {
                instance = wasmPluginInstanceService.createEmptyInstance(pluginName);
                instance.setInternal(true);
                instance.setTargets(targets);
            }
            instance.setEnabled(true);

            Map<String, Object> configurations = instance.getConfigurations();
            if (MapUtils.isEmpty(configurations)) {
                // Just in case it is a readonly empty map.
                configurations = new HashMap<>();
                instance.setConfigurations(configurations);
            }

            configurations.put(ModelMapperConfig.MODEL_MAPPING, new HashMap<>(upstream.getModelMapping()));

            wasmPluginInstanceService.addOrUpdate(instance);
        }
    }

    private void writeAiStatisticsResources(String routeName) {
        WasmPluginInstance existedInstance = wasmPluginInstanceService.query(WasmPluginInstanceScope.ROUTE, routeName,
            BuiltInPluginName.AI_STATISTICS, false);
        if (existedInstance != null) {
            return;
        }

        WasmPluginInstance instance = wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_STATISTICS);
        instance.setTarget(WasmPluginInstanceScope.ROUTE, routeName);
        instance.setEnabled(true);
        instance.setInternal(false);

        Map<String, Object> questionAttribute = AiStatisticsConfig.buildAttribute("question",
            AiStatisticsConfig.ValueSource.REQUEST_BODY, "messages.@reverse.0.content", null, true, null);
        Map<String, Object> streamingAnswerAttribute =
            AiStatisticsConfig.buildAttribute("answer", AiStatisticsConfig.ValueSource.RESPONSE_STREAMING_BODY,
                "choices.0.delta.content", AiStatisticsConfig.Rule.APPEND, true, null);
        Map<String, Object> nonStreamingAnswerAttribute = AiStatisticsConfig.buildAttribute("answer",
            AiStatisticsConfig.ValueSource.RESPONSE_BODY, "choices.0.message.content", null, true, null);
        List<Map<String, Object>> attributes =
            List.of(questionAttribute, streamingAnswerAttribute, nonStreamingAnswerAttribute);
        instance.setConfigurations(Map.of(AiStatisticsConfig.ATTRIBUTES, attributes));

        wasmPluginInstanceService.addOrUpdate(instance);
    }

    private Route buildRoute(String routeName, AiRoute aiRoute) {
        Route route = new Route();
        route.setName(routeName);
        route.setPath(Optional.ofNullable(aiRoute.getPathPredicate()).orElse(DEFAULT_PATH_PREDICATE));
        route.setDomains(aiRoute.getDomains());

        List<KeyedRoutePredicate> headerPredicates = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(aiRoute.getHeaderPredicates())) {
            headerPredicates.addAll(aiRoute.getHeaderPredicates());
        }
        List<AiModelPredicate> modelPredicates = aiRoute.getModelPredicates();
        if (CollectionUtils.isNotEmpty(modelPredicates)) {
            KeyedRoutePredicate headerRoutePredicate = new KeyedRoutePredicate(HigressConstants.MODEL_ROUTING_HEADER);
            if (modelPredicates.size() == 1) {
                AiModelPredicate modelPredicate = modelPredicates.get(0);
                headerRoutePredicate.setMatchType(modelPredicate.getMatchType());
                headerRoutePredicate.setMatchValue(modelPredicate.getMatchValue());
            } else {
                headerRoutePredicate.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
                headerRoutePredicate.setMatchValue(buildModelRoutingHeaderRegex(modelPredicates));
            }
            headerPredicates.add(headerRoutePredicate);
        }
        route.setHeaders(headerPredicates);

        route.setUrlParams(aiRoute.getUrlParamPredicates());

        return route;
    }

    @VisibleForTesting
    String buildModelRoutingHeaderRegex(List<AiModelPredicate> modelPredicates) {
        StringBuilder regexBuilder = new StringBuilder();
        regexBuilder.append("^(");
        for (int i = 0; i < modelPredicates.size(); i++) {
            AiModelPredicate modelPredicate = modelPredicates.get(i);
            if (i > 0) {
                regexBuilder.append("|");
            }
            if (modelPredicate.getMatchType().equals(RoutePredicateTypeEnum.REGULAR.toString())) {
                // Shouldn't happen as we have checked it in the caller.
                throw new IllegalArgumentException(
                    "Regular expression match is not supported for model routing header.");
            }
            regexBuilder.append(escapeForRegexMatch(modelPredicate.getMatchValue()));
            if (RoutePredicateTypeEnum.PRE == RoutePredicateTypeEnum.fromName(modelPredicate.getMatchType())) {
                regexBuilder.append(".*");
            }
        }
        regexBuilder.append(")");
        return regexBuilder.toString();
    }

    @VisibleForTesting
    String escapeForRegexMatch(String value) {
        return value.replaceAll("[\\[\\]{}()^$|*+?.\\\\]", "\\\\$0");
    }

    private void setUpstreams(Route route, List<AiUpstream> upstreams) {
        if (CollectionUtils.isEmpty(upstreams)) {
            route.setServices(List.of());
            return;
        }

        List<UpstreamService> services = new ArrayList<>(upstreams.size());
        for (AiUpstream upstream : upstreams) {
            UpstreamService service = llmProviderService.buildUpstreamService(upstream.getProvider());
            service.setVersion(null);
            service.setWeight(upstream.getWeight());
            services.add(service);
        }
        route.setServices(services);
    }

    private void deleteAiRouteResources(String aiRouteName) {
        String resourceName = buildRouteResourceName(aiRouteName);
        routeService.delete(resourceName);

        try {
            kubernetesClientService.deleteEnvoyFilter(resourceName);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND) {
                throw new BusinessException("Error occurs when deleting the EnvoyFilter with name: " + resourceName, e);
            }
        }

        deleteFallbackRouteResources(aiRouteName);
    }

    private void deleteFallbackRouteResources(String aiRouteName) {
        final String originalResourceName = buildRouteResourceName(aiRouteName);
        try {
            kubernetesClientService.deleteEnvoyFilter(originalResourceName);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND) {
                throw new BusinessException(
                    "Error occurs when deleting the fallback EnvoyFilter: " + originalResourceName, e);
            }
        }

        String fallbackResourceName = buildFallbackRouteResourceName(aiRouteName);
        routeService.delete(fallbackResourceName);
    }

    private void saveRoute(Route route) {
        Route existedRoute = routeService.query(route.getName());
        if (existedRoute == null) {
            routeService.add(route);
        } else {
            route.setVersion(existedRoute.getVersion());
            routeService.update(route);
        }
    }

    private static String buildRouteResourceName(String routeName) {
        return CommonKey.AI_ROUTE_PREFIX + routeName + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }

    private static String buildFallbackRouteResourceName(String routeName) {
        return CommonKey.AI_ROUTE_PREFIX + routeName + HigressConstants.FALLBACK_ROUTE_NAME_SUFFIX
            + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
    }
}
