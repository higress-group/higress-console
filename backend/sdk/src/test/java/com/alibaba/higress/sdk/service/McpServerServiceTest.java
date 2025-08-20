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
package com.alibaba.higress.sdk.service;

import static com.alibaba.higress.sdk.model.mcp.McpServerConstants.Label.MCP_SERVER_BIZ_TYPE_VALUE;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.TreeMap;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;
import com.alibaba.higress.sdk.service.consumer.ConsumerServiceImpl;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerService;
import com.alibaba.higress.sdk.service.mcp.McpServiceContextImpl;
import com.alibaba.higress.sdk.util.MapUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.google.common.collect.Lists;

import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

/**
 * @author HecarimV
 */
public class McpServerServiceTest {
        private static final String TEST_MCP_SERVER_PLUGIN_NAME = "mcp-server";
        private static final String TEST_KEY_AUTH_PLUGIN_NAME = "key-auth";
        private static final String DEFAULT_VERSION = "1.0.0";
        private static final String DEFAULT_ROUTE_DOMAIN = "higress.cn";
        private static final String DEFAULT_UPSTREAM_SERVICE = "test.default.svc.cluster.local";
        private static final String DEFAULT_CONFIG_NAME = "higress-config";
        private static final String DEFAULT_CONFIG_NAME_HIGRESS_KEY = "higress";
        private static final String DEFAULT_CONFIG_NAME_MCP_KEY = "mcpServer";
        private static final String REDIS_PLACEHOLDER_ADDRESS = "your.redis.host:6379";

        private KubernetesClientService kubernetesClientService;
        private KubernetesModelConverter kubernetesModelConverter;
        private WasmPluginServiceImpl wasmPluginService;
        private WasmPluginInstanceServiceImpl wasmPluginInstanceService;
        private ConsumerServiceImpl consumerService;
        private RouteServiceImpl routeService;
        private McpServerService mcpServerService;

