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

import static com.alibaba.higress.sdk.service.ai.LlmProviderHandler.PROVIDER_ID_KEY;
import static com.alibaba.higress.sdk.service.ai.LlmProviderHandler.PROVIDER_TYPE_KEY;

import java.util.ArrayList;
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

import com.alibaba.higress.sdk.constant.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.ServiceSourceService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

@SuppressWarnings("unchecked")
public class LlmProviderServiceImpl implements LlmProviderService {

    private static final String ACTIVE_PROVIDER_ID_KEY = "activeProviderId";
    private static final String PROVIDERS_KEY = "providers";

    private static final Map<String, LlmProviderHandler> PROVIDER_HANDLERS;

    static {
        PROVIDER_HANDLERS = Stream.of(
            new DefaultLlmProviderHandler(LlmProviderType.OPENAI, "api.openai.com", 443, V1McpBridge.PROTOCOL_HTTPS),
            new DefaultLlmProviderHandler(LlmProviderType.QWEN, "dashscope.aliyuncs.com", 443,
                V1McpBridge.PROTOCOL_HTTPS))
            .collect(Collectors.toMap(LlmProviderHandler::getType, p -> p));
    }

    private final ServiceSourceService serviceSourceService;
    private final WasmPluginService wasmPluginService;
    private final WasmPluginInstanceService wasmPluginInstanceService;

    public LlmProviderServiceImpl(ServiceSourceService serviceSourceService, WasmPluginService wasmPluginService,
        WasmPluginInstanceService wasmPluginInstanceService) {
        this.serviceSourceService = serviceSourceService;
        this.wasmPluginService = wasmPluginService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public LlmProvider addOrUpdate(LlmProvider provider) {
        LlmProviderHandler handler = PROVIDER_HANDLERS.get(provider.getType());
        if (handler == null) {
            throw new ValidationException("Provider type " + provider.getType() + " is not supported");
        }

        fillDefaultValues(provider);

        final String pluginName = BuiltInPluginName.AI_PROXY;
        WasmPluginInstance instance =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, pluginName, true);
        if (instance == null) {
            WasmPlugin plugin = wasmPluginService.query(pluginName, null);
            if (plugin == null) {
                throw new BusinessException("Plugin " + pluginName + " not found");
            }
            instance = new WasmPluginInstance();
            instance.setPluginName(plugin.getName());
            instance.setPluginVersion(plugin.getPluginVersion());
            instance.setInternal(true);
            instance.setScope(WasmPluginInstanceScope.GLOBAL);
            instance.setConfigurations(new HashMap<>());
        }
        instance.setEnabled(true);

        Map<String, Object> configurations = instance.getConfigurations();
        if (MapUtils.isEmpty(configurations)) {
            // Just in case it is a readonly empty map.
            configurations = new HashMap<>();
            instance.setConfigurations(configurations);
        }

        Object providersObj = configurations.get(PROVIDERS_KEY);
        if (!(providersObj instanceof List)) {
            providersObj = new ArrayList<>();
            configurations.put(PROVIDERS_KEY, providersObj);
        }

        List<Object> providers = (List<Object>)providersObj;
        Map<String, Object> providerConfig = null;
        for (Object providerObj : providers) {
            if (!(providerObj instanceof Map<?, ?>)) {
                continue;
            }
            Map<String, Object> providerMap = (Map<String, Object>)providerObj;
            if (provider.getName().equals(providerMap.get(PROVIDER_ID_KEY))) {
                providerConfig = providerMap;
                break;
            }
        }
        if (providerConfig == null) {
            providerConfig = new HashMap<>();
            providers.add(providerConfig);
        }
        handler.saveConfig(provider, providerConfig);
        wasmPluginInstanceService.addOrUpdate(instance);

        ServiceSource serviceSource = handler.buildServiceSource(provider.getName());
        serviceSourceService.addOrUpdate(serviceSource);

        UpstreamService upstreamService = handler.buildUpstreamService(provider.getName());
        WasmPluginInstance serviceInstance = new WasmPluginInstance();
        serviceInstance.setPluginName(instance.getPluginName());
        serviceInstance.setPluginVersion(instance.getPluginVersion());
        serviceInstance.setScope(WasmPluginInstanceScope.SERVICE);
        serviceInstance.setTarget(upstreamService.getName());
        serviceInstance.setEnabled(true);
        serviceInstance.setInternal(true);
        serviceInstance.setConfigurations(Map.of(ACTIVE_PROVIDER_ID_KEY, provider.getName()));
        wasmPluginInstanceService.addOrUpdate(serviceInstance);

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
        WasmPluginInstance globalInstance = instances.stream()
            .filter(instance -> WasmPluginInstanceScope.GLOBAL.equals(instance.getScope())).findFirst().orElse(null);

        if (globalInstance == null) {
            return;
        }

        Map<String, Object> globalConfigurations = globalInstance.getConfigurations();
        if (MapUtils.isEmpty(globalConfigurations)) {
            return;
        }

        Object providersObj = globalConfigurations.get(PROVIDERS_KEY);
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
            if (providerName.equals(providerMap.get(PROVIDER_ID_KEY))) {
                providers.remove(i);
                deletedProvider = providerMap;
                break;
            }
        }

        if (deletedProvider == null) {
            return;
        }

        // Delete other resources related to the deleted provider.
        Object type = deletedProvider.get(PROVIDER_TYPE_KEY);
        if (type != null) {
            LlmProviderHandler handler = PROVIDER_HANDLERS.get((String)type);
            if (handler != null) {
                UpstreamService upstreamService = handler.buildUpstreamService(providerName);
                wasmPluginInstanceService.delete(WasmPluginInstanceScope.SERVICE, upstreamService.getName(),
                    BuiltInPluginName.AI_PROXY);
                ServiceSource serviceSource = handler.buildServiceSource(providerName);
                serviceSourceService.delete(serviceSource.getName());
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

        return handler.buildUpstreamService(provider.getName());
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
        Object providersObj = instance.getConfigurations().get(PROVIDERS_KEY);
        if (!(providersObj instanceof List<?> providerList)) {
            return new TreeMap<>();
        }
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
        return providers;
    }

    private LlmProvider extractProvider(Map<String, Object> configurations) {
        String type = MapUtils.getString(configurations, PROVIDER_TYPE_KEY);
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

    private static void fillDefaultValues(LlmProvider provider) {
        if (StringUtils.isEmpty(provider.getProtocol())) {
            provider.setProtocol(LlmProviderProtocol.OPENAI_V1.getValue());
        }
    }
}
