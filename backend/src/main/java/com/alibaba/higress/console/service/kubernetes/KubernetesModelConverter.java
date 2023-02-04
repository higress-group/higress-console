package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.dto.Destination;
import com.alibaba.higress.console.controller.dto.DestinationTypeEnum;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.ParamsPredicates;
import com.alibaba.higress.console.controller.dto.PathPredicates;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.RoutePredicates;
import com.alibaba.higress.console.controller.dto.RoutePredicatesTypeEnum;
import com.alibaba.higress.console.util.KubernetesUtil;
import com.google.common.base.Splitter;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressBackend;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1IngressSpec;
import io.kubernetes.client.openapi.models.V1IngressTLS;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1TypedLocalObjectReference;
import io.kubernetes.client.util.Strings;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
public class KubernetesModelConverter {

    private static final Splitter lineSplitter = Splitter.on('\n').trimResults().omitEmptyStrings();
    private static final Splitter fieldSplitter = Splitter.on(Pattern.compile(" +")).trimResults().omitEmptyStrings();
    private static final V1IngressBackend DEFAULT_MCP_BRIDGE_BACKEND = new V1IngressBackend();
    private static final Integer DEFAULT_WEIGHT = 100;

    static {
        V1TypedLocalObjectReference mcpBridgeReference = new V1TypedLocalObjectReference();
        mcpBridgeReference.setApiGroup(KubernetesConstants.MCP_BRIDGE_API_GROUP);
        mcpBridgeReference.setKind(KubernetesConstants.MCP_BRIDGE_KIND);
        mcpBridgeReference.setName(KubernetesConstants.MCP_BRIDGE_NAME_DEFAULT);
        DEFAULT_MCP_BRIDGE_BACKEND.setResource(mcpBridgeReference);
    }

    public boolean isIngressSupported(V1Ingress ingress) {
        if (ingress.getMetadata() == null) {
            return false;
        }
        V1IngressSpec spec = ingress.getSpec();
        if (spec == null) {
            return false;
        }
        // TODO: Handle ingressClass field
        if (CollectionUtils.isEmpty(spec.getRules()) || spec.getRules().size() > 1) {
            return false;
        }
        V1IngressRule rule = spec.getRules().get(0);
        V1HTTPIngressRuleValue httpRule = rule.getHttp();
        if (httpRule == null) {
            return false;
        }
        if (CollectionUtils.isEmpty(httpRule.getPaths()) || httpRule.getPaths().size() > 1) {
            return false;
        }
        V1HTTPIngressPath path = httpRule.getPaths().get(0);
        if (!path.getPathType().equals(KubernetesConstants.IngressPathType.EXACT)
                && !path.getPathType().equals(KubernetesConstants.IngressPathType.PREFIX)) {
            return false;
        }
        V1IngressBackend backend = path.getBackend();
        if (path.getBackend() != null) {
            if (backend.getService() != null) {
                return false;
            }
            V1TypedLocalObjectReference resource = path.getBackend().getResource();
            if (resource != null &&
                    (!KubernetesConstants.MCP_BRIDGE_API_GROUP.equals(resource.getApiGroup())
                            || !KubernetesConstants.MCP_BRIDGE_KIND.equals(resource.getKind())
                            || !KubernetesConstants.MCP_BRIDGE_NAME_DEFAULT.equals(resource.getName()))) {
                return false;
            }
        }
        return true;
    }

    public Route ingress2Route(V1Ingress ingress) {
        Route route = new Route();
        route.setRoutePredicates(new RoutePredicates());
        fillRouteMetadata(route, ingress.getMetadata());
        fillRouteInfo(route, ingress.getMetadata(), ingress.getSpec());
        return route;
    }

    public V1Ingress route2Ingress(Route route) {
        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(new V1ObjectMeta());
        ingress.setSpec(new V1IngressSpec());
        fillIngressMetadata(ingress, route);
        fillIngressSpec(ingress, route);
        return ingress;
    }

