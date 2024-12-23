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
package com.alibaba.higress.sdk.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.InputStream;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;

public class WasmPluginServiceTest {

    private static final String TEST_BUILT_IN_PLUGIN_NAME = "basic-auth";
    private static final String DEFAULT_VERSION = "1.0.0";
    private static final String TEST_BUILT_IN_PLUGIN_USER_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + Separators.DASH + DEFAULT_VERSION;
    private static final String TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;
    private WasmPluginServiceImpl service;

    @BeforeEach
    public void setUp() {
        kubernetesClientService = mock(KubernetesClientService.class);
        kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);
        service = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter);
        service.initialize();
    }

    @AfterEach
    public void tearDown() {
        service = null;
        kubernetesModelConverter = null;
        kubernetesClientService = null;
    }

    @Test
    public void listPluginsTest() throws Exception {
        PaginatedResult<WasmPlugin> plugins = service.list(null);
        when(kubernetesClientService.listWasmPlugin()).thenReturn(Collections.emptyList());
        System.out.println(plugins.getTotal());

        Properties properties = new Properties();
        try (InputStream stream =
            getClass().getClassLoader().getResourceAsStream("plugins/plugins.properties")) {
            properties.load(stream);
        }
        Assertions.assertEquals(properties.size(), plugins.getTotal());
        Assertions.assertEquals(properties.size(), plugins.getData().size());
        Set<String> pluginNames = new HashSet<>(properties.stringPropertyNames());
        plugins.getData().forEach(p -> pluginNames.remove(p.getName()));
        Assertions.assertEquals(0, pluginNames.size(), "Missing built-in plugins: " + pluginNames);
    }

    @Test
    public void updateBuiltInTestNotConfigured() throws Exception {
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean())).thenReturn(Collections.emptyList());
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newVersion = "1.0.1";
        WasmPlugin updatedPlugin = service.updateBuiltIn(TEST_BUILT_IN_PLUGIN_NAME,newVersion);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME,cr.getMetadata().getName());
        Assertions.assertTrue(cr.getSpec().getUrl().endsWith(":" + newVersion));
        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
    }

    @Test
    public void updateBuiltInTestUserConfigured() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(Map.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(Map.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(Map.of("ki", "vi")).build());

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(List.of(existedCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newVersion = "1.0.1";
        WasmPlugin updatedPlugin = service.updateBuiltIn(TEST_BUILT_IN_PLUGIN_NAME, newVersion);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertTrue(cr.getSpec().getUrl().endsWith(":" + newVersion));
        Assertions.assertEquals(cr.getSpec().getDefaultConfig(), existedCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(cr.getSpec().getDefaultConfigDisable(), existedCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(cr.getSpec().getMatchRules(), existedCr.getSpec().getMatchRules());
    }

    @Test
    public void updateBuiltInTestInternalConfigured() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(Map.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(Map.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(Map.of("ki", "vi")).build());

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(List.of(existedCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newVersion = "1.0.1";
        WasmPlugin updatedPlugin = service.updateBuiltIn(TEST_BUILT_IN_PLUGIN_NAME, newVersion);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        ArgumentCaptor<V1alpha1WasmPlugin> newCrCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(newCrCaptor.capture());
        V1alpha1WasmPlugin newCr = newCrCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, newCr.getMetadata().getName());
        Assertions.assertTrue(newCr.getSpec().getUrl().endsWith(":" + newVersion));
        Assertions.assertTrue(newCr.getSpec().getDefaultConfigDisable());
        Assertions.assertTrue(MapUtils.isEmpty(newCr.getSpec().getDefaultConfig()));
        Assertions.assertTrue(CollectionUtils.isEmpty(newCr.getSpec().getMatchRules()));

        ArgumentCaptor<V1alpha1WasmPlugin> updatedCrCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(updatedCrCaptor.capture());
        V1alpha1WasmPlugin updatedCr = updatedCrCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, updatedCr.getMetadata().getName());
        Assertions.assertTrue(updatedCr.getSpec().getUrl().endsWith(":" + newVersion));
        Assertions.assertEquals(updatedCr.getSpec().getDefaultConfig(), existedCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(updatedCr.getSpec().getDefaultConfigDisable(),
            existedCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(updatedCr.getSpec().getMatchRules(), existedCr.getSpec().getMatchRules());
    }

    @Test
    public void updateBuiltInTestUserAndInternalConfigured() throws Exception {
        V1alpha1WasmPlugin userCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(Map.of("kf", "vf")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.foo.com").configurations(Map.of("kfd", "vfd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("foo").configurations(Map.of("kfi", "vfi")).build());

        V1alpha1WasmPlugin internalCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(Map.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(Map.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(Map.of("ki", "vi")).build());
        when(kubernetesClientService.listWasmPlugin(TEST_BUILT_IN_PLUGIN_NAME)).thenReturn(Collections.emptyList());
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(List.of(userCr, internalCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newVersion = "1.0.1";
        WasmPlugin updatedPlugin = service.updateBuiltIn(TEST_BUILT_IN_PLUGIN_NAME, newVersion);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        verify(kubernetesClientService, never()).createWasmPlugin(any());

        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(2)).replaceWasmPlugin(crCaptor.capture());

        V1alpha1WasmPlugin updatedInternalCr = crCaptor.getAllValues().stream()
            .filter(cr -> TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME.equals(cr.getMetadata().getName())).findFirst()
            .orElse(null);
        Assertions.assertNotNull(updatedInternalCr);
        Assertions.assertTrue(updatedInternalCr.getSpec().getUrl().endsWith(":" + newVersion));
        Assertions.assertEquals(updatedInternalCr.getSpec().getDefaultConfig(),
            internalCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(updatedInternalCr.getSpec().getDefaultConfigDisable(),
            internalCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(updatedInternalCr.getSpec().getMatchRules(), internalCr.getSpec().getMatchRules());

        V1alpha1WasmPlugin updatedUserCr = crCaptor.getAllValues().stream()
            .filter(cr -> TEST_BUILT_IN_PLUGIN_USER_CR_NAME.equals(cr.getMetadata().getName())).findFirst()
            .orElse(null);
        Assertions.assertNotNull(updatedUserCr);
        Assertions.assertTrue(updatedUserCr.getSpec().getUrl().endsWith(":" + newVersion));
        Assertions.assertEquals(updatedUserCr.getSpec().getDefaultConfig(), userCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(updatedUserCr.getSpec().getDefaultConfigDisable(),
            userCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(updatedUserCr.getSpec().getMatchRules(), userCr.getSpec().getMatchRules());

    }

    private V1alpha1WasmPlugin buildWasmPluginResource(String name, boolean builtIn, boolean internal) {
        WasmPlugin plugin = WasmPlugin.builder().name(name).pluginVersion(DEFAULT_VERSION).builtIn(builtIn)
            .category("TEST").icon("http://dummy-icon").phase(PluginPhase.UNSPECIFIED.name()).priority(1000)
            .imageRepository("oci://docker.io/" + name).build();
        return kubernetesModelConverter.wasmPluginToCr(plugin, internal);
    }
}
