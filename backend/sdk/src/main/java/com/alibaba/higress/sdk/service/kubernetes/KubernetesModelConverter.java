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

import java.io.ByteArrayInputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.security.cert.CertificateFactory;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.security.auth.x500.X500Principal;

import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.ImagePullPolicy;
import com.google.common.collect.Lists;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.asn1.x509.GeneralName;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.TlsCertificate;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.route.CorsConfig;
import com.alibaba.higress.sdk.model.route.Header;
import com.alibaba.higress.sdk.model.route.HeaderControlConfig;
import com.alibaba.higress.sdk.model.route.HeaderControlStageConfig;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1RegistryConfig;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.FailStrategy;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.alibaba.higress.sdk.util.MapUtil;
import com.alibaba.higress.sdk.util.TypeUtil;
import com.google.common.base.Splitter;
import com.google.gson.Gson;

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
public class KubernetesModelConverter {

    private static final String PSEUDO_HEADER_PREFIX = ":";
    private static final Splitter LINE_SPLITTER = Splitter.on('\n').trimResults().omitEmptyStrings();
    private static final Splitter FIELD_SPLITTER = Splitter.on(Pattern.compile(" +")).trimResults().omitEmptyStrings();
    private static final V1IngressBackend DEFAULT_MCP_BRIDGE_BACKEND = new V1IngressBackend();
    private static final Set<String> SUPPORTED_ANNOTATIONS;
    private static final Integer DEFAULT_WEIGHT = 100;

    private static final Gson GSON = new Gson();

    private final KubernetesClientService kubernetesClientService;

    static {
        V1TypedLocalObjectReference mcpBridgeReference = new V1TypedLocalObjectReference();
        mcpBridgeReference.setApiGroup(V1McpBridge.API_GROUP);
        mcpBridgeReference.setKind(V1McpBridge.KIND);
        mcpBridgeReference.setName(V1McpBridge.DEFAULT_NAME);
        DEFAULT_MCP_BRIDGE_BACKEND.setResource(mcpBridgeReference);

        Set<String> supportedAnnotations = new HashSet<>();
        for (Field field : KubernetesConstants.Annotation.class.getFields()) {
            if ((field.getModifiers() & (Modifier.PUBLIC | Modifier.STATIC | Modifier.FINAL)) == 0) {
                continue;
            }
            if (field.getType() != String.class) {
                continue;
            }
            if (!field.getName().endsWith("_KEY")) {
                continue;
            }
            try {
                supportedAnnotations.add((String)field.get(null));
            } catch (IllegalAccessException e) {
                log.error("Failed to get annotation key from field: {}", field.getName(), e);
            }
        }
        SUPPORTED_ANNOTATIONS = Collections.unmodifiableSet(supportedAnnotations);
    }

    public KubernetesModelConverter(KubernetesClientService kubernetesClientService) {
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
        fillCustomConfigs(route, ingress.getMetadata());
        route.setReadonly(!kubernetesClientService.isDefinedByConsole(ingress) || !isIngressSupported(ingress));
        return route;
    }

