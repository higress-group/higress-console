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

import static org.mockito.Mockito.mock;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerDirectRouteConfig;
import com.alibaba.higress.sdk.model.route.Header;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

/**
 * Tests for custom upstream headers on direct-route MCP servers.
 *
 * @author ran411285752
 */
public class DirectRoutingSaveStrategyTest {

    @Test
    @DisplayName("saves custom upstream headers as set rules so they override client headers")
    public void setDefaultConfigs_customHeaders_usesRequestHeaderSetRules() {
        DirectRoutingSaveStrategy strategy = new DirectRoutingSaveStrategy(mock(KubernetesClientService.class),
            mock(KubernetesModelConverter.class), mock(ConsumerService.class), mock(RouteService.class));
        List<Header> headers = Collections.singletonList(new Header("Authorization", "Bearer upstream"));
        McpServerDirectRouteConfig directRouteConfig = new McpServerDirectRouteConfig();
        directRouteConfig.setPath("/mcp");
        directRouteConfig.setTransportType(McpConstants.MCP_TRANSPORT_STREAMABLE);
        directRouteConfig.setHeaders(headers);

        McpServer mcpServer = new McpServer();
        mcpServer.setDescription("test");
        mcpServer.setDirectRouteConfig(directRouteConfig);

        Route route = new Route();
        route.setServices(Collections.singletonList(UpstreamService.builder().name("upstream.static").build()));
        route.setPath(RoutePredicate.builder().matchType(RoutePredicateTypeEnum.PRE.name())
            .matchValue("/mcp-servers/test").build());

        strategy.setDefaultConfigs(route, mcpServer);

        Assertions.assertNotNull(route.getHeaderControl());
        Assertions.assertEquals(Boolean.TRUE, route.getHeaderControl().getEnabled());
        Assertions.assertEquals(headers, route.getHeaderControl().getRequest().getSet());
        Assertions.assertTrue(route.getHeaderControl().getRequest().getAdd() == null
            || route.getHeaderControl().getRequest().getAdd().isEmpty());
    }
}