    public V1ConfigMap domain2V1ConfigMap(Domain domain) {
        V1ConfigMap domainConfigMap = new V1ConfigMap();
        domainConfigMap.metadata(new V1ObjectMeta());
        domainConfigMap.getMetadata().setName(normalizeDomainName(domain.getName()));
        Map<String, String> configMap = new HashMap<>();
        configMap.put(CommonKey.DOMAIN, domain.getName());
        configMap.put(KubernetesConstants.K8S_CERT, domain.getCertIdentifier());
        configMap.put(KubernetesConstants.K8S_ENABLE_HTTPS, domain.getEnableHttps());
        domainConfigMap.data(configMap);

        return domainConfigMap;
    }

    public Domain V1ConfigMap2Domain(V1ConfigMap configMap) {
        Domain domain = new Domain();
        Map<String, String> configMapData = configMap.getData();
        if (Objects.isNull(configMapData)) {
            throw new IllegalArgumentException("The ConfigMap data is illegal");
        }
        domain.setName(configMapData.get(CommonKey.DOMAIN));
        domain.setCertIdentifier(configMapData.get(KubernetesConstants.K8S_CERT));
        domain.setEnableHttps(configMapData.get(KubernetesConstants.K8S_ENABLE_HTTPS));
        return domain;
    }

    public static String normalizeDomainName(String name) {
        if (StringUtils.isNotBlank(name)) {
            if (name.startsWith(CommonKey.ASTERISK)) {
                name = CommonKey.WILDCARD + name.substring(CommonKey.ASTERISK.length());
            }
            name = CommonKey.DOMAIN_PREFIX + name;
        }
        return name;
    }
    
    private static void fillRouteMetadata(Route route, V1ObjectMeta metadata) {
        if (metadata != null) {
            route.setName(metadata.getName());
        }
    }

    private static void fillRouteInfo(Route route, V1ObjectMeta metadata, V1IngressSpec spec) {
        if (spec == null) {
            return;
        }

        List<V1IngressRule> rules = spec.getRules();
        if (CollectionUtils.isEmpty(rules)) {
            return;
        }

        V1IngressRule rule = rules.get(0);
        V1HTTPIngressRuleValue httpRule = rule.getHttp();
        if (httpRule == null) {
            return;
        }
        if (CollectionUtils.isNotEmpty(httpRule.getPaths())) {
            fillPathRoute(route, metadata, httpRule.getPaths().get(0));
        }

        String host = rule.getHost();
        if (!Strings.isNullOrEmpty(host)) {
            route.setDomainList(Collections.singletonList(host));
        } else if (CollectionUtils.isNotEmpty(spec.getTls())) {
            List<String> tlsHosts = new ArrayList<>();
            for (V1IngressTLS tlsItem : spec.getTls()) {
                if (CollectionUtils.isNotEmpty(tlsItem.getHosts())) {
                    tlsHosts.addAll(tlsItem.getHosts());
                }
            }
            route.setDomainList(tlsHosts);
        } else {
            route.setDomainList(Collections.emptyList());
        }
    }

    private static void fillPathRoute(Route route, V1ObjectMeta metadata, V1HTTPIngressPath path) {
        RoutePredicates routePredicates = new RoutePredicates();
        routePredicates.setPathPredicates(new PathPredicates());
        routePredicates.setHeaderPredicates(Collections.emptyList());
        routePredicates.setMethodPredicates(Collections.emptyList());
        routePredicates.setQueryPredicates(Collections.emptyList());
        route.setRoutePredicates(routePredicates);
        fillPathPredicates(routePredicates.getPathPredicates(), metadata, path);
        fillRouteDestinations(route, metadata, path.getBackend());
    }

