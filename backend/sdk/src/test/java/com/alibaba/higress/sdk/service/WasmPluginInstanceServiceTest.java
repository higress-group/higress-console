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

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.MatchRule;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;

import io.kubernetes.client.openapi.ApiException;

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

        wasmPluginService = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter,
            WasmPluginServiceConfig.buildFromEnv());
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
        final Map<String, Object> globalConfig = MapUtil.of("k", "v");
        final boolean globalEnabled = true;
        final String domain = "www.test.com";
        final boolean domainEnabled = true;
        final Map<String, Object> domainConfig = MapUtil.of("kd", "vd");
        final String route = "test";
        final boolean routeEnabled = true;
        final Map<String, Object> routeConfig = MapUtil.of("kr", "vr");

        V1alpha1WasmPlugin internalCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, true);
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr,
            WasmPluginInstance.builder().targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null))
                .enabled(globalEnabled).configurations(globalConfig).build());
        kubernetesModelConverter.setWasmPluginInstanceToCr(internalCr,
            WasmPluginInstance.builder().targets(MapUtil.of(WasmPluginInstanceScope.ROUTE, route)).enabled(routeEnabled)
                .configurations(routeConfig).build());

        V1alpha1WasmPlugin userCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        kubernetesModelConverter.setWasmPluginInstanceToCr(userCr,
            WasmPluginInstance.builder().targets(MapUtil.of(WasmPluginInstanceScope.DOMAIN, domain))
                .enabled(domainEnabled).configurations(domainConfig).build());

        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(internalCr, userCr);
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
        Assertions.assertNull(domainInstance1);

        WasmPluginInstance routeInstance =
            service.query(WasmPluginInstanceScope.ROUTE, route, TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNotNull(routeInstance);
        Assertions.assertEquals(routeEnabled, routeInstance.getEnabled());
        Assertions.assertEquals(routeConfig, routeInstance.getConfigurations());
        Assertions.assertTrue(routeInstance.getInternal());

        WasmPluginInstance routeInstance1 =
            service.query(WasmPluginInstanceScope.ROUTE, "some random route", TEST_BUILT_IN_PLUGIN_NAME);
        Assertions.assertNull(routeInstance1);
    }

    @Test
    public void addOrUpdateTestFromEmptyAddUserConfig() throws Exception {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null)).enabled(true)
            .configurations(MapUtil.of("k", "v")).internal(false).build();
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
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(MapUtil.of("k", "v")).internal(false).build();
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
            .configurations(MapUtil.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.DOMAIN).target("www.test.com").enabled(false)
            .configurations(MapUtil.of("kd", "vd")).internal(false).build();
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
            .configurations(MapUtil.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(false)
            .configurations(MapUtil.of("k2", "v2")).internal(false).build();
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
            .configurations(MapUtil.of("k", "v")).internal(true).build();
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
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(true)
            .configurations(MapUtil.of("k", "v")).internal(true).build();
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
            .configurations(MapUtil.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.ROUTE).target("test").enabled(true)
            .configurations(MapUtil.of("kd", "vd")).internal(true).build();
        WasmPluginInstance updatedInstance = service.addOrUpdate(instance);
        updatedInstance.setRawConfigurations(null);
        Assertions.assertEquals(instance, updatedInstance);

        verify(kubernetesClientService, never()).replaceWasmPlugin(any());
        ArgumentCaptor<V1alpha1WasmPlugin> crCaptor = ArgumentCaptor.forClass(V1alpha1WasmPlugin.class);
        verify(kubernetesClientService, times(1)).createWasmPlugin(crCaptor.capture());
        V1alpha1WasmPlugin cr = crCaptor.getValue();
        Assertions.assertNotNull(cr);
        Assertions.assertEquals(TEST_BUILT_IN_PLUGIN_INTERNAL_CR_NAME, cr.getMetadata().getName());
        Assertions.assertTrue(cr.getSpec().getDefaultConfigDisable());
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
            .configurations(MapUtil.of("k", "v")).internal(false).build();
        kubernetesModelConverter.setWasmPluginInstanceToCr(existedCr, existedInstance);
        List<V1alpha1WasmPlugin> crs = Lists.newArrayList(existedCr);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME))).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString())).thenReturn(crs);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString(), anyBoolean()))
            .thenReturn(crs);

        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).scope(WasmPluginInstanceScope.GLOBAL).enabled(false)
            .configurations(MapUtil.of("k2", "v2")).internal(true).build();
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
    public void addOrUpdateAllTestEmptyInput() {
        List<WasmPluginInstance> result = service.addOrUpdateAll(Collections.emptyList());
        Assertions.assertTrue(result.isEmpty(), "Result should be empty for empty input.");
    }

    @Test
    public void addOrUpdateAllTestMultipleInstances() throws Exception {
        WasmPluginInstance instance1 = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null)).enabled(true)
            .configurations(MapUtil.of("k1", "v1")).internal(false).build();

        WasmPluginInstance instance2 = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).targets(MapUtil.of(WasmPluginInstanceScope.DOMAIN, "www.example.com"))
            .enabled(false).configurations(MapUtil.of("k2", "v2")).internal(false).build();

        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString()))
            .thenReturn(Lists.newArrayList(existedCr));

        List<WasmPluginInstance> result = service.addOrUpdateAll(Lists.newArrayList(instance1, instance2));

        Assertions.assertEquals(2, result.size(), "Result should contain two updated instances.");
        verify(kubernetesClientService, times(1)).replaceWasmPlugin(any());
    }

    @Test
    public void addOrUpdateAllTestVersionMismatch() {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion("2.0.0").targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null)).enabled(true)
            .configurations(MapUtil.of("k", "v")).internal(false).build();

        IllegalArgumentException exception = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            service.addOrUpdateAll(Lists.newArrayList(instance));
        });

        Assertions.assertTrue(
            exception.getMessage().contains("Add operation is only allowed for the current plugin version."));
    }

    @Test
    public void addOrUpdateAllTestConfigurationParsingFailure() throws Exception {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null)).enabled(true)
            .rawConfigurations("invalid_yaml").internal(false).build();

        ValidationException exception = Assertions.assertThrows(ValidationException.class, () -> {
            service.addOrUpdateAll(Lists.newArrayList(instance));
        });

        Assertions.assertTrue(exception.getMessage().contains("Error occurs when parsing raw configurations"));
    }

    @Test
    public void addOrUpdateAllTestUpdateFailure() throws Exception {
        WasmPluginInstance instance = WasmPluginInstance.builder().pluginName(TEST_BUILT_IN_PLUGIN_NAME)
            .pluginVersion(DEFAULT_VERSION).targets(MapUtil.of(WasmPluginInstanceScope.GLOBAL, null)).enabled(true)
            .configurations(MapUtil.of("k", "v")).internal(false).build();

        V1alpha1WasmPlugin existedCr = buildWasmPluginResource(TEST_BUILT_IN_PLUGIN_NAME, true, false);
        when(kubernetesClientService.listWasmPlugin(eq(TEST_BUILT_IN_PLUGIN_NAME), anyString()))
            .thenReturn(Lists.newArrayList(existedCr));
        when(kubernetesClientService.replaceWasmPlugin(any())).thenThrow(new ApiException("Update failed"));

        BusinessException exception = Assertions.assertThrows(BusinessException.class, () -> {
            service.addOrUpdateAll(Lists.newArrayList(instance));
        });

        Assertions
            .assertTrue(exception.getMessage().contains("Error occurs when adding or updating the WasmPlugin CR"));
    }

    private V1alpha1WasmPlugin buildWasmPluginResource(String name, boolean builtIn, boolean internal) {
        WasmPlugin plugin = WasmPlugin.builder().name(name).pluginVersion(DEFAULT_VERSION).builtIn(builtIn)
            .category("TEST").icon("http://dummy-icon").phase(PluginPhase.UNSPECIFIED.name()).priority(1000)
            .imageRepository("oci://docker.io/" + name).build();
        return kubernetesModelConverter.wasmPluginToCr(plugin, internal);
    }
}
