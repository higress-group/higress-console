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

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.OpenAPISpecification;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.openapi.OpenAPIParameter;
import com.alibaba.higress.sdk.model.openapi.OpenAPIPathDescription;
import com.alibaba.higress.sdk.model.openapi.OpenAPIServer;
import com.alibaba.higress.sdk.model.openapi.OpenAPIServerVariable;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteSpecMatches;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
public class OpenAPIServiceImpl implements OpenAPIService{
    private final KubernetesClientService kubernetesClientService;
    private final DomainService domainService;
    private final RouteService routeService;

    private final WasmPluginInstanceService wasmPluginInstanceService;

    public OpenAPIServiceImpl(KubernetesClientService kubernetesClientService, DomainService domainService,
                              RouteService routeService, WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesClientService = kubernetesClientService;
        this.domainService = domainService;
        this.routeService = routeService;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }


    @Override
    public OpenAPISpecification add(OpenAPISpecification openApi) {
        if (kubernetesClientService.isIngressWorkMode()) {
            throw new BusinessException("Ingress mode is not supported for OpenAPI Specification yet");
        }

        List<DomainInfo> domainInfos = processDomains(openApi);
        addOrUpdateDomains(domainInfos);

        List<RouteInfo> routeInfos = processRoutes(openApi);
        addRoutes(routeInfos, openApi.getPaths(), domainInfos);

        return null;
    }
    private static class PathAndType {
        String pathPrefix;
        Boolean isExact;

        PathAndType(String pathPrefix, Boolean isExact) {
            this.pathPrefix = pathPrefix;
            this.isExact = isExact;
        }
    }
    private static class DomainInfo {
        Domain domain;
        PathAndType pathAndType;

        List<WasmPluginInstance> instances;

        DomainInfo(Domain domain, PathAndType pathAndType, List<WasmPluginInstance> instances) {
            this.domain = domain;
            this.pathAndType = pathAndType;
            this.instances = instances;
        }
    }

    private static class RouteInfo {
        Route route;
        List<WasmPluginInstance> instances;

        RouteInfo(Route route, List<WasmPluginInstance> instances) {
            this.route = route;
            this.instances = instances;
        }
    }

    private List<DomainInfo> processDomains(OpenAPISpecification openApi) {
        List<DomainInfo> domainInfos = new ArrayList<>();
        List<OpenAPIServer> servers = openApi.getServers();

        if (servers == null || servers.isEmpty()) {
            domainInfos.add(createDefaultDomainInfo());
        } else {
            for (OpenAPIServer server : servers) {
                domainInfos.addAll(createDomainInfoFromServer(server));
            }
        }

        return domainInfos;
    }

    private DomainInfo createDefaultDomainInfo() {
        Domain domain = new Domain();
        domain.setName("*");
        return new DomainInfo(domain, new PathAndType("/", Boolean.TRUE), null);
    }

