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
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass.V1GatewayClass;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass.V1GatewayClassSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1Gateway;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1GatewayList;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways.V1GatewaySpecListeners;

import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRoute;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRouteList;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.referencegrant.V1beta1ReferenceGrant;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.referencegrant.V1beta1ReferenceGrantSpec;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.referencegrant.V1beta1ReferenceGrantSpecFrom;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.referencegrant.V1beta1ReferenceGrantSpecTo;
import io.kubernetes.client.openapi.models.V1APIResource;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ConfigMapList;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressList;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;
import io.kubernetes.client.openapi.models.V1SecretList;
import io.kubernetes.client.openapi.models.V1Service;
import io.kubernetes.client.openapi.models.V1ServicePort;
import io.kubernetes.client.openapi.models.V1Status;

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

    private String workMode;

    public String httpRouteNameSpace;

    public String gatewayNameSpace;

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
        this.httpRouteNameSpace = controllerNamespace;
        this.gatewayNameSpace = controllerNamespace;

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
        initGatewayClass();
        getIngressOrGatewayMode();
        try {
            createSecretReferenceGrantForGateway();
        } catch (ApiException e) {
            log.error("Failed to create secret referenceGrant for gateway", e);
        }
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

    private void initGatewayClass() {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);

        V1GatewayClass gatewayClass = new V1GatewayClass();
        gatewayClass.setMetadata(new V1ObjectMeta());
        gatewayClass.getMetadata().setName(V1GatewayClass.DEFAULT_NAME);
        gatewayClass.setSpec(new V1GatewayClassSpec());

        try {
            Object existingGatewayClass = customObjectsApi.getClusterCustomObject(V1GatewayClass.API_GROUP, V1GatewayClass.VERSION,
                    V1GatewayClass.PLURAL, V1GatewayClass.DEFAULT_NAME);
            log.info("GatewayClass already exists: " + existingGatewayClass);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {  // if not exist, create new GatewayClass
                try {
                    Object response = customObjectsApi.createClusterCustomObject(V1GatewayClass.API_GROUP, V1GatewayClass.VERSION,
                            V1GatewayClass.PLURAL, gatewayClass, null, null, null);
                    log.info("Created GatewayClass: " + response);
                } catch (ApiException ex) {
                    throw new BusinessException("Failed to create GatewayClass",
                            ex);
                }
            } else {
                throw new BusinessException("Failed to check if GatewayClass exists",
                        e);
            }
        }
    }

    private void getIngressOrGatewayMode() {
        // read config, check if ingress or gateway mode
        V1ConfigMap higressConfig;
        try {
            higressConfig = readConfigMap(HigressConstants.DEFAULT_CONFIG);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the ConfigMap with name:"+HigressConstants.DEFAULT_CONFIG,
                    e);
        }
        Map<String, String> data = higressConfig.getData();
        workMode = "ingress";
        if (data!=null && data.containsKey("workMode")) {
            workMode = data.get("workMode");
        }
    }
    public boolean isIngressV1Supported() {
        return ingressV1Supported;
    }
    public boolean isIngressWorkMode() {
        return workMode.equals("ingress");
    }

    public Boolean setIngressMode(Boolean isIngressMode) throws ApiException {
        if (isIngressMode == null) {
            isIngressMode = true; // default to ingress mode
        }

        V1ConfigMap higressConfig = readConfigMap(HigressConstants.DEFAULT_CONFIG);
        if (higressConfig == null) {
            throw new BusinessException("ConfigMap not found: " + HigressConstants.DEFAULT_CONFIG);
        }

        Map<String, String> data = higressConfig.getData();
        if (data == null) {
            data = new HashMap<>();
            higressConfig.setData(data);
        }

        data.put("workMode", isIngressMode ? "ingress" : "gateway");

        replaceConfigMap(higressConfig);
        getIngressOrGatewayMode();
        return isIngressWorkMode();
    }

    public boolean isNamespaceProtected(String namespace) {
        return KubernetesConstants.KUBE_SYSTEM_NS.equals(namespace) || controllerNamespace.equals(namespace);
    }

    private void createSecretReferenceGrantForGateway() throws ApiException {
        if (isIngressWorkMode() || controllerNamespace.equals(gatewayNameSpace)) {
            return;
        }
        String referenceGrantName = KubernetesUtil.getReferenceGrantName(controllerNamespace, "gateway2secret");
        V1beta1ReferenceGrant v1beta1ReferenceGrant = readReferenceGrant(referenceGrantName, controllerNamespace);
        if (v1beta1ReferenceGrant == null) {
            v1beta1ReferenceGrant = new V1beta1ReferenceGrant();
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(referenceGrantName);
            metadata.setNamespace(controllerNamespace);
            v1beta1ReferenceGrant.setMetadata(metadata);
            V1beta1ReferenceGrantSpec spec = new V1beta1ReferenceGrantSpec();
            V1beta1ReferenceGrantSpecFrom from = new V1beta1ReferenceGrantSpecFrom();
            from.setNamespace(gatewayNameSpace);
            from.setKind(V1Gateway.KIND);
            from.setGroup(V1Gateway.API_GROUP);
            spec.getFrom().add(from);
            V1beta1ReferenceGrantSpecTo to = new V1beta1ReferenceGrantSpecTo();
            to.setKind("Secret");
            to.setGroup("");
            spec.getTo().add(to);
            v1beta1ReferenceGrant.setSpec(spec);
            createReferenceGrant(v1beta1ReferenceGrant);
        }
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

    public V1ConfigMap readOrCreateConfigMap(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        try {
            return coreV1Api.readNamespacedConfigMap(name, controllerNamespace, null);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                // ConfigMap not found, create a new one
                V1ConfigMap newConfigMap = new V1ConfigMap();
                newConfigMap.setMetadata(new V1ObjectMeta().name(name));
                return createConfigMap(newConfigMap);
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

    public List<V1Gateway> listGateway() {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.listNamespacedCustomObject(V1Gateway.API_GROUP, V1Gateway.VERSION,
                    gatewayNameSpace, V1Gateway.PLURAL, null, null, null, null, null, null, null, null, null, null);
            io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
            V1GatewayList list = json.deserialize(json.serialize(response), V1GatewayList.class);
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listGateway Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                    + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1Gateway createGateway(V1Gateway gateway) throws ApiException {
        renderDefaultLabels(gateway);
        modifyLoadBalancerPorts(null, gateway);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.createNamespacedCustomObject(V1Gateway.API_GROUP, V1Gateway.VERSION,
                gatewayNameSpace, V1Gateway.PLURAL, gateway, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1Gateway.class);
    }

    public V1Gateway replaceGateway(V1Gateway gateway) throws ApiException {
        V1ObjectMeta metadata = gateway.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("gateway doesn't have a valid metadata.");
        }
        renderDefaultLabels(gateway);
        V1Gateway gatewayOri = readGateway(metadata.getName());
        modifyLoadBalancerPorts(gatewayOri, gateway);
        gateway.getMetadata().setResourceVersion(gatewayOri.getMetadata().getResourceVersion());
        metadata.setNamespace(gatewayNameSpace);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.replaceNamespacedCustomObject(V1Gateway.API_GROUP, V1Gateway.VERSION,
                gatewayNameSpace, V1Gateway.PLURAL, metadata.getName(), gateway, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1Gateway.class);
    }

    public void deleteGateway(String name) throws ApiException {
        V1Gateway gateway = readGateway(name);
        modifyLoadBalancerPorts(gateway, null);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        customObjectsApi.deleteNamespacedCustomObject(V1Gateway.API_GROUP, V1Gateway.VERSION, gatewayNameSpace,
                V1Gateway.PLURAL, name, null, null, null, null, null);
    }

    public V1Gateway readGateway(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1Gateway.API_GROUP, V1Gateway.VERSION,
                    gatewayNameSpace, V1Gateway.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1Gateway.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public void modifyLoadBalancerPorts(V1Gateway gatewayOri, V1Gateway gatewayReplaced) {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        try {
            // get port counter from config
            V1ConfigMap portConfig = readOrCreateConfigMap(HigressConstants.PORT_CONFIG);
            Map<String, String> portCount = portConfig.getData();
            if (portCount == null) {
                portCount = new HashMap<>();
            }
            V1Service service = coreV1Api.readNamespacedService(V1GatewayClass.DEFAULT_NAME, gatewayNameSpace, null);
            List<V1ServicePort> ports = Objects.requireNonNull(service.getSpec()).getPorts();
            assert ports != null;

            Map<Integer, Integer> portFrequency = new HashMap<>();
            if (gatewayOri != null) {
                List<V1GatewaySpecListeners> listenersOri = gatewayOri.getSpec().getListeners();
                for (V1GatewaySpecListeners listener : listenersOri) {
                    portFrequency.put(listener.getPort(), portFrequency.getOrDefault(listener.getPort(), 0) - 1);
                }
            }
            if (gatewayReplaced != null) {
                List<V1GatewaySpecListeners> listenersReplaced = gatewayReplaced.getSpec().getListeners();
                for (V1GatewaySpecListeners listener : listenersReplaced) {
                    portFrequency.put(listener.getPort(), portFrequency.getOrDefault(listener.getPort(), 0) + 1);
                }
            }

            for (Map.Entry<Integer, Integer> entry : portFrequency.entrySet()) {
                Integer port = entry.getKey();
                Integer freq = entry.getValue();
                if (port == 80 || port == 443 || freq == 0) {
                    continue;
                }
                int count = Integer.parseInt(portCount.getOrDefault(port.toString(), "0")) + (freq>0?1:-1);

                if (count <= 0) {
                    portCount.remove(port.toString());
                    ports.removeIf(p -> p.getPort().equals(port));
                } else {
                    portCount.put(port.toString(), Integer.toString(count));
                    if (count==1) {
                        V1ServicePort servicePort = new V1ServicePort().port(port);
                        servicePort.setProtocol("TCP");
                        servicePort.setName("port"+Separators.DASH+ port);
                        ports.add(servicePort);
                    }
                }
            }

            portConfig.setData(portCount);
            replaceConfigMap(portConfig);
            service.getSpec().setPorts(ports);
            coreV1Api.replaceNamespacedService(V1GatewayClass.DEFAULT_NAME, gatewayNameSpace, service, null, null, null, null);
        } catch (ApiException e) {
            log.error("Error when modifying LoadBalancer ports ", e);
        }
    }

    public List<V1HTTPRoute> listHttpRouteByDomain(String domainName) {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        String labelSelectors = joinLabelSelectors(DEFAULT_LABEL_SELECTORS, buildDomainLabelSelector(domainName));
        try {
            Object response = customObjectsApi.listNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION,
                    httpRouteNameSpace, V1HTTPRoute.PLURAL, null, null, null, null, labelSelectors, null, null, null, null, null);
            io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
            V1HTTPRouteList list = json.deserialize(json.serialize(response), V1HTTPRouteList.class);
            if (list == null) {
                return Collections.emptyList();
            }
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listHttpRouteByDomain Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                    + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public List<V1HTTPRoute> listHttpRoute() {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.listNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION,
                    httpRouteNameSpace, V1HTTPRoute.PLURAL, null, null, null, null, null, null, null, null, null, null);
            io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
            V1HTTPRouteList list = json.deserialize(json.serialize(response), V1HTTPRouteList.class);
            if (list == null) {
                return Collections.emptyList();
            }
            return sortKubernetesObjects(list.getItems());
        } catch (ApiException e) {
            log.error("listHttpRouteByDomain Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                    + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1HTTPRoute readHttpRoute(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION,
                    httpRouteNameSpace, V1HTTPRoute.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1HTTPRoute.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }

    public V1HTTPRoute createHttpRoute(V1HTTPRoute httpRoute) throws ApiException {
        renderDefaultLabels(httpRoute);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.createNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION,
                httpRouteNameSpace, V1HTTPRoute.PLURAL, httpRoute, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1HTTPRoute.class);
    }

    public void deleteHttpRoute(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        customObjectsApi.deleteNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION, httpRouteNameSpace,
                V1HTTPRoute.PLURAL, name, null, null, null, null, null);
    }

    public V1HTTPRoute replaceHttpRoute(V1HTTPRoute httpRoute) throws ApiException {
        V1ObjectMeta metadata = httpRoute.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("httpRoute doesn't have a valid metadata.");
        }
        renderDefaultLabels(httpRoute);
        metadata.setNamespace(httpRouteNameSpace);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.replaceNamespacedCustomObject(V1HTTPRoute.API_GROUP, V1HTTPRoute.VERSION,
                httpRouteNameSpace, V1HTTPRoute.PLURAL, metadata.getName(), httpRoute, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1HTTPRoute.class);
    }

    public V1beta1ReferenceGrant addReferenceGrantForHttpRoute2Service(String fromNamespace, String toNamespace) throws ApiException {
        if (fromNamespace.equals(toNamespace)) {
            return null;
        }
        String referenceGrantName = KubernetesUtil.getReferenceGrantName(toNamespace, "httproute2service");
        V1beta1ReferenceGrant v1beta1ReferenceGrant = readReferenceGrant(referenceGrantName, toNamespace);
        if (v1beta1ReferenceGrant == null) {
            v1beta1ReferenceGrant = new V1beta1ReferenceGrant();
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(referenceGrantName);
            metadata.setNamespace(toNamespace);
            v1beta1ReferenceGrant.setMetadata(metadata);
            V1beta1ReferenceGrantSpec spec = new V1beta1ReferenceGrantSpec();
            V1beta1ReferenceGrantSpecFrom from = new V1beta1ReferenceGrantSpecFrom();
            from.setNamespace(fromNamespace);
            from.setKind(V1HTTPRoute.KIND);
            from.setGroup(V1HTTPRoute.API_GROUP);
            spec.getFrom().add(from);
            V1beta1ReferenceGrantSpecTo to = new V1beta1ReferenceGrantSpecTo();
            to.setKind("Service");
            to.setGroup("");
            spec.getTo().add(to);
            v1beta1ReferenceGrant.setSpec(spec);
            return createReferenceGrant(v1beta1ReferenceGrant);
        } else {
            List<V1beta1ReferenceGrantSpecFrom> froms = v1beta1ReferenceGrant.getSpec().getFrom();
            for (V1beta1ReferenceGrantSpecFrom from : froms) {
                if (fromNamespace.equals(from.getNamespace())) {
                    return v1beta1ReferenceGrant;
                }
            }
            V1beta1ReferenceGrantSpecFrom from = new V1beta1ReferenceGrantSpecFrom();
            from.setNamespace(fromNamespace);
            from.setKind(V1HTTPRoute.KIND);
            from.setGroup(V1HTTPRoute.API_GROUP);
            froms.add(from);
            return replaceReferenceGrant(v1beta1ReferenceGrant);
        }
    }
    public V1beta1ReferenceGrant readReferenceGrant(String name, String nameSpace) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(V1beta1ReferenceGrant.API_GROUP, V1beta1ReferenceGrant.VERSION,
                    nameSpace, V1beta1ReferenceGrant.PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1beta1ReferenceGrant.class);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            throw e;
        }
    }
    public V1beta1ReferenceGrant createReferenceGrant(V1beta1ReferenceGrant referenceGrant) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        String namespace = controllerNamespace;
        if (referenceGrant.getMetadata()!=null && referenceGrant.getMetadata().getNamespace() != null) {
            namespace = referenceGrant.getMetadata().getNamespace();
        }
        Object response = customObjectsApi.createNamespacedCustomObject(V1beta1ReferenceGrant.API_GROUP, V1beta1ReferenceGrant.VERSION,
                namespace, V1beta1ReferenceGrant.PLURAL, referenceGrant, null, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1beta1ReferenceGrant.class);
    }

    public V1beta1ReferenceGrant replaceReferenceGrant(V1beta1ReferenceGrant referenceGrant) throws ApiException{
        V1ObjectMeta metadata = referenceGrant.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("gateway doesn't have a valid metadata.");
        }
        String namespace = controllerNamespace;
        if (metadata.getNamespace() != null) {
            namespace = referenceGrant.getMetadata().getNamespace();
        }
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.replaceNamespacedCustomObject(V1beta1ReferenceGrant.API_GROUP, V1beta1ReferenceGrant.VERSION,
                namespace, V1beta1ReferenceGrant.PLURAL, metadata.getName(), referenceGrant, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1beta1ReferenceGrant.class);
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
