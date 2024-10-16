/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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

import static com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil.buildDomainLabelSelector;
import static com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil.buildLabelSelector;
import static com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil.joinLabelSelectors;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;
import io.kubernetes.client.util.Yaml;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.KubernetesConstants.Label;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridgeList;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginList;
import com.alibaba.higress.sdk.service.kubernetes.model.IstioEndpointShard;
import com.alibaba.higress.sdk.service.kubernetes.model.RegistryzService;
import com.google.common.net.HttpHeaders;

import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import io.kubernetes.client.openapi.apis.NetworkingV1Api;
import io.kubernetes.client.openapi.models.V1APIResource;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ConfigMapList;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressList;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.openapi.models.V1SecretList;
import io.kubernetes.client.openapi.models.V1Status;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import io.kubernetes.client.util.Strings;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Slf4j
public class KubernetesClientService {

    private static final String KUBE_CONFIG_DEFAULT_PATH =
        Paths.get(System.getProperty("user.home"), "/.kube/config").toString();
    private static final String POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH =
        "/var/run/secrets/kubernetes.io/serviceaccount/token";
    private static final String CONTROLLER_ACCESS_TOKEN_FILE_PATH = "/var/run/secrets/access-token/token";
    private static final String DEFAULT_LABEL_SELECTORS =
        buildLabelSelector(KubernetesConstants.Label.RESOURCE_DEFINER_KEY, Label.RESOURCE_DEFINER_VALUE);

    private ApiClient client;

    private final OkHttpClient okHttpClient = new OkHttpClient();

    private Boolean inCluster;

    private final String kubeConfig;

    private final String controllerServiceName;

    private final String controllerNamespace;

    private final String controllerIngressClassName;

    private final String controllerServiceHost;

    private final int controllerServicePort;

    private final String controllerJwtPolicy;

    private final String controllerAccessToken;

    private boolean ingressV1Supported;

    public KubernetesClientService(HigressServiceConfig config) throws IOException {
        validateConfig(config);

        this.kubeConfig = config.getKubeConfigPath();
        this.controllerNamespace = config.getControllerNamespace();
        this.controllerServiceName = config.getControllerServiceName();
        this.controllerServiceHost = config.getControllerServiceHost();
        this.controllerServicePort = config.getControllerServicePort();
        this.controllerIngressClassName = config.getIngressClassName();
        this.controllerJwtPolicy = config.getControllerJwtPolicy();
        this.controllerAccessToken = config.getControllerAccessToken();
        this.inCluster = isInCluster();

        if (inCluster) {
            client = ClientBuilder.cluster().build();
            log.info("init KubernetesClientService InCluster");
        } else {
            String kubeConfigPath = !Strings.isNullOrEmpty(kubeConfig) ? kubeConfig : KUBE_CONFIG_DEFAULT_PATH;
            try (FileReader reader = new FileReader(kubeConfigPath)) {
                client = ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(reader)).build();
            }
            log.info("init KubernetesClientService LoadKubeConfig");
        }

