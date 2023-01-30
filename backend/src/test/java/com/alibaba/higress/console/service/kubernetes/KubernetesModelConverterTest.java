package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.dto.Destination;
import com.alibaba.higress.console.controller.dto.DestinationTypeEnum;
import com.alibaba.higress.console.controller.dto.ParamsPredicates;
import com.alibaba.higress.console.controller.dto.PathPredicates;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.RoutePredicates;
import com.alibaba.higress.console.controller.dto.RoutePredicatesTypeEnum;
import com.alibaba.higress.console.util.KubernetesUtil;
import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressBackend;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1IngressServiceBackend;
import io.kubernetes.client.openapi.models.V1IngressSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
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
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, null, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithWeight() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "10% hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 10, null, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithPort() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, 8080, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathSingleServiceWithPortAndVersion() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080 v1");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination("v1", 100, 8080, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestPrefixPathMultipleServices() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "20% hello1.default.svc.cluster.local:8080\n" +
                "30% hello2.default.svc.cluster.local:18080 v1\n50% hello3.default.svc.cluster.local v2");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Multiple);
        Destination destination1 = new Destination(null, 20, 8080, "hello1.default.svc.cluster.local");
        Destination destination2 = new Destination("v1", 30, 18080, "hello2.default.svc.cluster.local");
        Destination destination3 = new Destination("v2", 50, null, "hello3.default.svc.cluster.local");
        expectedRoute.setServices(Arrays.asList(destination1, destination2, destination3));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestExactPathSingleService() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local");

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.EXACT);
        path.setPath("/foo");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.EQUAL.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, null, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void ingress2RouteTestRegularPathSingleService() {
        V1Ingress ingress = buildBasicSupportedIngress();

        V1ObjectMeta metadata = ingress.getMetadata();
        metadata.setName("test");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local");
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY,
                KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE);

        V1HTTPIngressPath path = ingress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        path.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        path.setPath("/route_\\d+");

        Route route = converter.ingress2Route(ingress);

        Route expectedRoute = buildBasicRoute();
        expectedRoute.setName(metadata.getName());
        PathPredicates pathPredicates = expectedRoute.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.REGULAR.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath(path.getPath());
        expectedRoute.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, null, "hello.default.svc.cluster.local");
        expectedRoute.setServices(Collections.singletonList(destination));
        Assertions.assertEquals(expectedRoute, route);
    }

    @Test
    public void route2IngressTestPrefixPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, null, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithWeight() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 80, null, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithPort() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination(null, 100, 8080, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathSingleServiceWithPortAndVersion() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination("v1", 100, 8080, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080 v1");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestPrefixPathMultipleServices() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.PRE.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Multiple);
        Destination destination1 = new Destination(null, 20, 8080, "hello1.default.svc.cluster.local");
        Destination destination2 = new Destination("v1", 30, 18080, "hello2.default.svc.cluster.local");
        Destination destination3 = new Destination("v2", 50, null, "hello3.default.svc.cluster.local");
        route.setServices(Arrays.asList(destination1, destination2, destination3));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "20% hello1.default.svc.cluster.local:8080\n" +
                "30% hello2.default.svc.cluster.local:18080 v1\n50% hello3.default.svc.cluster.local v2");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestExactPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.EQUAL.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination("v1", 100, 8080, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080 v1");

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.EXACT);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
    }

    @Test
    public void route2IngressTestRegularPathSingleService() {
        Route route = buildBasicRoute();
        route.setName("test");
        PathPredicates pathPredicates = route.getRoutePredicates().getPathPredicates();
        pathPredicates.setType(RoutePredicatesTypeEnum.REGULAR.toString());
        pathPredicates.setIgnoreCase(null);
        pathPredicates.setPath("/route_\\d+");
        route.setDestinationType(DestinationTypeEnum.Single);
        Destination destination = new Destination("v1", 100, 8080, "hello.default.svc.cluster.local");
        route.setServices(Collections.singletonList(destination));

        V1Ingress ingress = converter.route2Ingress(route);

        V1Ingress expectedIngress = buildBasicSupportedIngress();

        V1ObjectMeta expectedMetadata = expectedIngress.getMetadata();
        expectedMetadata.setName(route.getName());
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, "hello.default.svc.cluster.local:8080 v1");
        KubernetesUtil.setAnnotation(expectedMetadata, KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY,
                KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE);

        V1HTTPIngressPath expectedPath = expectedIngress.getSpec().getRules().get(0).getHttp().getPaths().get(0);
        expectedPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        expectedPath.setPath(pathPredicates.getPath());

        Assertions.assertEquals(expectedIngress, ingress);
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
        reference.setApiGroup(KubernetesConstants.MCP_BRIDGE_API_GROUP);
        reference.setKind(KubernetesConstants.MCP_BRIDGE_KIND);
        reference.setName(KubernetesConstants.MCP_BRIDGE_NAME_DEFAULT);
        backend.setResource(reference);
        path.setBackend(backend);

        return ingress;
    }

    private static Route buildBasicRoute() {
        Route route = new Route();

        RoutePredicates routePredicates = new RoutePredicates();
        routePredicates.setQueryPredicates(new ArrayList<>());
        routePredicates.setHeaderPredicates(new ArrayList<>());
        routePredicates.setMethodPredicates(new ArrayList<>());
        routePredicates.setPathPredicates(new PathPredicates());
        route.setRoutePredicates(routePredicates);

        route.setDomainList(new ArrayList<>());
        route.setServices(new ArrayList<>());
        return route;
    }
}
