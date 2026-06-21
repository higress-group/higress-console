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

import static com.alibaba.higress.sdk.constant.McpConstants.MCP_TRANSPORT_SSE;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

/**
 * Tests for {@link DirectRoutingDetailStrategy}, focused on the path concatenation behavior when joining the rewrite
 * path with the upstream SSE path suffix.
 */
public class DirectRoutingDetailStrategyTest {

    private static final String ROUTE_NAME = "mcp-server-test.internal";
    private static final String MCP_SERVER_NAME = "test";
    private static final String SSE_PATH_SUFFIX = "/sse";
    private static final String HIGRESS_KEY = "higress";
    private static final String MCP_KEY = "mcpServer";

    private static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

    private KubernetesClientService kubernetesClientService;
    private ConsumerService consumerService;
    private RouteService routeService;
    private DirectRoutingDetailStrategy strategy;

    @BeforeEach
    public void setUp() throws Exception {
        kubernetesClientService = mock(KubernetesClientService.class);
        consumerService = mock(ConsumerService.class);
        routeService = mock(RouteService.class);
        strategy = new DirectRoutingDetailStrategy(kubernetesClientService, consumerService, routeService);
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix without producing double slashes "
        + "when rewrite path ends with '/' and suffix starts with '/'")
    public void completeInfo_rewritePathWithTrailingSlashAndSuffixWithLeadingSlash_noDoubleSlash() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "/mcp-servers/foo/", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, SSE_PATH_SUFFIX);

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/mcp-servers/foo/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix correctly when both lack a separator slash")
    public void completeInfo_rewritePathAndSuffixWithoutLeadingSlash_insertsSeparator() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "/mcp-servers/foo", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, "sse");

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/mcp-servers/foo/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix correctly in the common case "
        + "(no trailing slash, suffix starts with '/')")
    public void completeInfo_commonCase_doesNotChangePath() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "/mcp-servers/foo", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, SSE_PATH_SUFFIX);

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/mcp-servers/foo/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix without double slashes when rewrite path is the root '/' "
        + "and suffix starts with '/'")
    public void completeInfo_rootPathPrefix_doesNotProduceDoubleSlash() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "/", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, SSE_PATH_SUFFIX);

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix without double slashes when rewrite path is the root '/' "
        + "and suffix lacks a leading slash")
    public void completeInfo_rootPathPrefixAndSuffixWithoutLeadingSlash_insertsSingleSeparator() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "/", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, "sse");

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    @Test
    @DisplayName("joins rewrite path with sse path suffix without double slashes when rewrite path is composed "
        + "entirely of '/' characters")
    public void completeInfo_prefixIsAllSlashes_collapsesToSingleRoot() throws Exception {
        Route route = buildRoute(ROUTE_NAME, "//", MCP_TRANSPORT_SSE);
        stubRouteAndConfigMap(route, SSE_PATH_SUFFIX);

        McpServer mcpServer = strategy.query(MCP_SERVER_NAME);

        Assertions.assertNotNull(mcpServer);
        Assertions.assertNotNull(mcpServer.getDirectRouteConfig());
        Assertions.assertEquals("/sse", mcpServer.getDirectRouteConfig().getPath());
    }

    private Route buildRoute(String name, String rewritePath, String transportType) {
        Route route = new Route();
        route.setName(name);
        RewriteConfig rewrite = new RewriteConfig();
        rewrite.setEnabled(Boolean.TRUE);
        rewrite.setPath(rewritePath);
        route.setRewrite(rewrite);
        Map<String, String> customConfigs = new HashMap<>();
        customConfigs.put(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_UPSTREAM_TRANSPORT_TYPE_KEY,
            transportType);
        route.setCustomConfigs(customConfigs);
        return route;
    }

    private void stubRouteAndConfigMap(Route route, String ssePathSuffix) throws Exception {
        when(routeService.query(eq(ROUTE_NAME))).thenReturn(route);

        McpServerConfigMap mcpConfig = new McpServerConfigMap();
        mcpConfig.setSsePathSuffix(ssePathSuffix);
        V1ConfigMap configMap = new V1ConfigMap();
        configMap.setMetadata(new V1ObjectMeta());
        configMap.setData(MapUtil.of(HIGRESS_KEY, buildHigressYaml(mcpConfig)));
        when(kubernetesClientService.readConfigMap(eq(KubernetesConstants.HIGRESS_CONFIG))).thenReturn(configMap);
    }

    private String buildHigressYaml(McpServerConfigMap mcpConfig) {
        try {
            Map<String, Object> root = new HashMap<>();
            root.put(MCP_KEY, mcpConfig);
            return YAML.writeValueAsString(root);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
