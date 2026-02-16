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
package com.alibaba.higress.sdk.service.ai;

import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.ACTIVE_PROVIDER_ID;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDERS;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_ID;
import static com.alibaba.higress.sdk.constant.plugin.config.AiProxyConfig.PROVIDER_TYPE;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.ai.AiUpstream;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.MapUtil;

import lombok.Setter;

@SuppressWarnings("unchecked")
public class LlmProviderServiceImpl implements LlmProviderService {

    private static final Map<String, LlmProviderHandler> PROVIDER_HANDLERS;

    static {
        PROVIDER_HANDLERS = Stream.of(new OpenaiLlmProviderHandler(),
            new DefaultLlmProviderHandler(LlmProviderType.MOONSHOT, "api.moonshot.cn", 443, V1McpBridge.PROTOCOL_HTTPS),
            new QwenLlmProviderHandler(), new AzureLlmProviderHandler(),
            new DefaultLlmProviderHandler(LlmProviderType.AI360, "api.360.cn", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.GITHUB, "models.inference.ai.azure.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.GROQ, "api.groq.com", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.BAICHUAN, "api.baichuan-ai.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.YI, "api.lingyiwanwu.com", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.DEEPSEEK, "api.deepseek.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new ZhipuAILlmProviderHandler(),
            new OllamaLlmProviderHandler(),
            new ClaudeLlmProviderHandler(),
            new DefaultLlmProviderHandler(LlmProviderType.BAIDU, "qianfan.baidubce.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.STEPFUN, "api.stepfun.com", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.MINIMAX, "api.minimax.chat", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.GEMINI, "generativelanguage.googleapis.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.MISTRAL, "api.mistral.ai", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.COHERE, "api.cohere.com", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.DOUBAO, "ark.cn-beijing.volces.com", 443,
                V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.COZE, "api.coze.cn", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.OPENROUTER, "openrouter.ai", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.GROK, "api.x.ai", 443, V1McpBridge.PROTOCOL_HTTPS),
            new BedrockLlmProviderHandler(), new VertexLlmProviderHandler())
            .collect(Collectors.toMap(LlmProviderHandler::getType, p -> p));
    }

    private final ServiceSourceService serviceSourceService;
    private final WasmPluginInstanceService wasmPluginInstanceService;
    @Setter
    private AiRouteService aiRouteService;

    public LlmProviderServiceImpl(ServiceSourceService serviceSourceService,
        WasmPluginInstanceService wasmPluginInstanceService) {
        this.serviceSourceService = serviceSourceService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public LlmProvider addOrUpdate(LlmProvider provider) {
        LlmProviderHandler handler = PROVIDER_HANDLERS.get(provider.getType());
        if (handler == null) {
            throw new ValidationException("Provider type " + provider.getType() + " is not supported");
        }

        handler.normalizeConfigs(provider.getRawConfigs());

        fillDefaultValues(provider);

        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(BuiltInPluginName.AI_PROXY, true);

        final String pluginName = BuiltInPluginName.AI_PROXY;
        WasmPluginInstance instance =
            instances.stream().filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);
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

        Object providersObj = configurations.get(PROVIDERS);
        if (!(providersObj instanceof List)) {
            providersObj = new ArrayList<>();
            configurations.put(PROVIDERS, providersObj);
        }

        Map<String, Object> providerConfig =
            provider.getRawConfigs() != null ? new HashMap<>(provider.getRawConfigs()) : new HashMap<>();
        handler.saveConfig(provider, providerConfig);

        boolean found = false;
        List<Object> providers = (List<Object>)providersObj;
        for (int i = 0; i < providers.size(); i++) {
            Object providerObj = providers.get(i);
            if (!(providerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> providerMap = (Map<String, Object>)providerObj;
            if (provider.getName().equals(providerMap.get(PROVIDER_ID))) {
                providers.set(i, providerConfig);
                found = true;
                break;
            }
        }
        if (!found) {
            providers.add(providerConfig);
        }

        List<ServiceSource> serviceSources = new ArrayList<>();
        {
            ServiceSource serviceSource = handler.buildServiceSource(provider.getName(), providerConfig);
            if (serviceSource != null) {
                serviceSources.add(serviceSource);
            }
            List<ServiceSource> extraServiceSources =
                handler.getExtraServiceSources(provider.getName(), providerConfig, false);
            if (CollectionUtils.isNotEmpty(extraServiceSources)) {
                serviceSources.addAll(extraServiceSources);
            }
        }

        UpstreamService upstreamService = handler.buildUpstreamService(provider.getName(), providerConfig);

        WasmPluginInstance existedServiceInstance = instances.stream()
            .filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.SERVICE, upstreamService.getName())).findFirst()
            .orElse(null);
        if (existedServiceInstance != null) {
            String boundProviderName =
                MapUtils.getString(existedServiceInstance.getConfigurations(), ACTIVE_PROVIDER_ID);
            if (!provider.getName().equals(boundProviderName)) {
                throw new ValidationException("The service instance for provider " + boundProviderName
                    + " is already existed. Cannot bind it to provider " + provider.getName());
            }
        }

        WasmPluginInstance serviceInstance = new WasmPluginInstance();
        serviceInstance.setPluginName(instance.getPluginName());
        serviceInstance.setPluginVersion(instance.getPluginVersion());
        serviceInstance.setTarget(WasmPluginInstanceScope.SERVICE, upstreamService.getName());
        serviceInstance.setEnabled(true);
        serviceInstance.setInternal(true);
        serviceInstance.setConfigurations(MapUtil.of(ACTIVE_PROVIDER_ID, provider.getName()));

        // Perform all the updates here just to avoid possible errors in resource building.
        if (!serviceSources.isEmpty()) {
            for (ServiceSource serviceSource : serviceSources) {
                serviceSource.setProxyName(provider.getProxyName());
                serviceSourceService.addOrUpdate(serviceSource);
            }
        }
        wasmPluginInstanceService.addOrUpdate(instance);
        wasmPluginInstanceService.addOrUpdate(serviceInstance);

        if (handler.needSyncRouteAfterUpdate()) {
            syncRelatedAiRoutes(provider);
        }

        return query(provider.getName());
    }

    @Override
    public PaginatedResult<LlmProvider> list(CommonPageQuery query) {
        return PaginatedResult.createFromFullList(new ArrayList<>(getProviders().values()), query);
    }

    @Override
    public LlmProvider query(String providerName) {
        return getProviders().get(providerName);
    }

    @Override
    public void delete(String providerName) {
        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(BuiltInPluginName.AI_PROXY);
        if (CollectionUtils.isEmpty(instances)) {
            return;
        }

        // Find the global config.
        WasmPluginInstance globalInstance =
            instances.stream().filter(i -> i.hasScopedTarget(WasmPluginInstanceScope.GLOBAL)).findFirst().orElse(null);

        if (globalInstance == null) {
            return;
        }

        Map<String, Object> globalConfigurations = globalInstance.getConfigurations();
        if (MapUtils.isEmpty(globalConfigurations)) {
            return;
        }

        Object providersObj = globalConfigurations.get(PROVIDERS);
        if (!(providersObj instanceof List)) {
            return;
        }

        // Find the provider config and remove it.
        Map<String, Object> deletedProvider = null;
        List<Object> providers = (List<Object>)providersObj;
        for (int i = providers.size() - 1; i >= 0; --i) {
            Object providerObj = providers.get(i);
            if (!(providerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> providerMap = (Map<String, Object>)providerObj;
            if (providerName.equals(providerMap.get(PROVIDER_ID))) {
                providers.remove(i);
                deletedProvider = providerMap;
                break;
            }
        }

        if (deletedProvider == null) {
            return;
        }

        // Delete other resources related to the deleted provider.
        Object type = deletedProvider.get(PROVIDER_TYPE);
        if (type != null) {
            LlmProviderHandler handler = PROVIDER_HANDLERS.get((String)type);
            if (handler != null) {
                UpstreamService upstreamService = handler.buildUpstreamService(providerName, deletedProvider);
                wasmPluginInstanceService.delete(WasmPluginInstanceScope.SERVICE, upstreamService.getName(),
                    BuiltInPluginName.AI_PROXY, true);

                ServiceSource serviceSource = handler.buildServiceSource(providerName, deletedProvider);
                if (serviceSource != null) {
                    serviceSourceService.delete(serviceSource.getName());
                }

                List<ServiceSource> extraServiceSources =
                    handler.getExtraServiceSources(providerName, deletedProvider, true);
                if (CollectionUtils.isNotEmpty(extraServiceSources)) {
                    for (ServiceSource extraSource : extraServiceSources) {
                        serviceSourceService.delete(extraSource.getName());
                    }
                }
            }
        }

        // Save the global config on the plugin.
        wasmPluginInstanceService.addOrUpdate(globalInstance);
    }

    @Override
    public UpstreamService buildUpstreamService(String providerName) {
        LlmProvider provider = query(providerName);
        if (provider == null) {
            throw new ValidationException("Unknown provider: " + providerName);
        }

        LlmProviderHandler handler = PROVIDER_HANDLERS.get(provider.getType());
        if (handler == null) {
            throw new ValidationException(
                "Provider type " + provider.getType() + " of provider " + providerName + " is not supported");
        }

        return handler.buildUpstreamService(provider.getName(), provider.getRawConfigs());
    }

    private void syncRelatedAiRoutes(LlmProvider provider) {
        AiRouteService aiRouteService = this.aiRouteService;
        if (aiRouteService == null) {
            throw new IllegalStateException("AiRouteService is not available when AI route syncing is needed.");
        }

        PaginatedResult<AiRoute> aiRoutes = aiRouteService.list(null);
        if (aiRoutes == null || CollectionUtils.isEmpty(aiRoutes.getData())) {
            return;
        }

        String providerName = provider.getName();
        for (AiRoute aiRoute : aiRoutes.getData()) {
            if (CollectionUtils.isEmpty(aiRoute.getUpstreams())) {
                continue;
            }
            if (hasProvider(aiRoute.getUpstreams(), providerName)
                || aiRoute.getFallbackConfig() != null && Boolean.TRUE.equals(aiRoute.getFallbackConfig().getEnabled())
                    && hasProvider(aiRoute.getFallbackConfig().getUpstreams(), providerName)) {
                aiRouteService.update(aiRoute);
            }
        }
    }

    private static boolean hasProvider(List<AiUpstream> upstreams, String providerName) {
        if (CollectionUtils.isEmpty(upstreams)) {
            return false;
        }
        for (AiUpstream upstream : upstreams) {
            if (providerName.equals(upstream.getProvider())) {
                return true;
            }
        }
        return false;
    }

    private SortedMap<String, LlmProvider> getProviders() {
        WasmPluginInstance instance =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, BuiltInPluginName.AI_PROXY, true);
        if (instance == null) {
            return new TreeMap<>();
        }
        if (MapUtils.isEmpty(instance.getConfigurations())) {
            return new TreeMap<>();
        }
        Object providersObj = instance.getConfigurations().get(PROVIDERS);
        if (!(providersObj instanceof List<?>)) {
            return new TreeMap<>();
        }
        List<?> providerList = (List<?>)providersObj;
        SortedMap<String, LlmProvider> providers = new TreeMap<>();
        for (Object providerObj : providerList) {
            if (!(providerObj instanceof Map<?, ?>)) {
                continue;
            }
            LlmProvider provider = extractProvider((Map<String, Object>)providerObj);
            if (provider == null) {
                continue;
            }
            providers.put(provider.getName(), provider);
        }
        fillProxyInfo(providers.values());
        return providers;
    }

    private LlmProvider extractProvider(Map<String, Object> configurations) {
        String type = MapUtils.getString(configurations, PROVIDER_TYPE);
        if (StringUtils.isBlank(type)) {
            return null;
        }

        LlmProviderHandler handler = PROVIDER_HANDLERS.get(type);
        if (handler == null) {
            return null;
        }

        LlmProvider provider = handler.createProvider();
        if (!handler.loadConfig(provider, configurations)) {
            // Failed to load provider config. The provider data is incomplete.
            return null;
        }
        return provider;
    }

    private void fillProxyInfo(Collection<LlmProvider> providers) {
        if (CollectionUtils.isEmpty(providers)) {
            return;
        }
        PaginatedResult<ServiceSource> serviceSources = serviceSourceService.list(null);
        if (serviceSources == null || CollectionUtils.isEmpty(serviceSources.getData())) {
            return;
        }

        Map<String, ServiceSource> serviceSourceMap =
            serviceSources.getData().stream().collect(Collectors.toMap(ServiceSource::getName, s -> s));
        for (LlmProvider provider : providers) {
            LlmProviderHandler handler = PROVIDER_HANDLERS.get(provider.getType());
            if (handler == null) {
                continue;
            }
            String serviceSourceName = handler.getServiceSourceName(provider.getName());
            ServiceSource serviceSource = serviceSourceMap.get(serviceSourceName);
            if (serviceSource != null) {
                provider.setProxyName(serviceSource.getProxyName());
            }
        }
    }

    private static void fillDefaultValues(LlmProvider provider) {
        if (StringUtils.isEmpty(provider.getProtocol())) {
            provider.setProtocol(LlmProviderProtocol.OPENAI_V1.getValue());
        }
    }
}
