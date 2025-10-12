/**
 * AI路由服务实现类
 * 
 * 实现了AiRouteService接口，负责AI路由的完整生命周期管理，包括：
 * - AI路由的创建、更新、删除和查询操作
 * - 相关Kubernetes资源的管理（ConfigMap、EnvoyFilter等）
 * - WASM插件实例的配置和管理
 * - 模型路由和映射功能的实现
 * - 故障转移机制的支持
 * 
 * 该类协调多个服务组件，确保AI路由配置的正确性和一致性。
 */
package com.alibaba.higress.sdk.service.ai;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
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
import com.alibaba.higress.sdk.model.ai.AiRouteFallbackConfig;
import com.alibaba.higress.sdk.model.ai.AiRouteFallbackStrategy;
import com.alibaba.higress.sdk.model.ai.AiUpstream;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;
import com.alibaba.higress.sdk.util.StringUtil;
import com.google.common.annotations.VisibleForTesting;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;

import static com.alibaba.higress.sdk.constant.HigressConstants.VALID_FALLBACK_RESPONSE_CODES;

/**
 * AI路由服务实现类
 * 
 * 使用SLF4J日志框架记录操作日志，实现了AI路由服务的所有核心业务逻辑。
 * 负责协调Kubernetes资源管理、WASM插件配置、路由规则构建等复杂操作。
 */
@Slf4j
public class AiRouteServiceImpl implements AiRouteService {

/**
     * 路由故障转移EnvoyFilter配置文件路径
     * 
     * 定义了用于生成路由故障转移功能的EnvoyFilter配置的YAML模板文件路径。
     * 该模板用于在请求失败时自动切换到备用路由。
     */
    private static final String ROUTE_FALLBACK_ENVOY_FILTER_CONFIG_PATH = "/templates/envoyfilter-route-fallback.yaml";

    /**
     * AI路由ConfigMap标签选择器
     * 
     * 用于在Kubernetes中标识和查询AI路由相关的ConfigMap资源。
     * 通过特定的标签键值对来筛选AI路由配置。
     */
    private static final Map<String, String> AI_ROUTE_LABEL_SELECTORS =
        MapUtil.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY,
                KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_AI_ROUTE);

    /**
     * 默认路径谓词
     * 
     * 当AI路由没有指定路径匹配条件时使用的默认谓词。
     * 配置为前缀匹配根路径"/"，不区分大小写。
     */
    private static final RoutePredicate DEFAULT_PATH_PREDICATE =
        new RoutePredicate(RoutePredicateTypeEnum.PRE.name(), "/", true);

    private final KubernetesModelConverter kubernetesModelConverter;

    private final KubernetesClientService kubernetesClientService;

    private final RouteService routeService;

    private final LlmProviderService llmProviderService;

    private final WasmPluginInstanceService wasmPluginInstanceService;

    private final VelocityEngine velocityEngine;

    private final Template routeFallbackEnvoyFilterConfigTemplate;

/**
     * AI路由服务构造函数
     * 
     * 初始化AI路由服务所需的所有依赖组件：
     * - Kubernetes模型转换器：用于对象转换
     * - Kubernetes客户端服务：用于操作K8s资源
     * - 路由服务：用于管理标准路由
     * - LLM提供者服务：用于管理AI提供者
     * - WASM插件实例服务：用于管理插件配置
     * 
     * 同时初始化Velocity模板引擎，用于生成EnvoyFilter配置，
     * 并预加载路由故障转移配置模板进行验证。
     * 
     * @param kubernetesModelConverter Kubernetes模型转换器
     * @param kubernetesClientService Kubernetes客户端服务
     * @param routeService 路由服务
     * @param llmProviderService LLM提供者服务
     * @param wasmPluginInstanceService WASM插件实例服务
     * @throws IllegalStateException 如果模板加载失败
     */
    public AiRouteServiceImpl(KubernetesModelConverter kubernetesModelConverter,
        KubernetesClientService kubernetesClientService, RouteService routeService,
        LlmProviderService llmProviderService, WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.kubernetesClientService = kubernetesClientService;
        this.routeService = routeService;
        this.llmProviderService = llmProviderService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        
        // 初始化Velocity模板引擎
        this.velocityEngine = new VelocityEngine();
        velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
        velocityEngine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
        velocityEngine.init();

        try {
            // 加载路由故障转移配置模板
            this.routeFallbackEnvoyFilterConfigTemplate =
                velocityEngine.getTemplate(ROUTE_FALLBACK_ENVOY_FILTER_CONFIG_PATH, StandardCharsets.UTF_8.name());
            
            // 预加载和验证模板
            String routeFallbackEnvoyFilterConfig = getRouteFallbackEnvoyFilterConfig(new ArrayList<>(
                    VALID_FALLBACK_RESPONSE_CODES));
            V1alpha3EnvoyFilter filter =
                kubernetesClientService.loadFromYaml(routeFallbackEnvoyFilterConfig, V1alpha3EnvoyFilter.class);
            assert filter != null;
        } catch (Exception e) {
            throw new IllegalStateException("Error occurs when loading route fallback envoy filter  from resource.", e);
        }
    }

