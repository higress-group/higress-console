package com.alibaba.higress.console.service.kubernetes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import io.kubernetes.client.openapi.models.V1Ingress;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;

public class KubernetesClientServiceTest {

    @Test
    public void checkControllerService() throws IOException {
        KubernetesClientService kubernetesClientService = new KubernetesClientService();
        kubernetesClientService.init();
        System.out.println(kubernetesClientService.checkControllerService());
    }

    @Test
    public void ingressTest() throws IOException {
        KubernetesClientService kubernetesClientService = new KubernetesClientService();
        kubernetesClientService.init();
        List<V1Ingress> result = kubernetesClientService.listIngress();

        System.out.println(JSON.toJSONString(result, SerializerFeature.PrettyFormat));
    }

}
