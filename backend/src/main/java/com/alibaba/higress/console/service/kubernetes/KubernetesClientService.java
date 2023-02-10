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

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import javax.annotation.PostConstruct;

import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridgeList;
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.constant.KubernetesConstants.Label;
import com.alibaba.higress.console.service.kubernetes.dto.IstioEndpointShard;
import com.alibaba.higress.console.service.kubernetes.dto.RegistryzService;
import com.alibaba.higress.console.util.KubernetesUtil;

import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.NetworkingV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ConfigMapList;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressList;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Status;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import io.kubernetes.client.util.Strings;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Slf4j
@org.springframework.stereotype.Service
public class KubernetesClientService {

    private static final String POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH = "/var/run/secrets/kubernetes.io";
    private static final String CONTROLLER_ACCESS_TOKEN_FILE_PATH = "/var/run/secrets/access-token/token";
    private static final String DEFAULT_LABEL_SELECTORS =
        KubernetesConstants.Label.RESOURCE_DEFINER_KEY + CommonKey.EQUALS_SIGN + Label.RESOURCE_DEFINER_VALUE;

    private ApiClient client;

    private final OkHttpClient okHttpClient = new OkHttpClient();

    @Value("${deploy.inCluster:}")
    private Boolean inCluster;

    @Value("${" + CommonKey.KUBE_CONFIG_KEY + ":}")
    private String kubeConfig;

    @Value("${" + CommonKey.CONTROLLER_SERVICE_NAME_KEY + ":" + CommonKey.CONTROLLER_SERVICE_NAME_DEFAULT + "}")
    private String controllerServiceName = CommonKey.CONTROLLER_SERVICE_NAME_DEFAULT;

    @Value("${" + CommonKey.NS_KEY + ":" + CommonKey.NS_DEFAULT + "}")
    private String controllerNamespace = CommonKey.NS_DEFAULT;

    @Value("#{'${" + CommonKey.PROTECTED_NSES_KEY + ":" + CommonKey.PROTECTED_NSES + "}'.split('"
        + CommonKey.LIST_CONFIG_SEPARATOR + "')}")
    private Set<String> protectedNses =
        new HashSet<>(Arrays.asList(CommonKey.PROTECTED_NSES.split(CommonKey.LIST_CONFIG_SEPARATOR)));

    @Value("${" + CommonKey.CONTROLLER_INGRESS_CLASS_NAME_KEY + ":" + CommonKey.CONTROLLER_INGRESS_CLASS_NAME_DEFAULT
        + "}")
    private String controllerIngressClassName = CommonKey.CONTROLLER_INGRESS_CLASS_NAME_DEFAULT;

    @Value("${" + CommonKey.CONTROLLER_SERVICE_HOST_KEY + ":" + CommonKey.CONTROLLER_SERVICE_HOST_DEFAULT + "}")
    private String controllerServiceHost = CommonKey.CONTROLLER_SERVICE_HOST_DEFAULT;

    @Value("${" + CommonKey.CONTROLLER_SERVICE_PORT_KEY + ":" + CommonKey.CONTROLLER_SERVICE_PORT_DEFAULT + "}")
    private int controllerServicePort = CommonKey.CONTROLLER_SERVICE_PORT_DEFAULT;

    @Value("${" + CommonKey.CONTROLLER_ACCESS_TOKEN_KEY + ":}")
    private String controllerAccessToken;