/**
     * 添加AI路由
     * 
     * 创建新的AI路由配置，执行以下操作：
     * 1. 填充默认值：为路由配置设置默认参数
     * 2. 写入AI路由资源：创建相关的Kubernetes资源（路由、插件配置等）
     * 3. 写入故障转移资源：如果配置了故障转移，创建相应的EnvoyFilter
     * 4. 创建ConfigMap：将AI路由配置持久化到Kubernetes ConfigMap
     * 
     * @param route AI路由对象，包含要创建的路由配置
     * @return 创建成功的AI路由对象
     * @throws ResourceConflictException 如果路由名称已存在
     * @throws BusinessException 如果创建过程中发生其他错误
     */
    @Override
    public AiRoute add(AiRoute route) {
        // 填充默认值
        fillDefaultValues(route);

        // 写入相关资源
        writeAiRouteResources(route);
        writeAiRouteFallbackResources(route);

        // 创建ConfigMap
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

        return configMap2AiRoute(newConfigMap);
    }

/**
     * 查询AI路由列表
     * 
     * 分页查询AI路由配置列表，执行以下步骤：
     * 1. 查询Kubernetes ConfigMap：使用标签选择器获取所有AI路由配置
     * 2. 转换为AI路由对象：将ConfigMap列表转换为AI路由对象列表
     * 3. 应用分页逻辑：根据查询条件进行分页处理
     * 
     * @param query 分页查询条件，包含页码、每页大小等信息
     * @return 分页查询结果，包含AI路由列表和分页信息
     * @throws BusinessException 如果查询过程中发生错误
     */
    @Override
    public PaginatedResult<AiRoute> list(CommonPageQuery query) {
        List<V1ConfigMap> configMaps;
        try {
            // 查询所有AI路由ConfigMap
            configMaps = kubernetesClientService.listConfigMap(AI_ROUTE_LABEL_SELECTORS);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing ConfigMap.", e);
        }
        
        // 转换为分页结果
        return PaginatedResult.createFromFullList(configMaps, query, this::configMap2AiRoute);
    }

