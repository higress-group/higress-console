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

import java.util.Objects;

import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

/**
 * @author lvshui
 */
public abstract class AbstractMcpServerDetailStrategy implements McpServerDetailStrategy {

    protected static final String HIGRESS_CONFIG = "higress-config";

    protected static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    static {
        YAML.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    protected final KubernetesClientService kubernetesClientService;
    protected final ConsumerService consumerService;
    protected final RouteService routeService;

    public AbstractMcpServerDetailStrategy(KubernetesClientService kubernetesClientService,
        ConsumerService consumerService, RouteService routeService) {
        this.kubernetesClientService = kubernetesClientService;
        this.consumerService = consumerService;
        this.routeService = routeService;
    }

    @Override
    public McpServer query(String name) {
        String routeName = McpServerHelper.mcpServerName2RouteName(name);
        Route route = routeService.query(routeName);
        if (Objects.isNull(route)) {
            throw new NotFoundException("can't found the bound route by name: " + routeName);
        }
        McpServer result = McpServerHelper.routeToMcpServer(route);
        completeInfo(route, result);

        return result;
    }

    protected abstract void completeInfo(Route route, McpServer result);
}
