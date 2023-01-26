package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpointShard;
import com.alibaba.higress.console.controller.dto.istio.RegistryzService;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
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
import java.util.List;
import java.util.Map;

@Slf4j
@org.springframework.stereotype.Service
public class KubernetesClientService {

    private static final String POD_SERVICE_ACCOUNT_TOKEN_FILE_PATH = "/var/run/secrets/kubernetes.io";
    private static final String ISTIO_SERVICE_ACCOUNT_TOKEN_FILE_PATH = "/var/run/secrets/access-token/token";
    private static final String INGRESS_GROUP = "networking.k8s.io";
    private static final String INGRESS_VERSION = "v1";
    private static final String INGRESS_PLURAL = "ingresses";

    private ApiClient client;

    private final OkHttpClient okHttpClient = new OkHttpClient();

    @Value("${deploy.inCluster:}")
    private Boolean inCluster;

    @Value("${istio.serviceName:" + CommonKey.HIGRESS_ISTIOD_DEFAULT + "}")
    private String istioServiceName;

    @Value("${istio.namespace:" + CommonKey.HIGRESS_ISTIOD_NS_DEFAULT + "}")
    private String istioNamespace;

    @Value("${istio.serviceHost:localhost}")
    private String istioServiceHost;

    @Value("${istio.servicePort:15014}")
    private int istioServicePort;

    @Value("${istio.accessToken:}")
    private String istioAccessToken;

    @PostConstruct
    public void init() throws IOException {
        if (checkInCluster()) {
            client = ClientBuilder.cluster().build();
            log.info("init KubernetesClientService InCluster");
        } else {
            String kubeConfigPath = CommonKey.HIGRESS_KUBE_CONFIG_DEFAULT_PATH;
            client =
                    ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();
            log.info("init KubernetesClientService LoadKubeConfig");
        }
    }

    public boolean checkHigress() throws ApiException {

        CoreV1Api api = new CoreV1Api(client);
        V1NamespaceList list = api.listNamespace(null, null, null, null, null, null, null, null, null, null);
        for (V1Namespace item : list.getItems()) {
            if (item.getMetadata() != null && CommonKey.HIGRESS_NS_DEFAULT.equals(item.getMetadata().getName())) {
                return true;
            }
        }
        return false;
    }

    public String checkIstioService() {

//        try {
//            Configuration.setDefaultApiClient(client);
//            CoreV1Api api = new CoreV1Api();
//            V1ServiceList list = api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
//            for (V1Service item : list.getItems()) {
//                if(CommonKey.HIGRESS_ISTIOD_DEFAULT.equals(item.getMetadata().getName())) {
//                    log.info("Get ISTIOD name {}, namespace {}", item.getMetadata().getName(), item.getMetadata().getNamespace());
//                    return item.getMetadata().getName() + "." + item.getMetadata().getNamespace();
//                }
//            }
//        } catch (Exception e) {
//            log.error("CheckIstioService fail use default ", e);
//        }
        return inCluster ? istioServiceName + "." + istioNamespace : istioServiceHost;
    }

    public List<RegistryzService> gatewayServiceList() throws ApiException, IOException {

        Request request = buildIstioRequest("/debug/registryz");
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

        Request request = buildIstioRequest("/debug/endpointShardz");
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

    /**
     * use <a href="https://github.com/kubernetes-client/java/blob/master/kubernetes/docs/CustomObjectsApi.md">CustomObjectsApi</a>
     */
    public Object getIngress(String name) {

        CustomObjectsApi apiInstance = new CustomObjectsApi(client);
        try {
            Object result = apiInstance.getClusterCustomObject(INGRESS_GROUP, INGRESS_VERSION, INGRESS_PLURAL, name);
            //TODO
            return result;

        } catch (ApiException e) {
            log.error("getIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    public Object listIngress() {

        CustomObjectsApi apiInstance = new CustomObjectsApi(client);
        try {
            Object result = apiInstance.listClusterCustomObject(INGRESS_GROUP, INGRESS_VERSION, INGRESS_PLURAL,
                    null, null, null, null, null, null, null, null, null, null);
            //TODO
            return result;
        } catch (ApiException e) {
            log.error("listIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }

    private Request buildIstioRequest(String path) throws IOException {

        String istioServiceUrl = checkIstioService();
        String url = "http://" + istioServiceUrl + ":" + istioServicePort + path;
        Request.Builder builder = new Request.Builder().url(url);
        String token = checkInCluster() ? readTokenFromFile() : getTokenFromConfiguration();
        if (!Strings.isNullOrEmpty(token)) {
            builder.addHeader(HttpHeaders.AUTHORIZATION, "Bear " + token);
        }
        return builder.build();
    }

    private String readTokenFromFile() throws IOException {

        return FileUtils.readFileToString(new File(ISTIO_SERVICE_ACCOUNT_TOKEN_FILE_PATH), Charset.defaultCharset());
    }

    private String getTokenFromConfiguration() {

        return istioAccessToken;
    }

}
