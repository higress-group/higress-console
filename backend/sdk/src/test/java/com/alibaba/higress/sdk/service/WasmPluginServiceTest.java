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

import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;
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
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.ImagePullPolicy;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;

public class WasmPluginServiceTest {

    private static final String TEST_BUILT_IN_PLUGIN_NAME = "basic-auth";
    private static final String DEFAULT_VERSION = "1.0.0";
    private static final String TEST_BUILT_IN_PLUGIN_USER_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + Separators.DASH + DEFAULT_VERSION;
    private static final String TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;

    private static final String CUSTOM_IMAGE_URL_PATTERN_PROPERTY = "higress-admin.wasmplugin.custom-image-url-pattern";

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;
    private WasmPluginServiceImpl service;

    @BeforeEach
    public void setUp() {
        kubernetesClientService = mock(KubernetesClientService.class);
        kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);
        service = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter);
    }

    @AfterEach
    public void tearDown() {
        System.clearProperty(CUSTOM_IMAGE_URL_PATTERN_PROPERTY);

        service = null;
        kubernetesModelConverter = null;
        kubernetesClientService = null;
    }

    @Test
    public void listPluginsTest() throws Exception {
        service.initialize();

        PaginatedResult<WasmPlugin> plugins = service.list(null);
        when(kubernetesClientService.listWasmPlugin()).thenReturn(Collections.emptyList());
        System.out.println(plugins.getTotal());

        Properties properties = new Properties();
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream("plugins/plugins.properties")) {
            properties.load(stream);
        }
        Assertions.assertEquals(properties.size(), plugins.getTotal());
        Assertions.assertEquals(properties.size(), plugins.getData().size());
        Set<String> pluginNames = new HashSet<>(properties.stringPropertyNames());
        plugins.getData().forEach(p -> pluginNames.remove(p.getName()));
        Assertions.assertEquals(0, pluginNames.size(), "Missing built-in plugins: " + pluginNames);
    }

    @Test
    public void listPluginsTestWithCustomImageUrlNameAndVersion() throws Exception {
        System.setProperty(CUSTOM_IMAGE_URL_PATTERN_PROPERTY, "http://foo.bar.com/plugins/${name}/${version}.wasm");
        service.initialize();

        listPluginsTest();

        PaginatedResult<WasmPlugin> plugins = service.list(null);
        for (WasmPlugin plugin : plugins.getData()) {
            String expectedUrl =
                "http://foo.bar.com/plugins/" + plugin.getName() + "/" + plugin.getPluginVersion() + ".wasm";
            Assertions.assertEquals(expectedUrl, plugin.getImageRepository());
            Assertions.assertNull(null, plugin.getImageVersion());
        }
    }

    @Test
    public void listPluginsTestWithCustomImageUrlNameOnly() throws Exception {
        System.setProperty(CUSTOM_IMAGE_URL_PATTERN_PROPERTY, "https://foo.bar.com/plugins/${name}.wasm");
        service.initialize();

        listPluginsTest();

        PaginatedResult<WasmPlugin> plugins = service.list(null);
        for (WasmPlugin plugin : plugins.getData()) {
            String expectedUrl = "https://foo.bar.com/plugins/" + plugin.getName() + ".wasm";
            Assertions.assertEquals(expectedUrl, plugin.getImageRepository());
            Assertions.assertNull(null, plugin.getImageVersion());
        }
    }

    @Test
    public void listPluginsTestWithCustomImageUrlFixed() throws Exception {
        System.setProperty(CUSTOM_IMAGE_URL_PATTERN_PROPERTY, "file:///opt/plugins/main.wasm");
        service.initialize();

        listPluginsTest();

        PaginatedResult<WasmPlugin> plugins = service.list(null);
        for (WasmPlugin plugin : plugins.getData()) {
            String expectedUrl = "file:///opt/plugins/main.wasm";
            Assertions.assertEquals(expectedUrl, plugin.getImageRepository());
            Assertions.assertNull(null, plugin.getImageVersion());
        }
    }

    @Test
    public void updateBuiltInTestNotConfigured() throws Exception {
        service.initialize();

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(Collections.emptyList());
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newRepo = "oci://docker.io/plugins/" + TEST_BUILT_IN_PLUGIN_NAME;
        final String newVersion = "1.0.1";
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName(TEST_BUILT_IN_PLUGIN_NAME);
        plugin.setImageRepository(newRepo);
        plugin.setImageVersion(newVersion);
        plugin.setPhase(PluginPhase.AUTHN.getName());
        plugin.setPriority(500);
        plugin.setImagePullPolicy(ImagePullPolicy.ALWAYS.getName());
        plugin.setImagePullSecret("test-secret");
        WasmPlugin updatedPlugin = service.updateBuiltIn(plugin);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newRepo, updatedPlugin.getImageRepository());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertEquals(newRepo + ":" + newVersion, cr.getSpec().getUrl());
        Assertions.assertTrue(cr.getSpec().getDefaultConfigDisable());
        Assertions.assertTrue(MapUtils.isEmpty(cr.getSpec().getDefaultConfig()));
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
        Assertions.assertEquals(plugin.getPhase(), cr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), cr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), cr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), cr.getSpec().getImagePullSecret());

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
    }

    @Test
    public void updateBuiltInTestUserConfigured() throws Exception {
        service.initialize();

        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(MapUtil.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(MapUtil.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(MapUtil.of("ki", "vi")).build());

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(Lists.newArrayList(existedCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newRepo = "http://192.168.0.1:8080/plugins/" + TEST_BUILT_IN_PLUGIN_NAME + ".wasm";
        final String newVersion = "";
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName(TEST_BUILT_IN_PLUGIN_NAME);
        plugin.setImageRepository(newRepo);
        plugin.setImageVersion(newVersion);
        plugin.setPhase(PluginPhase.AUTHN.name());
        plugin.setPriority(500);
        plugin.setImagePullPolicy(ImagePullPolicy.ALWAYS.getName());
        plugin.setImagePullSecret("test-secret");
        WasmPlugin updatedPlugin = service.updateBuiltIn(plugin);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newRepo, updatedPlugin.getImageRepository());
        Assertions.assertNull(updatedPlugin.getImageVersion());

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertEquals(newRepo, cr.getSpec().getUrl());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfig(), cr.getSpec().getDefaultConfig());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfigDisable(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(existedCr.getSpec().getMatchRules(), cr.getSpec().getMatchRules());
        Assertions.assertEquals(plugin.getPhase(), cr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), cr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), cr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), cr.getSpec().getImagePullSecret());
    }

    @Test
    public void updateBuiltInTestInternalConfigured() throws Exception {
        service.initialize();

        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(MapUtil.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(MapUtil.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(MapUtil.of("ki", "vi")).build());

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(Lists.newArrayList(existedCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newRepo = "files:///opt/plugins/" + TEST_BUILT_IN_PLUGIN_NAME + ".wasm";
        final String newVersion = "";
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName(TEST_BUILT_IN_PLUGIN_NAME);
        plugin.setImageRepository(newRepo);
        plugin.setImageVersion(newVersion);
        plugin.setPhase(PluginPhase.AUTHN.getName());
        plugin.setPriority(500);
        plugin.setImagePullPolicy(ImagePullPolicy.ALWAYS.getName());
        plugin.setImagePullSecret("test-secret");
        WasmPlugin updatedPlugin = service.updateBuiltIn(plugin);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newRepo, updatedPlugin.getImageRepository());
        Assertions.assertNull(updatedPlugin.getImageVersion());

        ArgumentCaptor<V1alpha1WasmPlugin> newCrCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(newCrCaptor.capture());
        V1alpha1WasmPlugin newCr = newCrCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, newCr.getMetadata().getName());
        Assertions.assertEquals(newRepo, newCr.getSpec().getUrl());
        Assertions.assertTrue(newCr.getSpec().getDefaultConfigDisable());
        Assertions.assertTrue(MapUtils.isEmpty(newCr.getSpec().getDefaultConfig()));
        Assertions.assertTrue(CollectionUtils.isEmpty(newCr.getSpec().getMatchRules()));
        Assertions.assertEquals(plugin.getPhase(), newCr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), newCr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), newCr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), newCr.getSpec().getImagePullSecret());

        ArgumentCaptor<V1alpha1WasmPlugin> updatedCrCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(updatedCrCaptor.capture());
        V1alpha1WasmPlugin updatedCr = updatedCrCaptor.getValue();
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, updatedCr.getMetadata().getName());
        Assertions.assertEquals(newRepo, updatedCr.getSpec().getUrl());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfig(), updatedCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfigDisable(),
            updatedCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(existedCr.getSpec().getMatchRules(), updatedCr.getSpec().getMatchRules());
        Assertions.assertEquals(plugin.getPhase(), updatedCr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), updatedCr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), updatedCr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), updatedCr.getSpec().getImagePullSecret());
    }

    @Test
    public void updateBuiltInTestUserAndInternalConfigured() throws Exception {
        service.initialize();

        V1alpha1WasmPlugin userCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(MapUtil.of("kf", "vf")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.foo.com").configurations(MapUtil.of("kfd", "vfd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("foo").configurations(MapUtil.of("kfi", "vfi")).build());

        V1alpha1WasmPlugin internalCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).configurations(MapUtil.of("k", "v")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").configurations(MapUtil.of("kd", "vd")).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.DOMAIN).target("test").configurations(MapUtil.of("ki", "vi")).build());
        when(kubernetesClientService.listWasmPlugin(TEST_BUILT_IN_PLUGIN_NAME)).thenReturn(Collections.emptyList());
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(Lists.newArrayList(userCr, internalCr));
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(invocation -> invocation.getArgument(0));

        final String newRepo = "https://foo.bar.com/plugins/" + TEST_BUILT_IN_PLUGIN_NAME + ".wasm";
        final String newVersion = null;
        WasmPlugin plugin = new WasmPlugin();
        plugin.setName(TEST_BUILT_IN_PLUGIN_NAME);
        plugin.setImageRepository(newRepo);
        plugin.setImageVersion(newVersion);
        plugin.setPhase(PluginPhase.AUTHN.name());
        plugin.setPriority(500);
        plugin.setImagePullPolicy(ImagePullPolicy.ALWAYS.getName());
        plugin.setImagePullSecret("test-secret");
        WasmPlugin updatedPlugin = service.updateBuiltIn(plugin);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_NAME, updatedPlugin.getName());
        Assertions.assertEquals(newRepo, updatedPlugin.getImageRepository());
        Assertions.assertEquals(newVersion, updatedPlugin.getImageVersion());

        verify(kubernetesClientService, never()).createWasmPlugin(any());

        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(2)).replaceWasmPlugin(crCaptor.capture());

        V1alpha1WasmPlugin updatedInternalCr = crCaptor.getAllValues().stream()
            .filter(cr -> TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME.equals(cr.getMetadata().getName())).findFirst()
            .orElse(null);
        Assertions.assertNotNull(updatedInternalCr);
        Assertions.assertEquals(newRepo, updatedInternalCr.getSpec().getUrl());
        Assertions.assertEquals(internalCr.getSpec().getDefaultConfig(),
            updatedInternalCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(internalCr.getSpec().getDefaultConfigDisable(),
            updatedInternalCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(internalCr.getSpec().getMatchRules(), updatedInternalCr.getSpec().getMatchRules());
        Assertions.assertEquals(plugin.getPhase(), internalCr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), internalCr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), internalCr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), internalCr.getSpec().getImagePullSecret());

        V1alpha1WasmPlugin updatedUserCr = crCaptor.getAllValues().stream()
            .filter(cr -> TEST_BUILT_IN_PLUGIN_USER_CR_NAME.equals(cr.getMetadata().getName())).findFirst()
            .orElse(null);
        Assertions.assertNotNull(updatedUserCr);
        Assertions.assertEquals(newRepo, updatedUserCr.getSpec().getUrl());
        Assertions.assertEquals(userCr.getSpec().getDefaultConfig(), updatedUserCr.getSpec().getDefaultConfig());
        Assertions.assertEquals(userCr.getSpec().getDefaultConfigDisable(),
            updatedUserCr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(userCr.getSpec().getMatchRules(), updatedUserCr.getSpec().getMatchRules());
        Assertions.assertEquals(plugin.getPhase(), userCr.getSpec().getPhase());
        Assertions.assertEquals(plugin.getPriority(), userCr.getSpec().getPriority());
        Assertions.assertEquals(plugin.getImagePullPolicy(), userCr.getSpec().getImagePullPolicy());
        Assertions.assertEquals(plugin.getImagePullSecret(), userCr.getSpec().getImagePullSecret());
    }

    private V1alpha1WasmPlugin buildWasmPluginResource(String name, boolean builtIn, boolean internal) {
        WasmPlugin plugin = WasmPlugin.builder().name(name).pluginVersion(DEFAULT_VERSION).builtIn(builtIn)
            .category("TEST").icon("http://dummy-icon").phase(PluginPhase.UNSPECIFIED.name()).priority(1000)
            .imageRepository("oci://docker.io/" + name).build();
        return kubernetesModelConverter.wasmPluginToCr(plugin, internal);
    }
}