        protected static final ObjectMapper YAML = new ObjectMapper(new YAMLFactory()
                        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE)
                        .disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));

        @BeforeEach
        public void setUp() throws Exception {
                kubernetesClientService = mock(KubernetesClientService.class);
                when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(i -> i.getArguments()[0]);
                when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(i -> i.getArguments()[0]);
                when(kubernetesClientService.createIngress(any())).thenAnswer(i -> i.getArguments()[0]);
                when(kubernetesClientService.replaceIngress(any())).thenAnswer(i -> i.getArguments()[0]);
                when(kubernetesClientService.createConfigMap(any())).thenAnswer(i -> i.getArguments()[0]);
                when(kubernetesClientService.replaceConfigMap(any())).thenAnswer(i -> i.getArguments()[0]);
                kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);

                wasmPluginService = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter,
                                WasmPluginServiceConfig.buildFromEnv());
                wasmPluginService.initialize();
                wasmPluginInstanceService = new WasmPluginInstanceServiceImpl(wasmPluginService,
                                kubernetesClientService,
                                kubernetesModelConverter);
                consumerService = new ConsumerServiceImpl(wasmPluginInstanceService);
                routeService = new RouteServiceImpl(kubernetesClientService, kubernetesModelConverter,
                                wasmPluginInstanceService, consumerService);
                mcpServerService = new McpServiceContextImpl(kubernetesClientService, kubernetesModelConverter,
                                wasmPluginInstanceService, consumerService, routeService);
        }

        @Test
        public void queryMcpServerTest() throws Exception {
                final String mcpServerName = "test";
                final McpServerTypeEnum mcpServerType = McpServerTypeEnum.OPEN_API;
                final String description = "description content";
                final boolean routeEnabled = true;
                final List<String> allowConsumers = Arrays.asList("consumerA", "consumerB");
                final Map<String, Object> mcpPluginConfig = MapUtil.of("server", MapUtil.of("name", mcpServerName));
                final Map<String, Object> keyAuthPluginConfig = MapUtil.of("allow", allowConsumers);
                String routeName = McpServerHelper.mcpServerName2RouteName(mcpServerName);

                V1alpha1WasmPlugin mcpServerPluginCr = buildWasmPluginResource(TEST_MCP_SERVER_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(mcpServerPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName))
                                                .enabled(routeEnabled).configurations(mcpPluginConfig).build());
                List<V1alpha1WasmPlugin> mcpPlugins = Collections.singletonList(mcpServerPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME))).thenReturn(mcpPlugins);

                V1alpha1WasmPlugin keyAuthPluginCr = buildWasmPluginResource(TEST_KEY_AUTH_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(keyAuthPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName))
                                                .enabled(routeEnabled).configurations(keyAuthPluginConfig).build());
                List<V1alpha1WasmPlugin> keyAuthPlugins = Collections.singletonList(keyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME))).thenReturn(keyAuthPlugins);

                V1Ingress ingress = buildIngressResource(routeName, description, mcpServerType);
                when(kubernetesClientService.readIngress(eq(routeName))).thenReturn(ingress);

                McpServer mcpServer = mcpServerService.query(mcpServerName);
                Assertions.assertNotNull(mcpServer);
                Assertions.assertEquals(mcpServerName, mcpServer.getName());
                Assertions.assertEquals(mcpServerType, mcpServer.getType());
                Assertions.assertEquals(description, mcpServer.getDescription());
                Assertions.assertNotNull(mcpServer.getRawConfigurations());
                Assertions.assertEquals(Collections.singletonList(DEFAULT_ROUTE_DOMAIN), mcpServer.getDomains());
                Assertions.assertEquals(DEFAULT_UPSTREAM_SERVICE, mcpServer.getServices().get(0).getName());
                Assertions.assertTrue(mcpServer.getConsumerAuthInfo().getEnable());
                Assertions.assertEquals(allowConsumers, mcpServer.getConsumerAuthInfo().getAllowedConsumers());

                Assertions.assertThrows(NotFoundException.class, () -> mcpServerService.query("random mcp"));
        }

        @Test
        public void addOrUpdateTest() throws Exception {
                final String mcpServerName = "test";
                final String description = "description content";
                McpServerTypeEnum mcpServerType = McpServerTypeEnum.OPEN_API;
                V1alpha1WasmPlugin existedMcpPluginCr = buildWasmPluginResource(TEST_MCP_SERVER_PLUGIN_NAME, true,
                                true);
                List<V1alpha1WasmPlugin> mcpPluginCrs = Collections.singletonList(existedMcpPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME))).thenReturn(mcpPluginCrs);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME), anyString()))
                                .thenReturn(mcpPluginCrs);
                V1alpha1WasmPlugin existedKeyAuthPluginCr = buildWasmPluginResource(TEST_KEY_AUTH_PLUGIN_NAME, true,
                                true);
                List<V1alpha1WasmPlugin> keyAuthPluginCrs = Collections.singletonList(existedKeyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME)))
                                .thenReturn(keyAuthPluginCrs);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), anyString()))
                                .thenReturn(keyAuthPluginCrs);
                when(kubernetesClientService.readIngress(anyString())).thenReturn(null);
                V1ConfigMap systemConfigMap = buildSystemConfigMap(null);
                when(kubernetesClientService.readConfigMap(anyString())).thenReturn(systemConfigMap);
                McpServer instance = new McpServer();
                instance.setName(mcpServerName);
                instance.setType(mcpServerType);
                instance.setDescription(description);
                instance.setDomains(Lists.newArrayList(DEFAULT_ROUTE_DOMAIN));
                UpstreamService testService = UpstreamService.builder().name(DEFAULT_UPSTREAM_SERVICE).port(8080)
                                .weight(100)
                                .build();
                instance.setServices(Collections.singletonList(testService));
                ConsumerAuthInfo consumerAuthInfo = new ConsumerAuthInfo();
                consumerAuthInfo.setEnable(true);
                instance.setConsumerAuthInfo(consumerAuthInfo);
                instance.setRawConfigurations(
                                KubernetesUtil.toYaml(MapUtil.of("server", MapUtil.of("name", mcpServerName))));
                mcpServerService.addOrUpdate(instance);

                ArgumentCaptor<V1alpha1WasmPlugin> pluginCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
                verify(kubernetesClientService, times(1)).replaceWasmPlugin(pluginCaptor.capture());
                List<V1alpha1WasmPlugin> capturedValues = pluginCaptor.getAllValues();
                Assertions.assertNotNull(capturedValues);
                String routeName = McpServerHelper.mcpServerName2RouteName(mcpServerName);

                for (V1alpha1WasmPlugin plugin : capturedValues) {
                        Assertions.assertEquals(Collections.singletonList(routeName),
                                        plugin.getSpec().getMatchRules().get(0).getIngress());
                        Assertions.assertNotNull(plugin.getSpec().getMatchRules().get(0).getConfig());
                }

                ArgumentCaptor<V1Ingress> ingressCaptor = ArgumentCaptor.forClass(V1Ingress.class);
                verify(kubernetesClientService, times(1)).createIngress(ingressCaptor.capture());
                V1Ingress ingress = ingressCaptor.getValue();
                Assertions.assertNotNull(ingress);
                Assertions.assertEquals(routeName, Objects.requireNonNull(ingress.getMetadata()).getName());
                Assertions.assertEquals(description,
                                Objects.requireNonNull(Objects.requireNonNull(ingress.getMetadata()).getAnnotations())
                                                .get(McpServerConstants.Annotation.RESOURCE_DESCRIPTION_KEY));
                Assertions.assertNotNull(ingress.getSpec(), "Ingress spec should not be null");
                List<V1IngressRule> rules = ingress.getSpec().getRules();
                Assertions.assertNotNull(rules, "Ingress should have at least one rule");
                V1IngressRule rule = rules.get(0);
                Assertions.assertEquals(DEFAULT_ROUTE_DOMAIN, rule.getHost(), "Ingress rule host mismatch");
                String path = Optional.ofNullable(rule.getHttp()).map(V1HTTPIngressRuleValue::getPaths)
                                .filter(paths -> !paths.isEmpty()).map(paths -> paths.get(0))
                                .map(V1HTTPIngressPath::getPath)
                                .orElse("");
                Assertions.assertEquals("/mcp-servers/" + mcpServerName, path, "Ingress path mismatch");

                Map<String, String> annotations = ingress.getMetadata().getAnnotations();

                Assertions.assertNotNull(annotations);
                Assertions
                                .assertNotNull(
                                                annotations.get(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_DOMAINS_KEY));
                Assertions.assertEquals("true", annotations.get(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_KEY));
                Assertions
                                .assertNotNull(annotations.get(
                                                McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_TYPE_KEY));
                Assertions.assertEquals(path,
                                annotations.get(McpServerConstants.Annotation.RESOURCE_MCP_SERVER_MATCH_RULE_VALUE_KEY));
        }

        @Test
        public void deleteTest() throws Exception {
                final String mcpServerName = "test";
                final boolean routeEnabled = true;
                final List<String> allowConsumers = Arrays.asList("consumerA", "consumerB");
                final Map<String, Object> mcpPluginConfig = MapUtil.of("server", MapUtil.of("name", mcpServerName));
                final Map<String, Object> keyAuthPluginConfig = MapUtil.of("allow", allowConsumers);
                V1alpha1WasmPlugin mcpServerPluginCr = buildWasmPluginResource(TEST_MCP_SERVER_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(mcpServerPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, mcpServerName))
                                                .enabled(routeEnabled).configurations(mcpPluginConfig).build());
                List<V1alpha1WasmPlugin> mcpPlugins = Collections.singletonList(mcpServerPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME))).thenReturn(mcpPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME), any()))
                                .thenReturn(mcpPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_MCP_SERVER_PLUGIN_NAME), any(), any()))
                                .thenReturn(mcpPlugins);

                V1alpha1WasmPlugin keyAuthPluginCr = buildWasmPluginResource(TEST_KEY_AUTH_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(keyAuthPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, mcpServerName))
                                                .enabled(routeEnabled).configurations(keyAuthPluginConfig).build());
                List<V1alpha1WasmPlugin> keyAuthPlugins = Collections.singletonList(keyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME))).thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any()))
                                .thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any(), any()))
                                .thenReturn(keyAuthPlugins);

                List<V1alpha1WasmPlugin> allPlugins = Arrays.asList(mcpServerPluginCr, keyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin()).thenReturn(allPlugins);

                doNothing().when(kubernetesClientService).deleteIngress(eq(mcpServerName));
                McpServerConfigMap mcpServerConfigMap = new McpServerConfigMap();
                McpServerConfigMap.MatchList matchList = new McpServerConfigMap.MatchList();
                matchList.setMatchRulePath("/mcp-servers/" + mcpServerName);
                mcpServerConfigMap.setMatchList(Collections.singletonList(matchList));
                McpServerConfigMap.Server dbServer = new McpServerConfigMap.Server();
                dbServer.setName(mcpServerName);
                mcpServerConfigMap.setServers(Collections.singletonList(dbServer));
                V1ConfigMap systemConfigMap = buildSystemConfigMap(mcpServerConfigMap);
                when(kubernetesClientService.readConfigMap(anyString())).thenReturn(systemConfigMap);

                mcpServerService.delete(mcpServerName);
                verify(kubernetesClientService, times(1)).deleteIngress(mcpServerName);
                ArgumentCaptor<V1alpha1WasmPlugin> pluginCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
                verify(kubernetesClientService, times(2)).replaceWasmPlugin(pluginCaptor.capture());
                List<V1alpha1WasmPlugin> capturedValues = pluginCaptor.getAllValues();
                Assertions.assertNotNull(capturedValues);
                for (V1alpha1WasmPlugin plugin : capturedValues) {
                        Assertions.assertEquals(0, plugin.getSpec().getMatchRules().size());
                }

                ArgumentCaptor<V1ConfigMap> cmCaptor = ArgumentCaptor.forClass(V1ConfigMap.class);
                verify(kubernetesClientService, times(2)).replaceConfigMap(cmCaptor.capture());
                V1ConfigMap configMap = cmCaptor.getValue();
                Assertions.assertNotNull(configMap);
                Assertions.assertNotNull(configMap.getData());
                Assertions.assertNotNull(configMap.getData().get(DEFAULT_CONFIG_NAME_HIGRESS_KEY));
                String higressConfigYaml = configMap.getData().get(DEFAULT_CONFIG_NAME_HIGRESS_KEY);
                Map<String, Object> higressConfig = YAML.readValue(higressConfigYaml,
                                new TypeReference<Map<String, Object>>() {
                                });
                Assertions.assertNotNull(higressConfig);
                McpServerConfigMap mcpConfig = YAML.readValue(
                                YAML.writeValueAsString(higressConfig.get(DEFAULT_CONFIG_NAME_MCP_KEY)),
                                new TypeReference<McpServerConfigMap>() {
                                });
                Assertions.assertNotNull(mcpConfig);
                Assertions.assertEquals(0, mcpConfig.getMatchList().size());
                Assertions.assertEquals(0, mcpConfig.getServers().size());
        }

        @Test
        public void addConsumerTest() throws Exception {
                final String mcpServerName = "test";
                final boolean routeEnabled = true;
                final McpServerTypeEnum mcpServerType = McpServerTypeEnum.OPEN_API;
                final List<String> allowConsumers = Arrays.asList("consumerA", "consumerB");
                final Map<String, Object> keyAuthPluginConfig = MapUtil.of("allow", allowConsumers);

                String routeName = McpServerHelper.mcpServerName2RouteName(mcpServerName);

                V1alpha1WasmPlugin keyAuthPluginCr = buildWasmPluginResource(TEST_KEY_AUTH_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(keyAuthPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName))
                                                .enabled(routeEnabled).configurations(keyAuthPluginConfig).build());
                List<V1alpha1WasmPlugin> keyAuthPlugins = Collections.singletonList(keyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME))).thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any()))
                                .thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any(), any()))
                                .thenReturn(keyAuthPlugins);

                V1Ingress ingress = buildIngressResource(routeName, "", mcpServerType);
                when(kubernetesClientService.readIngress(eq(routeName))).thenReturn(ingress);

                McpServerConsumers newConsumers = new McpServerConsumers();
                newConsumers.setMcpServerName(mcpServerName);
                ArrayList<String> consumersToAdd = new ArrayList<String>() {
                        {
                                add("consumerC");
                        }
                };
                newConsumers.setConsumers(consumersToAdd);
                mcpServerService.addAllowConsumers(newConsumers);

                ArgumentCaptor<V1alpha1WasmPlugin> pluginCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
                verify(kubernetesClientService, times(1)).replaceWasmPlugin(pluginCaptor.capture());
                V1alpha1WasmPlugin capturedValue = pluginCaptor.getValue();
                Assertions.assertNotNull(capturedValue);
                Assertions.assertNotNull(capturedValue.getSpec().getMatchRules());
                Object allowObj =
                                capturedValue.getSpec().getMatchRules().get(0).getConfig().get("allow");
        Assertions.assertInstanceOf(List.class, allowObj);
        List<?> allowList = (List<?>)allowObj;
        Assertions.assertEquals(3, allowList.size());
        Assertions.assertTrue(allowList.contains("consumerA"));
        Assertions.assertTrue(allowList.contains("consumerB"));
        Assertions.assertTrue(allowList.contains("consumerC"));
    }

        @Test
        public void deleteConsumerTest() throws Exception {
                final String mcpServerName = "test";
                final boolean routeEnabled = true;
                final McpServerTypeEnum mcpServerType = McpServerTypeEnum.OPEN_API;
                final List<String> allowConsumers = Arrays.asList("consumerA", "consumerB");
                final Map<String, Object> keyAuthPluginConfig = MapUtil.of("allow", allowConsumers);
                String routeName = McpServerHelper.mcpServerName2RouteName(mcpServerName);

                V1alpha1WasmPlugin keyAuthPluginCr = buildWasmPluginResource(TEST_KEY_AUTH_PLUGIN_NAME, true, true);
                kubernetesModelConverter.setWasmPluginInstanceToCr(keyAuthPluginCr,
                                WasmPluginInstance.builder()
                                                .targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, routeName))
                                                .enabled(routeEnabled).configurations(keyAuthPluginConfig).build());
                List<V1alpha1WasmPlugin> keyAuthPlugins = Collections.singletonList(keyAuthPluginCr);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME))).thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any()))
                                .thenReturn(keyAuthPlugins);
                when(kubernetesClientService.listWasmPlugin(eq(TEST_KEY_AUTH_PLUGIN_NAME), any(), any()))
                                .thenReturn(keyAuthPlugins);

                V1Ingress ingress = buildIngressResource(routeName, "", mcpServerType);
                when(kubernetesClientService.readIngress(eq(routeName))).thenReturn(ingress);

                McpServerConsumers newConsumers = new McpServerConsumers();
                newConsumers.setMcpServerName(mcpServerName);
                ArrayList<String> consumersToDelete = new ArrayList<String>() {
                        {
                                add("consumerA");
                        }
                };
                newConsumers.setConsumers(consumersToDelete);
                mcpServerService.deleteAllowConsumers(newConsumers);

                ArgumentCaptor<V1alpha1WasmPlugin> pluginCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
                verify(kubernetesClientService, times(1)).replaceWasmPlugin(pluginCaptor.capture());
                V1alpha1WasmPlugin capturedValue = pluginCaptor.getValue();
                Assertions.assertNotNull(capturedValue);
                Assertions.assertNotNull(capturedValue.getSpec().getMatchRules());
                Object allowObj =
                                capturedValue.getSpec().getMatchRules().get(0).getConfig().get("allow");
        Assertions.assertInstanceOf(List.class, allowObj);
        List<?> allowList = (List<?>)allowObj;
        Assertions.assertEquals(1, allowList.size());
        Assertions.assertTrue(allowList.contains("consumerB"));
    }

        private V1alpha1WasmPlugin buildWasmPluginResource(String name, boolean builtIn, boolean internal) {
                WasmPlugin plugin = WasmPlugin.builder().name(name).pluginVersion(DEFAULT_VERSION).builtIn(builtIn)
                                .category("TEST").icon("http://dummy-icon").phase(PluginPhase.UNSPECIFIED.name())
                                .priority(1000)
                                .imageRepository("oci://docker.io/" + name).build();
                return kubernetesModelConverter.wasmPluginToCr(plugin, internal);
        }

        private V1Ingress buildIngressResource(String mcpServerName, String description, McpServerTypeEnum type) {
                Route route = Route.builder().name(mcpServerName).build();
                route.setDomains(Collections.singletonList(DEFAULT_ROUTE_DOMAIN));
                route.setPath(
                                RoutePredicate.builder().matchType(RoutePredicateTypeEnum.PRE.toString())
                                                .matchValue("/test").build());
                UpstreamService testService = UpstreamService.builder().name(DEFAULT_UPSTREAM_SERVICE).port(8080)
                                .weight(100)
                                .build();
                route.setServices(Collections.singletonList(testService));
                route.setCustomConfigs(MapUtil.of(McpServerConstants.Annotation.RESOURCE_DESCRIPTION_KEY, description));
                Map<String, String> labelsMap = new TreeMap<>();
                labelsMap.put(KubernetesConstants.Label.INTERNAL_KEY, Boolean.TRUE.toString());
                labelsMap.put(McpServerConstants.Label.RESOURCE_MCP_SERVER_TYPE_KEY, type.name());
                labelsMap.put(KubernetesConstants.Label.RESOURCE_BIZ_TYPE_KEY, MCP_SERVER_BIZ_TYPE_VALUE);
                route.setCustomLabels(labelsMap);
                return kubernetesModelConverter.route2Ingress(route);
        }

        private V1ConfigMap buildSystemConfigMap(McpServerConfigMap mcpServerConfigMap) {
                V1ConfigMap configMap = new V1ConfigMap();
                V1ObjectMeta metadata = new V1ObjectMeta();
                configMap.metadata(metadata);
                metadata.setName(DEFAULT_CONFIG_NAME);
                if (Objects.isNull(mcpServerConfigMap)) {
                        mcpServerConfigMap = new McpServerConfigMap();
                        mcpServerConfigMap.setEnable(true);
                }
                Map<String, Object> configurations = MapUtil.of("mcpServer", mcpServerConfigMap);
                String rawConfigurations = KubernetesUtil.toYaml(configurations);
                configMap.setData(MapUtil.of(DEFAULT_CONFIG_NAME_HIGRESS_KEY, rawConfigurations));
                return configMap;
        }

        @Test
        public void testRedisConfigurationValidation() throws Exception {
                // Test case where Redis configuration is a placeholder
                McpServerConfigMap mcpConfig = new McpServerConfigMap();
                mcpConfig.setEnable(true);

                // Only set address as placeholder, use real values for username and password
                McpServerConfigMap.RedisConfig redisConfig = new McpServerConfigMap.RedisConfig();
                redisConfig.setAddress(REDIS_PLACEHOLDER_ADDRESS);
                redisConfig.setPassword("real_password");
                redisConfig.setUsername("real_username");
                redisConfig.setDb(0);
                mcpConfig.setRedis(redisConfig);

                V1ConfigMap configMap = buildSystemConfigMap(mcpConfig);
                when(kubernetesClientService.readConfigMap(KubernetesConstants.HIGRESS_CONFIG)).thenReturn(configMap);

                // Create OpenAPI type MCP Server
                McpServer mcpServer = new McpServer();
                mcpServer.setName("test-openapi-server");
                mcpServer.setType(McpServerTypeEnum.OPEN_API);
                mcpServer.setDescription("Test OpenAPI Server");

                // Verify that ValidationException is thrown
                Assertions.assertThrows(ValidationException.class, () -> {
                        mcpServerService.addOrUpdate(mcpServer);
                });
        }
}
