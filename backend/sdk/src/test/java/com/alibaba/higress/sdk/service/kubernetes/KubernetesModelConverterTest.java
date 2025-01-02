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

package com.alibaba.higress.sdk.service.kubernetes;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;


import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.route.Header;
import com.alibaba.higress.sdk.model.route.HeaderControlConfig;
import com.alibaba.higress.sdk.model.route.HeaderControlStageConfig;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass.V1GatewayClass;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1Gateway;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1GatewaySpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1GatewaySpecListeners;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1GatewaySpecTls;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRoute;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecBackendRefs;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecFilters;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecHeaders;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecMatches;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecParentRefs;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecPath;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecQueryParams;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecRequestHeaderModifier;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecRequestHeaderModifierAdd;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecResponseHeaderModifier;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecRules;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecUrlRewrite;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecUrlRewritePath;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.TlsCertificate;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.route.CorsConfig;
import com.alibaba.higress.sdk.model.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.alibaba.higress.sdk.util.TypeUtil;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressBackend;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1IngressServiceBackend;
import io.kubernetes.client.openapi.models.V1IngressSpec;
import io.kubernetes.client.openapi.models.V1IngressTLS;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.openapi.models.V1TypedLocalObjectReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;

public class KubernetesModelConverterTest {

    private KubernetesModelConverter converter;