    private static void fillPathPredicates(PathPredicates pathPredicates, V1ObjectMeta metadata, V1HTTPIngressPath path) {
        pathPredicates.setPath(path.getPath());
        RoutePredicatesTypeEnum predicatesType = null;
        switch (path.getPathType()) {
            case KubernetesConstants.IngressPathType.EXACT:
                predicatesType = RoutePredicatesTypeEnum.EQUAL;
                break;
            case KubernetesConstants.IngressPathType.PREFIX:
                String useRegexValue = null;
                if (metadata != null && metadata.getAnnotations() != null) {
                    useRegexValue = metadata.getAnnotations().get(KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY);
                }
                if (KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE.equals(useRegexValue)) {
                    predicatesType = RoutePredicatesTypeEnum.REGULAR;
                } else {
                    predicatesType = RoutePredicatesTypeEnum.PRE;
                }
                break;
        }
        pathPredicates.setType(predicatesType != null ? predicatesType.toString() : null);
    }

    private static void fillRouteDestinations(Route route, V1ObjectMeta metadata, V1IngressBackend backend) {
        if (backend.getResource() == null) {
            return;
        }
        if (metadata.getAnnotations() == null) {
            return;
        }

        String rawDestination = metadata.getAnnotations().get(KubernetesConstants.Annotation.INGRESS_DESTINATION);
        if (Strings.isNullOrEmpty(rawDestination)) {
            return;
        }

        List<Destination> destinations = new ArrayList<>();
        for (String item : lineSplitter.split(rawDestination)) {
            Destination destination = buildDestination(item);
            if (destination != null) {
                destinations.add(destination);
            }
        }
        route.setServices(destinations);
        // TODO: Support other destination types.
        route.setDestinationType(destinations.size() > 1 ? DestinationTypeEnum.Multiple : DestinationTypeEnum.Single);
    }

    private static Destination buildDestination(String config) {
        List<String> fields = fieldSplitter.splitToList(config);
        int weight = 100;
        int addrIndex = 0;
        if (fields.get(0).endsWith("%")) {
            String weightText = fields.get(0);
            try {
                weight = Integer.parseInt(weightText.substring(0, weightText.length() - 1));
            } catch (NumberFormatException ex) {
                return null;
            }
            ++addrIndex;
        }

        if (fields.size() < addrIndex + 1) {
            return null;
        }

        String address = fields.get(addrIndex);
        String host = address;
        Integer port = null;
        int colonIndex = address.lastIndexOf(':');
        if (colonIndex != -1) {
            host = address.substring(0, colonIndex);
            String rawPort = address.substring(colonIndex + 1);
            try {
                port = Integer.parseInt(rawPort);
            } catch (NumberFormatException ex) {
                return null;
            }
        }

        String subset = null;
        if (fields.size() > addrIndex + 1) {
            subset = fields.get(addrIndex + 1);
        }

        Destination destination = new Destination();
        destination.setName(host);
        destination.setServicePort(port);
        destination.setVersion(subset);
        destination.setPercent(weight);
        return destination;
    }

    private void fillIngressMetadata(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        metadata.setName(route.getName());

        if (CollectionUtils.isNotEmpty(route.getDomainList())) {
            for (String domain : route.getDomainList()) {
                KubernetesUtil.setLabel(ingress, KubernetesConstants.Label.DOMAIN_KEY_PREFIX + domain,
                        KubernetesConstants.Label.DOMAIN_VALUE_DUMMY);
            }
        }
    }

    private void fillIngressSpec(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        V1IngressSpec spec = Objects.requireNonNull(ingress.getSpec());
        // TODO: Support getting TLS data from domain entities.
        fillIngressRules(metadata, spec, route);
        fillIngressDestination(metadata, route);
    }