    public V1Ingress route2Ingress(Route route) {
        V1Ingress ingress = new V1Ingress();
        ingress.setMetadata(new V1ObjectMeta());
        ingress.setSpec(new V1IngressSpec());
        fillIngressMetadata(ingress, route);
        fillIngressSpec(ingress, route);
        fillIngressCors(ingress, route);
        fillIngressAnnotations(ingress, route);
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
            config.setAllowOrigins(Arrays.asList(allowOrigin.split(Separators.COMMA)));
        }
        if (StringUtils.isNotEmpty(allowMethods)) {
            config.setAllowMethods(Arrays.asList(allowMethods.split(Separators.COMMA)));
        }
        if (StringUtils.isNotEmpty(allowHeaders)) {
            config.setAllowHeaders(Arrays.asList(allowHeaders.split(Separators.COMMA)));
        }
        if (StringUtils.isNotEmpty(exposeHeaders)) {
            config.setExposeHeaders(Arrays.asList(exposeHeaders.split(Separators.COMMA)));
        }
        route.setCors(config);
    }

    public V1ConfigMap domain2ConfigMap(Domain domain) {
        V1ConfigMap domainConfigMap = new V1ConfigMap();

        V1ObjectMeta metadata = new V1ObjectMeta();
        domainConfigMap.metadata(metadata);
        metadata.setName(domainName2ConfigMapName(domain.getName()));
        metadata.setResourceVersion(domain.getVersion());
        metadata.setLabels(MapUtil.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY,
            KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_DOMAIN));

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
            throw new IllegalArgumentException("No data is found in the ConfigMap.");
        }
        domain.setName(configMapData.get(CommonKey.DOMAIN));
        domain.setCertIdentifier(configMapData.get(KubernetesConstants.K8S_CERT));
        domain.setEnableHttps(configMapData.get(KubernetesConstants.K8S_ENABLE_HTTPS));
        return domain;
    }

    public String domainName2ConfigMapName(String domainName) {
        return CommonKey.DOMAIN_PREFIX + KubernetesUtil.normalizeDomainName(domainName);
    }

    public V1ConfigMap aiRoute2ConfigMap(AiRoute route) {
        V1ConfigMap domainConfigMap = new V1ConfigMap();

        V1ObjectMeta metadata = new V1ObjectMeta();
        domainConfigMap.metadata(metadata);
        metadata.setName(aiRouteName2ConfigMapName(route.getName()));
        metadata.setResourceVersion(route.getVersion());
        metadata.setLabels(MapUtil.of(KubernetesConstants.Label.CONFIG_MAP_TYPE_KEY,
            KubernetesConstants.Label.CONFIG_MAP_TYPE_VALUE_AI_ROUTE));

        domainConfigMap.data(MapUtil.of(KubernetesConstants.DATA_FIELD, GSON.toJson(route)));

        return domainConfigMap;
    }

    public AiRoute configMap2AiRoute(V1ConfigMap configMap) {
        Map<String, String> configMapData = configMap.getData();
        if (Objects.isNull(configMapData)) {
            throw new IllegalArgumentException("No data is found in the ConfigMap");
        }

        String jsonData = configMapData.get(KubernetesConstants.DATA_FIELD);
        if (StringUtils.isEmpty(jsonData)) {
            throw new IllegalArgumentException(
                "No \"" + KubernetesConstants.DATA_FIELD + "\" field is found in the ConfigMap");
        }

        AiRoute route = GSON.fromJson(jsonData, AiRoute.class);

        V1ObjectMeta metadata = configMap.getMetadata();
        if (metadata != null) {
            route.setVersion(metadata.getResourceVersion());
        }

        return route;
    }

    public String aiRouteName2ConfigMapName(String routeName) {
        return CommonKey.AI_ROUTE_PREFIX + routeName;
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
            plugin.setPluginVersion(version);
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
            PluginPhase phase = PluginPhase.fromName(spec.getPhase());
            plugin.setPhase(ObjectUtils.firstNonNull(phase, PluginPhase.UNSPECIFIED).getName());
            plugin.setPriority(spec.getPriority());
            ImagePullPolicy imagePullPolicy = ImagePullPolicy.fromName(spec.getImagePullPolicy());
            plugin.setImagePullPolicy(ObjectUtils.firstNonNull(imagePullPolicy, ImagePullPolicy.UNSPECIFIED).getName());
            plugin.setImagePullSecret(spec.getImagePullSecret());
            String url = spec.getUrl();
            if (StringUtils.isNotEmpty(url)) {
                ImageUrl imageUrl = ImageUrl.parse(url);
                plugin.setImageRepository(imageUrl.getRepository());
                plugin.setImageVersion(imageUrl.getTag());
            }
        }

        return plugin;
    }

    public V1alpha1WasmPlugin wasmPluginToCr(WasmPlugin plugin) {
        return wasmPluginToCr(plugin, false);
    }

    public V1alpha1WasmPlugin wasmPluginToCr(WasmPlugin plugin, Boolean internal) {
        V1alpha1WasmPlugin cr = new V1alpha1WasmPlugin();

        String name = plugin.getName(), version = plugin.getPluginVersion();

        V1ObjectMeta metadata = new V1ObjectMeta();
        if (Boolean.TRUE.equals(internal)) {
            metadata.setName(name + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX);
        } else {
            metadata.setName(name + Separators.DASH + version);
        }
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
        PluginPhase phase = PluginPhase.fromName(plugin.getPhase());
        spec.setPhase(ObjectUtils.firstNonNull(phase, PluginPhase.UNSPECIFIED).getName());
        spec.setPriority(plugin.getPriority());
        spec.setUrl(buildImageUrl(plugin.getImageRepository(), plugin.getImageVersion()));
        ImagePullPolicy imagePullPolicy = ImagePullPolicy.fromName(plugin.getImagePullPolicy());
        spec.setImagePullPolicy(ObjectUtils.firstNonNull(imagePullPolicy, ImagePullPolicy.UNSPECIFIED).getName());
        spec.setImagePullSecret(plugin.getImagePullSecret());
        setDefaultValues(spec);
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
        setDefaultValues(dstSpec);
    }

    public List<WasmPluginInstance> getWasmPluginInstancesFromCr(V1alpha1WasmPlugin plugin) {
        V1ObjectMeta metadata = plugin.getMetadata();
        if (metadata == null || MapUtils.isEmpty(metadata.getLabels())) {
            return Collections.emptyList();
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

        List<WasmPluginInstance> instances = new ArrayList<>();
        if (ObjectUtils.anyNotNull(spec.getDefaultConfigDisable(), spec.getDefaultConfig())) {
            WasmPluginInstance instance =
                WasmPluginInstance.builder().targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null))
                    .enabled(Boolean.FALSE.equals(spec.getDefaultConfigDisable()))
                    .configurations(spec.getDefaultConfig()).build();
            instances.add(instance);
        }
        if (CollectionUtils.isNotEmpty(spec.getMatchRules())) {
            List<MatchRule> matchRules = new ArrayList<>(spec.getMatchRules());
            // Sort here so we can always get the correct order of instances.
            sortWasmPluginMatchRules(matchRules);
            for (MatchRule rule : spec.getMatchRules()) {
                boolean enabled = Boolean.FALSE.equals(rule.getConfigDisable());
                List<Map<WasmPluginInstanceScope, String>> targetsList = new ArrayList<>();
                for (WasmPluginInstanceScope scope : WasmPluginInstanceScope.NON_GLOBAL_SCOPES) {
                    List<String> targets = getTargetsByScope(rule, scope);
                    if (CollectionUtils.isEmpty(targets)) {
                        continue;
                    }
                    if (targetsList.isEmpty()) {
                        for (String target : targets) {
                            targetsList.add(MapUtil.of(scope, target));
                        }
                    } else {
                        List<Map<WasmPluginInstanceScope, String>> newTargetsList = new ArrayList<>();
                        for (Map<WasmPluginInstanceScope, String> existedTargets : targetsList) {
                            for (String target : targets) {
                                Map<WasmPluginInstanceScope, String> newTargets = new HashMap<>(existedTargets);
                                newTargets.put(scope, target);
                                newTargetsList.add(newTargets);
                            }
                        }
                        targetsList = newTargetsList;
                    }
                }
                for (Map<WasmPluginInstanceScope, String> targets : targetsList) {
                    WasmPluginInstance instance = WasmPluginInstance.builder().targets(targets).enabled(enabled)
                        .configurations(rule.getConfig()).build();
                    instances.add(instance);
                }
            }
        }
        instances.removeIf(i -> MapUtils.isEmpty(i.getConfigurations()));
        instances.forEach(i -> {
            i.setPluginName(name);
            i.setPluginVersion(version);
            i.setVersion(metadata.getResourceVersion());
            normalizePluginInstanceConfigurations(i.getConfigurations());
            i.setRawConfigurations(generateRawConfigurations(i.getConfigurations()));
            i.setInternal(KubernetesUtil.isInternalResource(plugin));
            i.syncDeprecatedFields();
        });
        return instances;
    }

    public WasmPluginInstance getWasmPluginInstanceFromCr(V1alpha1WasmPlugin plugin, WasmPluginInstanceScope scope,
        String target) {
        return getWasmPluginInstanceFromCr(plugin, MapUtil.of(scope, target));
    }

    public WasmPluginInstance getWasmPluginInstanceFromCr(V1alpha1WasmPlugin plugin,
        Map<WasmPluginInstanceScope, String> targets) {
        if (MapUtils.isEmpty(targets)) {
            return null;
        }

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
        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            if (targets.size() != 1) {
                // We don't support query instances by global and another instance scope.
                return null;
            }
            if (targets.get(WasmPluginInstanceScope.GLOBAL) != null) {
                return null;
            }
            enabled = !Boolean.TRUE.equals(spec.getDefaultConfigDisable());
            configurations = Optional.ofNullable(spec.getDefaultConfig()).orElseGet(HashMap::new);
        } else if (CollectionUtils.isNotEmpty(spec.getMatchRules())) {
            for (MatchRule rule : spec.getMatchRules()) {
                boolean matched = true;
                for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                    WasmPluginInstanceScope scope = entry.getKey();
                    String target = entry.getValue();
                    if (StringUtils.isEmpty(target)) {
                        continue;
                    }
                    List<String> targetsInMatchRule = getTargetsByScope(rule, scope);
                    if (targetsInMatchRule == null || targetsInMatchRule.size() != 1
                        || !target.equals(targetsInMatchRule.get(0))) {
                        matched = false;
                        break;
                    }
                }
                if (matched) {
                    enabled = !Boolean.TRUE.equals(rule.getConfigDisable());
                    configurations = rule.getConfig();
                    break;
                }
            }
        }

        if (enabled == null) {
            // No enabled is set, which means not configured.
            return null;
        }
        if (!enabled && MapUtils.isEmpty(configurations)) {
            // Disabled and no configuration set. We just take it as not configured.
            return null;
        }

        normalizePluginInstanceConfigurations(configurations);
        String rawConfiguration = generateRawConfigurations(configurations);
        WasmPluginInstance instance =
            WasmPluginInstance.builder().version(metadata.getResourceVersion()).pluginName(name).pluginVersion(version)
                .targets(new HashMap<>(targets)).enabled(enabled).configurations(configurations)
                .rawConfigurations(rawConfiguration).internal(KubernetesUtil.isInternalResource(plugin)).build();
        instance.syncDeprecatedFields();
        return instance;
    }

    private List<String> getTargetsByScope(MatchRule rule, WasmPluginInstanceScope scope) {
        switch (scope) {
            case GLOBAL:
                return null;
            case DOMAIN:
                return rule.getDomain();
            case ROUTE:
                return rule.getIngress();
            case SERVICE:
                return rule.getService();
            default:
                throw new IllegalArgumentException("Unsupported scope: " + scope);
        }
    }


    @SuppressWarnings("PMD.SwitchStatementRule")
    private void setTargetByScope(MatchRule rule, WasmPluginInstanceScope scope, String target) {
        switch (scope) {
            case GLOBAL:
                break;
            case DOMAIN:
                rule.setDomain(Lists.newArrayList(target));
                break;
            case ROUTE:
                rule.setIngress(Lists.newArrayList(target));
                break;
            case SERVICE:
                rule.setService(Lists.newArrayList(target));
                break;
            default:
                throw new IllegalArgumentException("Unsupported scope: " + scope);
        }
    }

    @SuppressWarnings("unchecked")
    private void normalizePluginInstanceConfigurations(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return;
        }
        for (Map.Entry<String, Object> entry : configurations.entrySet()) {
            Object value = entry.getValue();
            if (value == null) {
                continue;
            }
            if (value instanceof Map) {
                normalizePluginInstanceConfigurations((Map<String, Object>)value);
            } else if (value instanceof Double) {
                Double d= (Double) value;
                if (d == d.intValue()) {
                    entry.setValue(d.intValue());
                }
            } else if (value instanceof List) {
                ((List<?>)value).forEach(v -> {
                    if (v instanceof Map) {
                        normalizePluginInstanceConfigurations((Map<String, Object>)v);
                    }
                });
            }
        }
    }

    private String generateRawConfigurations(Map<String, Object> configurations) {
        if (MapUtils.isEmpty(configurations)) {
            return "";
        }
        String rawConfigurations = KubernetesUtil.toYaml(configurations);
        if (rawConfigurations.startsWith(KubernetesConstants.YAML_SEPARATOR)) {
            rawConfigurations = rawConfigurations.substring(KubernetesConstants.YAML_SEPARATOR.length());
        }
        return rawConfigurations.trim();
    }

    public void setWasmPluginInstanceToCr(V1alpha1WasmPlugin cr, WasmPluginInstance instance) {
        instance.syncDeprecatedFields();

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        if (spec == null) {
            spec = new V1alpha1WasmPluginSpec();
            cr.setSpec(spec);
        }

        List<MatchRule> matchRules = spec.getMatchRules();
        if (matchRules == null) {
            matchRules = new ArrayList<>();
        } else {
            matchRules = new ArrayList<>(matchRules);
        }
        spec.setMatchRules(matchRules);

        boolean enabled = instance.getEnabled() == null || instance.getEnabled();
        Map<String, Object> configurations = instance.getConfigurations();
        Map<WasmPluginInstanceScope, String> targets = instance.getTargets();
        if (MapUtils.isNotEmpty(targets)) {
            if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
                if (targets.size() == 1 && targets.get(WasmPluginInstanceScope.GLOBAL) == null) {
                    spec.setDefaultConfigDisable(!enabled);
                    spec.setDefaultConfig(configurations);
                }
            } else {
                MatchRule targetMatchRule = new MatchRule();
                targetMatchRule.setConfigDisable(!enabled);
                targetMatchRule.setConfig(configurations);
                for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                    setTargetByScope(targetMatchRule, entry.getKey(), entry.getValue());
                }

                MatchRule existedMatchRule = null;
                for (MatchRule matchRule : matchRules) {
                    if (matchRule.keyEquals(targetMatchRule)) {
                        existedMatchRule = matchRule;
                        break;
                    }
                }
                if (existedMatchRule != null) {
                    matchRules.remove(existedMatchRule);
                }
                matchRules.add(targetMatchRule);
            }
        }
        sortWasmPluginMatchRules(matchRules);
        setDefaultValues(spec);
    }

    public boolean removeWasmPluginInstanceFromCr(V1alpha1WasmPlugin cr, WasmPluginInstanceScope scope, String target) {
        return removeWasmPluginInstanceFromCr(cr, MapUtil.of(scope, target));
    }

    public boolean removeWasmPluginInstanceFromCr(V1alpha1WasmPlugin cr, Map<WasmPluginInstanceScope, String> targets) {
        if (MapUtils.isEmpty(targets)) {
            return false;
        }

        V1alpha1WasmPluginSpec spec = cr.getSpec();
        if (spec == null) {
            return false;
        }

        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            if (targets.size() != 1 || targets.get(WasmPluginInstanceScope.GLOBAL) != null) {
                return false;
            }
            spec.setDefaultConfigDisable(true);
            spec.setDefaultConfig(null);
            return true;
        }

        if (CollectionUtils.isEmpty(spec.getMatchRules())) {
            return false;
        }

        boolean changed = false;
        for (Iterator<MatchRule> it = spec.getMatchRules().listIterator(); it.hasNext();) {
            MatchRule rule = it.next();

            boolean matches = true;

            for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                List<String> targetsInRule = getTargetsByScope(rule, entry.getKey());
                if (targetsInRule == null || !targetsInRule.contains(entry.getValue())) {
                    matches = false;
                    break;
                }
            }

            if (!matches) {
                continue;
            }

            boolean removeRule = false;

            for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                List<String> targetsInRule = Objects.requireNonNull(getTargetsByScope(rule, entry.getKey()));
                if (targetsInRule.remove(entry.getValue()) && targetsInRule.isEmpty()) {
                    removeRule = true;
                }
            }

            if (removeRule) {
                it.remove();
            }

            changed = true;
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
        boolean hasService1 = CollectionUtils.isNotEmpty(r1.getService());
        boolean hasService2 = CollectionUtils.isNotEmpty(r2.getService());

        boolean empty1 = !hasDomain1 && !hasIngress1 && !hasService1;
        boolean empty2 = !hasDomain2 && !hasIngress2 && hasService2;
        if (empty1 && empty2) {
            return 0;
        }
        if (empty1 != empty2) {
            // One of them is empty. The non-empty one comes first.
            return empty1 ? 1 : -1;
        }

        // One contains some services, but the other one doesn't.
        // The one with service comes first since we need to match all service rules before any Ingress and domain
        // rules.
        if (hasService1 != hasService2) {
            return hasService1 ? -1 : 1;
        }

        if (hasService1) {
            // Both of them contain services.
            return compareStringLists(r1.getService(), r2.getService());
        }

        // None of them contains services, but one contains some Ingresses, and the other one doesn't.
        // The one with Ingresses comes first since we need to match all Ingress rules before any domain rules.
        if (hasIngress1 != hasIngress2) {
            return hasIngress1 ? -1 : 1;
        }

        if (!hasIngress1) {
            // None of them contains Ingress, so both of them contain domains.
            return compareStringLists(r1.getDomain(), r2.getDomain());
        }

        // One contains some domains, but the other one doesn't.
        // The one without any domain comes first since we need to match all Ingress rules before any domain rules.
        if (hasDomain1 != hasDomain2) {
            return hasDomain1 ? 1 : -1;
        }

        int ret = compareStringLists(r1.getIngress(), r2.getIngress());
        if (ret != 0) {
            return 0;
        }
        return hasDomain1 ? compareStringLists(r1.getDomain(), r2.getDomain()) : 0;
    }

    private static void setDefaultValues(V1alpha1WasmPluginSpec spec) {
        spec.setFailStrategy(FailStrategy.FAIL_OPEN.getName());

        if (spec.getDefaultConfigDisable() == null) {
            spec.setDefaultConfigDisable(true);
        }
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

    private static void fillCustomConfigs(Route route, V1ObjectMeta metadata) {
        if (metadata == null || MapUtils.isEmpty(metadata.getAnnotations())) {
            return;
        }
        Map<String, String> customConfigs = new HashMap<>();
        for (Map.Entry<String, String> annotation : metadata.getAnnotations().entrySet()) {
            if (isCustomAnnotation(annotation.getKey())) {
                customConfigs.put(annotation.getKey(), annotation.getValue());
            }
        }
        route.setCustomConfigs(customConfigs);
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
                StringUtils.join(cors.getAllowOrigins(), Separators.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getAllowHeaders())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_HEADERS_KEY,
                StringUtils.join(cors.getAllowHeaders(), Separators.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getAllowMethods())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_ALLOW_METHODS_KEY,
                StringUtils.join(cors.getAllowMethods(), Separators.COMMA));
        }
        if (CollectionUtils.isNotEmpty(cors.getExposeHeaders())) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.CORS_EXPOSE_HEADERS_KEY,
                StringUtils.join(cors.getExposeHeaders(), Separators.COMMA));
        }
    }

    private void fillIngressAnnotations(V1Ingress ingress, Route route) {
        if (MapUtils.isEmpty(route.getCustomConfigs())) {
            return;
        }
        for (Map.Entry<String, String> config : route.getCustomConfigs().entrySet()) {
            String key = config.getKey();
            if (!isCustomAnnotation(key)) {
                throw new ValidationException("Annotation [" + key + "] is already supported by Console. "
                    + "Please configure it in the corresponding section instead of using custom annotations.");
            }
            if (key.startsWith(KubernetesConstants.Annotation.NGINX_INGRESS_KEY_PREFIX)) {
                String higressKey = KubernetesConstants.Annotation.KEY_PREFIX
                    + key.substring(KubernetesConstants.Annotation.NGINX_INGRESS_KEY_PREFIX.length());
                if (!isCustomAnnotation(higressKey)) {
                    throw new ValidationException("Annotation [" + key + "] is already supported by Console. "
                        + "Please configure it in the corresponding section instead of using custom annotations.");
                }
            }
            KubernetesUtil.setAnnotation(ingress, config.getKey(), config.getValue());
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

        String rawDestination = metadata.getAnnotations().get(KubernetesConstants.Annotation.DESTINATION_KEY);
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
            String rawPort = address.substring(colonIndex + 1);
            try {
                port = Integer.parseInt(rawPort);
                if (port > 0 && port < 65536) {
                    // Only change the host if port is a valid number, just case the address looks like this:
                    // providers:org.apache.dubbo.samples.rest.api.facade.UserRestService:0.0.0:annotationConfig.zookeeper
                    host = address.substring(0, colonIndex);
                }
            } catch (NumberFormatException ex) {
                // Ignore it.
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
            getFunctionalAnnotation(annotations, KubernetesConstants.Annotation.REWRITE_PATH_KEY, enabled);
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
            proxyNextUpstream.setConditions(conditions.split(Separators.COMMA));
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
            for (String line : addConfig.split(Separators.NEW_LINE)) {
                int separatorIndex = line.indexOf(Separators.SPACE);
                Header header = separatorIndex != -1
                    ? new Header(line.substring(0, separatorIndex), line.substring(separatorIndex + 1))
                    : new Header(line, "");
                config.getAdd().add(header);
            }
        }
        if (StringUtils.isNotEmpty(setConfig)) {
            config.setSet(new ArrayList<>());
            for (String line : setConfig.split(Separators.NEW_LINE)) {
                int separatorIndex = line.indexOf(Separators.SPACE);
                Header header = separatorIndex != -1
                    ? new Header(line.substring(0, separatorIndex), line.substring(separatorIndex + 1))
                    : new Header(line, "");
                config.getSet().add(header);
            }
        }
        if (StringUtils.isNotEmpty(removeConfig)) {
            config.setRemove(Arrays.asList(removeConfig.split(Separators.COMMA)));
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
            KeyedRoutePredicate pseudoHeaderPredicate =
                buildKeyedRoutePredicate(k, v, KubernetesConstants.Annotation.PSEUDO_HEADER_MATCH_KEYWORD);
            if (pseudoHeaderPredicate != null) {
                pseudoHeaderPredicate.setKey(PSEUDO_HEADER_PREFIX + pseudoHeaderPredicate.getKey());
                headers.add(pseudoHeaderPredicate);
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
            route.setMethods(Arrays.asList(methods.split(Separators.SPACE)));
        }
    }

    private static void fillHeaderConfigConfig(Map<String, String> annotations, Route route) {
        String rawEnabled = annotations.get(KubernetesConstants.Annotation.HEADER_CONTROL_ENABLED_KEY);
        boolean enabled = rawEnabled == null || Boolean.parseBoolean(rawEnabled);

        HeaderControlStageConfig requestConfig =
            buildHeaderControlStageConfig(annotations, KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_UPDATE_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_REMOVE_KEY, enabled);
        HeaderControlStageConfig responseConfig =
            buildHeaderControlStageConfig(annotations, KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_UPDATE_KEY,
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

        {
            List<String> domains = route.getDomains();
            if (CollectionUtils.isEmpty(domains)) {
                domains = Collections.singletonList(HigressConstants.DEFAULT_DOMAIN);
            }
            for (String domain : domains) {
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
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_UPDATE_KEY,
                KubernetesConstants.Annotation.REQUEST_HEADER_CONTROL_REMOVE_KEY, enabled);
            fillIngressHeaderControlStageConfig(metadata, route.getHeaderControl().getResponse(),
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_ADD_KEY,
                KubernetesConstants.Annotation.RESPONSE_HEADER_CONTROL_UPDATE_KEY,
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
            setFunctionalAnnotation(metadata, KubernetesConstants.Annotation.REWRITE_PATH_KEY, rewrite.getPath(),
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
                StringUtils.join(config.getConditions(), Separators.COMMA), enabled);
        }
    }

    private void fillIngressHeaderControlStageConfig(V1ObjectMeta metadata, HeaderControlStageConfig config,
        String addKey, String setKey, String removeKey, boolean enabled) {
        if (config == null) {
            return;
        }
        if (CollectionUtils.isNotEmpty(config.getAdd())) {
            setFunctionalAnnotation(metadata, addKey,
                StringUtils.join(config.getAdd().stream().map(this::getHeaderConfig).filter(Objects::nonNull).collect(Collectors.toList()),
                    Separators.NEW_LINE),
                enabled);
        }
        if (CollectionUtils.isNotEmpty(config.getSet())) {
            setFunctionalAnnotation(metadata, setKey,
                StringUtils.join(config.getSet().stream().map(this::getHeaderConfig).filter(Objects::nonNull).collect(Collectors.toList()),
                    Separators.NEW_LINE),
                enabled);
        }
        if (CollectionUtils.isNotEmpty(config.getRemove())) {
            setFunctionalAnnotation(metadata, removeKey,
                StringUtils.join(
                    config.getRemove().stream().filter(StringUtils::isNotEmpty).collect(Collectors.toList()),
                    Separators.COMMA),
                enabled);
        }
    }

    private String getHeaderConfig(Header header) {
        if (StringUtils.isEmpty(header.getKey())) {
            return null;
        }
        if (StringUtils.isEmpty(header.getValue())) {
            return header.getKey() + Separators.SPACE;
        }
        return header.getKey() + Separators.SPACE + header.getValue();
    }

    private void fillIngressSpec(V1Ingress ingress, Route route) {
        V1ObjectMeta metadata = Objects.requireNonNull(ingress.getMetadata());
        V1IngressSpec spec = Objects.requireNonNull(ingress.getSpec());
        fillIngressTls(metadata, spec, route);
        fillIngressRules(metadata, spec, route);
        fillIngressDestination(metadata, route);
    }

    private void fillIngressTls(V1ObjectMeta metadata, V1IngressSpec spec, Route route) {
        List<String> domains = route.getDomains();
        if (CollectionUtils.isEmpty(domains)) {
            domains = Collections.singletonList(HigressConstants.DEFAULT_DOMAIN);
        }

        if (domains.size() > 1) {
            throw new IllegalArgumentException("Only one domain is allowed.");
        }

        List<V1IngressTLS> tlses = null;
        for (String domainName : domains) {
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

            if (configMap == null) {
                continue;
            }

            Domain domain = configMap2Domain(configMap);

            if (Domain.EnableHttps.OFF.equals(domain.getEnableHttps())) {
                continue;
            }

            if (StringUtils.isEmpty(domain.getCertIdentifier())) {
                continue;
            }

            V1IngressTLS tls = new V1IngressTLS();
            if (!HigressConstants.DEFAULT_DOMAIN.equals(domainName)) {
                tls.setHosts(Collections.singletonList(domainName));
            }
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
                if (valueBuilder.length() > 0) {
                    valueBuilder.append("\n");
                }
                valueBuilder.append(service.getWeight() == null ? DEFAULT_WEIGHT : service.getWeight()).append("% ");
                valueBuilder.append(service.getName());
                if (service.getPort() != null) {
                    valueBuilder.append(":").append(service.getPort());
                }
                if (!Strings.isNullOrEmpty(service.getVersion())) {
                    valueBuilder.append(" ").append(service.getVersion());
                }
            }
        }
        if (valueBuilder.length() > 0) {
            KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.DESTINATION_KEY,
                valueBuilder.toString());
        }
    }

    public ServiceSource v1RegistryConfig2ServiceSource(V1RegistryConfig v1RegistryConfig) {
        ServiceSource serviceSource = new ServiceSource();
        fillServiceSourceInfo(serviceSource, v1RegistryConfig);
        return serviceSource;
    }

    public String generateAuthSecretName(String serviceSourceName) {
        return serviceSourceName + "-auth-" + RandomStringUtils.randomAlphanumeric(5).toLowerCase(Locale.ROOT);
    }

    public void initV1McpBridge(V1McpBridge v1McpBridge) {
        v1McpBridge.setMetadata(new V1ObjectMeta());
        v1McpBridge.getMetadata().setName(V1McpBridge.DEFAULT_NAME);
        List<V1RegistryConfig> registries = new ArrayList<>();
        v1McpBridge.setSpec(new V1McpBridgeSpec());
        v1McpBridge.getSpec().setRegistries(registries);
    }

    public V1RegistryConfig addV1McpBridgeRegistry(V1McpBridge v1McpBridge, ServiceSource serviceSource) {
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
            return op.get();
        } else {
            V1RegistryConfig registry = serviceSource2V1RegistryConfig(serviceSource);
            registries.add(registry);
            return registry;
        }
    }

    public V1RegistryConfig removeV1McpBridgeRegistry(V1McpBridge v1McpBridge, String name) {
        V1McpBridgeSpec spec = v1McpBridge.getSpec();
        if (spec == null || CollectionUtils.isEmpty(spec.getRegistries())) {
            return null;
        }
        V1RegistryConfig target = null;
        for (Iterator<V1RegistryConfig> it = spec.getRegistries().iterator(); it.hasNext();) {
            V1RegistryConfig registryConfig = it.next();
            if (registryConfig.getName().equals(name)) {
                it.remove();
                target = registryConfig;
                // Normally, names should be unique. But we don't break here just in case they aren't.
            }
        }
        return target;
    }

    private void fillServiceSourceInfo(ServiceSource serviceSource, V1RegistryConfig v1RegistryConfig) {
        if (v1RegistryConfig == null) {
            return;
        }
        serviceSource.setDomain(v1RegistryConfig.getDomain());
        serviceSource.setType(v1RegistryConfig.getType());
        serviceSource.setPort(v1RegistryConfig.getPort());
        serviceSource.setName(v1RegistryConfig.getName());
        serviceSource.setProtocol(v1RegistryConfig.getProtocol());
        serviceSource.setSni(v1RegistryConfig.getSni());
        serviceSource.setProperties(new HashMap<>());
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(v1RegistryConfig.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(v1RegistryConfig.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS3.equals(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_NACOS_NAMESPACE_ID,
                v1RegistryConfig.getNacosNamespaceId());
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS,
                v1RegistryConfig.getNacosGroups());
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_ZK_SERVICES_PATH,
                v1RegistryConfig.getZkServicesPath());
        } else if (V1McpBridge.REGISTRY_TYPE_CONSUL.equals(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER,
                v1RegistryConfig.getConsulDataCenter());
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_CONSUL_SERVICE_TAG,
                v1RegistryConfig.getConsulServiceTag());
            serviceSource.getProperties().put(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL,
                v1RegistryConfig.getConsulRefreshInterval());
        }

        if (V1McpBridge.MCP_SUPPORTED_REGISTRY_TYPES.contains(v1RegistryConfig.getType())) {
            serviceSource.getProperties().put(V1McpBridge.ENABLE_MCP_SERVER,
                Optional.ofNullable(v1RegistryConfig.getEnableMcpServer()).orElse(Boolean.FALSE));
            serviceSource.getProperties().put(V1McpBridge.MCP_SERVER_BASE_URL, v1RegistryConfig.getMcpServerBaseUrl());
            serviceSource.getProperties().put(V1McpBridge.MCP_SERVER_EXPORT_DOMAINS,
                Optional.ofNullable(v1RegistryConfig.getMcpServerExportDomains()).orElse(new ArrayList<>()));
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
        v1RegistryConfig.setProtocol(StringUtils.firstNonBlank(serviceSource.getProtocol()));
        v1RegistryConfig.setSni(serviceSource.getSni());
        Map<String, Object> properties =
            Optional.ofNullable(serviceSource.getProperties()).orElse(Collections.emptyMap());
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(v1RegistryConfig.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(v1RegistryConfig.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS3.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setNacosNamespaceId(
                (String)Optional.ofNullable(properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_NAMESPACE_ID)).orElse(""));
            v1RegistryConfig.setNacosGroups((List<String>)Optional
                .ofNullable(properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS)).orElse(new ArrayList<>()));
        } else if (V1McpBridge.REGISTRY_TYPE_ZK.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setZkServicesPath((List<String>)Optional
                .ofNullable(properties.get(V1McpBridge.REGISTRY_TYPE_ZK_SERVICES_PATH)).orElse(new ArrayList<>()));
        } else if (V1McpBridge.REGISTRY_TYPE_CONSUL.equals(v1RegistryConfig.getType())) {
            v1RegistryConfig.setConsulDataCenter(
                (String)Optional.ofNullable(properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER)).orElse(""));
            v1RegistryConfig.setConsulServiceTag(
                (String)Optional.ofNullable(properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_SERVICE_TAG)).orElse(""));
            v1RegistryConfig
                .setConsulRefreshInterval((Integer)properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL));
        }

        if (V1McpBridge.MCP_SUPPORTED_REGISTRY_TYPES.contains(v1RegistryConfig.getType())) {
            v1RegistryConfig.setEnableMcpServer(
                (Boolean)Optional.ofNullable(properties.get(V1McpBridge.ENABLE_MCP_SERVER)).orElse(Boolean.FALSE));
            v1RegistryConfig.setMcpServerBaseUrl(
                (String)Optional.ofNullable(properties.get(V1McpBridge.MCP_SERVER_BASE_URL)).orElse(""));
            v1RegistryConfig.setMcpServerExportDomains((List<String>)Optional
                .ofNullable(properties.get(V1McpBridge.MCP_SERVER_EXPORT_DOMAINS)).orElse(new ArrayList<>()));
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
        Set<String> domains = new LinkedHashSet<>();

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

        return new ArrayList<>(domains);
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
            builder.append(Separators.COLON).append(imageVersion);
        }
        return builder.toString();
    }

    private void setQueryAnnotation(V1ObjectMeta metadata, KeyedRoutePredicate keyedRoutePredicate) {
        if (StringUtils.isAnyBlank(keyedRoutePredicate.getMatchType(), keyedRoutePredicate.getKey(),
            keyedRoutePredicate.getMatchValue())) {
            return;
        }
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.valueOf(keyedRoutePredicate.getMatchType());
        String annotationName = String.format(KubernetesConstants.Annotation.QUERY_MATCH_KEY_FORMAT,
            predicateType.getAnnotationPrefix(), keyedRoutePredicate.getKey());
        KubernetesUtil.setAnnotation(metadata, annotationName, keyedRoutePredicate.getMatchValue());
    }

    private void setHeaderAnnotation(V1ObjectMeta metadata, KeyedRoutePredicate keyedRoutePredicate) {
        if (StringUtils.isAnyBlank(keyedRoutePredicate.getMatchType(), keyedRoutePredicate.getKey(),
            keyedRoutePredicate.getMatchValue())) {
            return;
        }
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.valueOf(keyedRoutePredicate.getMatchType());
        String key = keyedRoutePredicate.getKey();
        String format = KubernetesConstants.Annotation.HEADER_MATCH_KEY_FORMAT;
        if (key.startsWith(PSEUDO_HEADER_PREFIX)) {
            key = key.substring(PSEUDO_HEADER_PREFIX.length());
            format = KubernetesConstants.Annotation.PSEUDO_HEADER_MATCH_KEY_FORMAT;
        }
        String annotationName = String.format(format, predicateType.getAnnotationPrefix(), key);
        KubernetesUtil.setAnnotation(metadata, annotationName, keyedRoutePredicate.getMatchValue());
    }

    private void setMethodAnnotation(V1ObjectMeta metadata, List<String> methods) {
        KubernetesUtil.setAnnotation(metadata, KubernetesConstants.Annotation.METHOD_KEY,
            StringUtils.join(methods, Separators.SPACE));
    }

    private static String getFunctionalAnnotation(Map<String, String> annotations, String key,
        boolean functionEnabled) {
        String actualKey = functionEnabled ? key : KubernetesConstants.Annotation.DISABLED_KEY_EXTRA_PREFIX + key;
        return annotations.get(actualKey);
    }

    private static void setFunctionalAnnotation(V1ObjectMeta metadata, String key, String value,
        boolean functionEnabled) {
        String actualKey = functionEnabled ? key : KubernetesConstants.Annotation.DISABLED_KEY_EXTRA_PREFIX + key;
        KubernetesUtil.setAnnotation(metadata, actualKey, value);
    }

    private static boolean isCustomAnnotation(String key) {
        if (key.startsWith(KubernetesConstants.Annotation.DISABLED_KEY_EXTRA_PREFIX)) {
            key = key.substring(KubernetesConstants.Annotation.DISABLED_KEY_EXTRA_PREFIX.length());
        }
        if (SUPPORTED_ANNOTATIONS.contains(key)) {
            return false;
        }
        if (!key.startsWith(KubernetesConstants.Annotation.KEY_PREFIX)) {
            return true;
        }
        if (key.contains(KubernetesConstants.Annotation.HEADER_MATCH_KEYWORD)
            || key.contains(KubernetesConstants.Annotation.PSEUDO_HEADER_MATCH_KEYWORD)
            || key.contains(KubernetesConstants.Annotation.QUERY_MATCH_KEYWORD)) {
            return false;
        }
        return true;
    }
}
