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
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
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
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;
import com.alibaba.higress.sdk.util.StringUtil;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AiRouteServiceImpl implements AiRouteService {

    private static final String ROUTE_FALLBACK_ENVOY_FILTER_CONFIG_PATH = "/templates/envoyfilter-route-fallback.yaml";

    private static final Map<String, String> AI_ROUTE_LABEL_SELECTORS =
        Map.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY, KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_AI_ROUTE);

    private final KubernetesModelConverter kubernetesModelConverter;

    private final KubernetesClientService kubernetesClientService;

    private final RouteService routeService;

    private final LlmProviderService llmProviderService;

    private final ConsumerService consumerService;

    private final String routeFallbackEnvoyFilterConfig;

    public AiRouteServiceImpl(KubernetesModelConverter kubernetesModelConverter,
        KubernetesClientService kubernetesClientService, RouteService routeService,
        LlmProviderService llmProviderService, ConsumerService consumerService) {
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.kubernetesClientService = kubernetesClientService;
        this.routeService = routeService;
        this.llmProviderService = llmProviderService;
        this.consumerService = consumerService;

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

        return kubernetesModelConverter.configMap2AiRoute(newConfigMap);
    }

    @Override
    public PaginatedResult<AiRoute> list(CommonPageQuery query) {
        List<V1ConfigMap> configMaps;
        try {
            configMaps = kubernetesClientService.listConfigMap(AI_ROUTE_LABEL_SELECTORS);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing ConfigMap.", e);
        }
        return PaginatedResult.createFromFullList(configMaps, query, kubernetesModelConverter::configMap2AiRoute);
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
        return Optional.ofNullable(configMap).map(kubernetesModelConverter::configMap2AiRoute).orElse(null);
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

        return kubernetesModelConverter.configMap2AiRoute(updatedConfigMap);
    }

    private void writeAiRouteResources(AiRoute aiRoute) {
        String routeName = aiRoute.getName() + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
        Route route = buildRoute(routeName, aiRoute);
        setUpstreams(route, aiRoute.getUpstreams());
        saveRoute(route);
        writeAuthConfigResources(routeName, aiRoute.getAuthConfig());
    }

    private void writeAiRouteFallbackResources(AiRoute aiRoute) {
        AiRouteFallbackConfig fallbackConfig = aiRoute.getFallbackConfig();
        if (fallbackConfig == null || !Boolean.TRUE.equals(fallbackConfig.getEnabled())
            || CollectionUtils.isEmpty(fallbackConfig.getUpstreams())) {
            return;
        }

        final String originalRouteName = aiRoute.getName() + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;

        final String fallbackRouteName = aiRoute.getName() + HigressConstants.FALLBACK_ROUTE_NAME_SUFFIX
            + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
        Route route = buildRoute(fallbackRouteName, aiRoute);
        KeyedRoutePredicate fallbackHeaderPredicate = new KeyedRoutePredicate(HigressConstants.FALLBACK_FROM_HEADER);
        fallbackHeaderPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.name());
        fallbackHeaderPredicate.setMatchValue(originalRouteName);
        fallbackHeaderPredicate.setCaseSensitive(true);
        route.setHeaders(List.of(fallbackHeaderPredicate));
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
    }

    private void writeAuthConfigResources(String routeName, AiRouteAuthConfig authConfig) {
        List<String> allowedConsumers = authConfig != null && Boolean.TRUE.equals(authConfig.getEnabled())
            ? authConfig.getAllowedConsumers() : List.of();
        consumerService.updateAllowList(WasmPluginInstanceScope.ROUTE, routeName, allowedConsumers);
    }

    private Route buildRoute(String routeName, AiRoute aiRoute) {
        Route route = new Route();
        route.setName(routeName);
        route.setPath(new RoutePredicate(RoutePredicateTypeEnum.PRE.name(), "/", true));
        route.setDomains(aiRoute.getDomains());
        return route;
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
        String routeName = aiRouteName + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
        routeService.delete(routeName);

        try {
            kubernetesClientService.deleteEnvoyFilter(routeName);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND) {
                throw new BusinessException("Error occurs when deleting the EnvoyFilter with name: " + routeName, e);
            }
        }

        String fallbackRouteName =
            aiRouteName + HigressConstants.FALLBACK_ROUTE_NAME_SUFFIX + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;
        routeService.delete(fallbackRouteName);
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
}