    @PostConstruct
    public void init() throws IOException {
        if (checkInCluster()) {
            client = ClientBuilder.cluster().build();
            log.info("init KubernetesClientService InCluster");
        } else {
            String kubeConfigPath =
                !Strings.isNullOrEmpty(kubeConfig) ? kubeConfig : CommonKey.KUBE_CONFIG_DEFAULT_PATH;
            try (FileReader reader = new FileReader(kubeConfigPath)) {
                client = ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(reader)).build();
            }
            log.info("init KubernetesClientService LoadKubeConfig");
        }
    }

    public boolean checkHigress() throws ApiException {
        CoreV1Api api = new CoreV1Api(client);
        V1NamespaceList list = api.listNamespace(null, null, null, null, null, null, null, null, null, null);
        for (V1Namespace item : list.getItems()) {
            if (item.getMetadata() != null && CommonKey.NS_DEFAULT.equals(item.getMetadata().getName())) {
                return true;
            }
        }
        return false;
    }

    public String checkControllerService() {
        // try {
        // Configuration.setDefaultApiClient(client);
        // CoreV1Api api = new CoreV1Api();
        // V1ServiceList list = api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null,
        // null);
        // for (V1Service item : list.getItems()) {
        // if (controllerServiceName.equals(item.getMetadata().getName())) {
        // log.info("Get Higress Controller name {}, namespace {}", item.getMetadata().getName(),
        // item.getMetadata().getNamespace());
        // return item.getMetadata().getName() + "." + item.getMetadata().getNamespace();
        // }
        // }
        // } catch (Exception e) {
        // log.error("checkControllerService fail use default ", e);
        // }
        return inCluster ? controllerServiceName + "." + controllerNamespace : controllerServiceHost;
    }

    public boolean isNamespaceProtected(String namespace) {
        return controllerNamespace.equals(namespace) || protectedNses.contains(namespace);
    }

    public List<RegistryzService> gatewayServiceList() throws ApiException, IOException {
        Request request = buildControllerRequest("/debug/registryz");
        log.info("gatewayServiceList url {}", request.url());
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (response.body() != null) {
                String responseString = new String(response.body().bytes());
                if (StringUtils.isNotEmpty(responseString)) {
                    return JSON.parseArray(responseString, RegistryzService.class);
                }
            }
        } catch (Exception e) {
            log.error("gatewayServiceList okHttpClient.newCall ", e);
        }
        return null;
    }

    public Map<String, Map<String, IstioEndpointShard>> gatewayServiceEndpoint() throws ApiException, IOException {
        Request request = buildControllerRequest("/debug/endpointShardz");
        log.info("gatewayServiceEndpoint url {}", request.url());
        try (Response response = okHttpClient.newCall(request).execute()) {
            if (response.body() != null) {
                String responseString = new String(response.body().bytes());
                if (StringUtils.isNotEmpty(responseString)) {
                    return JSON.parseObject(responseString, new TypeReference<>() {});
                }
            }
        } catch (Exception e) {
            log.error("gatewayServiceEndpoint okHttpClient.newCall ", e);
        }
        return null;
    }

    public boolean checkInCluster() {
        if (inCluster == null) {
            inCluster = new File(POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH).exists();
        }
        return inCluster;
    }

    public List<V1Ingress> listIngress() {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        try {
            V1IngressList list = apiInstance.listNamespacedIngress(controllerNamespace, null, null, null, null,
                DEFAULT_LABEL_SELECTORS, null, null, null, null, null);
            if (list == null) {
                return Collections.emptyList();
            }
            return list.getItems();
        } catch (ApiException e) {
            log.error("listIngress Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1Ingress readIngress(String name) {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        try {
            return apiInstance.readNamespacedIngress(name, controllerNamespace, null);
        } catch (ApiException e) {
            log.error("getIngress Status code: " + e.getCode() + "Reason: " + e.getResponseBody() + "Response headers: "
                + e.getResponseHeaders(), e);
            return null;
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
            if (ae.getCode() == HttpStatus.NOT_FOUND.value()) {
                // The Ingress to be deleted is already gone or never existed.
                return;
            }
            throw ae;
        }
        checkResponseStatus(status);
    }

    public List<V1ConfigMap> listConfigMap() throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        V1ConfigMapList list = coreV1Api.listNamespacedConfigMap(controllerNamespace, null, null, null, null,
            DEFAULT_LABEL_SELECTORS, null, null, null, null, null);
        return Optional.ofNullable(list.getItems()).orElse(new ArrayList<>());
    }

    public V1ConfigMap createConfigMap(V1ConfigMap configMap) throws ApiException {
        renderDefaultLabels(configMap);
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.createNamespacedConfigMap(controllerNamespace, configMap, null, null, null, null);
    }

    public V1ConfigMap readConfigMap(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        return coreV1Api.readNamespacedConfigMap(name, controllerNamespace, null);
    }

    public void deleteConfigMap(String name) throws ApiException {
        CoreV1Api coreV1Api = new CoreV1Api(client);
        V1Status status;
        try {
            status = coreV1Api.deleteNamespacedConfigMap(name, controllerNamespace, null, null, null, null, null, null);
        } catch (ApiException ae) {
            if (ae.getCode() == HttpStatus.NOT_FOUND.value()) {
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

    private void checkResponseStatus(V1Status status) {
        // TODO: Throw exception accordingly.
    }

    private Request buildControllerRequest(String path) throws IOException {
        String serviceUrl = checkControllerService();
        String url = "http://" + serviceUrl + ":" + controllerServicePort + path;
        Request.Builder builder = new Request.Builder().url(url);
        String token = checkInCluster() ? readTokenFromFile() : getTokenFromConfiguration();
        if (!Strings.isNullOrEmpty(token)) {
            builder.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        }
        return builder.build();
    }

    private String readTokenFromFile() throws IOException {
        return FileUtils.readFileToString(new File(CONTROLLER_ACCESS_TOKEN_FILE_PATH), Charset.defaultCharset());
    }

    private String getTokenFromConfiguration() {
        return controllerAccessToken;
    }

    private void renderDefaultLabels(KubernetesObject object) {
        KubernetesUtil.setLabel(object, Label.RESOURCE_DEFINER_KEY, Label.RESOURCE_DEFINER_VALUE);
    }

    public List<V1McpBridge> listV1McpBridge() {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.listNamespacedCustomObject(KubernetesConstants.MCP_BRIDGE_API_GROUP,
                V1McpBridge.DEFAULT_VERSION, controllerNamespace, V1McpBridge.MCP_BRIDGE_PLURAL,
                KubernetesConstants.PRETTY, null, null, null, null, null, null, null, null, null);
            io.kubernetes.client.openapi.JSON json = new io.kubernetes.client.openapi.JSON();
            V1McpBridgeList list = json.deserialize(json.serialize(response), V1McpBridgeList.class);
            return list.getItems();
        } catch (ApiException e) {
            log.error("listMcpBridge Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1McpBridge addV1McpBridge(V1McpBridge v1McpBridge) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.createNamespacedCustomObject(KubernetesConstants.MCP_BRIDGE_API_GROUP,
            V1McpBridge.DEFAULT_VERSION, controllerNamespace, V1McpBridge.MCP_BRIDGE_PLURAL, v1McpBridge,
            KubernetesConstants.PRETTY, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
    }

    public V1McpBridge updateV1McpBridge(V1McpBridge v1McpBridge) throws ApiException {
        V1ObjectMeta metadata = v1McpBridge.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("mcpBridge doesn't have a valid metadata.");
        }
        metadata.setNamespace(controllerNamespace);
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        Object response = customObjectsApi.replaceNamespacedCustomObject(KubernetesConstants.MCP_BRIDGE_API_GROUP,
            V1McpBridge.DEFAULT_VERSION, controllerNamespace, V1McpBridge.MCP_BRIDGE_PLURAL, metadata.getName(),
            v1McpBridge, null, null);
        return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
    }

    public void deleteV1McpBridge(String name) throws ApiException {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        customObjectsApi.deleteNamespacedCustomObject(KubernetesConstants.MCP_BRIDGE_API_GROUP,
            V1McpBridge.DEFAULT_VERSION, controllerNamespace, V1McpBridge.MCP_BRIDGE_PLURAL, name, null, null, null,
            null, null);
    }

    public V1McpBridge getV1McpBridge(String name) {
        CustomObjectsApi customObjectsApi = new CustomObjectsApi(client);
        try {
            Object response = customObjectsApi.getNamespacedCustomObject(KubernetesConstants.MCP_BRIDGE_API_GROUP,
                V1McpBridge.DEFAULT_VERSION, controllerNamespace, V1McpBridge.MCP_BRIDGE_PLURAL, name);
            return client.getJSON().deserialize(client.getJSON().serialize(response), V1McpBridge.class);
        } catch (ApiException e) {
            log.error("getMcpBridge Status code: " + e.getCode() + "Reason: " + e.getResponseBody()
                + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }
}
