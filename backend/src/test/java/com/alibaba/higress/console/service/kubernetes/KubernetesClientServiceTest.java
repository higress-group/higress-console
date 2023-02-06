/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
