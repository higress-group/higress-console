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
package com.alibaba.higress.console.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;

public class WasmPluginServiceTest {

    private WasmPluginServiceImpl service;

    @BeforeEach
    public void setUp() throws Exception {
        service = new WasmPluginServiceImpl();
        KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
        when(kubernetesClientService.listWasmPlugin()).thenReturn(Collections.emptyList());
        service.setKubernetesClientService(kubernetesClientService);
        service.initialize();
    }

    @AfterEach
    public void tearDown() {
        service = null;
    }

    @Test
    public void listPlugins() {
        PaginatedResult<WasmPlugin> plugins = service.list(null);
        System.out.println(plugins.getTotal());
        Assertions.assertTrue(plugins.getTotal() > 0);
    }
}