        initializeK8sCapabilities();
    }

    private void initializeK8sCapabilities() {
        try {
            NetworkingV1Api networkingV1Api = new NetworkingV1Api(client);
            List<V1APIResource> networkingV1ApiResources = networkingV1Api.getAPIResources().getResources();
            ingressV1Supported = CollectionUtils.isNotEmpty(networkingV1ApiResources)
                && networkingV1ApiResources.stream().anyMatch(r -> "Ingress".equals(r.getKind()));
        } catch (ApiException e) {
            log.error("Failed to load NetworkingV1 API resources from K8s", e);
            ingressV1Supported = false;
        }
    }

    public boolean isIngressV1Supported() {
        return ingressV1Supported;
    }

    public boolean isNamespaceProtected(String namespace) {
        return KubernetesConstants.KUBE_SYSTEM_NS.equals(namespace) || controllerNamespace.equals(namespace);
    }

    public <T extends KubernetesObject> T loadFromYaml(String yaml, Class<T> clazz) {
        return Yaml.getSnakeYaml(clazz).loadAs(yaml, clazz);
    }

    public <T extends KubernetesObject> T loadFromJson(String json, Class<T> clazz) {
        return client.getJSON().deserialize(json, clazz);
    }

    public List<RegistryzService> gatewayServiceList() throws IOException {
        Request request = buildControllerRequest("/debug/registryz");
        log.info("gatewayServiceList url {}", request.url());
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new BusinessException(
                    "Failed to get gateway service list from controller. Code=" + response.code());
            }
            if (response.body() == null) {
                throw new BusinessException("Empty response got from controller when loading gateway service list.");
            }
            String responseString = new String(response.body().bytes());
            if (StringUtils.isNotEmpty(responseString)) {
                return JSON.parseArray(responseString, RegistryzService.class);
            }
        }
        return null;
    }

    public Map<String, Map<String, IstioEndpointShard>> gatewayServiceEndpoint() throws IOException {
        Request request = buildControllerRequest("/debug/endpointShardz");
        log.info("gatewayServiceEndpoint url {}", request.url());
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new BusinessException("Failed to get service endpoints from controller. Code=" + response.code());
            }
            if (response.body() == null) {
                throw new BusinessException("Empty response got from controller when loading service endpoints.");
            }
            String responseString = new String(response.body().bytes());
            if (StringUtils.isNotEmpty(responseString)) {
                return JSON.parseObject(responseString, new TypeReference<>() {});
            }
        }
        return null;
    }

    private static boolean isInCluster() {
        return new File(POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH).exists();
    }

    public List<V1Ingress> listIngress() {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        try {
            V1IngressList list = apiInstance.listNamespacedIngress(controllerNamespace, null, null, null, null,
                DEFAULT_LABEL_SELECTORS, null, null, null, null, null);
            if (list == null) {
                return Collections.emptyList();
            }
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listIngress Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public List<V1Ingress> listIngressByDomain(String domainName) {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        String labelSelectors = joinLabelSelectors(DEFAULT_LABEL_SELECTORS, buildDomainLabelSelector(domainName));
        try {
            V1IngressList list = apiInstance.listNamespacedIngress(controllerNamespace, null, null, null, null,
                labelSelectors, null, null, null, null, null);
            if (list == null) {
                return Collections.emptyList();
            }
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listIngressByDomain Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1Ingress readIngress(String name) throws ApiException {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        try {
            return apiInstance.readNamespacedIngress(name, controllerNamespace, null);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public V1Ingress createIngress(V1Ingress ingress) throws ApiException {
        Objects.requireNonNull(ingress.getSpec()).setIngressClassName(controllerIngressClassName);
        renderDefaultLabels(ingress);
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        return apiInstance.createNamespacedIngress(controllerNamespace, ingress, null, null, null, null);
    }

    public V1Ingress replaceIngress(V1Ingress ingress) throws ApiException {
        V1ObjectMeta metadata = ingress.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("Ingress doesn't have a valid metadata.");
        }
        Objects.requireNonNull(ingress.getSpec()).setIngressClassName(controllerIngressClassName);
        renderDefaultLabels(ingress);
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        return apiInstance.replaceNamespacedIngress(metadata.getName(), controllerNamespace, ingress, null, null, null,
            null);
    }

    public void deleteIngress(String name) throws ApiException {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        V1Status status;
        try {
            status = apiInstance.deleteNamespacedIngress(name, controllerNamespace, null, null, null, null, null, null);
        } catch (ApiException ae) {
            if (ae.getCode() == HttpStatus.NOT_FOUND) {
                // The Ingress to be deleted is already gone or never existed.
                return;
            }
            throw ae;
        }
        checkResponseStatus(status);
    }

    public List<V1ConfigMap> listConfigMap() throws ApiException {
        return listConfigMap(null);
    }

    public List<V1ConfigMap> listConfigMap(Map<String, String> labelSelectors) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        String labelSelectorsStr = KubernetesUtil.joinLabelSelectors(DEFAULT_LABEL_SELECTORS,
            KubernetesUtil.buildLabelSelectors(labelSelectors));
        V1ConfigMapList list = coreV1Api.listNamespacedConfigMap(controllerNamespace, null, null, null, null,
            labelSelectorsStr, null, null, null, null, null);
        return sortKubernetesObjects(Optional.ofNullable(list.getItems()).orElse(Collections.emptyList()));
    }

    public V1ConfigMap createConfigMap(V1ConfigMap configMap) throws ApiException {
        renderDefaultLabels(configMap);
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.createNamespacedConfigMap(controllerNamespace, configMap, null, null, null, null);
    }

    public V1ConfigMap readConfigMap(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        try {
            return coreV1Api.readNamespacedConfigMap(name, controllerNamespace, null);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public void deleteConfigMap(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        V1Status status;
        try {
            status = coreV1Api.deleteNamespacedConfigMap(name, controllerNamespace, null, null, null, null, null, null);
        } catch (ApiException ae) {
            if (ae.getCode() == HttpStatus.NOT_FOUND) {
                // The ConfigMap to be deleted is already gone or never existed.
                return;
            }
            throw ae;
        }
        checkResponseStatus(status);
    }

    public V1ConfigMap replaceConfigMap(V1ConfigMap configMap) throws ApiException {
        V1ObjectMeta metadata = configMap.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("ConfigMap doesn't have a valid metadata.");
        }
        renderDefaultLabels(configMap);
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.replaceNamespacedConfigMap(metadata.getName(), controllerNamespace, configMap, null, null,
            null, null);
    }

    public List<V1Secret> listSecret(String type) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        String fieldSelectors = null;
        if (StringUtils.isNotEmpty(type)) {
            fieldSelectors = KubernetesConstants.TYPE_FIELD + Separators.EQUALS_SIGN + type;
        }
        V1SecretList list = coreV1Api.listNamespacedSecret(controllerNamespace, null, null, null, fieldSelectors, null,
            null, null, null, null, null);
        return sortKubernetesObjects(Optional.ofNullable(list.getItems()).orElse(Collections.emptyList()));
    }

    public V1Secret readSecret(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        try {
            return coreV1Api.readNamespacedSecret(name, controllerNamespace, null);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public V1Secret createSecret(V1Secret secret) throws ApiException {
        renderDefaultLabels(secret);
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.createNamespacedSecret(controllerNamespace, secret, null, null, null, null);
    }

    public V1Secret replaceSecret(V1Secret secret) throws ApiException {
        V1ObjectMeta metadata = secret.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("Secret doesn't have a valid metadata.");
        }
        renderDefaultLabels(secret);
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.replaceNamespacedSecret(metadata.getName(), controllerNamespace, secret, null, null, null,
            null);
    }

    public void deleteSecret(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        V1Status status;
        try {
            status = coreV1Api.deleteNamespacedSecret(name, controllerNamespace, null, null, null, null, null, null);
        } catch (ApiException ae) {
            if (ae.getCode() == HttpStatus.NOT_FOUND) {
                // The Secret to be deleted is already gone or never existed.
                return;
            }
            throw ae;
        }
        checkResponseStatus(status);
    }

    public List<V1McpBridge> listMcpBridge() {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.listNamespacedCustomObject(V1McpBridge.API_GROUP, V1McpBridge.VERSION,
                controllerNamespace, V1McpBridge.PLURAL, null, null, null, null, null, null, null, null, null, null);
            io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
            V1McpBridgeList list = json.deserialize(json.serialize(response), V1McpBridgeList.class);
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listMcpBridge Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1McpBridge createMcpBridge(V1McpBridge mcpBridge) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.createNamespacedCustomObject(V1McpBridge.API_GROUP, V1McpBridge.VERSION,
            controllerNamespace, V1McpBridge.PLURAL, mcpBridge, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
    }

    public V1McpBridge replaceMcpBridge(V1McpBridge mcpBridge) throws ApiException {
        V1ObjectMeta metadata = mcpBridge.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("mcpBridge doesn't have a valid metadata.");
        }
        metadata.setNamespace(controllerNamespace);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.replaceNamespacedCustomObject(V1McpBridge.API_GROUP, V1McpBridge.VERSION,
            controllerNamespace, V1McpBridge.PLURAL, metadata.getName(), mcpBridge, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
    }

    public void deleteMcpBridge(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        customObjectsApi.deleteNamespacedCustomObject(V1McpBridge.API_GROUP, V1McpBridge.VERSION, controllerNamespace,
            V1McpBridge.PLURAL, name, null, null, null, null, null);
    }

    public V1McpBridge readMcpBridge(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1McpBridge.API_GROUP, V1McpBridge.VERSION,
                controllerNamespace, V1McpBridge.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public List<V1alpha1WasmPlugin> listWasmPlugin() throws ApiException {
        return listWasmPlugin(null, null, null);
    }

    public List<V1alpha1WasmPlugin> listWasmPlugin(String name) throws ApiException {
        return listWasmPlugin(name, null, null);
    }

    public List<V1alpha1WasmPlugin> listWasmPlugin(String name, String version) throws ApiException {
        return listWasmPlugin(name, version, null);
    }

    public List<V1alpha1WasmPlugin> listWasmPlugin(String name, String version, Boolean builtIn) throws ApiException {
        List<String> labelSelectorItems = new ArrayList<>();
        labelSelectorItems.add(DEFAULT_LABEL_SELECTORS);
        if (StringUtils.isNotEmpty(name)) {
            labelSelectorItems.add(buildLabelSelector(Label.WASM_PLUGIN_NAME_KEY, name));
        }
        if (StringUtils.isNotEmpty(version)) {
            labelSelectorItems.add(buildLabelSelector(Label.WASM_PLUGIN_VERSION_KEY, version));
        }
        if (builtIn != null) {
            labelSelectorItems.add(buildLabelSelector(Label.WASM_PLUGIN_BUILT_IN_KEY, String.valueOf(builtIn)));
        }
        String labelSelector = labelSelectorItems.size() == 1 ? labelSelectorItems.get(0)
            : joinLabelSelectors(labelSelectorItems.toArray(new String[0]));
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.listNamespacedCustomObject(V1alpha1WasmPlugin.API_GROUP,
            V1alpha1WasmPlugin.VERSION, controllerNamespace, V1alpha1WasmPlugin.PLURAL, null, null, null, null,
            labelSelector, null, null, null, null, null);
        io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
        V1alpha1WasmPluginList list = json.deserialize(json.serialize(response), V1alpha1WasmPluginList.class);
        return sortKubernetesObjects(list.getItems());
    }

    public V1alpha1WasmPlugin createWasmPlugin(V1alpha1WasmPlugin plugin) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        renderDefaultLabels(plugin);
        Object response = customObjectsApi.createNamespacedCustomObject(V1alpha1WasmPlugin.API_GROUP,
            V1alpha1WasmPlugin.VERSION, controllerNamespace, V1alpha1WasmPlugin.PLURAL, plugin, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha1WasmPlugin.class);
    }

    public V1alpha1WasmPlugin replaceWasmPlugin(V1alpha1WasmPlugin plugin) throws ApiException {
        V1ObjectMeta metadata = plugin.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("WasmPlugin doesn't have a valid metadata.");
        }
        renderDefaultLabels(plugin);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response =
            customObjectsApi.replaceNamespacedCustomObject(V1alpha1WasmPlugin.API_GROUP, V1alpha1WasmPlugin.VERSION,
                controllerNamespace, V1alpha1WasmPlugin.PLURAL, metadata.getName(), plugin, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha1WasmPlugin.class);
    }

    public void deleteWasmPlugin(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            customObjectsApi.deleteNamespacedCustomObject(V1alpha1WasmPlugin.API_GROUP, V1alpha1WasmPlugin.VERSION,
                controllerNamespace, V1alpha1WasmPlugin.PLURAL, name, null, null, null, null, null);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND) {
                throw e;
            }
        }
    }

    public V1alpha1WasmPlugin readWasmPlugin(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1alpha1WasmPlugin.API_GROUP,
                V1alpha1WasmPlugin.VERSION, controllerNamespace, V1alpha1WasmPlugin.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha1WasmPlugin.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public V1alpha3EnvoyFilter createEnvoyFilter(V1alpha3EnvoyFilter filter) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        renderDefaultLabels(filter);
        Object response = customObjectsApi.createNamespacedCustomObject(V1alpha3EnvoyFilter.API_GROUP,
            V1alpha3EnvoyFilter.VERSION, controllerNamespace, V1alpha3EnvoyFilter.PLURAL, filter, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha3EnvoyFilter.class);
    }

    public V1alpha3EnvoyFilter replaceEnvoyFilter(V1alpha3EnvoyFilter filter) throws ApiException {
        V1ObjectMeta metadata = filter.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("EnvoyFilter doesn't have a valid metadata.");
        }
        renderDefaultLabels(filter);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response =
            customObjectsApi.replaceNamespacedCustomObject(V1alpha3EnvoyFilter.API_GROUP, V1alpha3EnvoyFilter.VERSION,
                controllerNamespace, V1alpha3EnvoyFilter.PLURAL, metadata.getName(), filter, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha3EnvoyFilter.class);
    }

    public void deleteEnvoyFilter(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            customObjectsApi.deleteNamespacedCustomObject(V1alpha3EnvoyFilter.API_GROUP, V1alpha3EnvoyFilter.VERSION,
                controllerNamespace, V1alpha3EnvoyFilter.PLURAL, name, null, null, null, null, null);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND) {
                throw e;
            }
        }
    }

    public V1alpha3EnvoyFilter readEnvoyFilter(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1alpha3EnvoyFilter.API_GROUP,
                V1alpha3EnvoyFilter.VERSION, controllerNamespace, V1alpha3EnvoyFilter.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1alpha3EnvoyFilter.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    private void checkResponseStatus(V1Status status) {
        // TODO: Throw exception accordingly.
    }

    private Request buildControllerRequest(String path) throws IOException {
        String serviceHost = inCluster ? controllerServiceName + "." + controllerNamespace : controllerServiceHost;
        String url = "http://" + serviceHost + ":" + controllerServicePort + path;
        Request.Builder builder = new Request.Builder().url(url);
        String token = controllerAccessToken;
        if (Strings.isNullOrEmpty(token) && inCluster) {
            token = readTokenFromFile();
        }
        if (!Strings.isNullOrEmpty(token)) {
            builder.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        }
        return builder.build();
    }

    private String readTokenFromFile() throws IOException {
        String fileName = CONTROLLER_ACCESS_TOKEN_FILE_PATH;
        if (KubernetesConstants.JwtPolicy.FIRST_PARTY_JWT.equals(controllerJwtPolicy)) {
            fileName = POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH;
        }
        return FileUtils.readFileToString(new File(fileName), Charset.defaultCharset());
    }

    private void renderDefaultLabels(KubernetesObject object) {
        KubernetesUtil.setLabel(object, Label.RESOURCE_DEFINER_KEY, Label.RESOURCE_DEFINER_VALUE);
        if (KubernetesUtil.isInternalResource(object)) {
            KubernetesUtil.setLabel(object, Label.INTERNAL_KEY, Boolean.toString(true));
        }
    }

    private static <T extends KubernetesObject> List<T> sortKubernetesObjects(List<T> objects) {
        if (CollectionUtils.isNotEmpty(objects)) {
            objects.sort(Comparator.comparing(o -> o.getMetadata() != null ? o.getMetadata().getName() : null));
        }
        return objects;
    }

    private static void validateConfig(HigressServiceConfig config) {
        if (isInCluster()) {
            if (StringUtils.isEmpty(config.getControllerServiceName())) {
                throw new IllegalArgumentException("controllerServiceName is required");
            }
        } else {
            if (StringUtils.isEmpty(config.getControllerServiceHost())) {
                throw new IllegalArgumentException("controllerServiceHost is required");
            }
        }
        if (StringUtils.isEmpty(config.getControllerNamespace())) {
            throw new IllegalArgumentException("controllerNamespace is required");
        }
        if (config.getControllerServicePort() == null) {
            throw new IllegalArgumentException("controllerServicePort is required");
        } else if (config.getControllerServicePort() <= 0 || config.getControllerServicePort() > 65535) {
            throw new IllegalArgumentException("controllerServicePort is invalid");
        }
        if (StringUtils.isEmpty(config.getControllerJwtPolicy())) {
            throw new IllegalArgumentException("controllerJwtPolicy is required");
        }
    }
}