    private List<DomainInfo> createDomainInfoFromServer(OpenAPIServer server) {
        String url = server.getUrl();
        Map<String, OpenAPIServerVariable> variables = server.getVariables();
        List<DomainInfo> domainInfos = new ArrayList<>();

        PathAndType pathAndType = extractPathPrefix(url, variables);
        List<String> schemes = extractSchemes(url, variables);
        List<String> hosts = extractHosts(url, variables);

        for (String host : hosts) {
            Domain domain = new Domain();
            domain.setIsIngressMode(kubernetesClientService.isIngressWorkMode());
            domain.setName(host);
            // For absolute URLs, create a DomainInfo for each scheme
            domain.setEnableHttps(Domain.EnableHttps.OFF);
            Map<Integer, String> portAndCertMap = new HashMap<>();
            for (String scheme : schemes) {
                if ("http".equalsIgnoreCase(scheme)) {
                    portAndCertMap.put(80, "");
                } else if ("https".equalsIgnoreCase(scheme)) {
                    domain.setEnableHttps(Domain.EnableHttps.ON);
                    // TODO: change the default tls name
                    String tls;
                    if (server.getExtensions()!=null && server.getExtensions().containsKey("tls_name")) {
                        tls= (String) server.getExtensions().get("tls_name");
                    } else {
                        throw new BusinessException("error openapi specification: protocol is https but without cert");
                    }
                    portAndCertMap.put(443, tls);
                }
            }
            domain.setPortAndCertMap(portAndCertMap);
            List<WasmPluginInstance> instances = new ArrayList<>();
            if (server.getExtensions()!=null && server.getExtensions().containsKey("policy")) {
                @SuppressWarnings("unchecked")
                Map<String, List<String>> wasm = (Map<String, List<String>>) server.getExtensions().get("policy");
                if (wasm.get("pluginName")!=null && wasm.get("enabled")!=null && wasm.get("rawConfigurations")!=null) {
                    List<String> pluginNames = wasm.get("pluginName");
                    List<String> enabled = wasm.get("enabled");
                    List<String> rawConfigs = wasm.get("rawConfigurations");
                    for (int i = 0; i < pluginNames.size(); i++) {
                        WasmPluginInstance instance = new WasmPluginInstance();
                        instance.setScope(WasmPluginInstanceScope.DOMAIN);
                        instance.setPluginName(pluginNames.get(i));
                        if (i < enabled.size()) {
                            instance.setEnabled(Boolean.parseBoolean(enabled.get(i)));
                        }
                        if (i < rawConfigs.size()) {
                            instance.setRawConfigurations(rawConfigs.get(i));
                        }
                        instance.setTarget(domain.getName());
                        instances.add(instance);
                    }
                }
            }
            domainInfos.add(new DomainInfo(domain, pathAndType, instances));
        }

        return domainInfos;
    }

    private PathAndType extractPathPrefix(String url, Map<String, OpenAPIServerVariable> variables) {
        String path;
        String processedUrl = renderDefaultSchemes(url, variables);
        try {
            path = new URL(processedUrl).getPath();
        } catch (MalformedURLException e) {
            // If URL is relative, it's the path prefix itself
            path = url;
        }
        return processPathVariables(path, variables);
    }

    private List<String> extractSchemes(String url, Map<String, OpenAPIServerVariable> variables) {
        List<String> schemes = new ArrayList<>();
        
        if (url.startsWith("{")) {
            int endIndex = url.indexOf("}");
            if (endIndex != -1) {
                String schemePlaceholder = url.substring(1, endIndex);
                OpenAPIServerVariable schemeVar = variables.get(schemePlaceholder);
                if (schemeVar != null && schemeVar.getEnums() != null) {
                    schemes.addAll(schemeVar.getEnums());
                } else {
                    schemes.add("http");
                }
            }
        } else {
            try {
                URL parsedUrl = new URL(url);
                schemes.add(parsedUrl.getProtocol());
            } catch (MalformedURLException e) {
                // If URL is relative, only http
                schemes.add("http");
            }
        }
        
        return schemes;
    }

    private List<String> extractHosts(String url, Map<String, OpenAPIServerVariable> variables) {
        List<String> hosts = new ArrayList<>();
        String processedUrl = renderDefaultSchemes(url, variables);
        
        try {
            URL parsedUrl = new URL(processedUrl);
            String host = parsedUrl.getHost();
            
            if (host.contains("{")) {
                String[] parts = host.split("\\.");
                List<String> hostVariations = new ArrayList<>();
                hostVariations.add(host);

                for (String part : parts) {
                    if (part.startsWith("{") && part.endsWith("}")) {
                        String varName = part.substring(1, part.length() - 1);
                        OpenAPIServerVariable var = variables.get(varName);
                        if (var != null) {
                            List<String> values = var.getEnums() != null ? var.getEnums() :
                                    (var.getDefaultValue() != null ? Arrays.asList(var.getDefaultValue()) :
                                            Arrays.asList("*"));
                            List<String> newVariations = new ArrayList<>();
                            for (String variation : hostVariations) {
                                for (String value : values) {
                                    newVariations.add(variation.replace("{" + varName + "}", value));
                                }
                            }
                            hostVariations = newVariations;
                        }
                    }
                }
                hosts.addAll(hostVariations);
            } else {
                hosts.add(host);
            }
        } catch (MalformedURLException e) {
            // If URL is relative, return wildcard
            hosts.add(HigressConstants.DEFAULT_DOMAIN);
        }
        
        return hosts;
    }

