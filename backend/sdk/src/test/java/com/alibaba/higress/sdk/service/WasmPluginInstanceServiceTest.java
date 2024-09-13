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

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import org.apache.commons.collections4.CollectionUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;

public class WasmPluginInstanceServiceTest {

    private static final String TEST_BUILT_IN_PLUGIN_NAME = "basic-auth";
    private static final String DEFAULT_VERSION = "1.0.0";
    private static final String TEST_BUILT_IN_PLUGIN_USER_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + Separators.DASH + DEFAULT_VERSION;
    private static final String TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME =
        TEST_BUILT_IN_PLUGIN_NAME + HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX;

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;
    private WasmPluginServiceImpl wasmPluginService;
    private WasmPluginInstanceServiceImpl service;

    @BeforeEach
    public void setUp() throws Exception {
        kubernetesClientService = mock(KubernetesClientService.class);
        when(kubernetesClientService.createWasmPlugin(any())).thenAnswer(i -> i.getArguments()[0]);
        when(kubernetesClientService.replaceWasmPlugin(any())).thenAnswer(i -> i.getArguments()[0]);
        kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);
        wasmPluginService = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter);
        wasmPluginService.initialize();
        service =
            new WasmPluginInstanceServiceImpl(wasmPluginService, kubernetesClientService, kubernetesModelConverter);
    }

    @AfterEach
    public void tearDown() {
        service = null;
        wasmPluginService = null;
        kubernetesModelConverter = null;
        kubernetesClientService = null;
    }

    @Test
    public void queryTest() throws Exception {
        final Map<String, Object> globalConfig = Map.of("k", "v");
        final boolean globalEnabled = true;
        final String domain = "www.test.com";
        final boolean domainEnabled = true;
        final Map<String, Object> domainConfig = Map.of("kd", "vd");
        final String route = "test";
        final boolean routeEnabled = true;
        final Map<String, Object> routeConfig = Map.of("kr", "vr");

        V1alpha1WasmPlugin internalCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr, WasmPluginInstance.builder()
            .scope(WasmPluginInstanceScope.GLOBAL).enabled(globalEnabled).configurations(globalConfig).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr,
            WasmPluginInstance.builder().scope(WasmPluginInstanceScope.ROUTE).target(route).enabled(routeEnabled)
                .configurations(routeConfig).build());

        V1alpha1WasmPlugin userCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr,
            WasmPluginInstance.builder().scope(WasmPluginInstanceScope.DOMAIN).target(domain).enabled(domainEnabled)
                .configurations(domainConfig).build());

        List<V1alpha1WasmPlugin> crs = List.of(internalCr, userCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance globalInstance =
            service.query(WasmPluginInstanceScope.GLOBAL, null, TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(globalInstance);
        Assertions.assertEquals(globalEnabled, globalInstance.getEnabled());
        Assertions.assertEquals(globalConfig, globalInstance.getConfigurations());
        Assertions.assertTrue(globalInstance.getInternal());

        WasmPluginInstance domainInstance =
            service.query(WasmPluginInstanceScope.DOMAIN, domain, TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(domainInstance);
        Assertions.assertEquals(domainEnabled, domainInstance.getEnabled());
        Assertions.assertEquals(domainConfig, domainInstance.getConfigurations());
        Assertions.assertFalse(domainInstance.getInternal());

        WasmPluginInstance domainInstance1 =
            service.query(WasmPluginInstanceScope.DOMAIN, "some random domain", TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(domainInstance1);
        Assertions.assertFalse(domainInstance1.getEnabled());
        Assertions.assertNull(domainInstance1.getConfigurations());
        Assertions.assertNull(domainInstance1.getInternal());

        WasmPluginInstance routeInstance =
            service.query(WasmPluginInstanceScope.ROUTE, route, TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(routeInstance);
        Assertions.assertEquals(routeEnabled, routeInstance.getEnabled());
        Assertions.assertEquals(routeConfig, routeInstance.getConfigurations());
        Assertions.assertTrue(routeInstance.getInternal());

        WasmPluginInstance routeInstance1 =
            service.query(WasmPluginInstanceScope.ROUTE, "some random route", TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(routeInstance1);
        Assertions.assertFalse(routeInstance1.getEnabled());
        Assertions.assertNull(routeInstance1.getConfigurations());
        Assertions.assertNull(routeInstance1.getInternal());
    }

    @Test
    public void addOrUpdateTestFromEmptyAddUserConfig() throws Exception {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(false).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    @Test
    public void addOrUpdateTestFromInternalAddUserConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(false).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    @Test
    public void addOrUpdateTestFromUserAddUserConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        WasmPluginInstance existedInstance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").enabled(false)
            .configurations(Map.of("kd", "vd")).internal(false).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfigDisable(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(existedCr.getSpec().getDefaultConfig(), cr.getSpec().getDefaultConfig());
        Assertions.assertEquals(1, cr.getSpec().getMatchRules().size());
        MatchRule rule = cr.getSpec().getMatchRules().get(0);
        Assertions.assertEquals(1, rule.getDomain().size());
        Assertions.assertEquals(instance.getTarget(), rule.getDomain().get(0));
        Assertions.assertTrue(CollectionUtils.isEmpty(rule.getIngress()));
        Assertions.assertNotEquals(instance.getEnabled(), rule.getConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), rule.getConfig());
    }

    @Test
    public void addOrUpdateTestUpdateUserConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        WasmPluginInstance existedInstance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(false)
            .configurations(Map.of("k2", "v2")).internal(false).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_USER_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    @Test
    public void addOrUpdateTestFromEmptyAddInternalConfig() throws Exception {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(true).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    @Test
    public void addOrUpdateTestFromInternalAddInternalConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(Map.of("k", "v")).internal(true).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    @Test
    public void addOrUpdateTestFromUserAddInternalConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        WasmPluginInstance existedInstance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
                .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
                .configurations(Map.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
                .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
                .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.ROUTE).target("test").enabled(true)
                .configurations(Map.of("kd", "vd")).internal(true).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNull(cr.getSpec().getDefaultConfigDisable());
        Assertions.assertNull(cr.getSpec().getDefaultConfig());
        Assertions.assertEquals(1, cr.getSpec().getMatchRules().size());
        MatchRule rule = cr.getSpec().getMatchRules().get(0);
        Assertions.assertEquals(1, rule.getIngress().size());
        Assertions.assertEquals(instance.getTarget(), rule.getIngress().get(0));
        Assertions.assertTrue(CollectionUtils.isEmpty(rule.getDomain()));
        Assertions.assertNotEquals(instance.getEnabled(), rule.getConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), rule.getConfig());
    }

    @Test
    public void addOrUpdateTestUpdateInternalConfig() throws Exception {
        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        WasmPluginInstance existedInstance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
                .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
                .configurations(Map.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = List.of(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
                .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
                .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(false)
                .configurations(Map.of("k2", "v2")).internal(true).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).createWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, cr.getMetadata().getName());
        Assertions.assertNotEquals(instance.getEnabled(), cr.getSpec().getDefaultConfigDisable());
        Assertions.assertEquals(instance.getConfigurations(), cr.getSpec().getDefaultConfig());
        Assertions.assertTrue(CollectionUtils.isEmpty(cr.getSpec().getMatchRules()));
    }

    private V1alpha1WasmPlugin buildWasmPluginResource(String name, boolean builtIn, boolean internal) {
        WasmPlugin plugin = WasmPlugin.builder().name(name).pluginVersion(DEFAULT_VERSION).builtIn(builtIn)
            .category("TEST").icon("http://dummy-icon").phase(PluginPhase.UNSPECIFIED.name()).priority(1000)
            .imageRepository("oci://docker.io/" + name).build();
        return kubernetesModelConverter.wasmPluginToCr(plugin, internal);
    }
}
