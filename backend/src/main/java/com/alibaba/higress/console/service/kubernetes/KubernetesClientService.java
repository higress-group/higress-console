package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpointShard;
import com.alibaba.higress.console.controller.dto.istio.RegistryzService;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.NetworkingV1Api;
import io.kubernetes.client.openapi.models.V1Ingress;
import io.kubernetes.client.openapi.models.V1IngressList;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import io.kubernetes.client.util.Strings;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@org.springframework.stereotype.Service
public class KubernetesClientService {

    private static final String POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH = "/var/run/secrets/kubernetes.io";
    private static final String CONTROLLER_ACCESS_TOKEN_FILE_PATH = "/var/run/secrets/access-token/token";

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
            String kubeConfigPath = !Strings.isNullOrEmpty(kubeConfig) ? kubeConfig : CommonKey.KUBE_CONFIG_DEFAULT_PATH;
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
//        try {
//            Configuration.setDefaultApiClient(client);
//            CoreV1Api api = new CoreV1Api();
//            V1ServiceList list = api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
//            for (V1Service item : list.getItems()) {
//                if (controllerServiceName.equals(item.getMetadata().getName())) {
//                    log.info("Get Higress Controller name {}, namespace {}", item.getMetadata().getName(), item.getMetadata().getNamespace());
//                    return item.getMetadata().getName() + "." + item.getMetadata().getNamespace();
//                }
//            }
//        } catch (Exception e) {
//            log.error("checkControllerService fail use default ", e);
//        }
        return inCluster ? controllerServiceName + "." + controllerNamespace : controllerServiceHost;
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
                    return JSON.parseObject(responseString, new TypeReference<>() {
                    });
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
            V1IngressList list = apiInstance.listNamespacedIngress(controllerNamespace,
                    null, null, null, null, null, null, null, null, null, null);
            if (list == null) {
                return Collections.emptyList();
            }
            return list.getItems();
        } catch (ApiException e) {
            log.error("listIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1Ingress getIngress(String name) {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        try {
            return apiInstance.readNamespacedIngress(name, controllerNamespace, null);
        } catch (ApiException e) {
            log.error("getIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public V1Ingress addIngress(V1Ingress ingress) throws ApiException {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        return apiInstance.createNamespacedIngress(controllerNamespace, ingress, null, null, null, null);
    }

    public V1Ingress updateIngress(V1Ingress ingress) throws ApiException {
        V1ObjectMeta metadata = ingress.getMetadata();
        if (metadata == null) {
            throw new IllegalArgumentException("ingress doesn't have a valid metadata.");
        }
        metadata.setNamespace(controllerNamespace);
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        return apiInstance.replaceNamespacedIngress(metadata.getName(), metadata.getNamespace(), ingress, null, null, null, null);
    }

    public void deleteIngress(String name) throws ApiException {
        NetworkingV1Api apiInstance = new NetworkingV1Api(client);
        apiInstance.deleteNamespacedIngress(name, controllerNamespace, null, null, null, null, null, null);
    }

    private Request buildControllerRequest(String path) throws IOException {
        String istioServiceUrl = checkControllerService();
        String url = "http://" + istioServiceUrl + ":" + controllerServicePort + path;
        Request.Builder builder = new Request.Builder().url(url);
        String token = checkInCluster() ? readTokenFromFile() : getTokenFromConfiguration();
        if (!Strings.isNullOrEmpty(token)) {
            builder.addHeader(HttpHeaders.AUTHORIZATION, "Bear " + token);
        }
        return builder.build();
    }

    private String readTokenFromFile() throws IOException {
        return FileUtils.readFileToString(new File(CONTROLLER_ACCESS_TOKEN_FILE_PATH), Charset.defaultCharset());
    }

    private String getTokenFromConfiguration() {
        return controllerAccessToken;
    }
}
