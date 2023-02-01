package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.controller.dto.istio.IstioEndpointShard;
import com.alibaba.higress.console.controller.dto.istio.RegistryzService;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ConfigMapList;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1Status;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Slf4j
@org.springframework.stereotype.Service
public class KubernetesClientService {
    private ApiClient client;
    
    public OkHttpClient okHttpClient = new OkHttpClient();
    
    @Value("${deploy.inCluster}")
    private Boolean inCluster;
    
    @PostConstruct
    public void init() throws IOException {
        
        if(checkInCluster()) {
            client = ClientBuilder.cluster().build();
            log.info("init KubernetesClientService InCluster");
        }else {
            String kubeConfigPath = CommonKey.HIGRESS_KUBE_CONFIG_DEFAULT_PATH;
            client =
                    ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();
            log.info("init KubernetesClientService LoadKubeConfig");
        }
    }
    public boolean checkHigress() throws ApiException, IOException{
        Configuration.setDefaultApiClient(client);
        CoreV1Api api = new CoreV1Api();
        V1NamespaceList list = api.listNamespace(null, null, null, null, null, null, null, null, null, null);
        for (V1Namespace item : list.getItems()) {
            if(CommonKey.HIGRESS_NS_DEFAULT.equals(item.getMetadata().getName())) {
                return true;
            }
        }
        return false;
    }
    
    public String checkIstioService() {
        String istioUrl = "http://" + CommonKey.HIGRESS_ISTIOD_DEFAULT + "." + CommonKey.HIGRESS_ISTIOD_NS_DEFAULT;
        try {
//            Configuration.setDefaultApiClient(client);
//            CoreV1Api api = new CoreV1Api();
//            V1ServiceList list = api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
//            for (V1Service item : list.getItems()) {
//                if(CommonKey.HIGRESS_ISTIOD_DEFAULT.equals(item.getMetadata().getName())) {
//                    log.info("Get ISTIOD name {}, namespace {}", item.getMetadata().getName(), item.getMetadata().getNamespace());
//                    return "http://" + item.getMetadata().getName() + "." + item.getMetadata().getNamespace();
//                }
//            }
            return istioUrl;
        }catch (Exception e) {
            log.error("CheckIstioService fail use default ", e);
            return istioUrl;
        }
    }
    
    public List<RegistryzService>  gatewayServiceList() throws ApiException, IOException{
        
        String resUrl = this.checkIstioService() + ":15014/debug/registryz";
        
        log.info("gatewayServiceList url {}", resUrl);
        
        String token = "Bearer " + FileUtils.readFileToString(new File("/var/run/secrets/access-token/token"), Charset.defaultCharset());
        Request request = new Request.Builder()
                .get()
                .addHeader("Authorization", token)
                .url(resUrl)
                .build();
        Response response;
        try {
            response = okHttpClient.newCall(request).execute();
            if(response.body() != null) {
                String responseString = new String(response.body().bytes());
                if(StringUtils.isNotEmpty(responseString)) {
                    return JSON.parseArray(responseString, RegistryzService.class);
                }
            }
        } catch (Exception e) {
            log.error("gatewayServiceList okHttpClient.newCall ", e);
        }
        return null;
    }
    
    public Map<String, Map<String, IstioEndpointShard>> gatewayServiceEndpoint() throws ApiException, IOException{
        
        String resUrl = this.checkIstioService() + ":15014/debug/endpointShardz";
    
        log.info("gatewayServiceEndpoint url {}", resUrl);
    
        String token = "Bearer " + FileUtils.readFileToString(new File("/var/run/secrets/access-token/token"), Charset.defaultCharset());

        Request request = new Request.Builder()
                .get()
                .addHeader("Authorization", token)
                .url(resUrl)
                .build();
        Response response;
        try {
            response = okHttpClient.newCall(request).execute();
            String responseString = new String(response.body().bytes());
            if (StringUtils.isNotEmpty(responseString)) {
                return JSON.parseObject(responseString, new TypeReference<Map<String, Map<String, IstioEndpointShard>>>() {});
            }
        } catch (Exception e) {
            log.error("gatewayServiceEndpoint okHttpClient.newCall ", e);
        }
        return null;
    }
    
    public boolean checkInCluster() {
        return inCluster;
    }
    
    public void inClusterListPod() throws ApiException, IOException {
        // loading the in-cluster config, including:
        //   1. service-account CA
        //   2. service-account bearer-token
        //   3. service-account namespace
        //   4. master endpoints(ip, port) from pre-set environment variables
        ApiClient client = ClientBuilder.cluster().build();
    
        // if you prefer not to refresh service account token, please use:
        // ApiClient client = ClientBuilder.oldCluster().build();
    
        // set the global default api-client to the in-cluster one from above
        Configuration.setDefaultApiClient(client);
    
        // the CoreV1Api loads default api-client from global configuration.
        CoreV1Api api = new CoreV1Api();
    
        // invokes the CoreV1Api client
        V1PodList list =
                api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
        for (V1Pod item : list.getItems()) {
            System.out.println(item.getMetadata().getName());
        }
    }
    
