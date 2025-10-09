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

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Predicate;

import org.apache.commons.collections4.CollectionUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
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
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.ImagePullPolicy;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.alibaba.higress.sdk.util.MapUtil;
import com.alibaba.higress.sdk.util.TypeUtil;
import com.google.common.collect.Lists;

import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.ApiException;
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

public class KubernetesModelConverterTest {

    private static final String DEFAULT_NAMESPACE = "higress-system";

    private KubernetesModelConverter converter;

    private final String httpsDomain = "higress.ai";

    @BeforeEach
    public void setUp() throws ApiException {
        final Predicate<V1ObjectMeta> isDefinedByConsole = metadata -> metadata != null
            && DEFAULT_NAMESPACE.equals(metadata.getNamespace()) && KubernetesConstants.Label.RESOURCE_DEFINER_VALUE
                .equals(KubernetesUtil.getLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY));

        KubernetesClientService service = mock(KubernetesClientService.class);
        when(service.isDefinedByConsole(any(KubernetesObject.class))).thenAnswer((Answer<Boolean>)invocation -> {
            KubernetesObject object = invocation.getArgument(0);
            return object != null && isDefinedByConsole.test(object.getMetadata());
        });
        when(service.isDefinedByConsole(any(V1ObjectMeta.class)))
            .thenAnswer((Answer<Boolean>)invocation -> isDefinedByConsole.test(invocation.getArgument(0)));
        V1ConfigMap httpsForceConfigmap = mock(V1ConfigMap.class);
        Map<String, String> httpsForceData = new HashMap<>();
        httpsForceData.put(KubernetesConstants.K8S_ENABLE_HTTPS, "force");
        httpsForceData.put(KubernetesConstants.K8S_CERT, "cert");
        when(httpsForceConfigmap.getData()).thenReturn(httpsForceData);
        when(service.readConfigMap(eq("domain-" + httpsDomain))).thenReturn(httpsForceConfigmap);