    private String renderDefaultSchemes(String url, Map<String, OpenAPIServerVariable> variables) {
        if (variables == null) {
            return url;
        }
        if (url.startsWith("{")) {
            int endIndex = url.indexOf("}");
            if (endIndex != -1) {
                String schemePlaceholder = url.substring(1, endIndex);
                OpenAPIServerVariable schemeVar = variables.get(schemePlaceholder);
                if (schemeVar == null) {
                    return url;
                }
                String value = schemeVar.getDefaultValue() != null ? schemeVar.getDefaultValue() :
                        (schemeVar.getEnums() != null && !schemeVar.getEnums().isEmpty() ? schemeVar.getEnums().get(0) : "");
                url = url.replace("{" + schemePlaceholder + "}", value);
            }
        }
        return url;
    }

    private PathAndType processPathVariables(String path, Map<String, OpenAPIServerVariable> variables) {
        // "^/(v2|v3)$"
        if (variables == null) {
            return new PathAndType(path, Boolean.TRUE);
        }

        StringBuilder regex = new StringBuilder("^");
        String[] segments = path.split("/");

        Boolean isExact = Boolean.TRUE;

        for (String segment : segments) {
            if (segment.startsWith("{") && segment.endsWith("}")) {
                isExact = Boolean.FALSE;
                String varName = segment.substring(1, segment.length() - 1);
                OpenAPIServerVariable var = variables.get(varName);
                if (var != null && var.getEnums() != null && !var.getEnums().isEmpty()) {
                    regex.append("/(" + String.join("|", var.getEnums()) + ")");
                } else {
                    regex.append("/[^/]+");
                }
            } else {
                regex.append("/" + Pattern.quote(segment));
            }
        }
        if(!isExact) {
            regex.append("$");
        }
        return new PathAndType(regex.toString(), isExact);
    }


    private List<RouteInfo> processRoutes(OpenAPISpecification openApi) {
        List<RouteInfo> routeInfos = new ArrayList<>();
        Map<String, OpenAPIPathDescription> paths = openApi.getPaths();

        for (Map.Entry<String, OpenAPIPathDescription> entry : paths.entrySet()) {
            String path = entry.getKey();
            OpenAPIPathDescription pathItem = entry.getValue();

            Route route = new Route();
            route.setIsIngressMode(kubernetesClientService.isIngressWorkMode());
            route.setName(path);
            RoutePredicate routePath = new RoutePredicate(RoutePredicateTypeEnum.EQUAL.toString(), path, false);
            route.setPath(routePath);

            boolean hasPathParameter = path.contains("{") && path.contains("}");

            if (hasPathParameter) {
                String regexPath = convertPathToRegex(path, getFirstOperationParameters(pathItem));
                routePath.setMatchValue(regexPath);
                routePath.setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
            }
            List<WasmPluginInstance> instances = new ArrayList<>();
            setRouteProperties(route, pathItem, instances);
            routeInfos.add(new RouteInfo(route, instances));
        }

        return routeInfos;
    }