    @BeforeEach
    public void setUp() {
        KubernetesClientService service = mock(KubernetesClientService.class);
        converter = new KubernetesModelConverter(service);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "10% hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local:8080 v1");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "20% hello1.default.svc.cluster.local:8080\n"
                + "30% hello2.default.svc.cluster.local:18080 v1\n50% hello3.default.svc.cluster.local v2");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.EXACT);
        path.setPath("/foo");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.USE_REGEX_KEY,
            KubernetesConstants.Annotation.TRUE_VALUE);

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/route_\\d+");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(true);
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
    void route2IngressTestMultipleDomainsThrowsException() {
        Route route = new Route();
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setPath(RoutePredicate.builder().matchType("exact").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        Assertions.assertThrows(IllegalArgumentException.class, () -> converter.route2Ingress(route));
    }

    @Test
    void route2IngressTestInvalidPathMatchTypeThrowsException() {
        Route route = new Route();
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setPath(RoutePredicate.builder().matchType("invalid").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        Assertions.assertThrows(IllegalArgumentException.class, () -> converter.route2Ingress(route));
    }

    @Test
    void route2IngressTestCustomAnnotationsValidInputSuccess() {
        Route route = new Route();
        route.setName("test-route");
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setCustomConfigs(Collections.singletonMap("custom.higress.cn", "value"));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertEquals("value", ingress.getMetadata().getAnnotations().get("custom.higress.cn"));
    }

    @Test
    void route2IngressTestCustomAnnotationsThrowsValidationException() {
        Route route = new Route();
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setCustomConfigs(Collections.singletonMap("higress.io/enable-proxy-next-upstream", "value"));

        Assertions.assertThrows(ValidationException.class, () -> converter.route2Ingress(route));
    }

    @Test
    void route2IngressTestCorsConfigSuccess() {
        Route route = new Route();
        route.setName("test-route");
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setCors(new CorsConfig(true, // enabled (Boolean)
            Collections.singletonList("https://higress.cn"), // allowOrigins (List<String>)
            Collections.singletonList("GET"), // allowMethods (List<String>)
            Collections.singletonList("Content-Type"), // allowHeaders (List<String>)
            Collections.singletonList("Content-Length"), // exposeHeaders (List<String>)
            3600, // maxAge (Integer)
            true // allowCredentials (Boolean)
        ));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertTrue(Boolean
            .parseBoolean(ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_ENABLED_KEY)));
        Assertions.assertEquals("3600",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_MAX_AGE_KEY));
        Assertions.assertTrue(Boolean.parseBoolean(
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_CREDENTIALS_KEY)));
        Assertions.assertEquals("https://higress.cn",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_ORIGIN_KEY));
        Assertions.assertEquals("Content-Type",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_HEADERS_KEY));
        Assertions.assertEquals("GET",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_METHODS_KEY));
        Assertions.assertEquals("Content-Length",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.CORS_EXPOSE_HEADERS_KEY));
    }

    @Test
    void route2IngressTestMethodsSuccess() {
        Route route = new Route();
        route.setName("test-route");
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setMethods(Collections.singletonList("GET"));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertEquals("GET",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.METHOD_KEY));
    }

    @Test
    void route2IngressTestRewriteConfig() {
        Route route = new Route();
        route.setName("test-route");
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setRewrite(new RewriteConfig(true, "/new-path", "new-host"));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertTrue(Boolean.parseBoolean(
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.REWRITE_ENABLED_KEY)));
        Assertions.assertEquals("/new-path",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.REWRITE_PATH_KEY));
        Assertions.assertEquals("new-host",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.UPSTREAM_VHOST_KEY));
    }

    @Test
    void route2IngressTestProxyNextUpstreamConfig() {
        Route route = new Route();
        route.setName("test-route");
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setProxyNextUpstream(new ProxyNextUpstreamConfig(true, 2, 10, new String[] {"$http_4xx"}));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertTrue(Boolean.parseBoolean(ingress.getMetadata().getAnnotations()
            .get(KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_ENABLED_KEY)));
        Assertions.assertEquals("2",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TRIES_KEY));
        Assertions.assertEquals("10",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TIMEOUT_KEY));
        Assertions.assertEquals("$http_4xx",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_KEY));
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
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
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.DESTINATION_KEY,
            "hello.default.svc.cluster.local:8080");
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.USE_REGEX_KEY,
            KubernetesConstants.Annotation.TRUE_VALUE);

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicate.getMatchValue());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    void domain2ConfigMapTestNormalizeDomainName() {
        V1ConfigMap domainConfigMap = new V1ConfigMap();
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(converter.domainName2ConfigMapName("domain-name"));
        metadata.setResourceVersion("0.0.1");
        metadata.setLabels(Map.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY,
            KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_DOMAIN));
        Map<String, String> configMap = new HashMap<>();
        configMap.put("workMode", "ingress");
        configMap.put(CommonKey.DOMAIN, "domain-name");
        configMap.put(KubernetesConstants.K8S_CERT, "{443:\"domain-cert\"}");
        configMap.put(KubernetesConstants.K8S_ENABLE_HTTPS, "domain-https");
        domainConfigMap.metadata(metadata);
        domainConfigMap.data(configMap);
        Domain domain = new Domain();
        domain.setName("domain-name");
        domain.setVersion("0.0.1");
        Map<Integer, String> portAndCertMap = new HashMap<>();
        portAndCertMap.put(443, "domain-cert");
        domain.setPortAndCertMap(portAndCertMap);
        domain.setEnableHttps("domain-https");
        V1ConfigMap target = converter.domain2ConfigMap(domain);
        Assertions.assertEquals(domainConfigMap, target);
    }

    @Test
    void configMap2DomainTestValidConfigMapShouldReturnDomain() {
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setResourceVersion("1");

        Map<String, String> data = new HashMap<>();
        data.put(CommonKey.DOMAIN, "higress.cn");
        data.put(KubernetesConstants.K8S_CERT, "cert-identifier");
        data.put(KubernetesConstants.K8S_ENABLE_HTTPS, "true");

        V1ConfigMap configMap = new V1ConfigMap();
        configMap.setMetadata(metadata);
        configMap.setData(data);

        Domain domain = converter.configMap2Domain(configMap);

        Assertions.assertNotNull(domain);
        Assertions.assertEquals("higress.cn", domain.getName());
        Assertions.assertEquals("1", domain.getVersion());
        Assertions.assertEquals("cert-identifier", domain.getPortAndCertMap().get(443));
        Assertions.assertEquals("true", domain.getEnableHttps());
    }

    @Test
    void configMap2DomainTestNullMetadataShouldReturnDomainWithNullVersion() {
        Map<String, String> data = new HashMap<>();
        data.put(CommonKey.DOMAIN, "higress.cn");

        V1ConfigMap configMap = new V1ConfigMap();
        configMap.setData(data);

        Domain domain = converter.configMap2Domain(configMap);

        Assertions.assertNotNull(domain);
        Assertions.assertEquals("higress.cn", domain.getName());
        Assertions.assertNull(domain.getVersion());
        Assertions.assertNull(domain.getPortAndCertMap());
        Assertions.assertNull(domain.getEnableHttps());
    }

    @Test
    void configMap2DomainTestNullDataShouldThrowIllegalArgumentException() {
        V1ConfigMap configMap = new V1ConfigMap();
        configMap.setData(null);

        IllegalArgumentException exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            converter.configMap2Domain(configMap);
        });
        Assertions.assertEquals("No data is found in the ConfigMap.", exception.getMessage());
    }

    @Test
    void configMap2DomainTestMissingFieldsShouldReturnDomainWithNullFields() {
        Map<String, String> data = new HashMap<>();
        data.put(CommonKey.DOMAIN, "higress.cn");

        V1ConfigMap configMap = new V1ConfigMap();
        configMap.setData(data);

        Domain domain = converter.configMap2Domain(configMap);

        Assertions.assertNotNull(domain);
        Assertions.assertEquals("higress.cn", domain.getName());
        Assertions.assertNull(domain.getPortAndCertMap());
        Assertions.assertNull(domain.getEnableHttps());
    }

    @Test
    void tlsCertificate2SecretTestValidCertificateWithoutDomainsShouldNotSetLabels() {
        TlsCertificate certificate = TlsCertificate.builder().cert("dummyCert").key("dummyKey").name("test-certificate")
            .version("1").domains(Collections.emptyList()).build();

        V1Secret secret = converter.tlsCertificate2Secret(certificate);

        Assertions.assertNotNull(secret);
        Assertions.assertEquals(KubernetesConstants.SECRET_TYPE_TLS, secret.getType());
        Assertions.assertEquals("test-certificate", secret.getMetadata().getName());
        Assertions.assertEquals("1", secret.getMetadata().getResourceVersion());

        Map<String, byte[]> data = secret.getData();
        Assertions.assertNotNull(data);
        Assertions.assertEquals(2, data.size());
        Assertions.assertArrayEquals(TypeUtil.string2Bytes("dummyCert"),
            data.get(KubernetesConstants.SECRET_TLS_CRT_FIELD));
        Assertions.assertArrayEquals(TypeUtil.string2Bytes("dummyKey"),
            data.get(KubernetesConstants.SECRET_TLS_KEY_FIELD));

        Map<String, String> labels = secret.getMetadata().getLabels();
        Assertions.assertNull(labels);
    }

    @Test
    void secret2TlsCertificateTestValidSecretWithoutCertAndKeyShouldReturnTlsCertificateWithoutCertAndKey() {
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta() {
            {
                setName("test-secret");
                setResourceVersion("123");
            }
        });

        TlsCertificate tlsCertificate = converter.secret2TlsCertificate(secret);

        Assertions.assertNotNull(tlsCertificate);
        Assertions.assertEquals("test-secret", tlsCertificate.getName());
        Assertions.assertEquals("123", tlsCertificate.getVersion());
        Assertions.assertNull(tlsCertificate.getCert());
        Assertions.assertNull(tlsCertificate.getKey());
        Assertions.assertNull(tlsCertificate.getValidityStart());
        Assertions.assertNull(tlsCertificate.getValidityEnd());
        Assertions.assertNull(tlsCertificate.getDomains());
    }

    @Test
    void secret2TlsCertificateTestNullMetadataShouldReturnTlsCertificateWithoutNameAndVersion() {
        V1Secret secret = new V1Secret();
        secret.setData(new HashMap<String, byte[]>() {
            {
                put(KubernetesConstants.SECRET_TLS_CRT_FIELD, "certData".getBytes());
                put(KubernetesConstants.SECRET_TLS_KEY_FIELD, "keyData".getBytes());
            }
        });

        TlsCertificate tlsCertificate = converter.secret2TlsCertificate(secret);

        Assertions.assertNotNull(tlsCertificate);
        Assertions.assertNull(tlsCertificate.getName());
        Assertions.assertNull(tlsCertificate.getVersion());
        Assertions.assertEquals("certData", tlsCertificate.getCert());
        Assertions.assertEquals("keyData", tlsCertificate.getKey());
    }

    @Test
    void secret2TlsCertificateTestEmptyDataShouldReturnTlsCertificateWithoutCertAndKey() {
        V1Secret secret = new V1Secret();
        secret.setMetadata(new V1ObjectMeta() {
            {
                setName("test-secret");
                setResourceVersion("123");
            }
        });
        secret.setData(Collections.emptyMap());

        TlsCertificate tlsCertificate = converter.secret2TlsCertificate(secret);

        Assertions.assertNotNull(tlsCertificate);
        Assertions.assertEquals("test-secret", tlsCertificate.getName());
        Assertions.assertEquals("123", tlsCertificate.getVersion());
        Assertions.assertNull(tlsCertificate.getCert());
        Assertions.assertNull(tlsCertificate.getKey());
        Assertions.assertNull(tlsCertificate.getValidityStart());
        Assertions.assertNull(tlsCertificate.getValidityEnd());
        Assertions.assertNull(tlsCertificate.getDomains());
    }

    @Test
    void wasmPluginFromCrTestWithValidInputShouldReturnWasmPlugin() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        cr.setMetadata(createMetadata());
        cr.setSpec(createSpec());

        WasmPlugin plugin = converter.wasmPluginFromCr(cr);

        Assertions.assertNotNull(plugin);
        Assertions.assertEquals("test-plugin", plugin.getName());
        Assertions.assertEquals("v1", plugin.getPluginVersion());
        Assertions.assertEquals("test-category", plugin.getCategory());
        Assertions.assertEquals(Boolean.TRUE, plugin.getBuiltIn());
        Assertions.assertEquals("Test Plugin", plugin.getTitle());
        Assertions.assertEquals("A test plugin", plugin.getDescription());
        Assertions.assertEquals("icon.png", plugin.getIcon());
        Assertions.assertEquals("test/image", plugin.getImageRepository());
        Assertions.assertEquals("v1", plugin.getImageVersion());
        Assertions.assertEquals(PluginPhase.UNSPECIFIED.getName(), plugin.getPhase());
        Assertions.assertEquals(10, plugin.getPriority());
    }

    @Test
    void wasmPluginFromCrTestWithMissingFieldsShouldHandleGracefully() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        cr.setMetadata(createMetadata());
        cr.setSpec(createSpec());

        cr.getMetadata().getLabels().remove(KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY);
        cr.getMetadata().getLabels().remove(KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY);
        cr.getSpec().setUrl("image");

        WasmPlugin plugin = converter.wasmPluginFromCr(cr);

        Assertions.assertNotNull(plugin);
        Assertions.assertEquals(null, plugin.getName());
        Assertions.assertEquals(null, plugin.getPluginVersion());
        Assertions.assertEquals("test-category", plugin.getCategory());
        Assertions.assertEquals(Boolean.TRUE, plugin.getBuiltIn());
        Assertions.assertEquals("Test Plugin", plugin.getTitle());
        Assertions.assertEquals("A test plugin", plugin.getDescription());
        Assertions.assertEquals("icon.png", plugin.getIcon());
        Assertions.assertEquals("image", plugin.getImageRepository());
        Assertions.assertEquals(null, plugin.getImageVersion());
        Assertions.assertEquals(PluginPhase.UNSPECIFIED.getName(), plugin.getPhase());
        Assertions.assertEquals(10, plugin.getPriority());
    }

    @Test
    void wasmPluginToCrTestValidInput_ShouldConvertCorrectly() {
        WasmPlugin plugin = WasmPlugin.builder().name("test-plugin").pluginVersion("1.0.0").version("1")
            .category("test-category").title("Test Plugin").description("A test plugin").icon("test-icon").builtIn(true)
            .imageRepository("test-repository").imageVersion("test-version").phase("test-phase").priority(10).build();

        V1alpha1WasmPlugin cr = converter.wasmPluginToCr(plugin);

        Assertions.assertNotNull(cr);
        Assertions.assertNotNull(cr.getMetadata());
        Assertions.assertEquals("test-plugin-1.0.0", cr.getMetadata().getName());
        Assertions.assertEquals("1", cr.getMetadata().getResourceVersion());

        Assertions.assertEquals("test-plugin",
            cr.getMetadata().getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY));
        Assertions.assertEquals("1.0.0",
            cr.getMetadata().getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY));
        Assertions.assertEquals("test-category",
            cr.getMetadata().getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_CATEGORY_KEY));
        Assertions.assertEquals("true",
            cr.getMetadata().getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_BUILT_IN_KEY));

        Assertions.assertEquals("Test Plugin",
            cr.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.WASM_PLUGIN_TITLE_KEY));
        Assertions.assertEquals("A test plugin",
            cr.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.WASM_PLUGIN_DESCRIPTION_KEY));
        Assertions.assertEquals("test-icon",
            cr.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.WASM_PLUGIN_ICON_KEY));

        Assertions.assertNotNull(cr.getSpec());
        Assertions.assertEquals("test-phase", cr.getSpec().getPhase());
        Assertions.assertEquals(10, cr.getSpec().getPriority().intValue());
        Assertions.assertEquals("oci://test-repository:test-version", cr.getSpec().getUrl());
    }

    @Test
    void wasmPluginToCrTestNullImageRepositoryShouldHandleCorrectly() {
        WasmPlugin plugin = WasmPlugin.builder().name("test-plugin").pluginVersion("1.0.0").version("1")
            .imageRepository(null).imageVersion("test-version").build();

        V1alpha1WasmPlugin cr = converter.wasmPluginToCr(plugin);

        Assertions.assertNotNull(cr);
        Assertions.assertNotNull(cr.getSpec());
        Assertions.assertEquals(null, cr.getSpec().getUrl());
    }

    @Test
    void wasmPluginToCrTestEmptyImageVersionShouldHandleCorrectly() {
        WasmPlugin plugin = WasmPlugin.builder().name("test-plugin").pluginVersion("1.0.0").version("1")
            .imageRepository("test-repository").imageVersion("").build();

        V1alpha1WasmPlugin cr = converter.wasmPluginToCr(plugin);

        Assertions.assertNotNull(cr);
        Assertions.assertNotNull(cr.getSpec());
        Assertions.assertEquals("oci://test-repository", cr.getSpec().getUrl());
    }

    @Test
    void mergeWasmPluginSpecTestSourceSpecNullDestinationSpecUnchanged() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        srcPlugin.setSpec(null);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec dstSpec = new V1alpha1WasmPluginSpec();
        dstSpec.setDefaultConfig(new HashMap<>());
        dstPlugin.setSpec(dstSpec);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        Assertions.assertEquals(new HashMap<>(), dstPlugin.getSpec().getDefaultConfig());
    }

    @Test
    void mergeWasmPluginSpecTestDestinationSpecNullSetNewSpec() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec srcSpec = new V1alpha1WasmPluginSpec();
        srcSpec.setDefaultConfig(new HashMap<>());
        srcPlugin.setSpec(srcSpec);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        dstPlugin.setSpec(null);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        Assertions.assertEquals(new HashMap<>(), dstPlugin.getSpec().getDefaultConfig());
    }

    @Test
    void mergeWasmPluginSpecTestMatchRulesMergedAndSorted() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec srcSpec = new V1alpha1WasmPluginSpec();
        srcSpec.setMatchRules(new ArrayList<>());
        srcSpec.getMatchRules().add(MatchRule.forDomain("higress.cn"));
        srcSpec.getMatchRules().add(MatchRule.forDomain("test.higress.cn"));
        srcPlugin.setSpec(srcSpec);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec dstSpec = new V1alpha1WasmPluginSpec();
        dstSpec.setMatchRules(new ArrayList<>());
        dstSpec.getMatchRules().add(MatchRule.forDomain("higress.cn"));
        dstSpec.getMatchRules().add(MatchRule.forDomain("test.higress.cn"));
        dstPlugin.setSpec(dstSpec);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        List<MatchRule> expected = new ArrayList<>();
        expected.add(MatchRule.forDomain("higress.cn"));
        expected.add(MatchRule.forDomain("test.higress.cn"));

        Assertions.assertEquals(expected, dstPlugin.getSpec().getMatchRules());
    }

    @Test
    void mergeWasmPluginSpecTestEmptyMatchRulesNoChange() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec srcSpec = new V1alpha1WasmPluginSpec();
        srcSpec.setMatchRules(new ArrayList<>());
        srcPlugin.setSpec(srcSpec);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec dstSpec = new V1alpha1WasmPluginSpec();
        dstSpec.setMatchRules(new ArrayList<>());
        dstSpec.getMatchRules().add(MatchRule.forDomain("higress.cn"));
        dstPlugin.setSpec(dstSpec);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        List<MatchRule> expected = new ArrayList<>();
        expected.add(MatchRule.forDomain("higress.cn"));

        Assertions.assertEquals(expected, dstPlugin.getSpec().getMatchRules());
    }

    @Test
    void mergeWasmPluginSpecTestSrcSpecNullNoChangeToDstPlugin() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        srcPlugin.setSpec(null);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec dstSpec = new V1alpha1WasmPluginSpec();
        dstSpec.setDefaultConfig(new HashMap<>());
        dstPlugin.setSpec(dstSpec);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        Assertions.assertEquals(new HashMap<>(), dstPlugin.getSpec().getDefaultConfig());
    }

    @Test
    void mergeWasmPluginSpecTestDstSpecNullSetNewSpec() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec srcSpec = new V1alpha1WasmPluginSpec();
        srcSpec.setDefaultConfig(new HashMap<>());
        srcPlugin.setSpec(srcSpec);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        dstPlugin.setSpec(null);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        Assertions.assertEquals(new HashMap<>(), dstPlugin.getSpec().getDefaultConfig());
    }

    @Test
    void mergeWasmPluginSpecTestMatchRulesMergedAndSortedWithExistingRules() {
        V1alpha1WasmPlugin srcPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec srcSpec = new V1alpha1WasmPluginSpec();
        srcSpec.setMatchRules(new ArrayList<>());
        srcSpec.getMatchRules().add(MatchRule.forDomain("higress.cn"));
        srcSpec.getMatchRules().add(MatchRule.forDomain("test.higress.cn"));
        srcPlugin.setSpec(srcSpec);

        V1alpha1WasmPlugin dstPlugin = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec dstSpec = new V1alpha1WasmPluginSpec();
        dstSpec.setMatchRules(new ArrayList<>());
        dstSpec.getMatchRules().add(MatchRule.forDomain("higress.cn"));
        dstPlugin.setSpec(dstSpec);

        converter.mergeWasmPluginSpec(srcPlugin, dstPlugin);

        List<MatchRule> expected = new ArrayList<>();
        expected.add(MatchRule.forDomain("higress.cn"));
        expected.add(MatchRule.forDomain("test.higress.cn"));

        Assertions.assertEquals(expected, dstPlugin.getSpec().getMatchRules());
    }

    @Test
    void setWasmPluginInstanceToCrTestGlobalScopeConfigured() {
        V1alpha1WasmPlugin plugin = new V1alpha1WasmPlugin();
        plugin.setMetadata(createMetadata("global", "test-plugin", "v1"));
        plugin.setSpec(createSpecWithGlobalConfig());

        WasmPluginInstance instance =
            converter.getWasmPluginInstanceFromCr(plugin, WasmPluginInstanceScope.GLOBAL, null);
        Assertions.assertNotNull(instance);
        Assertions.assertEquals("v1", instance.getPluginVersion());
        Assertions.assertEquals(WasmPluginInstanceScope.GLOBAL, instance.getScope());
        Assertions.assertTrue(instance.getEnabled());
        Assertions.assertEquals(1, instance.getConfigurations().size());
        Assertions.assertEquals("value", instance.getConfigurations().get("key"));
    }

    @Test
    void setWasmPluginInstanceToCrTestDomainScopeNotConfigured() {
        V1alpha1WasmPlugin plugin = new V1alpha1WasmPlugin();
        plugin.setMetadata(createMetadata("domain", "test-plugin", "v1"));
        plugin.setSpec(createSpecWithDomainConfig("higress.cn"));

        WasmPluginInstance instance =
            converter.getWasmPluginInstanceFromCr(plugin, WasmPluginInstanceScope.DOMAIN, "higress.cn");
        Assertions.assertNotNull(instance);
        Assertions.assertEquals("v1", instance.getPluginVersion());
        Assertions.assertEquals(WasmPluginInstanceScope.DOMAIN, instance.getScope());
        Assertions.assertTrue(instance.getEnabled());
        Assertions.assertEquals(1, instance.getConfigurations().size());
        Assertions.assertEquals("value", instance.getConfigurations().get("key"));

        WasmPluginInstance instanceNotConfigured =
            converter.getWasmPluginInstanceFromCr(plugin, WasmPluginInstanceScope.DOMAIN, "nonexistent.com");
        Assertions.assertNull(instanceNotConfigured);
    }

    @Test
    void setWasmPluginInstanceToCrTestRouteScopeConfigured() {
        V1alpha1WasmPlugin plugin = new V1alpha1WasmPlugin();
        plugin.setMetadata(createMetadata("route", "test-plugin", "v1"));
        plugin.setSpec(createSpecWithRouteConfig("test-route"));

        WasmPluginInstance instance =
            converter.getWasmPluginInstanceFromCr(plugin, WasmPluginInstanceScope.ROUTE, "test-route");
        Assertions.assertNotNull(instance);
        Assertions.assertEquals("v1", instance.getPluginVersion());
        Assertions.assertEquals(WasmPluginInstanceScope.ROUTE, instance.getScope());
        Assertions.assertTrue(instance.getEnabled());
        Assertions.assertEquals(1, instance.getConfigurations().size());
        Assertions.assertEquals("value", instance.getConfigurations().get("key"));
    }

    @Test
    void setWasmPluginInstanceToCrTestGlobalScopeShouldSetDefaultConfig() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(Map.of("key", "value")).build();
        instance.setGlobalTarget();

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        Assertions.assertEquals(Map.of("key", "value"), spec.getDefaultConfig());
        Assertions.assertFalse(spec.getDefaultConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestDomainScopeShouldAddOrUpdateDomainRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(Map.of("key", "value")).build();
        instance.setTarget(WasmPluginInstanceScope.DOMAIN, "higress.cn");

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        List<MatchRule> matchRules = spec.getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule domainRule = matchRules.get(0);
        Assertions.assertTrue(domainRule.getDomain().contains("higress.cn"));
        Assertions.assertEquals(Map.of("key", "value"), domainRule.getConfig());
        Assertions.assertFalse(domainRule.getConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestDomainScopeExistingRuleShouldUpdateExistingDomainRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        spec.setMatchRules(
            List.of(new MatchRule(false, Map.of("key", "original"), List.of("higress.cn"), List.of(), List.of())));
        cr.setSpec(spec);

        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(Map.of("key", "updated")).build();
        instance.setTarget(WasmPluginInstanceScope.DOMAIN, "higress.cn");

        converter.setWasmPluginInstanceToCr(cr, instance);

        List<MatchRule> matchRules = cr.getSpec().getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule domainRule = matchRules.get(0);
        Assertions.assertTrue(domainRule.getDomain().contains("higress.cn"));
        Assertions.assertEquals(Map.of("key", "updated"), domainRule.getConfig());
        Assertions.assertFalse(domainRule.getConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestRouteScopeShouldAddOrUpdateRouteRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(Map.of("key", "value")).build();
        instance.setTarget(WasmPluginInstanceScope.ROUTE, "route-1");

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        List<MatchRule> matchRules = spec.getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule routeRule = matchRules.get(0);
        Assertions.assertTrue(routeRule.getIngress().contains("route-1"));
        Assertions.assertEquals(Map.of("key", "value"), routeRule.getConfig());
        Assertions.assertFalse(routeRule.getConfigDisable());
    }

    @Test
    void removeWasmPluginInstanceFromCrTestGlobalScopeTargetNullShouldRemoveDefaultConfig() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        Map<String, Object> config = new HashMap<>();
        config.put("key", "value");
        spec.setDefaultConfig(config);
        cr.setSpec(spec);
        boolean result = converter.removeWasmPluginInstanceFromCr(cr, WasmPluginInstanceScope.GLOBAL, null);

        Assertions.assertTrue(result);
        Assertions.assertNull(cr.getSpec().getDefaultConfig());
    }

    @Test
    void removeWasmPluginInstanceFromCrTestDomainScopeValidTargetShouldRemoveDomain() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        List<MatchRule> matchRules = new ArrayList<>();
        MatchRule rule = new MatchRule();
        rule.setDomain(new ArrayList<String>() {
            {
                add("higress.cn");
            }
        });
        matchRules.add(rule);
        spec.setMatchRules(matchRules);
        cr.setSpec(spec);

        boolean result = converter.removeWasmPluginInstanceFromCr(cr, WasmPluginInstanceScope.DOMAIN, "higress.cn");

        Assertions.assertTrue(result);
        Assertions.assertTrue(cr.getSpec().getMatchRules().isEmpty());
    }

    @Test
    void removeWasmPluginInstanceFromCrTestDomainScopeEmptyTargetShouldNotChange() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        List<MatchRule> matchRules = new ArrayList<>();
        MatchRule rule = new MatchRule();
        rule.setDomain(new ArrayList<String>() {
            {
                add("higress.cn");
            }
        });
        matchRules.add(rule);
        spec.setMatchRules(matchRules);
        cr.setSpec(spec);

        boolean result = converter.removeWasmPluginInstanceFromCr(cr, WasmPluginInstanceScope.DOMAIN, "");

        Assertions.assertFalse(result);
        Assertions.assertEquals(1, cr.getSpec().getMatchRules().size());
    }

    @Test
    void removeWasmPluginInstanceFromCrTestRouteScopeValidTargetShouldRemoveIngress() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        List<MatchRule> matchRules = new ArrayList<>();
        MatchRule rule = new MatchRule();
        rule.setIngress(new ArrayList<String>() {
            {
                add("test-route");
            }
        });
        matchRules.add(rule);
        spec.setMatchRules(matchRules);
        cr.setSpec(spec);

        boolean result = converter.removeWasmPluginInstanceFromCr(cr, WasmPluginInstanceScope.ROUTE, "test-route");

        Assertions.assertTrue(result);
        Assertions.assertTrue(cr.getSpec().getMatchRules().isEmpty());
    }

    @Test
    void removeWasmPluginInstanceFromCrTestRouteScopeEmptyTargetShouldNotChange() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        List<MatchRule> matchRules = new ArrayList<>();
        MatchRule rule = new MatchRule();
        rule.setIngress(new ArrayList<String>() {
            {
                add("test-route");
            }
        });
        matchRules.add(rule);
        spec.setMatchRules(matchRules);
        cr.setSpec(spec);

        boolean result = converter.removeWasmPluginInstanceFromCr(cr, WasmPluginInstanceScope.ROUTE, "");

        Assertions.assertFalse(result);
        Assertions.assertEquals(1, cr.getSpec().getMatchRules().size());
    }

    @Test
    public void v1RegistryConfig2ServiceSourceTestNacosType() {
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setType(V1McpBridge.REGISTRY_TYPE_NACOS);
        v1RegistryConfig.setDomain("testDomain");
        v1RegistryConfig.setPort(80);
        v1RegistryConfig.setName("testName");
        v1RegistryConfig.setNacosNamespaceId("testNamespaceId");
        v1RegistryConfig.setNacosGroups(List.of("testGroup1", "testGroup2"));

        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(v1RegistryConfig);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(V1McpBridge.REGISTRY_TYPE_NACOS, serviceSource.getType());
        Assertions.assertEquals("testDomain", serviceSource.getDomain());
        Assertions.assertEquals(80, serviceSource.getPort());
        Assertions.assertEquals("testName", serviceSource.getName());
        Map<String, Object> properties = serviceSource.getProperties();
        Assertions.assertNotNull(properties);
        Assertions.assertEquals("testNamespaceId", properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_NAMESPACE_ID));
        Assertions.assertEquals(List.of("testGroup1", "testGroup2"),
            properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS));
    }

    @Test
    public void v1RegistryConfig2ServiceSourceTestZkType() {
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setType(V1McpBridge.REGISTRY_TYPE_ZK);
        v1RegistryConfig.setDomain("testDomain");
        v1RegistryConfig.setPort(80);
        v1RegistryConfig.setName("testName");
        v1RegistryConfig.setZkServicesPath(List.of("testPath1", "testPath2"));

        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(v1RegistryConfig);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(V1McpBridge.REGISTRY_TYPE_ZK, serviceSource.getType());
        Assertions.assertEquals("testDomain", serviceSource.getDomain());
        Assertions.assertEquals(80, serviceSource.getPort());
        Assertions.assertEquals("testName", serviceSource.getName());
        Map<String, Object> properties = serviceSource.getProperties();
        Assertions.assertNotNull(properties);
        Assertions.assertEquals(List.of("testPath1", "testPath2"),
            properties.get(V1McpBridge.REGISTRY_TYPE_ZK_SERVICES_PATH));
    }

    @Test
    public void v1RegistryConfig2ServiceSourceTestConsulType() {
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setType(V1McpBridge.REGISTRY_TYPE_CONSUL);
        v1RegistryConfig.setDomain("testDomain");
        v1RegistryConfig.setPort(80);
        v1RegistryConfig.setName("testName");
        v1RegistryConfig.setConsulDataCenter("testDataCenter");
        v1RegistryConfig.setConsulServiceTag("testServiceTag");
        v1RegistryConfig.setConsulRefreshInterval(30);

        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(v1RegistryConfig);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(V1McpBridge.REGISTRY_TYPE_CONSUL, serviceSource.getType());
        Assertions.assertEquals("testDomain", serviceSource.getDomain());
        Assertions.assertEquals(80, serviceSource.getPort());
        Assertions.assertEquals("testName", serviceSource.getName());
        Map<String, Object> properties = serviceSource.getProperties();
        Assertions.assertNotNull(properties);
        Assertions.assertEquals("testDataCenter", properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER));
        Assertions.assertEquals("testServiceTag", properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_SERVICE_TAG));
        Assertions.assertEquals(30, properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL));
    }

    @Test
    public void v1RegistryConfig2ServiceSourceTestNullInput() {
        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(null);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(new ServiceSource(), serviceSource);
    }

    @Test
    public void generateAuthSecretNameTestValidServiceSourceName() {
        String serviceSourceName = "test-service-source";
        String expectedPattern = serviceSourceName + "-auth-\\w{5}";

        String authSecretName = converter.generateAuthSecretName(serviceSourceName);

        Assertions.assertTrue(authSecretName.matches(expectedPattern),
            "Auth secret name should match the expected pattern");
    }

    @Test
    public void generateAuthSecretNameTestEmptyServiceSourceName() {
        String serviceSourceName = "";
        String expectedPattern = serviceSourceName + "-auth-\\w{5}";

        String authSecretName = converter.generateAuthSecretName(serviceSourceName);

        Assertions.assertTrue(authSecretName.matches(expectedPattern),
            "Auth secret name should match the expected pattern");
    }

    @Test
    public void generateAuthSecretNameTestNullServiceSourceName() {
        String serviceSourceName = null;
        String expectedPattern = "null-auth-\\w{5}";

        String authSecretName = converter.generateAuthSecretName(serviceSourceName);

        Assertions.assertTrue(authSecretName.matches(expectedPattern),
            "Auth secret name should match the expected pattern");
    }

    @Test
    void initV1McpBridgeTestShouldSetDefaultValues() {
        V1McpBridge v1McpBridge = new V1McpBridge();

        converter.initV1McpBridge(v1McpBridge);

        Assertions.assertNotNull(v1McpBridge.getMetadata(), "Metadata should not be null");
        Assertions.assertEquals(V1McpBridge.DEFAULT_NAME, v1McpBridge.getMetadata().getName(),
            "Metadata name should be set to default");
        Assertions.assertNotNull(v1McpBridge.getSpec(), "Spec should not be null");
        Assertions.assertNotNull(v1McpBridge.getSpec().getRegistries(), "Spec registries should not be null");
        Assertions.assertEquals(0, v1McpBridge.getSpec().getRegistries().size(),
            "Spec registries should be initialized as empty list");
    }

    @Test
    public void addV1McpBridgeRegistryTestRegistryDoesNotExistShouldAddAndReturnRegistryConfig() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        List<V1RegistryConfig> registries = new ArrayList<>();
        spec.setRegistries(registries);

        ServiceSource serviceSource =
            new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null, null, new HashMap<>(), null);

        V1RegistryConfig result = converter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(serviceSource.getName(), result.getName());
        Assertions.assertEquals(serviceSource.getDomain(), result.getDomain());
        Assertions.assertEquals(serviceSource.getType(), result.getType());
        Assertions.assertEquals(serviceSource.getPort(), result.getPort());
        Assertions.assertTrue(registries.contains(result));
    }

    @Test
    public void addV1McpBridgeRegistryTestRegistryExistsShouldUpdateAndReturnRegistryConfig() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        List<V1RegistryConfig> registries = new ArrayList<>();
        V1RegistryConfig existingRegistry = new V1RegistryConfig();
        existingRegistry.setName("testService");
        registries.add(existingRegistry);
        spec.setRegistries(registries);

        ServiceSource serviceSource =
            new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null, null, new HashMap<>(), null);

        V1RegistryConfig result = converter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(serviceSource.getName(), result.getName());
        Assertions.assertEquals(serviceSource.getDomain(), result.getDomain());
        Assertions.assertEquals(serviceSource.getType(), result.getType());
        Assertions.assertEquals(serviceSource.getPort(), result.getPort());
        Assertions.assertTrue(registries.contains(result));
    }

    @Test
    public void addV1McpBridgeRegistryTestNullServiceSourceShouldReturnNull() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        List<V1RegistryConfig> registries = new ArrayList<>();
        spec.setRegistries(registries);

        V1RegistryConfig result = converter.addV1McpBridgeRegistry(v1McpBridge, null);

        Assertions.assertNull(result);
    }

    @Test
    public void addV1McpBridgeRegistryTestNullSpecShouldCreateSpecAndAddRegistry() {
        V1McpBridge v1McpBridge = new V1McpBridge();

        ServiceSource serviceSource =
            new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null, null, new HashMap<>(), null);

        V1RegistryConfig result = converter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);

        Assertions.assertNotNull(result);
        Assertions.assertNotNull(v1McpBridge.getSpec());
        Assertions.assertNotNull(v1McpBridge.getSpec().getRegistries());
        Assertions.assertTrue(v1McpBridge.getSpec().getRegistries().contains(result));
    }

    @Test
    public void addV1McpBridgeRegistryTestNullRegistriesShouldCreateRegistriesAndAddRegistry() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        ServiceSource serviceSource =
            new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null, null, new HashMap<>(), null);

        V1RegistryConfig result = converter.addV1McpBridgeRegistry(v1McpBridge, serviceSource);

        Assertions.assertNotNull(result);
        Assertions.assertNotNull(v1McpBridge.getSpec().getRegistries());
        Assertions.assertTrue(v1McpBridge.getSpec().getRegistries().contains(result));
    }

    @Test
    public void removeV1McpBridgeRegistryTestRegistryExistsShouldRemoveAndReturnRegistryConfig() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        List<V1RegistryConfig> registries = new ArrayList<>();
        V1RegistryConfig registryConfig = new V1RegistryConfig();
        registryConfig.setName("testRegistry");
        registries.add(registryConfig);
        spec.setRegistries(registries);

        V1RegistryConfig result = converter.removeV1McpBridgeRegistry(v1McpBridge, "testRegistry");

        Assertions.assertNotNull(result);
        Assertions.assertEquals("testRegistry", result.getName());
        Assertions.assertTrue(spec.getRegistries().isEmpty());
    }

    @Test
    public void removeV1McpBridgeRegistryTestRegistryDoesNotExistShouldReturnNull() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        List<V1RegistryConfig> registries = new ArrayList<>();
        V1RegistryConfig registryConfig = new V1RegistryConfig();
        registryConfig.setName("existingRegistry");
        registries.add(registryConfig);
        spec.setRegistries(registries);

        V1RegistryConfig result = converter.removeV1McpBridgeRegistry(v1McpBridge, "nonExistingRegistry");

        Assertions.assertNull(result);
        Assertions.assertEquals(1, spec.getRegistries().size());
    }

    @Test
    public void removeV1McpBridgeRegistryTestNoRegistriesShouldReturnNull() {
        V1McpBridge v1McpBridge = new V1McpBridge();
        V1McpBridgeSpec spec = new V1McpBridgeSpec();
        v1McpBridge.setSpec(spec);

        spec.setRegistries(new ArrayList<>());

        V1RegistryConfig result = converter.removeV1McpBridgeRegistry(v1McpBridge, "testRegistry");

        Assertions.assertNull(result);
    }

    @Test
    public void removeV1McpBridgeRegistryTestNullSpecShouldReturnNull() {
        V1McpBridge v1McpBridge = new V1McpBridge();

        v1McpBridge.setSpec(null);

        V1RegistryConfig result = converter.removeV1McpBridgeRegistry(v1McpBridge, "testRegistry");

        Assertions.assertNull(result);
    }

    @Test
    void ingress2RouteTestValidIngressWithSingleRule() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setResourceVersion("1");

        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(metadata);
        ingress.setSpec(spec);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals("test-ingress", route.getName());
        Assertions.assertEquals("1", route.getVersion());
    }

    @Test
    void ingress2RouteTestValidIngressWithMultipleRules() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setResourceVersion("1");

        V1IngressRule rule1 = new V1IngressRule();
        rule1.setHost("example.com");

        V1IngressRule rule2 = new V1IngressRule();
        rule2.setHost("test.example.com");

        spec.setRules(Arrays.asList(rule1, rule2));

        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(metadata);
        ingress.setSpec(spec);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals("test-ingress", route.getName());
        Assertions.assertEquals("1", route.getVersion());
        Assertions.assertEquals(null, route.getDomains());
    }

    @Test
    void ingress2RouteTestValidIngressWithTLS() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setResourceVersion("1");

        V1IngressTLS tls = new V1IngressTLS();
        tls.setHosts(Arrays.asList("higress.cn", "test.higress.cn"));

        spec.setTls(Arrays.asList(tls));

        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(metadata);
        ingress.setSpec(spec);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals("test-ingress", route.getName());
        Assertions.assertEquals("1", route.getVersion());
        Assertions.assertEquals(null, route.getDomains());
    }

    @Test
    void ingress2RouteTestValidIngressWithAnnotationsReturnsValidRoute() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setResourceVersion("1");
        metadata.setAnnotations(new HashMap<String, String>() {
            {
                put("higress.cn", "annotation-value");
            }
        });

        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(metadata);
        ingress.setSpec(spec);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals("test-ingress", route.getName());
        Assertions.assertEquals("1", route.getVersion());
        Assertions.assertNotNull(route.getCustomConfigs());
        Assertions.assertEquals("annotation-value", route.getCustomConfigs().get("higress.cn"));
    }

    @Test
    void ingress2RouteTestNullMetadataReturnsRouteWithDefaults() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1Ingress ingress = new V1Ingress();
        ingress.setSpec(spec);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals(null, route.getName());
        Assertions.assertEquals(null, route.getVersion());
    }

    @Test
    void ingress2RouteTestNullSpecReturnsRouteWithDefaults() {
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setResourceVersion("1");

        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(metadata);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertEquals("test-ingress", route.getName());
        Assertions.assertEquals("1", route.getVersion());
        Assertions.assertNull(route.getDomains());
    }

    @Test
    public void domainName2ConfigMapNameTestNormalDomainNameConfigMapNameCreated() {
        String domainName = "www.higress.cn";
        String expectedConfigMapName = "domain-www.higress.cn";
        String actualConfigMapName = converter.domainName2ConfigMapName(domainName);

        Assertions.assertEquals(expectedConfigMapName, actualConfigMapName,
            "ConfigMap name should be 'domain-www.higress.cn'");
    }

    @Test
    public void domainName2ConfigMapNameTestWildcardDomainNameConfigMapNameCreated() {
        String domainName = "*.higress.cn";
        String expectedConfigMapName = "domain-wildcard.higress.cn";
        String actualConfigMapName = converter.domainName2ConfigMapName(domainName);

        Assertions.assertEquals(expectedConfigMapName, actualConfigMapName,
            "ConfigMap name should be 'domain-wildcard.higress.cn'");
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
        route.setCustomConfigs(new HashMap<>());
        return route;
    }

    @Test
    public void isGatewaySupportedTestMissingMetadata() {
        V1Gateway gateway = buildBasicSupportedGateway();
        gateway.setMetadata(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));
    }

    @Test
    public void isGatewaySupportedTestMissingSpec() {
        V1Gateway gateway = buildBasicSupportedGateway();
        gateway.setSpec(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));
    }

    @Test
    public void isGatewaySupportedTestMissingGatewayClass() {
        V1Gateway gateway = buildBasicSupportedGateway();
        gateway.getSpec().setGatewayClassName(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));
    }

    @Test
    public void isGatewaySupportedTestMissingListeners() {
        V1Gateway gateway = buildBasicSupportedGateway();
        gateway.getSpec().setListeners(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));

        gateway.getSpec().setListeners(Collections.emptyList());
        Assertions.assertFalse(converter.isGatewaySupported(gateway));
    }

    @Test
    public void isGatewaySupportedTestInvalidListener() {
        V1Gateway gateway = buildBasicSupportedGateway();
        V1GatewaySpecListeners listener = gateway.getSpec().getListeners().get(0);

        listener.setPort(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));

        listener.setPort(0);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));

        listener.setPort(80);

        listener.setName(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));

        listener.setName("valid-name");
        listener.setProtocol("INVALID");
        Assertions.assertFalse(converter.isGatewaySupported(gateway));

        listener.setProtocol("HTTPS");
        listener.setTls(null);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));
        V1GatewaySpecTls v1GatewaySpecTls = new V1GatewaySpecTls();
        v1GatewaySpecTls.setCertificateRefs(Collections.emptyList());
        listener.setTls(v1GatewaySpecTls);
        Assertions.assertFalse(converter.isGatewaySupported(gateway));


    }

    @Test
    public void isGatewaySupportedTestAllGood() {
        V1Gateway gateway = buildBasicSupportedGateway();
        Assertions.assertTrue(converter.isGatewaySupported(gateway));
    }

    @Test
    public void isHttpRouteSupportedTestMissingMetadata() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.setMetadata(null);
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestMissingSpec() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.setSpec(null);
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestMissingParentRefs() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.getSpec().setParentRefs(null);
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));

        httpRoute.getSpec().setParentRefs(Collections.emptyList());
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestMissingRules() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.getSpec().setRules(null);
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));

        httpRoute.getSpec().setRules(Collections.emptyList());
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestTooManyHostnames() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.getSpec().setHostnames(Arrays.asList("host1.com", "host2.com"));
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestInvalidBackendRefs() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecRules rule = httpRoute.getSpec().getRules().get(0);

        rule.setBackendRefs(null);
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));

        rule.setBackendRefs(Collections.emptyList());
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));

        V1HTTPRouteSpecBackendRefs backendRef = new V1HTTPRouteSpecBackendRefs();
        backendRef.setKind("InvalidKind");
        rule.setBackendRefs(Collections.singletonList(backendRef));
        Assertions.assertFalse(converter.isHttpRouteSupported(httpRoute));
    }

    @Test
    public void isHttpRouteSupportedTestAllGood() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        Assertions.assertTrue(converter.isHttpRouteSupported(httpRoute));
    }

    private V1HTTPRoute buildBasicSupportedHttpRoute() {
        V1HTTPRoute httpRoute = new V1HTTPRoute();
        httpRoute.setMetadata(new V1ObjectMeta());
        V1HTTPRouteSpec spec = new V1HTTPRouteSpec();
        spec.setParentRefs(Collections.singletonList(new V1HTTPRouteSpecParentRefs()));
        V1HTTPRouteSpecRules rule = new V1HTTPRouteSpecRules();
        V1HTTPRouteSpecMatches match = new V1HTTPRouteSpecMatches();
        V1HTTPRouteSpecPath path = new V1HTTPRouteSpecPath();
        path.setType(V1HTTPRouteSpecPath.TypeEnum.PATHPREFIX);
        path.setValue("/");
        match.setPath(path);
        rule.setMatches(Collections.singletonList(match));
        V1HTTPRouteSpecBackendRefs backendRef = new V1HTTPRouteSpecBackendRefs();
        backendRef.setKind("Service");
        rule.setBackendRefs(Collections.singletonList(backendRef));
        spec.setRules(Collections.singletonList(rule));
        httpRoute.setSpec(spec);
        return httpRoute;
    }

    private V1Gateway buildBasicSupportedGateway() {
        V1Gateway gateway = new V1Gateway();
        gateway.setMetadata(new V1ObjectMeta());
        V1GatewaySpec spec = new V1GatewaySpec();
        spec.setGatewayClassName(V1GatewayClass.DEFAULT_NAME);
        V1GatewaySpecListeners listener = new V1GatewaySpecListeners();
        listener.setName("http");
        listener.setProtocol("HTTP");
        listener.setPort(80);
        spec.setListeners(Collections.singletonList(listener));
        gateway.setSpec(spec);
        return gateway;
    }

    @Test
    public void httpRoute2RouteTestBasic() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        httpRoute.getMetadata().setName("test-route");

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setName("test-route");
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        Assertions.assertEquals(expectedRoute, route);
    }
    @Test
    public void httpRoute2RouteTestWithDomain() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecParentRefs parentRefs = new V1HTTPRouteSpecParentRefs();
        parentRefs.setName(converter.domainName2GatewayName("example.com"));
        httpRoute.getSpec().setParentRefs(Collections.singletonList(parentRefs));
        httpRoute.getSpec().addHostnamesItem("example.com");

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setDomains(Collections.singletonList("example.com"));
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithSinglePath() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecPath path = new V1HTTPRouteSpecPath();
        path.setType(V1HTTPRouteSpecPath.TypeEnum.EXACT);
        path.setValue("/exact");
        V1HTTPRouteSpecMatches match = new V1HTTPRouteSpecMatches();
        match.setPath(path);
        httpRoute.getSpec().getRules().get(0).setMatches(Collections.singletonList(match));

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate predicate1 = new RoutePredicate();
        predicate1.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        predicate1.setMatchValue("/exact");
        predicate1.setCaseSensitive(null);
        expectedRoute.setPath(predicate1);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithHeaders() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecHeaders header = new V1HTTPRouteSpecHeaders();
        header.setName("X-Test");
        header.setType(V1HTTPRouteSpecHeaders.TypeEnum.EXACT);
        header.setValue("test-value");
        httpRoute.getSpec().getRules().get(0).getMatches().get(0).addHeadersItem(header);

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        KeyedRoutePredicate headerPredicate = new KeyedRoutePredicate();
        headerPredicate.setKey("X-Test");
        headerPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        headerPredicate.setMatchValue("test-value");
        expectedRoute.setHeaders(Collections.singletonList(headerPredicate));

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithQueryParams() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecQueryParams param = new V1HTTPRouteSpecQueryParams();
        param.setName("q");
        param.setType(V1HTTPRouteSpecQueryParams.TypeEnum.EXACT);
        param.setValue("search");
        httpRoute.getSpec().getRules().get(0).getMatches().get(0).addQueryParamsItem(param);

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        KeyedRoutePredicate queryParamPredicate = new KeyedRoutePredicate();
        queryParamPredicate.setKey("q");
        queryParamPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        queryParamPredicate.setMatchValue("search");
        expectedRoute.setUrlParams(Collections.singletonList(queryParamPredicate));

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithMethods() {
        List<String> methods = Arrays.asList("GET", "POST", "DELETE", "TRACE");
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecMatches matchesItem = new V1HTTPRouteSpecMatches();

        V1HTTPRouteSpecPath path = new V1HTTPRouteSpecPath();
        path.setType(V1HTTPRouteSpecPath.TypeEnum.EXACT);
        path.setValue("/exact");

        matchesItem.setPath(path);
        List<V1HTTPRouteSpecMatches> matches = new ArrayList<>();
        for (String method: methods) {
            V1HTTPRouteSpecMatches matchesItemCopy;
            try{
                matchesItemCopy= (V1HTTPRouteSpecMatches) matchesItem.clone();
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException("Error when clone matches", e);
            }
            if (V1HTTPRouteSpecMatches.MethodEnum.GET.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.GET);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.POST.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.POST);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.PUT.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.PUT);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.DELETE.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.DELETE);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.PATCH.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.PATCH);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.HEAD.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.HEAD);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.OPTIONS.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.OPTIONS);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.CONNECT.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.CONNECT);
            } else if (V1HTTPRouteSpecMatches.MethodEnum.TRACE.toString().equals(method)) {
                matchesItemCopy.setMethod(V1HTTPRouteSpecMatches.MethodEnum.TRACE);
            } else {
                throw new IllegalArgumentException("Unsupported method type: " + method);
            }
            matches.add(matchesItemCopy);
        }

        httpRoute.getSpec().getRules().get(0).setMatches(matches);
        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RoutePredicate predicate1 = new RoutePredicate();
        predicate1.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        predicate1.setMatchValue("/exact");
        predicate1.setCaseSensitive(null);
        expectedRoute.setPath(predicate1);

        expectedRoute.setMethods(methods);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithUrlRewrite() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecFilters filter = new V1HTTPRouteSpecFilters();
        filter.setType(V1HTTPRouteSpecFilters.TypeEnum.URLREWRITE);
        V1HTTPRouteSpecUrlRewrite urlRewrite = new V1HTTPRouteSpecUrlRewrite();
        urlRewrite.setHostname("example.com");
        V1HTTPRouteSpecUrlRewritePath path = new V1HTTPRouteSpecUrlRewritePath();
        path.setType(V1HTTPRouteSpecUrlRewritePath.TypeEnum.REPLACEPREFIXMATCH);
        path.setReplacePrefixMatch("/new");
        urlRewrite.setPath(path);
        filter.setUrlRewrite(urlRewrite);
        httpRoute.getSpec().getRules().get(0).addFiltersItem(filter);

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        RewriteConfig rewriteConfig = new RewriteConfig();
        rewriteConfig.setEnabled(true);
        rewriteConfig.setHost("example.com");
        rewriteConfig.setPath("/new");
        expectedRoute.setRewrite(rewriteConfig);

        Assertions.assertEquals(expectedRoute, route);
    }


    @Test
    public void httpRoute2RouteTestWithRequestHeaderModifier() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecFilters filter = new V1HTTPRouteSpecFilters();
        filter.setType(V1HTTPRouteSpecFilters.TypeEnum.REQUESTHEADERMODIFIER);
        V1HTTPRouteSpecRequestHeaderModifier headerModifier = new V1HTTPRouteSpecRequestHeaderModifier();
        V1HTTPRouteSpecRequestHeaderModifierAdd addHeader = new V1HTTPRouteSpecRequestHeaderModifierAdd();
        addHeader.setName("X-Custom-Header");
        addHeader.setValue("CustomValue");
        headerModifier.addAddItem(addHeader);
        headerModifier.addSetItem(addHeader);
        headerModifier.addRemoveItem("X-Remove-Header");
        filter.setRequestHeaderModifier(headerModifier);
        httpRoute.getSpec().getRules().get(0).addFiltersItem(filter);

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        HeaderControlConfig headerControl = new HeaderControlConfig();
        headerControl.setEnabled(true);
        HeaderControlStageConfig requestConfig = new HeaderControlStageConfig();
        List<Header> configAdd = new ArrayList<>();
        requestConfig.setAdd(configAdd);
        List<Header> configSet = new ArrayList<>();
        requestConfig.setSet(configSet);
        List<String> remove = new ArrayList<>();
        requestConfig.setRemove(remove);
        configAdd.add(new Header("X-Custom-Header", "CustomValue"));
        configSet.add(new Header("X-Custom-Header", "CustomValue"));
        remove.add("X-Remove-Header");
        headerControl.setRequest(requestConfig);
        expectedRoute.setHeaderControl(headerControl);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithResponseHeaderModifier() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();
        V1HTTPRouteSpecFilters filter = new V1HTTPRouteSpecFilters();
        filter.setType(V1HTTPRouteSpecFilters.TypeEnum.RESPONSEHEADERMODIFIER);
        V1HTTPRouteSpecResponseHeaderModifier headerModifier = new V1HTTPRouteSpecResponseHeaderModifier();
        V1HTTPRouteSpecRequestHeaderModifierAdd addHeader = new V1HTTPRouteSpecRequestHeaderModifierAdd();
        addHeader.setName("X-Custom-Response-Header");
        addHeader.setValue("CustomResponseValue");
        headerModifier.addAddItem(addHeader);
        headerModifier.addSetItem(addHeader);
        headerModifier.addRemoveItem("X-Remove-Response-Header");
        filter.setResponseHeaderModifier(headerModifier);
        httpRoute.getSpec().getRules().get(0).addFiltersItem(filter);

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);
        HeaderControlConfig headerControl = new HeaderControlConfig();
        headerControl.setEnabled(true);
        HeaderControlStageConfig responseConfig = new HeaderControlStageConfig();
        List<Header> configAdd = new ArrayList<>();
        responseConfig.setAdd(configAdd);
        List<Header> configSet = new ArrayList<>();
        responseConfig.setSet(configSet);
        List<String> remove = new ArrayList<>();
        responseConfig.setRemove(remove);
        configAdd.add(new Header("X-Custom-Response-Header", "CustomResponseValue"));
        configSet.add(new Header("X-Custom-Response-Header", "CustomResponseValue"));
        remove.add("X-Remove-Response-Header");
        headerControl.setResponse(responseConfig);
        expectedRoute.setHeaderControl(headerControl);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithBothFilters() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();

        // URL Rewrite filter
        V1HTTPRouteSpecFilters urlRewriteFilter = new V1HTTPRouteSpecFilters();
        urlRewriteFilter.setType(V1HTTPRouteSpecFilters.TypeEnum.URLREWRITE);
        V1HTTPRouteSpecUrlRewrite urlRewrite = new V1HTTPRouteSpecUrlRewrite();
        urlRewrite.setHostname("example.com");
        V1HTTPRouteSpecUrlRewritePath path = new V1HTTPRouteSpecUrlRewritePath();
        path.setType(V1HTTPRouteSpecUrlRewritePath.TypeEnum.REPLACEPREFIXMATCH);
        path.setReplacePrefixMatch("/new");
        urlRewrite.setPath(path);
        urlRewriteFilter.setUrlRewrite(urlRewrite);

        // Request Header Modifier filter
        V1HTTPRouteSpecFilters headerModifierFilter = new V1HTTPRouteSpecFilters();
        headerModifierFilter.setType(V1HTTPRouteSpecFilters.TypeEnum.REQUESTHEADERMODIFIER);
        V1HTTPRouteSpecRequestHeaderModifier headerModifier = new V1HTTPRouteSpecRequestHeaderModifier();
        V1HTTPRouteSpecRequestHeaderModifierAdd addHeader = new V1HTTPRouteSpecRequestHeaderModifierAdd();
        addHeader.setName("X-Custom-Header");
        addHeader.setValue("CustomValue");
        headerModifier.addAddItem(addHeader);
        headerModifier.addSetItem(addHeader);
        headerModifier.addRemoveItem("X-Remove-Header");
        headerModifierFilter.setRequestHeaderModifier(headerModifier);

        httpRoute.getSpec().getRules().get(0).setFilters(Arrays.asList(urlRewriteFilter, headerModifierFilter));

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);

        // Expected URL Rewrite config
        RewriteConfig rewriteConfig = new RewriteConfig();
        rewriteConfig.setEnabled(true);
        rewriteConfig.setHost("example.com");
        rewriteConfig.setPath("/new");
        expectedRoute.setRewrite(rewriteConfig);

        // Expected Header Control config
        HeaderControlConfig headerControl = new HeaderControlConfig();
        headerControl.setEnabled(true);
        HeaderControlStageConfig requestConfig = new HeaderControlStageConfig();
        List<Header> configAdd = new ArrayList<>();
        requestConfig.setAdd(configAdd);
        List<Header> configSet = new ArrayList<>();
        requestConfig.setSet(configSet);
        List<String> remove = new ArrayList<>();
        requestConfig.setRemove(remove);
        configAdd.add(new Header("X-Custom-Header", "CustomValue"));
        configSet.add(new Header("X-Custom-Header", "CustomValue"));
        remove.add("X-Remove-Header");
        headerControl.setRequest(requestConfig);
        expectedRoute.setHeaderControl(headerControl);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithRegularExpressionHeaders() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();

        // Case 1: Regex starts with "^\Q" and ends with "\E.*" -> PREFIX
        V1HTTPRouteSpecHeaders header1 = new V1HTTPRouteSpecHeaders();
        header1.setName("X-Prefix-Header");
        header1.setType(V1HTTPRouteSpecHeaders.TypeEnum.REGULAREXPRESSION);
        header1.setValue("^"+ Pattern.quote("prefix")+".*");

        // Case 2: Other regex pattern
        V1HTTPRouteSpecHeaders header2 = new V1HTTPRouteSpecHeaders();
        header2.setName("X-Regex-Header");
        header2.setType(V1HTTPRouteSpecHeaders.TypeEnum.REGULAREXPRESSION);
        header2.setValue("regex-pattern");

        httpRoute.getSpec().getRules().get(0).getMatches().get(0).setHeaders(Arrays.asList(header1, header2));

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);

        List<KeyedRoutePredicate> expectedHeaders = new ArrayList<>();

        // Expected result for Case 1
        KeyedRoutePredicate expectedHeader1 = new KeyedRoutePredicate();
        expectedHeader1.setKey("X-Prefix-Header");
        expectedHeader1.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        expectedHeader1.setMatchValue("prefix");
        expectedHeaders.add(expectedHeader1);

        // Expected result for Case 2
        KeyedRoutePredicate expectedHeader2 = new KeyedRoutePredicate();
        expectedHeader2.setKey("X-Regex-Header");
        expectedHeader2.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        expectedHeader2.setMatchValue("regex-pattern");
        expectedHeaders.add(expectedHeader2);

        expectedRoute.setHeaders(expectedHeaders);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void httpRoute2RouteTestWithRegularExpressionQueryParams() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();

        // Case 1: Regex starts with "^" and ends with ".*"
        V1HTTPRouteSpecQueryParams param1 = new V1HTTPRouteSpecQueryParams();
        param1.setName("prefix_param");
        param1.setType(V1HTTPRouteSpecQueryParams.TypeEnum.REGULAREXPRESSION);
        param1.setValue("^"+ Pattern.quote("prefix")+".*");

        // Case 2: Other regex pattern
        V1HTTPRouteSpecQueryParams param2 = new V1HTTPRouteSpecQueryParams();
        param2.setName("regex_param");
        param2.setType(V1HTTPRouteSpecQueryParams.TypeEnum.REGULAREXPRESSION);
        param2.setValue("regex-pattern");

        httpRoute.getSpec().getRules().get(0).getMatches().get(0).setQueryParams(Arrays.asList(param1, param2));

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setServices(Collections.singletonList(new UpstreamService()));
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);

        List<KeyedRoutePredicate> expectedUrlParams = new ArrayList<>();

        // Expected result for Case 1
        KeyedRoutePredicate expectedParam1 = new KeyedRoutePredicate();
        expectedParam1.setKey("prefix_param");
        expectedParam1.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        expectedParam1.setMatchValue("prefix");
        expectedUrlParams.add(expectedParam1);

        // Expected result for Case 2
        KeyedRoutePredicate expectedParam2 = new KeyedRoutePredicate();
        expectedParam2.setKey("regex_param");
        expectedParam2.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        expectedParam2.setMatchValue("regex-pattern");
        expectedUrlParams.add(expectedParam2);

        expectedRoute.setUrlParams(expectedUrlParams);

        Assertions.assertEquals(expectedRoute, route);
    }
    @Test
    public void httpRoute2RouteTestWithBackendRefs() {
        V1HTTPRoute httpRoute = buildBasicSupportedHttpRoute();

        // Case 1: BackendRef with namespace and port and weight
        V1HTTPRouteSpecBackendRefs backendRef1 = new V1HTTPRouteSpecBackendRefs();
        backendRef1.setName("service1");
        backendRef1.setNamespace("custom-namespace");
        backendRef1.setPort(8080);
        backendRef1.setWeight(20);

        // Case 2: BackendRef with namespace but no port
        V1HTTPRouteSpecBackendRefs backendRef2 = new V1HTTPRouteSpecBackendRefs();
        backendRef2.setName("service2");
        backendRef2.setNamespace("another-namespace");

        // Case 3: BackendRef without namespace but with port
        V1HTTPRouteSpecBackendRefs backendRef3 = new V1HTTPRouteSpecBackendRefs();
        backendRef3.setName("service3");
        backendRef3.setPort(9090);

        // Case 4: BackendRef without namespace and port
        V1HTTPRouteSpecBackendRefs backendRef4 = new V1HTTPRouteSpecBackendRefs();
        backendRef4.setName("service4");

        // Case 5: Mcp Bridge
        V1HTTPRouteSpecBackendRefs backendRef5 = new V1HTTPRouteSpecBackendRefs();
        backendRef5.setName("service5-provider.DEFAULT-GROUP.public.nacos");
        backendRef5.setGroup(V1McpBridge.API_GROUP);

        httpRoute.getSpec().getRules().get(0).setBackendRefs(Arrays.asList(backendRef1, backendRef2, backendRef3, backendRef4, backendRef5));

        Route route = converter.httpRoute2Route(httpRoute);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setIsIngressMode(false);
        RoutePredicate pathPredicate = expectedRoute.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        expectedRoute.setCors(null);
        expectedRoute.setCustomConfigs(null);

        List<UpstreamService> expectedServices = new ArrayList<>();
        expectedServices.add(new UpstreamService("service1.custom-namespace.svc.cluster.local:8080", null, null, 20));
        expectedServices.add(new UpstreamService("service2.another-namespace.svc.cluster.local", null, null, null));
        expectedServices.add(new UpstreamService("service3.default.svc.cluster.local:9090", null, null, null));
        expectedServices.add(new UpstreamService("service4.default.svc.cluster.local", null, null, null));
        expectedServices.add(new UpstreamService("service5-provider.DEFAULT-GROUP.public.nacos", null, null, null));

        expectedRoute.setServices(expectedServices);

        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void route2HttpRouteTestBasic() {
        Route route = buildBasicRoute();
        route.setName("test-route");
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        
        expectedHttpRoute.getMetadata().setName("test-route");
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithDomain() {
        Route route = buildBasicRoute();
        route.setDomains(Collections.singletonList("example.com"));
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        expectedHttpRoute.getMetadata().setLabels(Collections.singletonMap("higress.io/domain_example.com", "true"));
        
        expectedHttpRoute.getSpec().setHostnames(Collections.singletonList("example.com"));
        V1HTTPRouteSpecParentRefs parentRefs = new V1HTTPRouteSpecParentRefs();
        parentRefs.setName(converter.domainName2GatewayName("example.com"));
        expectedHttpRoute.getSpec().setParentRefs(Collections.singletonList(parentRefs));
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithSinglePath() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = new RoutePredicate();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        pathPredicate.setMatchValue("/exact");
        pathPredicate.setCaseSensitive(null);
        route.setPath(pathPredicate);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        
        V1HTTPRouteSpecPath path = new V1HTTPRouteSpecPath();
        path.setType(V1HTTPRouteSpecPath.TypeEnum.EXACT);
        path.setValue("/exact");
        V1HTTPRouteSpecMatches match = new V1HTTPRouteSpecMatches();
        match.setPath(path);
        expectedHttpRoute.getSpec().getRules().get(0).setMatches(Collections.singletonList(match));
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithHeaders() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        List<KeyedRoutePredicate> headers = new ArrayList<>();

        // Case 1: Exact match
        KeyedRoutePredicate header1 = new KeyedRoutePredicate();
        header1.setKey("X-Exact-Header");
        header1.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        header1.setMatchValue("exact-value");
        headers.add(header1);

        // Case 2: Prefix match
        KeyedRoutePredicate header2 = new KeyedRoutePredicate();
        header2.setKey("X-Prefix-Header");
        header2.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        header2.setMatchValue("prefix");
        headers.add(header2);

        // Case 3: Regular expression match
        KeyedRoutePredicate header3 = new KeyedRoutePredicate();
        header3.setKey("X-Regex-Header");
        header3.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        header3.setMatchValue("regex-pattern");
        headers.add(header3);

        route.setHeaders(headers);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        

        List<V1HTTPRouteSpecHeaders> expectedHeaders = new ArrayList<>();

        // Expected result for Case 1
        V1HTTPRouteSpecHeaders expectedHeader1 = new V1HTTPRouteSpecHeaders();
        expectedHeader1.setName("X-Exact-Header");
        expectedHeader1.setType(V1HTTPRouteSpecHeaders.TypeEnum.EXACT);
        expectedHeader1.setValue("exact-value");
        expectedHeaders.add(expectedHeader1);

        // Expected result for Case 2
        V1HTTPRouteSpecHeaders expectedHeader2 = new V1HTTPRouteSpecHeaders();
        expectedHeader2.setName("X-Prefix-Header");
        expectedHeader2.setType(V1HTTPRouteSpecHeaders.TypeEnum.REGULAREXPRESSION);
        expectedHeader2.setValue("^" + Pattern.quote("prefix") + ".*");
        expectedHeaders.add(expectedHeader2);

        // Expected result for Case 3
        V1HTTPRouteSpecHeaders expectedHeader3 = new V1HTTPRouteSpecHeaders();
        expectedHeader3.setName("X-Regex-Header");
        expectedHeader3.setType(V1HTTPRouteSpecHeaders.TypeEnum.REGULAREXPRESSION);
        expectedHeader3.setValue("regex-pattern");
        expectedHeaders.add(expectedHeader3);

        expectedHttpRoute.getSpec().getRules().get(0).getMatches().get(0).setHeaders(expectedHeaders);
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithQueryParams() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        List<KeyedRoutePredicate> urlParams = new ArrayList<>();

        // Case 1: Exact match
        KeyedRoutePredicate param1 = new KeyedRoutePredicate();
        param1.setKey("exact_param");
        param1.setMatchType(RoutePredicateTypeEnum.EQUAL.toString());
        param1.setMatchValue("exact-value");
        urlParams.add(param1);

        // Case 2: Prefix match
        KeyedRoutePredicate param2 = new KeyedRoutePredicate();
        param2.setKey("prefix_param");
        param2.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        param2.setMatchValue("prefix");
        urlParams.add(param2);

        // Case 3: Regular expression match
        KeyedRoutePredicate param3 = new KeyedRoutePredicate();
        param3.setKey("regex_param");
        param3.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
        param3.setMatchValue("regex-pattern");
        urlParams.add(param3);

        route.setUrlParams(urlParams);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        

        List<V1HTTPRouteSpecQueryParams> expectedParams = new ArrayList<>();

        // Expected result for Case 1
        V1HTTPRouteSpecQueryParams expectedParam1 = new V1HTTPRouteSpecQueryParams();
        expectedParam1.setName("exact_param");
        expectedParam1.setType(V1HTTPRouteSpecQueryParams.TypeEnum.EXACT);
        expectedParam1.setValue("exact-value");
        expectedParams.add(expectedParam1);

        // Expected result for Case 2
        V1HTTPRouteSpecQueryParams expectedParam2 = new V1HTTPRouteSpecQueryParams();
        expectedParam2.setName("prefix_param");
        expectedParam2.setType(V1HTTPRouteSpecQueryParams.TypeEnum.REGULAREXPRESSION);
        expectedParam2.setValue("^" + Pattern.quote("prefix") + ".*");
        expectedParams.add(expectedParam2);

        // Expected result for Case 3
        V1HTTPRouteSpecQueryParams expectedParam3 = new V1HTTPRouteSpecQueryParams();
        expectedParam3.setName("regex_param");
        expectedParam3.setType(V1HTTPRouteSpecQueryParams.TypeEnum.REGULAREXPRESSION);
        expectedParam3.setValue("regex-pattern");
        expectedParams.add(expectedParam3);

        expectedHttpRoute.getSpec().getRules().get(0).getMatches().get(0).setQueryParams(expectedParams);
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithUrlRewrite() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        RewriteConfig rewriteConfig = new RewriteConfig();
        rewriteConfig.setEnabled(true);
        rewriteConfig.setHost("example.com");
        rewriteConfig.setPath("/new");
        route.setRewrite(rewriteConfig);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        
        V1HTTPRouteSpecFilters filter = new V1HTTPRouteSpecFilters();
        filter.setType(V1HTTPRouteSpecFilters.TypeEnum.URLREWRITE);
        V1HTTPRouteSpecUrlRewrite urlRewrite = new V1HTTPRouteSpecUrlRewrite();
        urlRewrite.setHostname("example.com");
        V1HTTPRouteSpecUrlRewritePath path = new V1HTTPRouteSpecUrlRewritePath();
        path.setType(V1HTTPRouteSpecUrlRewritePath.TypeEnum.REPLACEPREFIXMATCH);
        path.setReplacePrefixMatch("/new");
        urlRewrite.setPath(path);
        filter.setUrlRewrite(urlRewrite);
        expectedHttpRoute.getSpec().getRules().get(0).addFiltersItem(filter);
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithMethods() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        route.setMethods(Arrays.asList("GET", "POST", "TRACE"));
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        
        V1HTTPRouteSpecPath path = new V1HTTPRouteSpecPath();
        path.setType(V1HTTPRouteSpecPath.TypeEnum.PATHPREFIX);
        path.setValue("/");

        V1HTTPRouteSpecMatches match1 = new V1HTTPRouteSpecMatches();
        match1.setMethod(V1HTTPRouteSpecMatches.MethodEnum.GET);
        match1.setPath(path);
        V1HTTPRouteSpecMatches match2 = new V1HTTPRouteSpecMatches();
        match2.setMethod(V1HTTPRouteSpecMatches.MethodEnum.POST);
        match2.setPath(path);
        V1HTTPRouteSpecMatches match3 = new V1HTTPRouteSpecMatches();
        match3.setMethod(V1HTTPRouteSpecMatches.MethodEnum.TRACE);
        match3.setPath(path);
        expectedHttpRoute.getSpec().getRules().get(0).setMatches(Arrays.asList(match1, match2, match3));
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithHeaderControl() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);
        HeaderControlConfig headerControl = new HeaderControlConfig();
        headerControl.setEnabled(true);
        HeaderControlStageConfig requestConfig = new HeaderControlStageConfig();
        requestConfig.setAdd(Collections.singletonList(new Header("X-Custom-Header", "CustomValue")));
        requestConfig.setSet(Collections.singletonList(new Header("X-Custom-Header", "CustomValue")));
        requestConfig.setRemove(Collections.singletonList("X-Remove-Header"));
        headerControl.setRequest(requestConfig);
        route.setHeaderControl(headerControl);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        
        V1HTTPRouteSpecFilters filter = new V1HTTPRouteSpecFilters();
        filter.setType(V1HTTPRouteSpecFilters.TypeEnum.REQUESTHEADERMODIFIER);
        V1HTTPRouteSpecRequestHeaderModifier headerModifier = new V1HTTPRouteSpecRequestHeaderModifier();
        V1HTTPRouteSpecRequestHeaderModifierAdd addHeader = new V1HTTPRouteSpecRequestHeaderModifierAdd();
        addHeader.setName("X-Custom-Header");
        addHeader.setValue("CustomValue");
        headerModifier.addAddItem(addHeader);
        headerModifier.addSetItem(addHeader);
        headerModifier.addRemoveItem("X-Remove-Header");
        filter.setRequestHeaderModifier(headerModifier);
        expectedHttpRoute.getSpec().getRules().get(0).addFiltersItem(filter);
        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(null);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);
    }

    @Test
    public void route2HttpRouteTestWithBackendRefs() {
        Route route = buildBasicRoute();
        RoutePredicate pathPredicate = route.getPath();
        pathPredicate.setMatchType(RoutePredicateTypeEnum.PRE.toString());
        pathPredicate.setMatchValue("/");
        pathPredicate.setCaseSensitive(null);

        List<UpstreamService> services = new ArrayList<>();

        // Case 1: Normal Kubernetes service in default namespace
        UpstreamService service1 = new UpstreamService();
        service1.setName("service1.default.svc.cluster.local:8080");
        service1.setWeight(50);
        services.add(service1);

        // Case 2: Kubernetes service in different namespace
        UpstreamService service2 = new UpstreamService();
        service2.setName("service2.custom-namespace.svc.cluster.local");
        services.add(service2);

        // Case 3: MCP service
        UpstreamService service3 = new UpstreamService();
        service3.setName("mcp-service.DEFAULT-GROUP.public.nacos");
        services.add(service3);

        route.setServices(services);
        route.setCors(null);
        route.setCustomConfigs(null);

        V1HTTPRoute httpRoute = converter.route2HttpRoute(route);

        V1HTTPRoute expectedHttpRoute = buildBasicSupportedHttpRoute();
        

        List<V1HTTPRouteSpecBackendRefs> expectedBackendRefs = new ArrayList<>();

        // Expected result for Case 1
        V1HTTPRouteSpecBackendRefs expectedBackend1 = new V1HTTPRouteSpecBackendRefs();
        expectedBackend1.setName("service1");
        expectedBackend1.setPort(8080);
        expectedBackend1.setWeight(50);
        expectedBackend1.setNamespace("default");
        expectedBackendRefs.add(expectedBackend1);

        // Expected result for Case 2
        V1HTTPRouteSpecBackendRefs expectedBackend2 = new V1HTTPRouteSpecBackendRefs();
        expectedBackend2.setName("service2");
        expectedBackend2.setNamespace("custom-namespace");
        expectedBackendRefs.add(expectedBackend2);

        // Expected result for Case 3
        V1HTTPRouteSpecBackendRefs expectedBackend3 = new V1HTTPRouteSpecBackendRefs();
        expectedBackend3.setName("mcp-service.DEFAULT-GROUP.public.nacos");
        expectedBackend3.setGroup(V1McpBridge.API_GROUP);
        expectedBackendRefs.add(expectedBackend3);

        expectedHttpRoute.getSpec().getRules().get(0).setBackendRefs(expectedBackendRefs);

        Assertions.assertEquals(expectedHttpRoute, httpRoute);

    }

    @Test
    public void domain2GatewayTestWithHttpDomain() {
        Domain domain = new Domain();
        domain.setName("example.com");
        domain.setVersion("1");
        Map<Integer, String> portAndCertMap = new HashMap<>();
        portAndCertMap.put(80, "");
        domain.setPortAndCertMap(portAndCertMap);

        V1Gateway gateway = converter.domain2Gateway(domain);

        V1Gateway expectedGateway = new V1Gateway();
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("example.com");
        metadata.setResourceVersion("1");
        expectedGateway.setMetadata(metadata);

        V1GatewaySpec spec = new V1GatewaySpec().addDefaultAddress();
        spec.setGatewayClassName(V1GatewayClass.DEFAULT_NAME);
        V1GatewaySpecListeners listener = new V1GatewaySpecListeners();
        listener.setName("example.com-80");
        listener.setPort(80);
        listener.setHostname("example.com");
        listener.setProtocol("HTTP");
        listener.setAllowedRoutes(V1GatewaySpecListeners.getDefaultAllowedRoutes());
        spec.setListeners(Collections.singletonList(listener));
        expectedGateway.setSpec(spec);

        Assertions.assertEquals(expectedGateway, gateway);
    }

    @Test
    public void domain2GatewayTestWithHttpsDomain() {
        Domain domain = new Domain();
        domain.setName("secure.example.com");
        domain.setVersion("2");
        Map<Integer, String> portAndCertMap = new HashMap<>();
        portAndCertMap.put(443, "test-cert");
        domain.setPortAndCertMap(portAndCertMap);

        V1Gateway gateway = converter.domain2Gateway(domain);

        V1Gateway expectedGateway = new V1Gateway();
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("secure.example.com");
        metadata.setResourceVersion("2");
        expectedGateway.setMetadata(metadata);

        V1GatewaySpec spec = new V1GatewaySpec().addDefaultAddress();
        spec.setGatewayClassName(V1GatewayClass.DEFAULT_NAME);
        V1GatewaySpecListeners listener = new V1GatewaySpecListeners();
        listener.setName("secure.example.com-443");
        listener.setPort(443);
        listener.setHostname("secure.example.com");
        listener.setProtocol("HTTPS");
        listener.setTls(V1GatewaySpecListeners.getDefaultTls("test-cert"));
        listener.setAllowedRoutes(V1GatewaySpecListeners.getDefaultAllowedRoutes());
        spec.setListeners(Collections.singletonList(listener));
        expectedGateway.setSpec(spec);

        Assertions.assertEquals(expectedGateway, gateway);
    }

    @Test
    public void domain2GatewayTestWithWildcardDomain() {
        Domain domain = new Domain();
        domain.setName("*");
        domain.setVersion("3");
        Map<Integer, String> portAndCertMap = new HashMap<>();
        portAndCertMap.put(80, "");
        portAndCertMap.put(443, "wildcard-cert");
        domain.setPortAndCertMap(portAndCertMap);

        V1Gateway gateway = converter.domain2Gateway(domain);

        V1Gateway expectedGateway = new V1Gateway();
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(HigressConstants.DEFAULT_DOMAIN);
        metadata.setResourceVersion("3");
        expectedGateway.setMetadata(metadata);

        V1GatewaySpec spec = new V1GatewaySpec().addDefaultAddress();
        spec.setGatewayClassName(V1GatewayClass.DEFAULT_NAME);
        List<V1GatewaySpecListeners> listeners = new ArrayList<>();

        V1GatewaySpecListeners httpListener = new V1GatewaySpecListeners();
        httpListener.setName(HigressConstants.DEFAULT_DOMAIN+ Separators.DASH +"80");
        httpListener.setPort(80);
        httpListener.setProtocol("HTTP");
        httpListener.setAllowedRoutes(V1GatewaySpecListeners.getDefaultAllowedRoutes());
        listeners.add(httpListener);

        V1GatewaySpecListeners httpsListener = new V1GatewaySpecListeners();
        httpsListener.setName(HigressConstants.DEFAULT_DOMAIN+ Separators.DASH +"443");
        httpsListener.setPort(443);
        httpsListener.setProtocol("HTTPS");
        httpsListener.setTls(V1GatewaySpecListeners.getDefaultTls("wildcard-cert"));
        httpsListener.setAllowedRoutes(V1GatewaySpecListeners.getDefaultAllowedRoutes());
        listeners.add(httpsListener);

        spec.setListeners(listeners);
        expectedGateway.setSpec(spec);

        Assertions.assertEquals(expectedGateway, gateway);
    }

    @Test
    public void domain2GatewayTestWithEmptyPortAndCertMap() {
        Domain domain = new Domain();
        domain.setName("empty.example.com");
        domain.setVersion("4");
        domain.setPortAndCertMap(new HashMap<>());

        V1Gateway gateway = converter.domain2Gateway(domain);

        Assertions.assertNull(gateway);
    }
    private V1alpha1WasmPluginSpec createSpecWithGlobalConfig() {
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        spec.setDefaultConfig(Collections.singletonMap("key", "value"));
        spec.setDefaultConfigDisable(false);
        return spec;
    }

    private V1alpha1WasmPluginSpec createSpecWithDomainConfig(String domain) {
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        MatchRule matchRule = new MatchRule();
        matchRule.setDomain(Collections.singletonList(domain));
        matchRule.setConfig(Collections.singletonMap("key", "value"));
        matchRule.setConfigDisable(false);
        spec.setMatchRules(Collections.singletonList(matchRule));
        return spec;
    }

    private V1alpha1WasmPluginSpec createSpecWithRouteConfig(String route) {
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        MatchRule matchRule = new MatchRule();
        matchRule.setIngress(Collections.singletonList(route));
        matchRule.setConfig(Collections.singletonMap("key", "value"));
        matchRule.setConfigDisable(false);
        spec.setMatchRules(Collections.singletonList(matchRule));
        return spec;
    }

    private V1ObjectMeta createMetadata(String name, String pluginName, String pluginVersion) {
        Map<String, String> labels = new HashMap<>();
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, pluginName);
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY, pluginVersion);
        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(name);
        metadata.setLabels(labels);
        return metadata;
    }

    private V1ObjectMeta createMetadata() {
        Map<String, String> labels = new HashMap<>();
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, "test-plugin");
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY, "v1");
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_CATEGORY_KEY, "test-category");
        labels.put(KubernetesConstants.Label.WASM_PLUGIN_BUILT_IN_KEY, "true");

        Map<String, String> annotations = new HashMap<>();
        annotations.put(KubernetesConstants.Annotation.WASM_PLUGIN_TITLE_KEY, "Test Plugin");
        annotations.put(KubernetesConstants.Annotation.WASM_PLUGIN_DESCRIPTION_KEY, "A test plugin");
        annotations.put(KubernetesConstants.Annotation.WASM_PLUGIN_ICON_KEY, "icon.png");

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setLabels(labels);
        metadata.setAnnotations(annotations);
        return metadata;
    }

    private V1alpha1WasmPluginSpec createSpec() {
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        spec.setUrl("test/image:v1");
        spec.setPhase(PluginPhase.UNSPECIFIED.getName());
        spec.setPriority(10);
        return spec;
    }
}
