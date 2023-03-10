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
package com.alibaba.higress.console.service.kubernetes;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginInstance;
import com.alibaba.higress.console.controller.dto.WasmPluginInstanceScope;
import com.alibaba.higress.console.controller.dto.route.CorsConfig;
import com.alibaba.higress.console.controller.dto.route.RoutePredicate;
import com.alibaba.higress.console.controller.dto.route.RoutePredicateTypeEnum;
import com.alibaba.higress.console.controller.dto.route.UpstreamService;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.PluginConfigAccessor;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.PluginConfigRuleAccessor;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.google.common.collect.ImmutableMap;

import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressBackend;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1IngressServiceBackend;
import io.kubernetes.client.openapi.models.V1IngressSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1TypedLocalObjectReference;

public class KubernetesModelConverterTest {

    private KubernetesModelConverter converter;

    @BeforeEach
    public void setUp() {
        converter = new KubernetesModelConverter();
    }

    @AfterEach
    public void tearDown() {
        converter = null;
    }

    @Test
    public void isIngressSupportedTestMissingMetadata() {
        V1Ingress ingress = buildBasicSupportedIngress();
        ingress.setMetadata(null);
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMissingSpec() {
        V1Ingress ingress = buildBasicSupportedIngress();
        ingress.setSpec(null);
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMissingRules() {
        V1Ingress ingress = buildBasicSupportedIngress();
        ingress.getSpec().setRules(null);
        Assertions.assertFalse(converter.isIngressSupported(ingress));

        ingress.getSpec().setRules(Collections.emptyList());
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMultipleRules() {
        V1Ingress ingress = buildBasicSupportedIngress();
        List<V1IngressRule> rules = ingress.getSpec().getRules();
        rules.add(rules.get(0));
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMissingHttpRule() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1IngressRule rule = ingress.getSpec().getRules().get(0);
        rule.setHttp(null);
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMissingPath() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1HTTPIngressRuleValue httpRule = ingress.getSpec().getRules().get(0).getHttp();
        httpRule.setPaths(null);
        Assertions.assertFalse(converter.isIngressSupported(ingress));

        httpRule.setPaths(Collections.emptyList());
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMultiplePaths() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1HTTPIngressRuleValue httpRule = ingress.getSpec().getRules().get(0).getHttp();
        List<V1HTTPIngressPath> paths = httpRule.getPaths();
        paths.add(paths.get(0));
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestUnsupportedPathType() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.IMPLEMENTATION_SPECIFIC);
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestMissingBackend() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setBackend(null);
        Assertions.assertTrue(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestServiceBackend() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1IngressBackend backend = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0).getBackend();
        backend.setService(new V1IngressServiceBackend());
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestNonMcpBackend() {
        V1Ingress ingress = buildBasicSupportedIngress();
        V1IngressBackend backend = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0).getBackend();
        V1TypedLocalObjectReference reference = backend.getResource();
        reference.setName("DummyKind");
        Assertions.assertFalse(converter.isIngressSupported(ingress));
    }

    @Test
    public void isIngressSupportedTestAllGood() {
        V1Ingress ingress = buildBasicSupportedIngress();
        Assertions.assertTrue(converter.isIngressSupported(ingress));
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleService() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, 100);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithWeight() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "10% hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, 10);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithPort() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, null, 100);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithPortAndVersion() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080 v1");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, "v1", 100);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathMultipleServices() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "20% hello1.default.svc.cluster.local:8080\n"
                + "30% hello2.default.svc.cluster.local:18080 v1\n50% hello3.default.svc.cluster.local v2");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service1 = new UpstreamService("hello1.default.svc.cluster.local", 8080, null, 20);
        UpstreamService service2 = new UpstreamService("hello2.default.svc.cluster.local", 18080, "v1", 30);
        UpstreamService service3 = new UpstreamService("hello3.default.svc.cluster.local", null, "v2", 50);
        expectedRoute.setServices(Arrays.asList(service1, service2, service3));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestExactPathSingleService() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.EXACT);
        path.setPath("/foo");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, 100);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestRegularPathSingleService() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.USE_REGEX_KEY,
            KubernetesConstants.Annotation.TRUE_VALUE);

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/route_\\d+");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue(path.getPath());
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, 100);
        expectedRoute.setServices(Collections.singletonList(service));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void route2IngressTestPrefixPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, null);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithWeight() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", null, null, 15);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithPort() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, null, null);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithPortAndVersion() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, "v1", 100);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathMultipleServices() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service1 = new UpstreamService("hello1.default.svc.cluster.local", 8080, null, 20);
        UpstreamService service2 = new UpstreamService("hello2.default.svc.cluster.local", 18080, "v1", 30);
        UpstreamService service3 = new UpstreamService("hello3.default.svc.cluster.local", null, "v2", 50);
        route.setServices(Arrays.asList(service1, service2, service3));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "20% hello1.default.svc.cluster.local:8080\n"
                + "30% hello2.default.svc.cluster.local:18080 v1\n50% hello3.default.svc.cluster.local v2");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestExactPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        pathPredicate.setCaseSensitive(null);
        pathPredicate.setMatchValue("/");
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, "v1", 100);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.EXACT);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestRegularPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        pathPredicate.setMatchValue("/route_\\d+");
        pathPredicate.setCaseSensitive(null);
        UpstreamService service = new UpstreamService("hello.default.svc.cluster.local", 8080, "v1", 100);
        route.setServices(Collections.singletonList(service));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION,
            "hello.default.svc.cluster.local:8080");
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.USE_REGEX_KEY,
            KubernetesConstants.Annotation.TRUE_VALUE);

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void wasmPluginInstance2CrTestGlobal() {
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName("test-plugin");
        plugin.setPhase(PluginPhase.AUTHZ.getName());
        plugin.setPriority(1000);
        plugin.setImageRepository("oci://localhost/test-plugin");
        plugin.setVersion("1.0.0");

        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setName(plugin.getName());
        instance.setScope(WasmPluginInstanceScope.GLOBAL);
        instance.setConfigurations(ImmutableMap.of("a", 1, "b", ":", "c", Arrays.asList(1, 2, 3)));

        V1alpha1WasmPlugin cr = converter.wasmPluginInstance2Cr(instance, plugin);

        V1alpha1WasmPlugin expectedCr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        expectedCr.setMetadata(metadata);
        metadata.setName(instance.getScope().getId() + CommonKey.DASH + plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, instance.getScope().getId());
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        expectedCr.setSpec(expectedSpec);
        expectedSpec.setPhase(plugin.getPhase());
        expectedSpec.setPriority(plugin.getPriority());
        expectedSpec.setUrl(plugin.getImageRepository() + CommonKey.COLON + plugin.getVersion());
        PluginConfigAccessor expectedConfig = new PluginConfigAccessor();
        expectedConfig.setConfigurations(instance.getConfigurations());
        expectedSpec.setPluginConfig(expectedConfig.toMap());

        Assertions.assertEquals(expectedCr, cr);
    }

    @Test
    public void wasmPluginInstance2CrTestGlobalWithCustomImage() {
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName("test-plugin");
        plugin.setPhase(PluginPhase.AUTHZ.getName());
        plugin.setPriority(1000);
        plugin.setImageRepository("oci://localhost/test-plugin");
        plugin.setVersion("1.0.0");

        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setName(plugin.getName());
        instance.setScope(WasmPluginInstanceScope.GLOBAL);
        instance.setConfigurations(ImmutableMap.of("a", 1, "b", ":", "c", Arrays.asList(1, 2, 3)));
        instance.setImageRepository("oci://www.test.com/test-plugin");
        instance.setImageVersion("0.0.1");

        V1alpha1WasmPlugin cr = converter.wasmPluginInstance2Cr(instance, plugin);

        V1alpha1WasmPlugin expectedCr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        expectedCr.setMetadata(metadata);
        metadata.setName(instance.getScope().getId() + CommonKey.DASH + plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, instance.getScope().getId());
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        expectedCr.setSpec(expectedSpec);
        expectedSpec.setPhase(plugin.getPhase());
        expectedSpec.setPriority(plugin.getPriority());
        expectedSpec.setUrl(instance.getImageRepository() + CommonKey.COLON + instance.getImageVersion());
        PluginConfigAccessor expectedConfig = new PluginConfigAccessor();
        expectedConfig.setConfigurations(instance.getConfigurations());
        expectedSpec.setPluginConfig(expectedConfig.toMap());

        Assertions.assertEquals(expectedCr, cr);
    }

    @Test
    public void wasmPluginInstance2CrTestDomain() {
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName("test-plugin");
        plugin.setPhase(PluginPhase.AUTHZ.getName());
        plugin.setPriority(1000);
        plugin.setImageRepository("oci://localhost/test-plugin");
        plugin.setVersion("1.0.0");

        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setName(plugin.getName());
        instance.setScope(WasmPluginInstanceScope.DOMAIN);
        instance.setTarget("www.test.com");
        instance.setConfigurations(ImmutableMap.of("a", 1, "b", ":", "c", List.of(1, 2, 3)));

        V1alpha1WasmPlugin cr = converter.wasmPluginInstance2Cr(instance, plugin);

        V1alpha1WasmPlugin expectedCr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        expectedCr.setMetadata(metadata);
        metadata.setName(
            instance.getScope().getId() + CommonKey.DASH + instance.getTarget() + CommonKey.DASH + plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, instance.getScope().getId());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_TARGET_KEY, instance.getTarget());
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        expectedCr.setSpec(expectedSpec);
        expectedSpec.setPhase(plugin.getPhase());
        expectedSpec.setPriority(plugin.getPriority());
        expectedSpec.setUrl(plugin.getImageRepository() + CommonKey.COLON + plugin.getVersion());
        PluginConfigAccessor expectedConfig = new PluginConfigAccessor();
        PluginConfigRuleAccessor expectedRule = new PluginConfigRuleAccessor();
        expectedRule.setMatchDomains(List.of(instance.getTarget()));
        expectedRule.setConfigurations(instance.getConfigurations());
        expectedConfig.setRules(List.of(expectedRule));
        expectedSpec.setPluginConfig(expectedConfig.toMap());

        Assertions.assertEquals(expectedCr, cr);
    }

    @Test
    public void wasmPluginInstance2CrTestRoute() {
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName("test-plugin");
        plugin.setPhase(PluginPhase.AUTHZ.getName());
        plugin.setPriority(1000);
        plugin.setImageRepository("oci://localhost/test-plugin");
        plugin.setVersion("1.0.0");

        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setName(plugin.getName());
        instance.setScope(WasmPluginInstanceScope.ROUTE);
        instance.setTarget("test-route");
        instance.setConfigurations(ImmutableMap.of("a", 1, "b", ":", "c", List.of(1, 2, 3)));

        V1alpha1WasmPlugin cr = converter.wasmPluginInstance2Cr(instance, plugin);

        V1alpha1WasmPlugin expectedCr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        expectedCr.setMetadata(metadata);
        metadata.setName(
            instance.getScope().getId() + CommonKey.DASH + instance.getTarget() + CommonKey.DASH + plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, plugin.getName());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, instance.getScope().getId());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_TARGET_KEY, instance.getTarget());
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        expectedCr.setSpec(expectedSpec);
        expectedSpec.setPhase(plugin.getPhase());
        expectedSpec.setPriority(plugin.getPriority());
        expectedSpec.setUrl(plugin.getImageRepository() + CommonKey.COLON + plugin.getVersion());
        PluginConfigAccessor expectedConfig = new PluginConfigAccessor();
        PluginConfigRuleAccessor expectedRule = new PluginConfigRuleAccessor();
        expectedRule.setMatchRoutes(List.of(instance.getTarget()));
        expectedRule.setConfigurations(instance.getConfigurations());
        expectedConfig.setRules(List.of(expectedRule));
        expectedSpec.setPluginConfig(expectedConfig.toMap());

        Assertions.assertEquals(expectedCr, cr);
    }

    @Test
    public void wasmPluginCr2InstanceTestGlobal() {
        WasmPluginInstanceScope scope = WasmPluginInstanceScope.GLOBAL;
        String pluginName = "test-plugin";
        String imageRepository = "oci://localhost/test-plugin";
        String version = "1.0.0";

        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        cr.setMetadata(metadata);
        metadata.setName(scope.getId() + CommonKey.DASH + pluginName);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, pluginName);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, scope.getId());
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        cr.setSpec(expectedSpec);
        expectedSpec.setPhase(PluginPhase.AUTHN.getName());
        expectedSpec.setPriority(1000);
        expectedSpec.setUrl(imageRepository + CommonKey.COLON + version);
        PluginConfigAccessor config = new PluginConfigAccessor();
        Map<String, Object> configurations = ImmutableMap.of("a", 1, "b", ":", "c", List.of(1, 2, 3));
        config.setConfigurations(configurations);
        expectedSpec.setPluginConfig(config.toMap());

        WasmPluginInstance instance = converter.wasmPluginCr2Instance(cr);

        WasmPluginInstance expectedInstance = new WasmPluginInstance();
        expectedInstance.setName(pluginName);
        expectedInstance.setScope(scope);
        expectedInstance.setImageRepository(imageRepository);
        expectedInstance.setImageVersion(version);
        expectedInstance.setConfigurations(configurations);

        Assertions.assertEquals(expectedInstance, instance);
    }

    @Test
    public void wasmPluginCr2InstanceTestDomain() {
        WasmPluginInstanceScope scope = WasmPluginInstanceScope.DOMAIN;
        String target = "www.test.com";
        String pluginName = "test-plugin";
        String imageRepository = "oci://localhost/test-plugin";
        String version = "1.0.0";

        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        cr.setMetadata(metadata);
        metadata.setName(scope.getId() + CommonKey.DASH + pluginName + CommonKey.DASH + target);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, pluginName);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, scope.getId());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_TARGET_KEY, target);
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        cr.setSpec(expectedSpec);
        expectedSpec.setPhase(PluginPhase.AUTHN.getName());
        expectedSpec.setPriority(1000);
        expectedSpec.setUrl(imageRepository + CommonKey.COLON + version);
        PluginConfigAccessor config = new PluginConfigAccessor();
        Map<String, Object> configurations = ImmutableMap.of("a", 1, "b", ":", "c", Arrays.asList(1, 2, 3));
        PluginConfigRuleAccessor rule = new PluginConfigRuleAccessor();
        rule.setMatchDomains(List.of(target));
        rule.setConfigurations(configurations);
        config.setRules(List.of(rule));
        expectedSpec.setPluginConfig(config.toMap());

        WasmPluginInstance instance = converter.wasmPluginCr2Instance(cr);

        WasmPluginInstance expectedInstance = new WasmPluginInstance();
        expectedInstance.setName(pluginName);
        expectedInstance.setScope(scope);
        expectedInstance.setTarget(target);
        expectedInstance.setImageRepository(imageRepository);
        expectedInstance.setImageVersion(version);
        expectedInstance.setConfigurations(configurations);

        Assertions.assertEquals(expectedInstance, instance);
    }

    @Test
    public void wasmPluginCr2InstanceTestRoute() {
        WasmPluginInstanceScope scope = WasmPluginInstanceScope.ROUTE;
        String target = "test-route";
        String pluginName = "test-plugin";
        String imageRepository = "oci://localhost/test-plugin";
        String version = "1.0.0";

        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1ObjectMeta metadata = new V1ObjectMeta();
        cr.setMetadata(metadata);
        metadata.setName(scope.getId() + CommonKey.DASH + pluginName + CommonKey.DASH + target);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, pluginName);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_SCOPE_KEY, scope.getId());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_TARGET_KEY, target);
        V1alpha1WasmPluginSpec expectedSpec = new V1alpha1WasmPluginSpec();
        cr.setSpec(expectedSpec);
        expectedSpec.setPhase(PluginPhase.AUTHN.getName());
        expectedSpec.setPriority(1000);
        expectedSpec.setUrl(imageRepository + CommonKey.COLON + version);
        PluginConfigAccessor config = new PluginConfigAccessor();
        Map<String, Object> configurations = ImmutableMap.of("a", 1, "b", ":", "c", Arrays.asList(1, 2, 3));
        PluginConfigRuleAccessor rule = new PluginConfigRuleAccessor();
        rule.setMatchDomains(List.of(target));
        rule.setConfigurations(configurations);
        config.setRules(List.of(rule));
        expectedSpec.setPluginConfig(config.toMap());

        WasmPluginInstance instance = converter.wasmPluginCr2Instance(cr);

        WasmPluginInstance expectedInstance = new WasmPluginInstance();
        expectedInstance.setName(pluginName);
        expectedInstance.setScope(scope);
        expectedInstance.setTarget(target);
        expectedInstance.setImageRepository(imageRepository);
        expectedInstance.setImageVersion(version);
        expectedInstance.setConfigurations(configurations);

        Assertions.assertEquals(expectedInstance, instance);
    }

    private V1Ingress buildBasicSupportedIngress() {
        V1Ingress ingress = new V1Ingress();

        V1ObjectMeta metadata = new V1ObjectMeta();
        ingress.setMetadata(metadata);

        V1IngressSpec spec = new V1IngressSpec();
        ingress.setSpec(spec);

        V1IngressRule rule = new V1IngressRule();

        List<V1IngressRule> rules = new ArrayList<>();
        rules.add(rule);
        spec.setRules(rules);

        V1HTTPIngressRuleValue httpRule = new V1HTTPIngressRuleValue();
        rule.setHttp(httpRule);

        V1HTTPIngressPath path = new V1HTTPIngressPath();

        List<V1HTTPIngressPath> paths = new ArrayList<>();
        paths.add(path);
        httpRule.setPaths(paths);

        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        V1IngressBackend backend = new V1IngressBackend();
        V1TypedLocalObjectReference reference = new V1TypedLocalObjectReference();
        reference.setApiGroup(V1McpBridge.API_GROUP);
        reference.setKind(V1McpBridge.KIND);
        reference.setName(V1McpBridge.DEFAULT_NAME);
        backend.setResource(reference);
        path.setBackend(backend);

        return ingress;
    }

    private static Route buildBasicRoute() {
        Route route = new Route();
        route.setDomains(new ArrayList<>());
        route.setPath(new RoutePredicate());
        route.setCors(new CorsConfig());
        return route;
    }
}
