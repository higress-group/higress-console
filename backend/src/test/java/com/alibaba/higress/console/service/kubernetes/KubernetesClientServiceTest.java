package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.fastjson.JSON;
import io.kubernetes.client.openapi.ApiException;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class KubernetesClientServiceTest {
    
    @Test
    public void checkIstioService() throws IOException, ApiException {
        KubernetesClientService kubernetesClientService = new KubernetesClientService();
        kubernetesClientService.init();
        System.out.println(kubernetesClientService.checkIstioService());
    }
    
    @Test
    public void ingressTest() throws IOException {
        KubernetesClientService kubernetesClientService = new KubernetesClientService();
        kubernetesClientService.init();
        Object result = kubernetesClientService.listIngress();
        
        System.out.println(JSON.toJSONString(result));
    }
    
}
