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
package com.alibaba.higress.sdk.service.ai;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

public class AiRouteServiceTest {

	private VelocityEngine velocityEngine;

	private Template routeFallbackEnvoyFilterConfigTemplate;

	private KubernetesClientService kubernetesClientService;

	private RouteService routeService;

	private LlmProviderService llmProviderService;

	private WasmPluginInstanceService wasmPluginInstanceService;

	private KubernetesModelConverter converter;

	private AiRouteServiceImpl aiRouteService;

	@BeforeEach
	public void setUp() throws ApiException {
		this.velocityEngine = new VelocityEngine();
		velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		velocityEngine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		velocityEngine.init();
		this.routeFallbackEnvoyFilterConfigTemplate = velocityEngine.getTemplate(
				"/templates/envoyfilter-route-fallback.yaml", StandardCharsets.UTF_8.name());

		this.kubernetesClientService = mock(KubernetesClientService.class);
		this.routeService = mock(RouteService.class);
		this.llmProviderService = mock(LlmProviderService.class);
		this.wasmPluginInstanceService = mock(WasmPluginInstanceService.class);
		when(kubernetesClientService.loadFromYaml(anyString(), eq(V1alpha3EnvoyFilter.class)))
				.thenReturn(new V1alpha3EnvoyFilter());
		this.converter = new KubernetesModelConverter(kubernetesClientService);
		this.aiRouteService = new AiRouteServiceImpl(converter, kubernetesClientService, routeService,
				llmProviderService, wasmPluginInstanceService);
	}

	@Test
	public void responseCodeIsNullTest() throws Exception {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", null);
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();
		//System.out.println(config);
		Assertions.assertTrue(config.contains("name: \"4xx_response\"") && config.contains("name: \"5xx_response\""));
	}

	@Test
	public void responseCodeIsEmptyTest() throws Exception {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", Collections.emptyList());
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();
		//System.out.println(config);
		Assertions.assertTrue(config.contains("name: \"4xx_response\"") && config.contains("name: \"5xx_response\""));
	}

	@Test
	public void responseCodeIs4xxTest() throws Exception {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", Collections.singletonList("4xx"));
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();
		//System.out.println(config);
		Assertions.assertTrue(config.contains("name: \"4xx_response\""));
		Assertions.assertFalse(config.contains("name: \"5xx_response\""));
	}

	@Test
	public void responseCodeIs5xxTest() throws Exception {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", Collections.singletonList("5xx"));
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();
		//System.out.println(config);
		Assertions.assertFalse(config.contains("name: \"4xx_response\""));
		Assertions.assertTrue(config.contains("name: \"5xx_response\""));
	}

	@Test
	public void responseCodeIs4xxAnd5xxTest() throws Exception {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", Arrays.asList("4xx", "5xx"));
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();
		//System.out.println(writer);
		Assertions.assertTrue(config.contains("name: \"4xx_response\"") && config.contains("name: \"5xx_response\""));
	}

	@Test
	public void updateShouldNotWriteRuntimeResourcesWhenConfigMapReplaceConflicts() throws ApiException {
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(converter.aiRoute2ConfigMap(
				createRoute("old.example.com")));
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenThrow(new ApiException(409, "Conflict"));

		Assertions.assertThrows(ResourceConflictException.class,
				() -> aiRouteService.update(createRoute("new.example.com")));

		InOrder inOrder = inOrder(kubernetesClientService);
		inOrder.verify(kubernetesClientService).readConfigMap("ai-route-test");
		inOrder.verify(kubernetesClientService).replaceConfigMap(any());
		inOrder.verifyNoMoreInteractions();
		verify(kubernetesClientService, never()).deleteEnvoyFilter(anyString());
		verifyNoInteractions(routeService, llmProviderService, wasmPluginInstanceService);
	}

