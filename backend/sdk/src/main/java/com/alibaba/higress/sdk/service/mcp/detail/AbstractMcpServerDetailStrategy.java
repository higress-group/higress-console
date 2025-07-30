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
package com.alibaba.higress.sdk.service.mcp.detail;

import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.ALLOW;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RouteAuthConfig;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.google.common.collect.Lists;

/**
 * @author lvshui
 */
public abstract class AbstractMcpServerDetailStrategy implements McpServerDetailStrategy {

    protected static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
            .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    static {
        YAML.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    protected final KubernetesClientService kubernetesClientService;
    protected final WasmPluginInstanceService wasmPluginInstanceService;
    protected final RouteService routeService;

    public AbstractMcpServerDetailStrategy(KubernetesClientService kubernetesClientService,
            WasmPluginInstanceService wasmPluginInstanceService, RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
        this.routeService = routeService;
    }

    @Override
    public McpServer query(String name) {
        String routeName = McpServerHelper.mcpServerName2RouteName(name);
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new NotFoundException("can't found the bound route by name: " + routeName);
        }
        McpServer result = routeToMcpServerWithAuth(route);
        completeInfo(route, result);

        return result;
    }

    protected abstract void completeInfo(Route route, McpServer result);

    protected McpServer routeToMcpServerWithAuth(Route route) {
        WasmPluginInstance instance = wasmPluginInstanceService
                .query(MapUtil.of(WasmPluginInstanceScope.ROUTE, route.getName()), BuiltInPluginName.KEY_AUTH, true);
        route.setAuthConfig(RouteAuthConfig.builder().enabled(false).build());
        if (Objects.nonNull(instance)) {
            route.setAuthConfig(generateAuthConfig(instance));
        }
        return McpServerHelper.routeToMcpServer(route);
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
                List<?> allowList = (List<?>) allowObj;
                List<String> collectList = allowList.stream().filter(a -> a instanceof String).map(a -> (String) a)
                        .collect(Collectors.toList());
                routeAuthConfig.setAllowedConsumers(collectList);
            }
        }
        return routeAuthConfig;
    }
}
