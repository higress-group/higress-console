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

import java.io.ByteArrayInputStream;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.security.auth.x500.X500Principal;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.asn1.x509.GeneralName;
import org.openapi4j.core.exception.EncodeException;
import org.openapi4j.core.util.TreeUtil;

import com.alibaba.fastjson.JSON;
import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.ServiceSource;
import com.alibaba.higress.console.controller.dto.TlsCertificate;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginInstance;
import com.alibaba.higress.console.controller.dto.WasmPluginInstanceScope;
import com.alibaba.higress.console.controller.dto.route.CorsConfig;
import com.alibaba.higress.console.controller.dto.route.Header;
import com.alibaba.higress.console.controller.dto.route.HeaderControlConfig;
import com.alibaba.higress.console.controller.dto.route.HeaderControlStageConfig;
import com.alibaba.higress.console.controller.dto.route.KeyedRoutePredicate;
import com.alibaba.higress.console.controller.dto.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.console.controller.dto.route.RewriteConfig;
import com.alibaba.higress.console.controller.dto.route.RoutePredicate;
import com.alibaba.higress.console.controller.dto.route.RoutePredicateTypeEnum;
import com.alibaba.higress.console.controller.dto.route.UpstreamService;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1RegistryConfig;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.console.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.alibaba.higress.console.util.TypeUtil;
import com.google.common.base.Splitter;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1HTTPIngressPath;
import io.kubernetes.client.openapi.models.V1HTTPIngressRuleValue;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressBackend;
import io.kubernetes.client.openapi.models.V1IngressRule;
import io.kubernetes.client.openapi.models.V1IngressSpec;
import io.kubernetes.client.openapi.models.V1IngressTLS;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.openapi.models.V1TypedLocalObjectReference;
import io.kubernetes.client.util.Strings;
import lombok.extern.slf4j.Slf4j;

/**
 * @author CH3CHO
 */
@Slf4j
@org.springframework.stereotype.Service
public class KubernetesModelConverter {

    private static final Splitter LINE_SPLITTER = Splitter.on('\n').trimResults().omitEmptyStrings();
    private static final Splitter FIELD_SPLITTER = Splitter.on(Pattern.compile(" +")).trimResults().omitEmptyStrings();
    private static final V1IngressBackend DEFAULT_MCP_BRIDGE_BACKEND = new V1IngressBackend();
    private static final Integer DEFAULT_WEIGHT = 100;

    private KubernetesClientService kubernetesClientService;

    static {
        V1TypedLocalObjectReference mcpBridgeReference = new V1TypedLocalObjectReference();
        mcpBridgeReference.setApiGroup(V1McpBridge.API_GROUP);
        mcpBridgeReference.setKind(V1McpBridge.KIND);
        mcpBridgeReference.setName(V1McpBridge.DEFAULT_NAME);
        DEFAULT_MCP_BRIDGE_BACKEND.setResource(mcpBridgeReference);
    }

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
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
            if (resource != null && (!V1McpBridge.API_GROUP.equals(resource.getApiGroup())
                || !V1McpBridge.KIND.equals(resource.getKind())
                || !V1McpBridge.DEFAULT_NAME.equals(resource.getName()))) {
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
        fillIngressCors(ingress, route);
        return ingress;
    }