	@Test
	public void updateShouldWriteConfigMapBeforeRuntimeResources() throws ApiException {
		when(kubernetesClientService.readConfigMap("ai-route-test"))
				.thenReturn(converter.aiRoute2ConfigMap(createRoute("old.example.com")));
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenAnswer(invocation -> invocation.getArgument(0));
		when(routeService.query("ai-route-test.internal"))
				.thenReturn(Route.builder().version("route-version-1").build());
		when(routeService.update(any())).thenReturn(new Route());
		when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_STATISTICS))
				.thenReturn(new WasmPluginInstance());

		AiRoute updatedRoute = aiRouteService.update(createRoute("new.example.com"));

		Assertions.assertEquals(Collections.singletonList("new.example.com"), updatedRoute.getDomains());
		InOrder inOrder = inOrder(kubernetesClientService, routeService);
		inOrder.verify(kubernetesClientService).readConfigMap("ai-route-test");
		inOrder.verify(kubernetesClientService).replaceConfigMap(any());
		inOrder.verify(routeService).query("ai-route-test.internal");
		inOrder.verify(routeService).update(any());
		verify(kubernetesClientService).replaceConfigMap(any());
		verify(routeService).update(any());
		verify(routeService).delete("ai-route-test.fallback.internal");
		verify(wasmPluginInstanceService).addOrUpdate(any());
	}

	@Test
	public void updateShouldRestorePreviousConfigMapAndRuntimeResourcesWhenRuntimeWriteFails() throws ApiException {
		AiRoute previousRoute = createRoute("old.example.com");
		V1ConfigMap previousConfigMap = converter.aiRoute2ConfigMap(previousRoute);
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(previousConfigMap);
		V1ConfigMap committedConfigMap = new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2"));
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenReturn(committedConfigMap, previousConfigMap);
		when(routeService.query("ai-route-test.internal"))
				.thenReturn(Route.builder().version("route-version-1").build(),
						Route.builder().version("route-version-2").build());
		BusinessException runtimeWriteFailure = new BusinessException("Runtime resource write failed");
		when(routeService.update(any())).thenThrow(runtimeWriteFailure).thenReturn(new Route());
		when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.AI_STATISTICS))
				.thenReturn(new WasmPluginInstance());

		BusinessException thrown = Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.update(createRoute("new.example.com")));

		Assertions.assertSame(runtimeWriteFailure, thrown);
		verify(kubernetesClientService, times(2)).replaceConfigMap(any());
		verify(kubernetesClientService).replaceConfigMap(argThat(configMap ->
				"2".equals(configMap.getMetadata().getResourceVersion())
						&& Collections.singletonList("old.example.com")
								.equals(converter.configMap2AiRoute(configMap).getDomains())));
		verify(routeService, times(2)).update(any());
		verify(routeService).update(argThat(route ->
				Collections.singletonList("old.example.com").equals(route.getDomains())));
	}

	@Test
	public void updateShouldRollbackFallbackResourcesWhenPrimaryRuntimeRollbackFails() throws ApiException {
		AiRoute previousRoute = createRoute("old.example.com");
		V1ConfigMap previousConfigMap = converter.aiRoute2ConfigMap(previousRoute);
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(previousConfigMap);
		V1ConfigMap committedConfigMap = new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2"));
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenReturn(committedConfigMap, previousConfigMap);
		when(routeService.query("ai-route-test.internal"))
				.thenReturn(Route.builder().version("route-version-1").build(),
						Route.builder().version("route-version-2").build());
		BusinessException runtimeWriteFailure = new BusinessException("Runtime resource write failed");
		BusinessException runtimeRollbackFailure = new BusinessException("Runtime resource rollback failed");
		when(routeService.update(any())).thenThrow(runtimeWriteFailure).thenThrow(runtimeRollbackFailure);

		BusinessException thrown = Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.update(createRoute("new.example.com")));

		Assertions.assertSame(runtimeWriteFailure, thrown);
		verify(routeService, times(2)).update(any());
		verify(kubernetesClientService).deleteEnvoyFilter("ai-route-test.internal");
		verify(routeService).delete("ai-route-test.fallback.internal");
	}

	@Test
	public void updateShouldSkipRuntimeRollbackWhenPreviousConfigMapCannotBeConverted() throws ApiException {
		V1ConfigMap previousConfigMap = converter.aiRoute2ConfigMap(createRoute("old.example.com"));
		KubernetesModelConverter converterSpy = spy(converter);
		doReturn(null).when(converterSpy).configMap2AiRoute(previousConfigMap);
		aiRouteService = new AiRouteServiceImpl(converterSpy, kubernetesClientService, routeService,
				llmProviderService, wasmPluginInstanceService);
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(previousConfigMap);
		V1ConfigMap committedConfigMap = new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2"));
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenReturn(committedConfigMap, previousConfigMap);
		when(routeService.query("ai-route-test.internal"))
				.thenReturn(Route.builder().version("route-version-1").build());
		BusinessException runtimeWriteFailure = new BusinessException("Runtime resource write failed");
		when(routeService.update(any())).thenThrow(runtimeWriteFailure);

		BusinessException thrown = Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.update(createRoute("new.example.com")));

		Assertions.assertSame(runtimeWriteFailure, thrown);
		verify(kubernetesClientService, times(2)).replaceConfigMap(any());
		verify(routeService, times(1)).update(any());
		verify(kubernetesClientService, never()).deleteEnvoyFilter(anyString());
		verify(routeService, never()).delete(anyString());
	}

	@Test
	public void updateShouldNotRestoreRuntimeResourcesWhenConfigMapRollbackConflicts() throws ApiException {
		AiRoute previousRoute = createRoute("old.example.com");
		when(kubernetesClientService.readConfigMap("ai-route-test"))
				.thenReturn(converter.aiRoute2ConfigMap(previousRoute));
		V1ConfigMap committedConfigMap = new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2"));
		ApiException rollbackConflict = new ApiException(409, "Rollback conflict");
		when(kubernetesClientService.replaceConfigMap(any()))
				.thenReturn(committedConfigMap).thenThrow(rollbackConflict);
		BusinessException runtimeWriteFailure = new BusinessException("Runtime resource write failed");
		when(routeService.query("ai-route-test.internal"))
				.thenReturn(Route.builder().version("route-version-1").build());
		when(routeService.update(any())).thenThrow(runtimeWriteFailure);

		BusinessException thrown = Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.update(createRoute("new.example.com")));

		Assertions.assertSame(runtimeWriteFailure, thrown);
		verify(kubernetesClientService, times(2)).replaceConfigMap(any());
		verify(routeService, times(1)).update(any());
		verifyNoInteractions(llmProviderService, wasmPluginInstanceService);
	}

	private static AiRoute createRoute(String domain) {
		return AiRoute.builder().name("test").version("1")
				.domains(Collections.singletonList(domain)).build();
	}

}