    private List<OpenAPIParameter> getFirstOperationParameters(OpenAPIPathDescription pathItem) {
        if (pathItem.getGet() != null && pathItem.getGet().getParameters() != null) {
            return pathItem.getGet().getParameters();
        } else if (pathItem.getPost() != null && pathItem.getPost().getParameters() != null) {
            return pathItem.getPost().getParameters();
        } else if (pathItem.getPut() != null && pathItem.getPut().getParameters() != null) {
            return pathItem.getPut().getParameters();
        } else if (pathItem.getDelete() != null && pathItem.getDelete().getParameters() != null) {
            return pathItem.getDelete().getParameters();
        } else if (pathItem.getPatch() != null && pathItem.getPatch().getParameters() != null) {
            return pathItem.getPatch().getParameters();
        } else if (pathItem.getOptions() != null && pathItem.getOptions().getParameters() != null) {
            return pathItem.getOptions().getParameters();
        } else if (pathItem.getHead() != null && pathItem.getHead().getParameters() != null) {
            return pathItem.getHead().getParameters();
        } else if (pathItem.getTrace() != null && pathItem.getTrace().getParameters() != null) {
            return pathItem.getTrace().getParameters();
        }
        return null;
    }

    private String convertPathToRegex(String path, List<OpenAPIParameter> parameters) {
        if (parameters == null) {
            return path;
        }
        StringBuilder regex = new StringBuilder("^");
        String[] segments = path.split("/");

        for (String segment : segments) {
            if (segment.startsWith("{") && segment.endsWith("}")) {
                String paramName = segment.substring(1, segment.length() - 1);
                OpenAPIParameter param = parameters.stream()
                        .filter(p -> p.getName().equals(paramName) && "path".equals(p.getIn()))
                        .findFirst()
                        .orElse(null);

                if (param != null && param.getSchema() != null) {
                    String format = param.getSchema().getFormat();
                    String type = param.getSchema().getType();
                    if ("integer".equals(type) || "int32".equals(format) || "int64".equals(format)) {
                        regex.append("/([0-9]+)");
                    } else if ("float".equals(type) || "double".equals(type)) {
                        regex.append("/([0-9]*\\.?[0-9]+)");
                    } else {
                        regex.append("/([^/]+)");
                    }
                } else {
                    regex.append("/([^/]+)");
                }
            } else {
                regex.append("/" + Pattern.quote(segment));
            }
        }
        regex.append("$");

        return regex.toString();
    }

