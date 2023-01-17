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
import io.kubernetes.client.openapi.apis.CustomObjectsApi;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
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
import java.util.List;
import java.util.Map;

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
        if(inCluster == null) {
            return false;
        }
        return inCluster;
    }
    
    /**
     * use CustomObjectsApi
     * https://github.com/kubernetes-client/java/blob/master/kubernetes/docs/CustomObjectsApi.md
     */
    public Object getIngress(String name) {
        ApiClient defaultClient = client;
        CustomObjectsApi apiInstance = new CustomObjectsApi(defaultClient);
        String group = "networking.k8s.io"; // String | the custom resource's group
        String version = "v1"; // String | the custom resource's version
        String plural = "ingresses"; // String | the custom resource's plural name. For TPRs this would be lowercase plural kind.
        try {
            Object result = apiInstance.getClusterCustomObject(group, version, plural, name);
            //TODO
            return result;
            
        } catch (ApiException e) {
            log.error("getIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }
    
    public Object listIngress() {
        ApiClient defaultClient = client;
        CustomObjectsApi apiInstance = new CustomObjectsApi(defaultClient);
        String group = "networking.k8s.io"; // String | the custom resource's group
        String version = "v1"; // String | the custom resource's version
        String plural = "ingresses"; // String | the custom resource's plural name. For TPRs this would be lowercase plural kind.
        try {
            Object result = apiInstance.listClusterCustomObject(group, version, plural,
                    null, null, null, null, null,null, null, null, null, null);
            //TODO
            return result;
        
        } catch (ApiException e) {
            log.error("listIngress Status code: " + e.getCode()
                    + "Reason: " + e.getResponseBody() + "Response headers: " + e.getResponseHeaders(), e);
            return null;
        }
    }
    
}
