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

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.alibaba.higress.console.controller.dto.*;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1RegistryConfig;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.dto.route.RoutePredicate;
import com.alibaba.higress.console.controller.dto.route.RoutePredicateTypeEnum;
import com.alibaba.higress.console.controller.dto.route.UpstreamService;
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

@org.springframework.stereotype.Service
public class KubernetesModelConverter {

    private static final Splitter LINE_SPLITTER = Splitter.on('\n').trimResults().omitEmptyStrings();
    private static final Splitter FIELD_SPLITTER = Splitter.on(Pattern.compile(" +")).trimResults().omitEmptyStrings();
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
            if (resource != null && (!KubernetesConstants.MCP_BRIDGE_API_GROUP.equals(resource.getApiGroup())
                || !KubernetesConstants.MCP_BRIDGE_KIND.equals(resource.getKind())
                || !KubernetesConstants.MCP_BRIDGE_NAME_DEFAULT.equals(resource.getName()))) {
                return false;
            }
        }
        return true;
    }

    public Route ingress2Route(V1Ingress ingress) {
        Route route = new Route();
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

    public V1ConfigMap domain2ConfigMap(Domain domain) {
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

    public Domain configMap2Domain(V1ConfigMap configMap) {
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
            route.setDomains(Collections.singletonList(host));
        } else if (CollectionUtils.isNotEmpty(spec.getTls())) {
            List<String> tlsHosts = new ArrayList<>();
            for (V1IngressTLS tlsItem : spec.getTls()) {
                if (CollectionUtils.isNotEmpty(tlsItem.getHosts())) {
                    tlsHosts.addAll(tlsItem.getHosts());
                }
            }
            route.setDomains(tlsHosts);
        } else {
            route.setDomains(Collections.emptyList());
        }
    }

    private static void fillPathRoute(Route route, V1ObjectMeta metadata, V1HTTPIngressPath path) {
        fillPathPredicates(route, metadata, path);
        fillRouteDestinations(route, metadata, path.getBackend());
    }

    private static void fillPathPredicates(Route route, V1ObjectMeta metadata, V1HTTPIngressPath path) {
        RoutePredicate pathPredicate = new RoutePredicate();
        route.setPath(pathPredicate);
        pathPredicate.setMatchValue(path.getPath());
        RoutePredicateTypeEnum matchType = null;
        switch (path.getPathType()) {
            case KubernetesConstants.IngressPathType.EXACT:
                matchType = RoutePredicateTypeEnum.EQUAL;
                break;
            case KubernetesConstants.IngressPathType.PREFIX:
                String useRegexValue = null;
                if (metadata != null && metadata.getAnnotations() != null) {
                    useRegexValue = metadata.getAnnotations().get(KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY);
                }
                if (KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE.equals(useRegexValue)) {
                    matchType = RoutePredicateTypeEnum.REGULAR;
                } else {
                    matchType = RoutePredicateTypeEnum.PRE;
                }
                break;
            default:
                break;
        }
        pathPredicate.setMatchType(matchType != null ? matchType.toString() : null);
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

        List<UpstreamService> services = new ArrayList<>();
        for (String item : LINE_SPLITTER.split(rawDestination)) {
            UpstreamService service = buildDestination(item);
            if (service != null) {
                services.add(service);
            }
        }
        route.setServices(services);
    }

    private static UpstreamService buildDestination(String config) {
        List<String> fields = FIELD_SPLITTER.splitToList(config);
        int weight = DEFAULT_WEIGHT;
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

        UpstreamService service = new UpstreamService();
        service.setName(host);
        service.setPort(port);
        service.setVersion(subset);
        service.setWeight(weight);
        return service;
    }

    private void fillIngressMetadata(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        metadata.setName(route.getName());

        if (CollectionUtils.isNotEmpty(route.getDomains())) {
            for (String domain : route.getDomains()) {
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

        if (CollectionUtils.isNotEmpty(route.getDomains())) {
            if (route.getDomains().size() > 1) {
                throw new IllegalArgumentException("Only one domain is allowed.");
            }
            rule.setHost(route.getDomains().get(0));
        }

        V1HTTPIngressRuleValue httpRule = new V1HTTPIngressRuleValue();
        rule.setHttp(httpRule);

        if (CollectionUtils.isNotEmpty(route.getMethods())) {
            throw new IllegalArgumentException("methods is not supported yet.");
        }

        if (CollectionUtils.isNotEmpty(route.getHeaders())) {
            throw new IllegalArgumentException("headers is not supported yet.");
        }

        if (CollectionUtils.isNotEmpty(route.getUrlParams())) {
            throw new IllegalArgumentException("urlParams is not supported yet.");
        }

        RoutePredicate pathPredicate = route.getPath();
        if (pathPredicate != null) {
            fillHttpPathRule(metadata, httpRule, pathPredicate);
        }
    }

    private static void fillHttpPathRule(V1ObjectMeta metadata, V1HTTPIngressRuleValue httpRule,
        RoutePredicate pathPredicate) {
        V1HTTPIngressPath httpPath = new V1HTTPIngressPath();
        httpRule.setPaths(Collections.singletonList(httpPath));

        httpPath.setPath(pathPredicate.getMatchValue());
        String matchType = pathPredicate.getMatchType();
        if (RoutePredicateTypeEnum.EQUAL.toString().equals(matchType)) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.EXACT);
        } else if (RoutePredicateTypeEnum.PRE.toString().equals(matchType)) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
        } else if (RoutePredicateTypeEnum.REGULAR.toString().equals(matchType)) {
            httpPath.setPathType(KubernetesConstants.IngressPathType.PREFIX);
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_USE_REGEX_KEY,
                KubernetesConstants.Annotation.INGRESS_USE_REGEX_TRUE_VALUE);
        } else {
            throw new IllegalArgumentException("Unsupported path match type: " + matchType);
        }

        if (Boolean.FALSE.equals(pathPredicate.getCaseSensitive())) {
            throw new IllegalArgumentException("path.caseSensitive is not supported yet.");
        }

        httpPath.setBackend(DEFAULT_MCP_BRIDGE_BACKEND);
    }

    private static void fillIngressDestination(V1ObjectMeta metadata, Route route) {
        List<UpstreamService> services = route.getServices();

        if (CollectionUtils.isEmpty(services)) {
            return;
        }

        StringBuilder valueBuilder = new StringBuilder();
        if (services.size() == 1) {
            UpstreamService service = services.get(0);
            valueBuilder.append(service.getName());
            if (service.getPort() != null) {
                valueBuilder.append(":").append(service.getPort());
            }
        } else {
            for (UpstreamService service : services) {
                if (!valueBuilder.isEmpty()) {
                    valueBuilder.append("\n");
                }
                valueBuilder.append(service.getWeight()).append("% ");
                valueBuilder.append(service.getName());
                if (service.getPort() != null) {
                    valueBuilder.append(":").append(service.getPort());
                }
                if (!Strings.isNullOrEmpty(service.getVersion())) {
                    valueBuilder.append(" ").append(service.getVersion());
                }
            }
        }
        if (!valueBuilder.isEmpty()) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.INGRESS_DESTINATION,
                valueBuilder.toString());
        }
    }

    public ServiceSource v1RegistryConfig2ServiceSource(V1RegistryConfig v1RegistryConfig) {
        ServiceSource serviceSource = new ServiceSource();
        fillServiceSourceInfo(serviceSource, v1RegistryConfig);
        return serviceSource;
    }

    public static void initV1McpBridge(V1McpBridge v1McpBridge) {
        v1McpBridge.setMetadata(new V1ObjectMeta());
        v1McpBridge.getMetadata().setName(V1McpBridge.MCP_BRIDGE_NAME);
        List<V1RegistryConfig> registries = new ArrayList<>();
        v1McpBridge.setSpec(new V1McpBridgeSpec());
        v1McpBridge.getSpec().setRegistries(registries);
    }

    public static void addV1McpBridgeRegistry(V1McpBridge v1McpBridge, ServiceSource serviceSource) {
        Optional<V1RegistryConfig> op = v1McpBridge.getSpec().getRegistries().stream()
            .filter(r -> StringUtils.isNotBlank(r.getName()) && r.getName().equals(serviceSource.getName()))
            .findFirst();
        if (op.isPresent()) {
            serviceSource2V1RegistryConfig(op.get(), serviceSource);
        } else {
            v1McpBridge.getSpec().getRegistries().add(serviceSource2V1RegistryConfig(serviceSource));
        }
    }

    public static void removeV1McpBridgeRegistry(V1McpBridge v1McpBridge, String name) {
        List<V1RegistryConfig> registries = v1McpBridge.getSpec().getRegistries().stream()
            .filter(r -> !r.getName().equals(name)).collect(Collectors.toList());
        v1McpBridge.getSpec().setRegistries(registries);
    }

    public static void fillServiceSourceInfo(ServiceSource serviceSource, V1RegistryConfig v1RegistryConfig) {
        if (v1RegistryConfig == null) {
            return;
        }
        serviceSource.setDomain(v1RegistryConfig.getDomain());
        serviceSource.setType(v1RegistryConfig.getType());
        serviceSource.setPort(v1RegistryConfig.getPort());
        serviceSource.setName(v1RegistryConfig.getName());
        serviceSource.setProperties(new HashMap<>());
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(v1RegistryConfig.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSNAMESPACEID,
                v1RegistryConfig.getNacosNamespaceId());
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS,
                v1RegistryConfig.getNacosGroups());
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_ZK_ZKSERVICESPATH,
                v1RegistryConfig.getZkServicesPath());
        }
    }

    private static V1RegistryConfig serviceSource2V1RegistryConfig(ServiceSource serviceSource) {
        if (serviceSource == null) {
            return null;
        }
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setDomain(serviceSource.getDomain());
        v1RegistryConfig.setType(serviceSource.getType());
        v1RegistryConfig.setPort(serviceSource.getPort());
        v1RegistryConfig.setName(serviceSource.getName());
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(serviceSource.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(serviceSource.getType())) {
            v1RegistryConfig.setNacosNamespaceId((String)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSNAMESPACEID))
                .orElse(""));
            v1RegistryConfig.setNacosGroups((List)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS))
                .orElse(new ArrayList<>()));
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setZkServicesPath((List)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_ZK_ZKSERVICESPATH))
                .orElse(new ArrayList<>()));
        }
        return v1RegistryConfig;
    }

    private static void serviceSource2V1RegistryConfig(V1RegistryConfig v1RegistryConfig, ServiceSource serviceSource) {
        if (serviceSource == null) {
            return;
        }
        v1RegistryConfig.setDomain(serviceSource.getDomain());
        v1RegistryConfig.setType(serviceSource.getType());
        v1RegistryConfig.setPort(serviceSource.getPort());
        v1RegistryConfig.setName(serviceSource.getName());
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(serviceSource.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(serviceSource.getType())) {
            v1RegistryConfig.setNacosNamespaceId((String)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSNAMESPACEID))
                .orElse(""));
            v1RegistryConfig.setNacosGroups((List)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS))
                .orElse(new ArrayList<>()));
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setZkServicesPath((List)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_ZK_ZKSERVICESPATH))
                .orElse(new ArrayList<>()));
        }
    }

    public static V1RegistryConfig registryConfig2V1RegistryConfig(RegistryConfig registryConfig) {
        V1RegistryConfig v1RegistryConfig = new V1RegistryConfig();
        v1RegistryConfig.setName(registryConfig.getName());
        v1RegistryConfig.setType(registryConfig.getType());
        v1RegistryConfig.setPort(v1RegistryConfig.getPort());
        v1RegistryConfig.setDomain(registryConfig.getDomain());
        v1RegistryConfig.setNacosGroups(registryConfig.getNacosGroups());
        v1RegistryConfig.setConsulNamespace(registryConfig.getConsulNamespace());
        v1RegistryConfig.setNacosNamespaceId(registryConfig.getNacosNamespaceId());
        registryConfig.setZkServicesPath(registryConfig.getZkServicesPath());
        return v1RegistryConfig;
    }
}