    private void setRouteProperties(Route route, OpenAPIPathDescription pathItem, List<WasmPluginInstance> instances) {
        List<String> methods = new ArrayList<>();
        if (pathItem.getGet() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.GET.toString());
        }
        if (pathItem.getPut() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.PUT.toString());
        }
        if (pathItem.getPost() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.POST.toString());
        }
        if (pathItem.getDelete() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.DELETE.toString());
        }
        if (pathItem.getOptions() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.OPTIONS.toString());
        }
        if (pathItem.getHead() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.HEAD.toString());
        }
        if (pathItem.getPatch() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.PATCH.toString());
        }
        if (pathItem.getTrace() != null) {
            methods.add(V1HTTPRouteSpecMatches.MethodEnum.TRACE.toString());
        }
        
        route.setMethods(methods);
        // TODO: backend -> weight
        if (pathItem.getExtensions()!=null && pathItem.getExtensions().containsKey("x-backends")) {
            @SuppressWarnings("unchecked")
            Map<String, List<String>> backends = (Map<String, List<String>>) pathItem.getExtensions().get("x-backends");
            List<UpstreamService> services = new ArrayList<>();
            if (backends.get("name")!=null && backends.get("weight")!=null) {
                List<String> names = backends.get("name");
                List<String> weights = backends.get("weight");
                for (int i = 0; i < names.size(); i++) {
                    UpstreamService service = new UpstreamService();
                    service.setName(names.get(i));
                    if (i < weights.size()) {
                        service.setWeight(Integer.parseInt(weights.get(i)));
                    }
                    services.add(service);
                }
            }
            route.setServices(services);
        }

        if (pathItem.getExtensions()!=null && pathItem.getExtensions().containsKey("policy")) {
            @SuppressWarnings("unchecked")
            Map<String, List<String>> wasm = (Map<String, List<String>>) pathItem.getExtensions().get("policy");
            if (wasm.get("pluginName")!=null && wasm.get("enabled")!=null && wasm.get("rawConfigurations")!=null) {
                List<String> pluginNames = wasm.get("pluginName");
                List<String> enabled = wasm.get("enabled"); 
                List<String> rawConfigs = wasm.get("rawConfigurations");
                for (int i = 0; i < pluginNames.size(); i++) {
                    WasmPluginInstance instance = new WasmPluginInstance();
                    instance.setScope(WasmPluginInstanceScope.ROUTE);
                    instance.setPluginName(pluginNames.get(i));
                    if (i < enabled.size()) {
                        instance.setEnabled(Boolean.parseBoolean(enabled.get(i)));
                    }
                    if (i < rawConfigs.size()) {
                        instance.setRawConfigurations(rawConfigs.get(i));
                    }
                    instances.add(instance);
                }
            }
        }

    }

    private void addOrUpdateDomains(List<DomainInfo> domainInfos) {
        for (DomainInfo domainInfo : domainInfos) {
            domainService.addOrUpdate(domainInfo.domain);
            List<WasmPluginInstance> instances = domainInfo.instances;
            if (CollectionUtils.isNotEmpty(instances)) {
                for (WasmPluginInstance instance: instances) {
                    wasmPluginInstanceService.addOrUpdate(instance);
                }
            }
        }
    }

    private void addRoutes(List<RouteInfo> routeInfos, Map<String, OpenAPIPathDescription> paths, List<DomainInfo> domainInfos) {
        for (RouteInfo routeInfo : routeInfos){
            Route route = routeInfo.route;
            List<WasmPluginInstance> instances = routeInfo.instances;
            String path = route.getName();
            String matchType = route.getPath().getMatchType();
            String matchValue = route.getPath().getMatchValue();
            List<OpenAPIServer> servers = paths.get(path).getServers();
            if (CollectionUtils.isNotEmpty(servers)) {
                for (OpenAPIServer server : servers) {
                    String url = server.getUrl();
                    Map<String, OpenAPIServerVariable> variables = server.getVariables();
                    PathAndType pathAndType = extractPathPrefix(url, variables);
                    List<String> hosts = extractHosts(url, variables);
                    route.getPath().setMatchValue(pathAndType.pathPrefix+matchValue);
                    if (pathAndType.isExact) {
                        route.getPath().setMatchType(matchType);
                    } else {
                        route.getPath().setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
                    }
                    for (String host: hosts) {
                        route.setName(KubernetesUtil.normalizeRouteName(host+path));
                        route.setDomains(Collections.singletonList(host));
                        routeService.add(route);
                        if (CollectionUtils.isNotEmpty(instances)) {
                            for (WasmPluginInstance instance: instances) {
                                instance.setTarget(KubernetesUtil.normalizeRouteName(host+path));
                                wasmPluginInstanceService.addOrUpdate(instance);
                            }
                        }
                    }
                }
            } else {
                // DomainInfos
                for (DomainInfo domainInfo : domainInfos) {
                    route.setName(KubernetesUtil.normalizeRouteName(domainInfo.domain.getName()+path));
                    route.setDomains(Collections.singletonList(domainInfo.domain.getName()));
                    route.getPath().setMatchValue(domainInfo.pathAndType.pathPrefix+matchValue);
                    if (domainInfo.pathAndType.isExact) {
                        route.getPath().setMatchType(matchType);
                    } else {
                        route.getPath().setMatchType(RoutePredicateTypeEnum.REGULAR.toString());
                    }
                    routeService.add(route);
                    if (CollectionUtils.isNotEmpty(instances)) {
                        for (WasmPluginInstance instance: instances) {
                            instance.setTarget(KubernetesUtil.normalizeRouteName(domainInfo.domain.getName()+path));
                            wasmPluginInstanceService.addOrUpdate(instance);
                        }
                    }
                }
            }
        }
    }
}