        V1ConfigMap httpsOnConfigMap = mock(V1ConfigMap.class);
        Map<String, String> httpsOnData = new HashMap<>();
        httpsOnData.put(KubernetesConstants.K8S_ENABLE_HTTPS, "on");
        httpsOnData.put(KubernetesConstants.K8S_CERT, "cert");
        when(httpsOnConfigMap.getData()).thenReturn(httpsOnData);
        when(service.readConfigMap(eq("domain-" + httpsDomain + "-on"))).thenReturn(httpsOnConfigMap);

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
    void route2IngressTestInvalidPathMatchTypeThrowsException() {
        Route route = new Route();
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setPath(RoutePredicate.builder().matchType("invalid").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        Assertions.assertThrows(IllegalArgumentException.class, () -> converter.route2Ingress(route));
    }

    @Test
    void route2IngressTestMultipleDomains() {
        Route route = new Route();
        List<String> domains = new ArrayList<>();
        domains.add("higress.cn");
        domains.add("higress.com");
        route.setDomains(domains);
        route.setPath(RoutePredicate.builder().matchType("EQUAL").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        V1Ingress ingress = converter.route2Ingress(route);
        Assertions.assertEquals(2, ingress.getSpec().getRules().size());
        Assertions.assertNull(ingress.getSpec().getTls());
    }

    @Test
    void route2IngressTestMultipleDomainsWithDifferentProtocol() {
        Route route = new Route();
        List<String> domains = new ArrayList<>();
        domains.add("higress.cn");
        domains.add(httpsDomain);
        route.setDomains(domains);
        route.setPath(RoutePredicate.builder().matchType("EQUAL").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        ValidationException exception =
            Assertions.assertThrows(ValidationException.class, () -> converter.route2Ingress(route));
        Assertions.assertEquals("Currently only supports domains with the same protocol", exception.getMessage());
    }

    @Test
    void route2IngressTestMultipleDomainsWithDifferentHttpsConfiguration() {
        Route route = new Route();
        List<String> domains = new ArrayList<>();
        domains.add(httpsDomain);
        domains.add(httpsDomain + "-on");
        route.setDomains(domains);
        route.setPath(RoutePredicate.builder().matchType("EQUAL").matchValue("/test").build());
        route.setServices(Collections.singletonList(new UpstreamService()));

        ValidationException exception =
            Assertions.assertThrows(ValidationException.class, () -> converter.route2Ingress(route));
        Assertions.assertEquals("All domains must use consistent HTTPS configuration", exception.getMessage());
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
        Assertions.assertEquals("test-route", Objects.requireNonNull(ingress.getMetadata()).getName());
        Assertions.assertEquals("GET", Objects.requireNonNull(ingress.getMetadata().getAnnotations())
            .get(KubernetesConstants.Annotation.METHOD_KEY));
    }

    @Test
    void route2IngressTestRewriteConfigPrefix() {
        Route route = new Route();
        route.setName("test-route");
        route.setPath(new RoutePredicate(RoutePredicateTypeEnum.PRE.toString(), "/old-path", null));
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
    void route2IngressTestRewriteConfigEqual() {
        Route route = new Route();
        route.setName("test-route");
        route.setPath(new RoutePredicate(RoutePredicateTypeEnum.EQUAL.toString(), "/old-path", null));
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
    void route2IngressTestRewriteConfigRegex() {
        Route route = new Route();
        route.setName("test-route");
        route.setPath(new RoutePredicate(RoutePredicateTypeEnum.REGULAR.toString(), "/old-path($|/|\\?)", null));
        route.setDomains(Collections.singletonList("higress.cn"));
        route.setRewrite(new RewriteConfig(true, "/new-path", "new-host"));

        V1Ingress ingress = converter.route2Ingress(route);

        Assertions.assertNotNull(ingress);
        Assertions.assertEquals("test-route", ingress.getMetadata().getName());
        Assertions.assertTrue(Boolean.parseBoolean(
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.REWRITE_ENABLED_KEY)));
        Assertions.assertEquals("/new-path",
            ingress.getMetadata().getAnnotations().get(KubernetesConstants.Annotation.REWRITE_TARGET_KEY));
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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

        V1Ingress expectedIngress = buildBasicSupportedIngress(false);

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        expectedMetadata.setNamespace(null);
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
        metadata.setLabels(MapUtil.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY,
            KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_DOMAIN));
        Map<String, String> configMap = new HashMap<>();
        configMap.put(CommonKey.DOMAIN, "domain-name");
        configMap.put(KubernetesConstants.K8S_CERT, "domain-cert");
        configMap.put(KubernetesConstants.K8S_ENABLE_HTTPS, "domain-https");
        domainConfigMap.metadata(metadata);
        domainConfigMap.data(configMap);
        Domain domain = new Domain();
        domain.setName("domain-name");
        domain.setVersion("0.0.1");
        domain.setCertIdentifier("domain-cert");
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
        Assertions.assertEquals("cert-identifier", domain.getCertIdentifier());
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
        Assertions.assertNull(domain.getCertIdentifier());
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
        Assertions.assertNull(domain.getCertIdentifier());
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
            .imageRepository("test-repository").imageVersion("test-version").phase(PluginPhase.AUTHN.getName())
            .priority(10).imagePullPolicy(ImagePullPolicy.ALWAYS.getName()).imagePullSecret("test-secret").build();

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
        Assertions.assertEquals(plugin.getPhase(), cr.getSpec().getPhase());
        Assertions.assertEquals(10, cr.getSpec().getPriority().intValue());
        Assertions.assertEquals("oci://test-repository:test-version", cr.getSpec().getUrl());
        Assertions.assertEquals(plugin.getImagePullPolicy(), cr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), cr.getSpec().getImagePullSecret());
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
            WasmPluginInstance.builder().enabled(true).configurations(MapUtil.of("key", "value")).build();
        instance.setGlobalTarget();

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        Assertions.assertEquals(MapUtil.of("key", "value"), spec.getDefaultConfig());
        Assertions.assertFalse(spec.getDefaultConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestDomainScopeShouldAddOrUpdateDomainRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(MapUtil.of("key", "value")).build();
        instance.setTarget(WasmPluginInstanceScope.DOMAIN, "higress.cn");

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        List<MatchRule> matchRules = spec.getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule domainRule = matchRules.get(0);
        Assertions.assertTrue(domainRule.getDomain().contains("higress.cn"));
        Assertions.assertEquals(MapUtil.of("key", "value"), domainRule.getConfig());
        Assertions.assertFalse(domainRule.getConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestDomainScopeExistingRuleShouldUpdateExistingDomainRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        spec.setMatchRules(Lists.newArrayList(new MatchRule(false, MapUtil.of("key", "original"),
            Lists.newArrayList("higress.cn"), Lists.newArrayList(), Lists.newArrayList())));
        cr.setSpec(spec);

        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(MapUtil.of("key", "updated")).build();
        instance.setTarget(WasmPluginInstanceScope.DOMAIN, "higress.cn");

        converter.setWasmPluginInstanceToCr(cr, instance);

        List<MatchRule> matchRules = cr.getSpec().getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule domainRule = matchRules.get(0);
        Assertions.assertTrue(domainRule.getDomain().contains("higress.cn"));
        Assertions.assertEquals(MapUtil.of("key", "updated"), domainRule.getConfig());
        Assertions.assertFalse(domainRule.getConfigDisable());
    }

    @Test
    void setWasmPluginInstanceToCrTestRouteScopeShouldAddOrUpdateRouteRule() {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();
        WasmPluginInstance instance =
            WasmPluginInstance.builder().enabled(true).configurations(MapUtil.of("key", "value")).build();
        instance.setTarget(WasmPluginInstanceScope.ROUTE, "route-1");

        converter.setWasmPluginInstanceToCr(cr, instance);

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        Assertions.assertNotNull(spec);
        List<MatchRule> matchRules = spec.getMatchRules();
        Assertions.assertNotNull(matchRules);
        Assertions.assertEquals(1, matchRules.size());
        MatchRule routeRule = matchRules.get(0);
        Assertions.assertTrue(routeRule.getIngress().contains("route-1"));
        Assertions.assertEquals(MapUtil.of("key", "value"), routeRule.getConfig());
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
        v1RegistryConfig.setNacosGroups(Lists.newArrayList("testGroup1", "testGroup2"));

        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(v1RegistryConfig);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(V1McpBridge.REGISTRY_TYPE_NACOS, serviceSource.getType());
        Assertions.assertEquals("testDomain", serviceSource.getDomain());
        Assertions.assertEquals(80, serviceSource.getPort());
        Assertions.assertEquals("testName", serviceSource.getName());
        Map<String, Object> properties = serviceSource.getProperties();
        Assertions.assertNotNull(properties);
        Assertions.assertEquals("testNamespaceId", properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_NAMESPACE_ID));
        Assertions.assertEquals(Lists.newArrayList("testGroup1", "testGroup2"),
            properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS));
    }

    @Test
    public void v1RegistryConfig2ServiceSourceTestZkType() {
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setType(V1McpBridge.REGISTRY_TYPE_ZK);
        v1RegistryConfig.setDomain("testDomain");
        v1RegistryConfig.setPort(80);
        v1RegistryConfig.setName("testName");
        v1RegistryConfig.setZkServicesPath(Lists.newArrayList("testPath1", "testPath2"));

        ServiceSource serviceSource = converter.v1RegistryConfig2ServiceSource(v1RegistryConfig);

        Assertions.assertNotNull(serviceSource);
        Assertions.assertEquals(V1McpBridge.REGISTRY_TYPE_ZK, serviceSource.getType());
        Assertions.assertEquals("testDomain", serviceSource.getDomain());
        Assertions.assertEquals(80, serviceSource.getPort());
        Assertions.assertEquals("testName", serviceSource.getName());
        Map<String, Object> properties = serviceSource.getProperties();
        Assertions.assertNotNull(properties);
        Assertions.assertEquals(Lists.newArrayList("testPath1", "testPath2"),
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

        ServiceSource serviceSource = new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null,
            null, null, new HashMap<>(), null);

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

        ServiceSource serviceSource = new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null,
            null, "", new HashMap<>(), null);

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

        ServiceSource serviceSource = new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null,
            null, null, new HashMap<>(), null);

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

        ServiceSource serviceSource = new ServiceSource("testService", "1.0", "http", "test.domain.com", 8080, null,
            null, null, new HashMap<>(), null);

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
        metadata.setNamespace(DEFAULT_NAMESPACE);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY,
            KubernetesConstants.Label.RESOURCE_DEFINER_VALUE);

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
        metadata.setNamespace(DEFAULT_NAMESPACE);
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
        Assertions.assertTrue(CollectionUtils.isEmpty(route.getDomains()));
    }

    @Test
    void ingress2RouteTestValidIngressWithTLS() {
        V1IngressBackend backend = new V1IngressBackend();
        V1IngressSpec spec = new V1IngressSpec();
        spec.setDefaultBackend(backend);

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName("test-ingress");
        metadata.setNamespace(DEFAULT_NAMESPACE);
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
        metadata.setNamespace(DEFAULT_NAMESPACE);
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
    void ingress2RouteTestNotReadonly() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test-ingress");
        metadata.setNamespace(DEFAULT_NAMESPACE);
        metadata.setResourceVersion("1");
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY,
            KubernetesConstants.Label.RESOURCE_DEFINER_VALUE);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertFalse(route.getReadonly());
    }

    @Test
    void ingress2RouteTestReadonlyDueToNonSysNs() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test-ingress");
        metadata.setNamespace("test-ns");
        metadata.setResourceVersion("1");
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY,
            KubernetesConstants.Label.RESOURCE_DEFINER_VALUE);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertTrue(route.getReadonly());
    }

    @Test
    void ingress2RouteTestReadonlyDueToIncorrectDefiner() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test-ingress");
        metadata.setNamespace(DEFAULT_NAMESPACE);
        metadata.setResourceVersion("1");
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY, "bad-definer");

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertTrue(route.getReadonly());
    }

    @Test
    void ingress2RouteTestReadonlyDueToMissingDefiner() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test-ingress");
        metadata.setNamespace(DEFAULT_NAMESPACE);
        metadata.setResourceVersion("1");
        metadata.getLabels().remove(KubernetesConstants.Label.RESOURCE_DEFINER_KEY);

        Route route = converter.ingress2Route(ingress);

        Assertions.assertNotNull(route);
        Assertions.assertTrue(route.getReadonly());
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
        return buildBasicSupportedIngress(true);
    }

    private V1Ingress buildBasicSupportedIngress(boolean setDefinerLabel) {
        V1Ingress ingress = new V1Ingress();

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setNamespace(DEFAULT_NAMESPACE);
        KubernetesUtil.setLabel(metadata, "higress.io/domain_higress-default-domain", "true");
        if (setDefinerLabel) {
            KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.RESOURCE_DEFINER_KEY,
                KubernetesConstants.Label.RESOURCE_DEFINER_VALUE);
        }
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
        route.setCustomLabels(new HashMap<>());
        route.setReadonly(false);
        return route;
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
        metadata.setNamespace(DEFAULT_NAMESPACE);
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
        metadata.setNamespace(DEFAULT_NAMESPACE);
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