    private static void fillIngressRules(V1ObjectMeta metadata, V1IngressSpec spec, Route route) {
        V1IngressRule rule = new V1IngressRule();
        spec.setRules(Collections.singletonList(rule));

        if (CollectionUtils.isNotEmpty(route.getDomainList())) {
            if (route.getDomainList().size() > 1) {
                throw new IllegalArgumentException("Only one domain is allowed.");
            }
            rule.setHost(route.getDomainList().get(0));
        }

        V1HTTPIngressRuleValue httpRule = new V1HTTPIngressRuleValue();
        rule.setHttp(httpRule);

        RoutePredicates routePredicates = route.getRoutePredicates();
        if (routePredicates == null) {
            throw new IllegalArgumentException("Missing routePredicates.");
        }

        List<String> methodPredicates = routePredicates.getMethodPredicates();
        if (CollectionUtils.isNotEmpty(methodPredicates)) {
            throw new IllegalArgumentException("methodPredicates is not supported yet.");
        }

        List<ParamsPredicates> headerPredicates = routePredicates.getHeaderPredicates();
        if (CollectionUtils.isNotEmpty(headerPredicates)) {
            throw new IllegalArgumentException("headerPredicates is not supported yet.");
        }

        if (CollectionUtils.isNotEmpty(routePredicates.getQueryPredicates())) {
            throw new IllegalArgumentException("queryPredicates is not supported yet.");
        }

        PathPredicates pathPredicates = routePredicates.getPathPredicates();
        if (pathPredicates != null) {
            fillHttpPathRule(metadata, httpRule, pathPredicates);
        }
    }

    private static void fillHttpPathRule(V1ObjectMeta metadata, V1HTTPIngressRuleValue httpRule, PathPredicates pathPredicates) {
        V1HTTPIngressPath httpPath = new V1HTTPIngressPath();
        httpRule.setPaths(Collections.singletonList(httpPath));

        httpPath.setPath(pathPredicates.getPath());
        if (RoutePredicatesTypeEnum.EQUAL.toString().equals(pathPredicates.getType())) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.EXACT);
        } else if (RoutePredicatesTypeEnum.PRE.toString().equals(pathPredicates.getType())) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        } else if (RoutePredicatesTypeEnum.REGULAR.toString().equals(pathPredicates.getType())) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY,
                    KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE);
        } else {
            throw new IllegalArgumentException("Unsupported path predicates type: " + pathPredicates.getType());
        }

        if (Boolean.TRUE.equals(pathPredicates.getIgnoreCase())) {
            throw new IllegalArgumentException("pathPredicates.ignoreCase is not supported yet.");
        }

        httpPath.setBackend(DEFAULT_MCP_BRIDGE_BACKEND);
    }

    private static void fillIngressDestination(V1ObjectMeta metadata, Route route) {
        if (CollectionUtils.isEmpty(route.getServices())) {
            return;
        }

        if (route.getDestinationType() != null) {
            switch (route.getDestinationType()) {
                case Single:
                case Multiple:
                    break;
                default:
                    throw new IllegalArgumentException("DestinationType [" + route.getDestinationType() + "] is not supported yet.");
            }
        }

        StringBuilder valueBuilder = new StringBuilder();
        if (route.getServices().size() == 1) {
            Destination service = route.getServices().get(0);
            valueBuilder.append(service.getName());
            if (service.getServicePort() != null) {
                valueBuilder.append(":").append(service.getServicePort());
            }
            if (!Strings.isNullOrEmpty(service.getVersion())) {
                valueBuilder.append(" ").append(service.getVersion());
            }
        } else {
            for (Destination service : route.getServices()) {
                if (!valueBuilder.isEmpty()) {
                    valueBuilder.append("\n");
                }
                int weight = Objects.requireNonNullElse(service.getPercent(), DEFAULT_WEIGHT);
                valueBuilder.append(weight).append("% ");
                valueBuilder.append(service.getName());
                if (service.getServicePort() != null) {
                    valueBuilder.append(":").append(service.getServicePort());
                }
                if (!Strings.isNullOrEmpty(service.getVersion())) {
                    valueBuilder.append(" ").append(service.getVersion());
                }
            }
        }
        if (!valueBuilder.isEmpty()) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION, valueBuilder.toString());
        }
    }

}