/**
     * 查询单个AI路由
     * 
     * 根据路由名称查询特定的AI路由配置，执行以下步骤：
     * 1. 转换ConfigMap名称：将AI路由名称转换为对应的ConfigMap名称
     * 2. 读取ConfigMap：从Kubernetes读取对应的ConfigMap资源
     * 3. 转换为AI路由：将ConfigMap转换为AI路由对象
     * 
     * @param routeName 路由名称
     * @return 查询到的AI路由对象，如果不存在则返回null
     * @throws BusinessException 如果查询过程中发生错误
     */
    @Override
    public AiRoute query(String routeName) {
        V1ConfigMap configMap;
        String configMapName = kubernetesModelConverter.aiRouteName2ConfigMapName(routeName);
        try {
            // 读取ConfigMap
            configMap = kubernetesClientService.readConfigMap(configMapName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the ConfigMap with name: " + configMapName, e);
        }
        
        // 转换为AI路由对象，如果不存在则返回null
        return Optional.ofNullable(configMap).map(this::configMap2AiRoute).orElse(null);
    }

/**
     * 删除AI路由
     * 
     * 删除指定名称的AI路由配置，执行以下步骤：
     * 1. 删除相关资源：清理与该AI路由相关的所有Kubernetes资源（路由、插件、EnvoyFilter等）
     * 2. 删除ConfigMap：从Kubernetes删除存储AI路由配置的ConfigMap
     * 
     * @param routeName 要删除的路由名称
     * @throws BusinessException 如果删除过程中发生错误
     */
    @Override
    public void delete(String routeName) {
        // 删除相关资源
        deleteAiRouteResources(routeName);

        // 删除ConfigMap
        String configMapName = kubernetesModelConverter.aiRouteName2ConfigMapName(routeName);
        try {
            kubernetesClientService.deleteConfigMap(configMapName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ConfigMap with name: " + configMapName, e);
        }
    }

/**
     * 更新AI路由
     * 
     * 修改现有的AI路由配置，执行以下步骤：
     * 1. 填充默认值：确保路由配置包含所有必需的默认参数
     * 2. 重写AI路由资源：更新相关的Kubernetes资源（路由、插件配置等）
     * 3. 重写故障转移资源：根据新的配置更新故障转移相关的EnvoyFilter
     * 4. 更新ConfigMap：将更新后的AI路由配置保存到Kubernetes ConfigMap
     * 
     * @param route 包含更新信息的AI路由对象
     * @return 更新后的AI路由对象
     * @throws ResourceConflictException 如果更新过程中发生资源冲突
     * @throws BusinessException 如果更新过程中发生其他错误
     */
    @Override
    public AiRoute update(AiRoute route) {
        // 填充默认值
        fillDefaultValues(route);

        // 重写相关资源
        writeAiRouteResources(route);
        writeAiRouteFallbackResources(route);

        // 更新ConfigMap
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
            fallbackUpStreams = Lists.newArrayList(fallbackConfig.getUpstreams().get(0));
        } else {
            throw new BusinessException("Unknown fallback strategy: " + fallbackStrategy);
        }
        setUpstreams(route, fallbackUpStreams);
        saveRoute(route);

        String fallbackEnvoyFilterConfig = getRouteFallbackEnvoyFilterConfig(fallbackConfig.getResponseCodes());
        StringBuilder envoyFilterBuilder = new StringBuilder(fallbackEnvoyFilterConfig);
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

        writeModelMappingResources(fallbackRouteName, fallbackUpStreams);
        writeAiStatisticsResources(fallbackRouteName);
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
            wasmPluginInstanceService.delete(WasmPluginInstanceScope.ROUTE, routeName, BuiltInPluginName.MODEL_MAPPER, true);
            return;
        }

        final String pluginName = BuiltInPluginName.MODEL_MAPPER;
        for (AiUpstream upstream : upstreams) {
            UpstreamService upstreamService = llmProviderService.buildUpstreamService(upstream.getProvider());

            Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName,
                WasmPluginInstanceScope.SERVICE, upstreamService.getName());

            if (MapUtils.isEmpty(upstream.getModelMapping())) {
                wasmPluginInstanceService.delete(targets, pluginName, true);
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
            Lists.newArrayList(questionAttribute, streamingAnswerAttribute, nonStreamingAnswerAttribute);
        instance.setConfigurations(MapUtil.of(AiStatisticsConfig.ATTRIBUTES, attributes));

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

        route.setAuthConfig(aiRoute.getAuthConfig());

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

    private String getRouteFallbackEnvoyFilterConfig(List<String> responseCodes) {
        VelocityContext context = new VelocityContext();
        context.put("responseCodes", responseCodes);
        StringWriter writer = new StringWriter();
        routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
        return writer.toString();
    }

    private void setUpstreams(Route route, List<AiUpstream> upstreams) {
        if (CollectionUtils.isEmpty(upstreams)) {
            route.setServices(Lists.newArrayList());
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