    public void kubeConfigFileListPod() throws ApiException, IOException {
    
        // file path to your KubeConfig
    
//        String kubeConfigPath = System.getenv("HOME") + "/.kube/config";
        String kubeConfigPath = CommonKey.HIGRESS_KUBE_CONFIG_DEFAULT_PATH;
        
        // loading the out-of-cluster config, a kubeconfig from file-system
        ApiClient client =
                ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();
    
        // set the global default api-client to the in-cluster one from above
        Configuration.setDefaultApiClient(client);
    
        // the CoreV1Api loads default api-client from global configuration.
        CoreV1Api api = new CoreV1Api();
    
        // invokes the CoreV1Api client
        V1PodList list =
                api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null, null);
        for (V1Pod item : list.getItems()) {
            System.out.println(item.getMetadata().getName());
        }
    }

    public List<V1ConfigMap> kubeConfigFileListConfigMap(String namespace) throws ApiException,
                                                                           IOException {
        Function<CoreV1Api, List<V1ConfigMap>> call = new Function<CoreV1Api, List<V1ConfigMap>>() {
            @SneakyThrows
            @Override
            public List<V1ConfigMap> apply(CoreV1Api coreV1Api) {
                V1ConfigMapList list = coreV1Api.listNamespacedConfigMap(namespace, null, null,
                    null, null, null, null, null, null, null, null);
                return Optional.ofNullable(list.getItems()).orElse(new ArrayList<>());
            }
        };

        return this.executeKubeConfigCall(call);
    }

    public V1ConfigMap kubeConfigFileCreateConfigMap(String namespace,
                                                     V1ConfigMap configMap) throws ApiException,
                                                                            IOException {
        Function<CoreV1Api, V1ConfigMap> call = new Function<CoreV1Api, V1ConfigMap>() {
            @SneakyThrows
            @Override
            public V1ConfigMap apply(CoreV1Api coreV1Api) {
                return coreV1Api.createNamespacedConfigMap(namespace, configMap, null, null, null,
                    null);
            }
        };

        return this.executeKubeConfigCall(call);
    }

    public V1ConfigMap kubeConfigFileReadConfigMap(String namespace,
                                                   String name) throws ApiException, IOException {
        Function<CoreV1Api, V1ConfigMap> call = new Function<CoreV1Api, V1ConfigMap>() {
            @SneakyThrows
            @Override
            public V1ConfigMap apply(CoreV1Api coreV1Api) {
                return coreV1Api.readNamespacedConfigMap(name, namespace, null);
            }
        };

        return this.executeKubeConfigCall(call);
    }

    public V1Status kubeConfigFileDeleteConfigMap(String namespace,
                                                  String name) throws ApiException, IOException {
        Function<CoreV1Api, V1Status> call = new Function<CoreV1Api, V1Status>() {
            @SneakyThrows
            @Override
            public V1Status apply(CoreV1Api coreV1Api) {
                return coreV1Api.deleteNamespacedConfigMap(name, namespace, null, null, null, null,
                    null, null);
            }
        };

        return this.executeKubeConfigCall(call);
    }

    public V1ConfigMap kubeConfigFilePutConfigMap(String namespace,
                                                  String name,
                                               V1ConfigMap configMap) throws ApiException, IOException {
        Function<CoreV1Api, V1ConfigMap> call = new Function<CoreV1Api, V1ConfigMap>() {
            @SneakyThrows
            @Override
            public V1ConfigMap apply(CoreV1Api coreV1Api) {
                return coreV1Api.replaceNamespacedConfigMap(name, namespace, configMap, null, null, null,
                    null);
            }
        };

        return this.executeKubeConfigCall(call);
    }

    private <T> T executeKubeConfigCall(Function<CoreV1Api, T> call) throws ApiException,
                                                                     IOException {

        // file path to your KubeConfig

        //String kubeConfigPath = System.getenv("HOME") + "/.kube/config";
        String kubeConfigPath = CommonKey.HIGRESS_KUBE_CONFIG_DEFAULT_PATH;

        // loading the out-of-cluster config, a kubeconfig from file-system
        ApiClient client = ClientBuilder
            .kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

        // set the global default api-client to the in-cluster one from above
        Configuration.setDefaultApiClient(client);

        // the CoreV1Api loads default api-client from global configuration.
        CoreV1Api api = new CoreV1Api();

        return call.apply(api);
    }

}