    private static void fillRouteCors(Route route, V1ObjectMeta metadata) {
        if (metadata == null || metadata.getAnnotations() == null) {
            return;
        }
        CorsConfig config = new CorsConfig();
        String maxAge = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_MAX_AGE_KEY);
        String enableCors = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_ENABLED_KEY);
        String allowCredentials =
            metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_CREDENTIALS_KEY);
        String allowOrigin = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_ORIGIN_KEY);
        String allowMethods = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_METHODS_KEY);
        String allowHeaders = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_ALLOW_HEADERS_KEY);
        String exposeHeaders = metadata.getAnnotations().get(KubernetesConstants.Annotation.CORS_EXPOSE_HEADERS_KEY);

        config.setMaxAge(TypeUtil.string2Integer(maxAge));
        if (StringUtils.isNotEmpty(enableCors)) {
            config.setEnabled(Boolean.valueOf(enableCors));
        }
        if (StringUtils.isNotEmpty(allowCredentials)) {
            config.setAllowCredentials(Boolean.valueOf(allowCredentials));
        }
        if (StringUtils.isNotEmpty(allowOrigin)) {
            config.setAllowOrigins(Arrays.asList(allowOrigin.split(CommonKey.COMMA)));
        }
        if (StringUtils.isNotEmpty(allowMethods)) {
            config.setAllowMethods(Arrays.asList(allowMethods.split(CommonKey.COMMA)));
        }
        if (StringUtils.isNotEmpty(allowHeaders)) {
            config.setAllowHeaders(Arrays.asList(allowHeaders.split(CommonKey.COMMA)));
        }
        if (StringUtils.isNotEmpty(exposeHeaders)) {
            config.setExposeHeaders(Arrays.asList(exposeHeaders.split(CommonKey.COMMA)));
        }
        route.setCors(config);
    }

    public V1ConfigMap domain2ConfigMap(Domain domain) {
        V1ConfigMap domainConfigMap = new V1ConfigMap();

        V1ObjectMeta metadata = new V1ObjectMeta();
        domainConfigMap.metadata(metadata);
        metadata.setName(domainName2ConfigMapName(domain.getName()));
        metadata.setResourceVersion(domain.getVersion());

        Map<String, String> configMap = new HashMap<>();
        configMap.put(CommonKey.DOMAIN, domain.getName());
        configMap.put(KubernetesConstants.K8S_CERT, domain.getCertIdentifier());
        configMap.put(KubernetesConstants.K8S_ENABLE_HTTPS, domain.getEnableHttps());
        domainConfigMap.data(configMap);

        return domainConfigMap;
    }

    public Domain configMap2Domain(V1ConfigMap configMap) {
        Domain domain = new Domain();

        V1ObjectMeta metadata = configMap.getMetadata();
        if (metadata != null) {
            domain.setVersion(metadata.getResourceVersion());
        }

        Map<String, String> configMapData = configMap.getData();
        if (Objects.isNull(configMapData)) {
            throw new IllegalArgumentException("The ConfigMap data is illegal");
        }
        domain.setName(configMapData.get(CommonKey.DOMAIN));
        domain.setCertIdentifier(configMapData.get(KubernetesConstants.K8S_CERT));
        domain.setEnableHttps(configMapData.get(KubernetesConstants.K8S_ENABLE_HTTPS));
        return domain;
    }

    public String domainName2ConfigMapName(String domainName) {
        return CommonKey.DOMAIN_PREFIX + KubernetesUtil.normalizeDomainName(domainName);
    }

    public V1Secret tlsCertificate2Secret(TlsCertificate certificate) {
        V1Secret secret = new V1Secret();

        V1ObjectMeta metadata = new V1ObjectMeta();
        secret.setMetadata(metadata);
        metadata.setName(certificate.getName());
        metadata.setResourceVersion(certificate.getVersion());

        secret.setType(KubernetesConstants.SECRET_TYPE_TLS);

        Map<String, byte[]> data = new HashMap<>(2);
        data.put(KubernetesConstants.SECRET_TLS_CRT_FIELD, TypeUtil.string2Bytes(certificate.getCert()));
        data.put(KubernetesConstants.SECRET_TLS_KEY_FIELD, TypeUtil.string2Bytes(certificate.getKey()));
        secret.setData(data);

        if (StringUtils.isNotEmpty(certificate.getCert())) {
            List<String> domains = getCertBoundDomains(certificate.getCert());
            if (CollectionUtils.isNotEmpty(domains)) {
                domains.forEach(d -> setDomainLabel(metadata, d));
            }
        }

        return secret;
    }

    public TlsCertificate secret2TlsCertificate(V1Secret secret) {
        TlsCertificate certificate = new TlsCertificate();

        V1ObjectMeta metadata = secret.getMetadata();
        if (metadata != null) {
            certificate.setName(metadata.getName());
            certificate.setVersion(metadata.getResourceVersion());
        }

        Map<String, byte[]> data = secret.getData();
        if (MapUtils.isNotEmpty(data)) {
            certificate.setCert(TypeUtil.bytes2String(data.get(KubernetesConstants.SECRET_TLS_CRT_FIELD)));
            certificate.setKey(TypeUtil.bytes2String(data.get(KubernetesConstants.SECRET_TLS_KEY_FIELD)));
        }

        fillTlsCertificateDetails(certificate);
        return certificate;
    }

    public WasmPlugin wasmPluginFromCr(V1alpha1WasmPlugin cr) {
        WasmPlugin plugin = new WasmPlugin();

        V1ObjectMeta metadata = cr.getMetadata();
        if (metadata != null) {
            plugin.setVersion(metadata.getResourceVersion());

            String name = MapUtils.getString(metadata.getLabels(), KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY);
            plugin.setName(name);
            String version =
                MapUtils.getString(metadata.getLabels(), KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY);
            plugin.setImageVersion(version);
            String category =
                MapUtils.getString(metadata.getLabels(), KubernetesConstants.Label.WASM_PLUGIN_CATEGORY_KEY);
            plugin.setCategory(category);
            String builtIn =
                MapUtils.getString(metadata.getLabels(), KubernetesConstants.Label.WASM_PLUGIN_BUILT_IN_KEY);
            if (StringUtils.isNotEmpty(builtIn)) {
                plugin.setBuiltIn(Boolean.valueOf(builtIn));
            }

            String title =
                MapUtils.getString(metadata.getAnnotations(), KubernetesConstants.Annotation.WASM_PLUGIN_TITLE_KEY);
            plugin.setTitle(title);
            String description = MapUtils.getString(metadata.getAnnotations(),
                KubernetesConstants.Annotation.WASM_PLUGIN_DESCRIPTION_KEY);
            plugin.setDescription(description);
            String icon =
                MapUtils.getString(metadata.getAnnotations(), KubernetesConstants.Annotation.WASM_PLUGIN_ICON_KEY);
            plugin.setIcon(icon);
        }

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        if (spec != null) {
            plugin.setPhase(spec.getPhase());
            plugin.setPriority(spec.getPriority());
            String url = spec.getUrl();
            if (StringUtils.isNotEmpty(url)) {
                int colonIndex = url.lastIndexOf(CommonKey.COLON);
                if (colonIndex != -1) {
                    plugin.setImageRepository(url.substring(0, colonIndex));
                    plugin.setImageVersion(url.substring(colonIndex + 1));
                } else {
                    plugin.setImageRepository(url);
                }
            }
        }

        return plugin;
    }

    public V1alpha1WasmPlugin wasmPluginToCr(WasmPlugin plugin) {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();

        String name = plugin.getName(), version = plugin.getImageVersion();

        V1ObjectMeta metadata = new V1ObjectMeta();
        metadata.setName(name + CommonKey.DASH + version);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY, name);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY, version);
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_CATEGORY_KEY, plugin.getCategory());
        boolean builtIn = Boolean.TRUE.equals(plugin.getBuiltIn());
        KubernetesUtil.setLabel(metadata, KubernetesConstants.Label.WASM_PLUGIN_BUILT_IN_KEY, String.valueOf(builtIn));

        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.WASM_PLUGIN_TITLE_KEY, plugin.getTitle());
        if (StringUtils.isNotEmpty(plugin.getDescription())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.WASM_PLUGIN_DESCRIPTION_KEY,
                plugin.getDescription());
        }
        if (StringUtils.isNotEmpty(plugin.getIcon())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.WASM_PLUGIN_ICON_KEY,
                plugin.getIcon());
        }

        metadata.setResourceVersion(plugin.getVersion());
        cr.setMetadata(metadata);

        V1alpha1WasmPluginSpec spec = new V1alpha1WasmPluginSpec();
        spec.setPhase(plugin.getPhase());
        spec.setPriority(plugin.getPriority());
        spec.setUrl(buildImageUrl(plugin.getImageRepository(), plugin.getImageVersion()));
        cr.setSpec(spec);

        return cr;
    }

    public void mergeWasmPluginSpec(V1alpha1WasmPlugin srcPlugin, V1alpha1WasmPlugin dstPlugin) {
        V1alpha1WasmPluginSpec srcSpec = srcPlugin.getSpec();

        if (srcSpec == null) {
            return;
        }

        V1alpha1WasmPluginSpec dstSpec = dstPlugin.getSpec();

        if (dstSpec == null) {
            dstSpec = new V1alpha1WasmPluginSpec();
            dstPlugin.setSpec(dstSpec);
        }

        dstSpec.setDefaultConfig(srcSpec.getDefaultConfig());
        dstSpec.setDefaultConfigDisable(srcSpec.getDefaultConfigDisable());
        if (CollectionUtils.isNotEmpty(srcSpec.getMatchRules())) {
            if (dstSpec.getMatchRules() == null) {
                dstSpec.setMatchRules(new ArrayList<>());
            } else {
                dstSpec.getMatchRules().removeIf(r -> srcSpec.getMatchRules().stream().anyMatch(r::keyEquals));
            }
            dstSpec.getMatchRules().addAll(srcSpec.getMatchRules());
        }
        sortWasmPluginMatchRules(dstSpec.getMatchRules());
    }

    public WasmPluginInstance getWasmPluginInstanceFromCr(V1alpha1WasmPlugin plugin, WasmPluginInstanceScope scope,
        String target) {
        V1ObjectMeta metadata = plugin.getMetadata();
        if (metadata == null || MapUtils.isEmpty(metadata.getLabels())) {
            return null;
        }

        V1alpha1WasmPluginSpec spec = plugin.getSpec();
        if (spec == null) {
            return null;
        }

        String name = metadata.getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_NAME_KEY);
        String version = metadata.getLabels().get(KubernetesConstants.Label.WASM_PLUGIN_VERSION_KEY);
        if (StringUtils.isAnyBlank(name, version)) {
            return null;
        }

        Boolean enabled = null;
        Map<String, Object> configurations = null;
        switch (scope) {
            case GLOBAL:
                if (target == null) {
                    enabled = !Boolean.TRUE.equals(spec.getDefaultConfigDisable());
                    configurations = Optional.ofNullable(spec.getDefaultConfig()).orElse(Collections.emptyMap());
                }
                break;
            case DOMAIN:
                if (StringUtils.isNotEmpty(target) && CollectionUtils.isNotEmpty(spec.getMatchRules())) {
                    Optional<MatchRule> rule = spec.getMatchRules().stream()
                        .filter(r -> r.getDomain() != null && r.getDomain().contains(target)).findFirst();
                    if (rule.isPresent()) {
                        enabled = !Boolean.TRUE.equals(rule.get().getConfigDisable());
                        configurations = rule.get().getConfig();
                    }
                }
                break;
            case ROUTE:
                if (StringUtils.isNotEmpty(target) && CollectionUtils.isNotEmpty(spec.getMatchRules())) {
                    Optional<MatchRule> rule = spec.getMatchRules().stream()
                        .filter(r -> r.getIngress() != null && r.getIngress().contains(target)).findFirst();
                    if (rule.isPresent()) {
                        enabled = !Boolean.TRUE.equals(rule.get().getConfigDisable());
                        configurations = rule.get().getConfig();
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("Unsupported scope: " + scope);
        }
        if (MapUtils.isEmpty(configurations)) {
            return null;
        }

        String rawConfiguration;
        try {
            rawConfiguration = TreeUtil.toYaml(configurations);
        } catch (EncodeException e) {
            throw new BusinessException(
                "Error occurs when encoding configurations to YAML: " + JSON.toJSONString(configurations), e);
        }

        return WasmPluginInstance.builder().version(metadata.getResourceVersion()).pluginName(name)
            .pluginVersion(version).scope(scope).target(target).enabled(enabled).configurations(configurations)
            .rawConfigurations(rawConfiguration).build();
    }

    public void setWasmPluginInstanceToCr(V1alpha1WasmPlugin cr, WasmPluginInstance instance) {
        V1alpha1WasmPluginSpec spec = cr.getSpec();
        if (spec == null) {
            spec = new V1alpha1WasmPluginSpec();
            cr.setSpec(spec);
        }

        List<MatchRule> matchRules = spec.getMatchRules();
        if (matchRules == null) {
            matchRules = new ArrayList<>();
            spec.setMatchRules(matchRules);
        }

        boolean enabled = instance.getEnabled() == null || instance.getEnabled();
        Map<String, Object> configurations = instance.getConfigurations();
        WasmPluginInstanceScope scope = instance.getScope();
        switch (scope) {
            case GLOBAL:
                if (instance.getTarget() == null) {
                    spec.setDefaultConfigDisable(!enabled);
                    spec.setDefaultConfig(configurations);
                }
                break;
            case DOMAIN:
                String domain = instance.getTarget();
                MatchRule domainRule = matchRules.stream()
                    .filter(r -> r.getDomain() != null && r.getDomain().contains(domain)).findFirst().orElse(null);
                if (domainRule == null) {
                    domainRule = MatchRule.forDomain(domain);
                    matchRules.add(domainRule);
                    sortWasmPluginMatchRules(matchRules);
                }
                domainRule.setConfigDisable(!enabled);
                domainRule.setConfig(configurations);
                break;
            case ROUTE:
                String route = instance.getTarget();
                MatchRule routeRule = matchRules.stream()
                    .filter(r -> r.getIngress() != null && r.getIngress().contains(route)).findFirst().orElse(null);
                if (routeRule == null) {
                    routeRule = MatchRule.forIngress(route);
                    // Route rules shall come first to get a higher priority.
                    matchRules.add(0, routeRule);
                    sortWasmPluginMatchRules(matchRules);
                }
                routeRule.setConfigDisable(!enabled);
                routeRule.setConfig(configurations);
                break;
            default:
                throw new IllegalArgumentException("Unsupported scope: " + scope);
        }
    }

    public boolean removeWasmPluginInstanceFromCr(V1alpha1WasmPlugin cr, WasmPluginInstanceScope scope, String target) {
        V1alpha1WasmPluginSpec spec = cr.getSpec();
        if (spec == null) {
            return false;
        }

        boolean changed = false;
        switch (scope) {
            case GLOBAL:
                if (target == null) {
                    spec.setDefaultConfig(null);
                    changed = true;
                }
                break;
            case DOMAIN:
                if (StringUtils.isEmpty(target) || CollectionUtils.isEmpty(spec.getMatchRules())) {
                    break;
                }
                for (Iterator<MatchRule> it = spec.getMatchRules().listIterator(); it.hasNext();) {
                    MatchRule rule = it.next();
                    if (CollectionUtils.isEmpty(rule.getDomain())) {
                        continue;
                    }
                    if (!rule.getDomain().contains(target)) {
                        continue;
                    }
                    changed = true;
                    rule.getDomain().remove(target);
                    if (CollectionUtils.isEmpty(rule.getDomain()) && CollectionUtils.isEmpty(rule.getIngress())) {
                        it.remove();
                    }
                }
                break;
            case ROUTE:
                if (StringUtils.isEmpty(target) || CollectionUtils.isEmpty(spec.getMatchRules())) {
                    break;
                }
                for (Iterator<MatchRule> it = spec.getMatchRules().listIterator(); it.hasNext();) {
                    MatchRule rule = it.next();
                    if (CollectionUtils.isEmpty(rule.getIngress())) {
                        continue;
                    }
                    if (!rule.getIngress().contains(target)) {
                        continue;
                    }
                    changed = true;
                    rule.getIngress().remove(target);
                    if (CollectionUtils.isEmpty(rule.getDomain()) && CollectionUtils.isEmpty(rule.getIngress())) {
                        it.remove();
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("Unsupported scope: " + scope);
        }
        return changed;
    }

    private void sortWasmPluginMatchRules(List<MatchRule> matchRules) {
        if (CollectionUtils.isEmpty(matchRules)) {
            return;
        }
        matchRules.sort(KubernetesModelConverter::compareMatchRules);
    }

    private static int compareMatchRules(MatchRule r1, MatchRule r2) {
        boolean hasDomain1 = CollectionUtils.isNotEmpty(r1.getDomain());
        boolean hasDomain2 = CollectionUtils.isNotEmpty(r2.getDomain());
        boolean hasIngress1 = CollectionUtils.isNotEmpty(r1.getIngress());
        boolean hasIngress2 = CollectionUtils.isNotEmpty(r2.getIngress());

        boolean empty1 = !hasDomain1 && !hasIngress1;
        boolean empty2 = !hasDomain2 && !hasIngress2;
        if (empty1 && empty2) {
            return 0;
        }
        if (empty1 != empty2) {
            // One of them is empty. The non-empty one comes first.
            return empty1 ? 1 : -1;
        }

        // One contains some Ingresses, but the other one doesn't.
        // The one with Ingresses comes first since we need to match any Ingress rules before all the domain
        // rules.
        if (hasIngress1 != hasIngress2) {
            return hasIngress1 ? -1 : 1;
        }

        if (!hasIngress1) {
            // None of them contains Ingress, so both of them contain domains.
            return compareStringLists(r1.getDomain(), r2.getDomain());
        }

        // One contains some domains as well, but the other one doesn't.
        // The one without any domain comes first since we need to match any Ingress rules before all the
        // domain rules.
        if (hasDomain1 != hasDomain2) {
            return hasDomain1 ? 1 : -1;
        }

        int ret = compareStringLists(r1.getIngress(), r2.getIngress());
        if (ret != 0) {
            return 0;
        }
        return hasDomain1 ? compareStringLists(r1.getDomain(), r2.getDomain()) : 0;
    }

    private static int compareStringLists(List<String> l1, List<String> l2) {
        boolean empty1 = CollectionUtils.isEmpty(l1);
        boolean empty2 = CollectionUtils.isEmpty(l2);
        if (empty1 && empty2) {
            return 0;
        }
        if (empty1 != empty2) {
            // One of them is empty. The non-empty one comes first.
            return empty1 ? 1 : -1;
        }

        for (int i = 0, n = Math.max(l1.size(), l2.size()); i < n; ++i) {
            if (i >= l1.size()) {
                return -1;
            }
            if (i >= l2.size()) {
                return 1;
            }
            int ret = StringUtils.compare(l1.get(i), l2.get(i));
            if (ret != 0) {
                return ret;
            }
        }

        return 0;
    }

    private static void fillRouteMetadata(Route route, V1ObjectMeta metadata) {
        if (metadata != null) {
            route.setName(metadata.getName());
            route.setVersion(metadata.getResourceVersion());
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

        Map<String, String> annotations = metadata.getAnnotations();
        if (MapUtils.isNotEmpty(annotations)) {
            fillRewriteConfig(annotations, route);
            fillProxyNextUpstreamConfig(annotations, route);
            fillHeaderAndQueryConfig(annotations, route);
            fillMethodConfig(annotations, route);
            fillHeaderConfigConfig(annotations, route);

        }
        fillRouteCors(route, metadata);
    }

    private static void fillPathRoute(Route route, V1ObjectMeta metadata, V1HTTPIngressPath path) {
        fillPathPredicates(route, metadata, path);
        fillRouteDestinations(route, metadata, path.getBackend());
    }

    private void fillIngressCors(V1Ingress ingress, Route route) {
        CorsConfig cors = route.getCors();
        if (Objects.isNull(cors)) {
            return;
        }

        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        if (!Objects.isNull(cors.getEnabled())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ENABLED_KEY,
                cors.getEnabled().toString());
        }
        if (!Objects.isNull(cors.getMaxAge())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_MAX_AGE_KEY,
                cors.getMaxAge().toString());
        }
        if (!Objects.isNull(cors.getAllowCredentials())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_CREDENTIALS_KEY,
                cors.getAllowCredentials().toString());
        }
        if (CollectionUtils.isNotEmpty(cors.getAllowOrigins())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_ORIGIN_KEY,
                StringUtils.join(cors.getAllowOrigins(), CommonKey.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getAllowHeaders())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_HEADERS_KEY,
                StringUtils.join(cors.getAllowHeaders(), CommonKey.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getAllowMethods())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_METHODS_KEY,
                StringUtils.join(cors.getAllowMethods(), CommonKey.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getExposeHeaders())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_EXPOSE_HEADERS_KEY,
                StringUtils.join(cors.getExposeHeaders(), CommonKey.COMMA));
        }
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
                    useRegexValue = metadata.getAnnotations().get(KubernetesConstants.Annotation.USE_REGEX_KEY);
                }
                if (KubernetesConstants.Annotation.TRUE_VALUE.equals(useRegexValue)) {
                    matchType = RoutePredicateTypeEnum.REGULAR;
                } else {
                    matchType = RoutePredicateTypeEnum.PRE;
                }
                break;
            default:
                break;
        }
        pathPredicate.setMatchType(matchType != null ? matchType.toString() : null);

        if (metadata != null && metadata.getAnnotations() != null) {
            String ignorePathCase = metadata.getAnnotations().get(KubernetesConstants.Annotation.IGNORE_PATH_CASE_KEY);
            if (StringUtils.isNotEmpty(ignorePathCase)) {
                pathPredicate.setCaseSensitive(!Boolean.parseBoolean(ignorePathCase));
            }
        }
    }

    private static void fillRouteDestinations(Route route, V1ObjectMeta metadata, V1IngressBackend backend) {
        if (backend.getResource() == null) {
            return;
        }
        if (metadata.getAnnotations() == null) {
            return;
        }

        String rawDestination = metadata.getAnnotations().get(KubernetesConstants.Annotation.DESTINATION);
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

    private static void fillRewriteConfig(Map<String, String> annotations, Route route) {
        String rawEnabled = annotations.get(KubernetesConstants.Annotation.REWRITE_ENABLED_KEY);
        boolean enabled = StringUtils.isEmpty(rawEnabled) || Boolean.parseBoolean(rawEnabled);
        String pathRewrite =
            getFunctionalAnnotation(annotations, KubernetesConstants.Annotation.REWRITE_TARGET_KEY, enabled);
        String hostRewrite =
            getFunctionalAnnotation(annotations, KubernetesConstants.Annotation.UPSTREAM_VHOST_KEY, enabled);

        if (StringUtils.isAllBlank(rawEnabled, pathRewrite, hostRewrite)) {
            return;
        }

        RewriteConfig rewrite = new RewriteConfig();
        rewrite.setEnabled(enabled);
        rewrite.setPath(pathRewrite);
        rewrite.setHost(hostRewrite);
        route.setRewrite(rewrite);
    }

    private static void fillProxyNextUpstreamConfig(Map<String, String> annotations, Route route) {
        String rawEnabled = annotations.get(KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_ENABLED_KEY);
        boolean enabled = StringUtils.isEmpty(rawEnabled) || Boolean.parseBoolean(rawEnabled);
        String tries =
            getFunctionalAnnotation(annotations, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TRIES_KEY, enabled);
        String timeout = getFunctionalAnnotation(annotations,
            KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TIMEOUT_KEY, enabled);
        String conditions =
            getFunctionalAnnotation(annotations, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_KEY, enabled);

        if (StringUtils.isAllBlank(rawEnabled, tries, timeout, conditions)) {
            return;
        }

        ProxyNextUpstreamConfig proxyNextUpstream = new ProxyNextUpstreamConfig();
        proxyNextUpstream.setEnabled(enabled);
        proxyNextUpstream.setAttempts(TypeUtil.string2Integer(tries));
        proxyNextUpstream.setTimeout(TypeUtil.string2Integer(timeout));
        if (StringUtils.isNotEmpty(conditions)) {
            proxyNextUpstream.setConditions(conditions.split(CommonKey.COMMA));
        }
        route.setProxyNextUpstream(proxyNextUpstream);
    }

    private static HeaderControlStageConfig buildHeaderControlStageConfig(Map<String, String> annotations,
        String addKey, String setKey, String removeKey, boolean enabled) {
        String addConfig = getFunctionalAnnotation(annotations, addKey, enabled);
        String setConfig = getFunctionalAnnotation(annotations, setKey, enabled);
        String removeConfig = getFunctionalAnnotation(annotations, removeKey, enabled);

        if (StringUtils.isAllBlank(addConfig, setConfig, removeConfig)) {
            return null;
        }

        HeaderControlStageConfig config = new HeaderControlStageConfig();
        if (StringUtils.isNotEmpty(addConfig)) {
            config.setAdd(new ArrayList<>());
            for (String line : addConfig.split(CommonKey.NEW_LINE)) {
                int equalIndex = line.indexOf(CommonKey.EQUALS_SIGN);
                Header header = equalIndex != -1
                    ? new Header(line.substring(0, equalIndex), line.substring(equalIndex + 1)) : new Header(line, "");
                config.getAdd().add(header);
            }
        }
        if (StringUtils.isNotEmpty(setConfig)) {
            config.setSet(new ArrayList<>());
            for (String line : setConfig.split(CommonKey.NEW_LINE)) {
                int equalIndex = line.indexOf(CommonKey.EQUALS_SIGN);
                Header header = equalIndex != -1
                    ? new Header(line.substring(0, equalIndex), line.substring(equalIndex + 1)) : new Header(line, "");
                config.getSet().add(header);
            }
        }
        if (StringUtils.isNotEmpty(removeConfig)) {
            config.setRemove(Arrays.asList(removeConfig.split(CommonKey.COMMA)));
        }
        return config;
    }

    private static void fillHeaderAndQueryConfig(Map<String, String> annotations, Route route) {
        List<KeyedRoutePredicate> headers = new ArrayList<>();
        List<KeyedRoutePredicate> urlParams = new ArrayList<>();
        annotations.forEach((k, v) -> {
            if (!k.startsWith(KubernetesConstants.Annotation.KEY_PREFIX)) {
                return;
            }

            k = k.substring(KubernetesConstants.Annotation.KEY_PREFIX.length());

            KeyedRoutePredicate headerPredicate =
                buildKeyedRoutePredicate(k, v, KubernetesConstants.Annotation.HEADER_MATCH_KEYWORD);
            if (headerPredicate != null) {
                headers.add(headerPredicate);
                return;
            }
            KeyedRoutePredicate queryPredicate =
                buildKeyedRoutePredicate(k, v, KubernetesConstants.Annotation.QUERY_MATCH_KEYWORD);
            if (queryPredicate != null) {
                urlParams.add(queryPredicate);
                return;
            }
        });
        if (CollectionUtils.isNotEmpty(headers)) {
            route.setHeaders(headers);
        }
        if (CollectionUtils.isNotEmpty(urlParams)) {
            route.setUrlParams(urlParams);
        }
    }

    private static KeyedRoutePredicate buildKeyedRoutePredicate(String annotation, String value, String matchKeyword) {
        int keywordIndex = annotation.indexOf(matchKeyword);
        if (keywordIndex == -1) {
            return null;
        }
        String rawType = annotation.substring(0, keywordIndex);
        RoutePredicateTypeEnum type = RoutePredicateTypeEnum.fromAnnotationPrefix(rawType);
        String key = annotation.substring(keywordIndex + matchKeyword.length());
        KeyedRoutePredicate predicate = new KeyedRoutePredicate();
        predicate.setKey(key);
        predicate.setMatchType(type != null ? type.name() : null);
        predicate.setMatchValue(value);
        return predicate;
    }

    private static void fillMethodConfig(Map<String, String> annotations, Route route) {
        String methods = annotations.get(KubernetesConstants.Annotation.METHOD_KEY);
        if (StringUtils.isNotBlank(methods)) {
            route.setMethods(Arrays.asList(methods.split(CommonKey.SPACE)));
        }
    }

    private static void fillHeaderConfigConfig(Map<String, String> annotations, Route route) {
        String rawEnabled = annotations.get(KubernetesConstants.Annotation.HEADER_CONTROL_ENABLED_KEY);
        boolean enabled = rawEnabled == null || Boolean.parseBoolean(rawEnabled);

        HeaderControlStageConfig requestConfig =
            buildHeaderControlStageConfig(annotations, KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_SET_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_REMOVE_KEY, enabled);
        HeaderControlStageConfig responseConfig =
            buildHeaderControlStageConfig(annotations, KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_SET_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_REMOVE_KEY, enabled);

        if (requestConfig == null && responseConfig == null) {
            return;
        }

        HeaderControlConfig headerControlConfig = new HeaderControlConfig();
        headerControlConfig.setEnabled(enabled);
        headerControlConfig.setRequest(requestConfig);
        headerControlConfig.setResponse(responseConfig);
        route.setHeaderControl(headerControlConfig);
    }

    private void fillIngressMetadata(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        metadata.setName(route.getName());
        metadata.setResourceVersion(route.getVersion());

        if (CollectionUtils.isNotEmpty(route.getDomains())) {
            for (String domain : route.getDomains()) {
                setDomainLabel(metadata, domain);
            }
        }

        if (CollectionUtils.isNotEmpty(route.getUrlParams())) {
            for (KeyedRoutePredicate query : route.getUrlParams()) {
                setQueryAnnotation(metadata, query);
            }
        }

        if (CollectionUtils.isNotEmpty(route.getHeaders())) {
            for (KeyedRoutePredicate header : route.getHeaders()) {
                setHeaderAnnotation(metadata, header);
            }
        }

        if (CollectionUtils.isNotEmpty(route.getMethods())) {
            setMethodAnnotation(metadata, route.getMethods());
        }

        fillIngressRewriteConfig(metadata, route.getRewrite());
        fillIngressProxyNextUpstreamConfig(metadata, route.getProxyNextUpstream());
        if (route.getHeaderControl() != null) {
            boolean enabled = !Boolean.FALSE.equals(route.getHeaderControl().getEnabled());
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.HEADER_CONTROL_ENABLED_KEY,
                Boolean.toString(enabled));
            fillIngressHeaderControlStageConfig(metadata, route.getHeaderControl().getRequest(),
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_SET_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_REMOVE_KEY, enabled);
            fillIngressHeaderControlStageConfig(metadata, route.getHeaderControl().getResponse(),
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_SET_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_REMOVE_KEY, enabled);
        }
    }

    private void fillIngressRewriteConfig(V1ObjectMeta metadata, RewriteConfig rewrite) {
        if (rewrite == null) {
            return;
        }
        boolean enabled = !Boolean.FALSE.equals(rewrite.getEnabled());
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.REWRITE_ENABLED_KEY,
            Boolean.toString(enabled));
        if (StringUtils.isNotEmpty(rewrite.getPath())) {
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.REWRITE_TARGET_KEY, rewrite.getPath(),
                enabled);
        }
        if (StringUtils.isNotEmpty(rewrite.getHost())) {
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.UPSTREAM_VHOST_KEY, rewrite.getHost(),
                enabled);
        }
    }

    private void fillIngressProxyNextUpstreamConfig(V1ObjectMeta metadata, ProxyNextUpstreamConfig config) {
        if (config == null) {
            return;
        }
        boolean enabled = !Boolean.FALSE.equals(config.getEnabled());
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_ENABLED_KEY,
            Boolean.toString(enabled));
        if (config.getAttempts() != null) {
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TRIES_KEY,
                String.valueOf(config.getAttempts()), enabled);
        }
        if (config.getTimeout() != null) {
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_TIMEOUT_KEY,
                String.valueOf(config.getTimeout()), enabled);
        }
        if (config.getConditions() != null && config.getConditions().length != 0) {
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.PROXY_NEXT_UPSTREAM_KEY,
                StringUtils.join(config.getConditions(), CommonKey.COMMA), enabled);
        }
    }

    private void fillIngressHeaderControlStageConfig(V1ObjectMeta metadata, HeaderControlStageConfig config,
        String addKey, String setKey, String removeKey, boolean enabled) {
        if (config == null) {
            return;
        }
        if (CollectionUtils.isNotEmpty(config.getAdd())) {
            setFunctionalAnnotation(metadata, addKey,
                StringUtils.join(config.getAdd().stream().map(this::getHeaderConfig).toList(), CommonKey.NEW_LINE),
                enabled);
        }
        if (CollectionUtils.isNotEmpty(config.getSet())) {
            setFunctionalAnnotation(metadata, setKey,
                StringUtils.join(config.getSet().stream().map(this::getHeaderConfig).toList(), CommonKey.NEW_LINE),
                enabled);
        }
        if (CollectionUtils.isNotEmpty(config.getRemove())) {
            setFunctionalAnnotation(metadata, removeKey, StringUtils.join(config.getRemove(), CommonKey.COMMA),
                enabled);
        }
    }

    private String getHeaderConfig(Header header) {
        return header.getKey() + CommonKey.EQUALS_SIGN + header.getValue();
    }

    private void fillIngressSpec(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        V1IngressSpec spec = Objects.requireNonNull(ingress.getSpec());
        fillIngressTls(metadata, spec, route);
        fillIngressRules(metadata, spec, route);
        fillIngressDestination(metadata, route);
    }

    private void fillIngressTls(V1ObjectMeta metadata, V1IngressSpec spec, Route route) {
        if (CollectionUtils.isEmpty(route.getDomains())) {
            return;
        }

        if (route.getDomains().size() > 1) {
            throw new IllegalArgumentException("Only one domain is allowed.");
        }

        List<V1IngressTLS> tlses = null;
        for (String domainName : route.getDomains()) {
            if (Strings.isNullOrEmpty(domainName)) {
                continue;
            }

            V1ConfigMap configMap;
            try {
                configMap = kubernetesClientService.readConfigMap(domainName2ConfigMapName(domainName));
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when reading config map associated with domain " + domainName,
                    e);
            }

            Domain domain = configMap2Domain(configMap);

            if (Domain.EnableHttps.OFF.equals(domain.getEnableHttps())) {
                continue;
            }

            if (StringUtils.isEmpty(domain.getCertIdentifier())) {
                continue;
            }

            V1IngressTLS tls = new V1IngressTLS();
            tls.setHosts(Collections.singletonList(domain.getName()));
            tls.setSecretName(domain.getCertIdentifier());
            if (tlses == null) {
                tlses = new ArrayList<>();
                spec.setTls(tlses);
            }
            tlses.add(tls);

            if (Domain.EnableHttps.FORCE.equals(domain.getEnableHttps())) {
                KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.SSL_REDIRECT_KEY,
                    KubernetesConstants.Annotation.TRUE_VALUE);
            }
        }
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
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.USE_REGEX_KEY,
                KubernetesConstants.Annotation.TRUE_VALUE);
        } else {
            throw new IllegalArgumentException("Unsupported path match type: " + matchType);
        }

        if (null != pathPredicate.getCaseSensitive()) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.IGNORE_PATH_CASE_KEY,
                String.valueOf(!pathPredicate.getCaseSensitive()));
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
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION, valueBuilder.toString());
        }
    }

    public ServiceSource v1RegistryConfig2ServiceSource(V1RegistryConfig v1RegistryConfig) {
        ServiceSource serviceSource = new ServiceSource();
        fillServiceSourceInfo(serviceSource, v1RegistryConfig);
        return serviceSource;
    }

    public void initV1McpBridge(V1McpBridge v1McpBridge) {
        v1McpBridge.setMetadata(new V1ObjectMeta());
        v1McpBridge.getMetadata().setName(V1McpBridge.DEFAULT_NAME);
        List<V1RegistryConfig> registries = new ArrayList<>();
        v1McpBridge.setSpec(new V1McpBridgeSpec());
        v1McpBridge.getSpec().setRegistries(registries);
    }

    public void addV1McpBridgeRegistry(V1McpBridge v1McpBridge, ServiceSource serviceSource) {
        V1McpBridgeSpec spec = v1McpBridge.getSpec();
        if (spec == null) {
            spec = new V1McpBridgeSpec();
            v1McpBridge.setSpec(spec);
        }
        List<V1RegistryConfig> registries = spec.getRegistries();
        if (registries == null) {
            registries = new ArrayList<>();
            spec.setRegistries(registries);
        }
        Optional<V1RegistryConfig> op = registries.stream()
            .filter(r -> StringUtils.isNotBlank(r.getName()) && r.getName().equals(serviceSource.getName()))
            .findFirst();
        if (op.isPresent()) {
            fillV1RegistryConfig(op.get(), serviceSource);
        } else {
            registries.add(serviceSource2V1RegistryConfig(serviceSource));
        }
    }

    public void removeV1McpBridgeRegistry(V1McpBridge v1McpBridge, String name) {
        List<V1RegistryConfig> registries = v1McpBridge.getSpec().getRegistries().stream()
            .filter(r -> !r.getName().equals(name)).collect(Collectors.toList());
        v1McpBridge.getSpec().setRegistries(registries);
    }

    private void fillServiceSourceInfo(ServiceSource serviceSource, V1RegistryConfig v1RegistryConfig) {
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
        fillV1RegistryConfig(v1RegistryConfig, serviceSource);
        return v1RegistryConfig;
    }

    @SuppressWarnings("unchecked")
    private static void fillV1RegistryConfig(V1RegistryConfig v1RegistryConfig, ServiceSource serviceSource) {
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
            v1RegistryConfig.setNacosGroups((List<String>)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS))
                .orElse(new ArrayList<>()));
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setZkServicesPath((List<String>)Optional
                .ofNullable(serviceSource.getProperties().get(V1McpBridge.REGISTRY_TYPE_ZK_ZKSERVICESPATH))
                .orElse(new ArrayList<>()));
        }
    }

    private static void fillTlsCertificateDetails(TlsCertificate tlsCertificate) {
        String certData = tlsCertificate.getCert();
        if (StringUtils.isEmpty(certData)) {
            return;
        }

        X509Certificate certificate = parseCertificateData(certData);
        if (certificate == null) {
            return;
        }
        tlsCertificate.setDomains(getCertBoundDomains(certificate));
        tlsCertificate.setValidityStart(TypeUtil.date2LocalDateTime(certificate.getNotBefore()));
        tlsCertificate.setValidityEnd(TypeUtil.date2LocalDateTime(certificate.getNotAfter()));
    }

    private static X509Certificate parseCertificateData(String certData) {
        try {
            CertificateFactory cf = CertificateFactory.getInstance("X509");
            return (X509Certificate)cf.generateCertificate(new ByteArrayInputStream(certData.getBytes()));
        } catch (Exception ex) {
            log.error("Failed to parse certificate data:\n" + certData, ex);
            return null;
        }
    }

    private static List<String> getCertBoundDomains(String certData) {
        X509Certificate certificate = parseCertificateData(certData);
        return certificate != null ? getCertBoundDomains(certificate) : Collections.emptyList();
    }

    private static List<String> getCertBoundDomains(X509Certificate certificate) {
        List<String> domains = new ArrayList<>();

        String subjectDomain = getPrincipleValue(certificate.getSubjectX500Principal(), "CN");
        if (StringUtils.isNotEmpty(subjectDomain)) {
            domains.add(subjectDomain);
        }

        Collection<List<?>> subjectAlternativeNames = null;
        try {
            subjectAlternativeNames = certificate.getSubjectAlternativeNames();
        } catch (CertificateParsingException e) {
            log.error("Failed to parse SubjectAlternativeNames of a certificate.", e);
        }
        if (CollectionUtils.isNotEmpty(subjectAlternativeNames)) {
            for (List<?> nameEntry : subjectAlternativeNames) {
                if (nameEntry == null || nameEntry.isEmpty() || nameEntry.size() < 2) {
                    continue;
                }
                Object type = nameEntry.get(0);
                if (!(type instanceof Integer && type.equals(GeneralName.dNSName))) {
                    continue;
                }
                Object name = nameEntry.get(1);
                if (name instanceof String) {
                    domains.add((String)name);
                }
            }
        }

        return domains;
    }

    private static String getPrincipleValue(X500Principal principal, String type) {
        if (principal == null || StringUtils.isEmpty(principal.getName())) {
            return null;
        }

        try {
            LdapName name = new LdapName(principal.getName());
            return name.getRdns().stream().filter(dn -> type.equals(dn.getType()) && dn.getValue() != null)
                .map(dn -> dn.getValue().toString()).findFirst().orElse(null);
        } catch (InvalidNameException e) {
            log.error("Error occurs when parsing subject: " + principal.getName(), e);
            return null;
        }
    }

    private void setDomainLabel(V1ObjectMeta metadata, String domainName) {
        String labelName = KubernetesConstants.Label.DOMAIN_KEY_PREFIX + KubernetesUtil.normalizeDomainName(domainName);
        KubernetesUtil.setLabel(metadata, labelName, KubernetesConstants.Label.DOMAIN_VALUE_DUMMY);
    }

    private static String buildImageUrl(String imageRepository, String imageVersion) {
        if (StringUtils.isBlank(imageRepository)) {
            return null;
        }

        StringBuilder builder = new StringBuilder();
        if (!imageRepository.contains(CommonKey.PROTOCOL_KEYWORD)) {
            builder.append(CommonKey.OCI_PROTOCOL);
        }
        builder.append(imageRepository);

        if (StringUtils.isNotBlank(imageVersion)) {
            builder.append(CommonKey.COLON).append(imageVersion);
        }
        return builder.toString();
    }

    private void setQueryAnnotation(V1ObjectMeta metadata, KeyedRoutePredicate keyedRoutePredicate) {
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.valueOf(keyedRoutePredicate.getMatchType());
        String annotationName = String.format(KubernetesConstants.Annotation.QUERY_MATCH_KEY_FORMAT,
            predicateType.getAnnotationPrefix(), keyedRoutePredicate.getKey());
        KubernetesUtil.setAnnotation(metadata, annotationName, keyedRoutePredicate.getMatchValue());
    }

    private void setHeaderAnnotation(V1ObjectMeta metadata, KeyedRoutePredicate keyedRoutePredicate) {
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.valueOf(keyedRoutePredicate.getMatchType());
        String annotationName = String.format(KubernetesConstants.Annotation.HEADER_MATCH_KEY_FORMAT,
            predicateType.getAnnotationPrefix(), keyedRoutePredicate.getKey());
        KubernetesUtil.setAnnotation(metadata, annotationName, keyedRoutePredicate.getMatchValue());
    }

    private void setMethodAnnotation(V1ObjectMeta metadata, List<String> methods) {
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.METHOD_KEY,
            StringUtils.join(methods, CommonKey.SPACE));
    }

    private static String getFunctionalAnnotation(Map<String, String> annotations, String key,
        boolean functionEnabled) {
        String actualKey = functionEnabled ? key : key + CommonKey.DISABLED_KEY_SUFFIX;
        return annotations.get(actualKey);
    }

    private static void setFunctionalAnnotation(V1ObjectMeta metadata, String key, String value,
        boolean functionEnabled) {
        String actualKey = functionEnabled ? key : key + CommonKey.DISABLED_KEY_SUFFIX;
        KubernetesUtil.setAnnotation(metadata, actualKey, value);
    }
}
