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

import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.ai.AiUpstream;
import com.alibaba.higress.sdk.model.route.UpstreamService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

public class AiRouteServiceTest {

	private static final String ROUTE_NAME = "test";
	private static final String CONFIG_MAP_NAME = "ai-route-test";
	private static final String ROUTE_RESOURCE_NAME = "ai-route-test.internal";
	private static final String PROVIDER_NAME = "provider";
	private static final String CURRENT_VERSION = "2";
	private static final String STALE_VERSION = "1";

	private VelocityEngine velocityEngine;

	private Template routeFallbackEnvoyFilterConfigTemplate;

	private KubernetesModelConverter kubernetesModelConverter;
	private KubernetesClientService kubernetesClientService;
	private RouteService routeService;
	private LlmProviderService llmProviderService;
	private WasmPluginInstanceService wasmPluginInstanceService;
	private AiRouteService aiRouteService;

	@BeforeEach
	public void setUp() {
		this.velocityEngine = new VelocityEngine();
		velocityEngine.setProperty(RuntimeConstants.RESOURCE_LOADER, "classpath");
		velocityEngine.setProperty("classpath.resource.loader.class", ClasspathResourceLoader.class.getName());
		velocityEngine.init();
		this.routeFallbackEnvoyFilterConfigTemplate = velocityEngine.getTemplate(
				"/templates/envoyfilter-route-fallback.yaml", StandardCharsets.UTF_8.name());
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
	public void updateShouldRejectStaleVersionBeforeRuntimeWrites() throws ApiException {
		setUpAiRouteService();
		when(kubernetesClientService.readConfigMap(CONFIG_MAP_NAME)).thenReturn(configMap(CURRENT_VERSION));

		Assertions.assertThrows(ResourceConflictException.class,
				() -> aiRouteService.update(aiRoute(STALE_VERSION)));

		verify(kubernetesClientService).readConfigMap(CONFIG_MAP_NAME);
		verify(kubernetesClientService, never()).replaceConfigMap(any());
		verify(kubernetesClientService, never()).deleteEnvoyFilter(anyString());
		verifyNoInteractions(routeService, llmProviderService, wasmPluginInstanceService);
	}

	@Test
	public void updateShouldKeepFinalCasWhenVersionMatches() throws ApiException {
		setUpAiRouteService();
		when(kubernetesClientService.readConfigMap(CONFIG_MAP_NAME)).thenReturn(configMap(CURRENT_VERSION));

		Assertions.assertThrows(ResourceConflictException.class,
				() -> aiRouteService.update(aiRoute(CURRENT_VERSION)));

		InOrder order = inOrder(kubernetesClientService, routeService);
		order.verify(kubernetesClientService).readConfigMap(CONFIG_MAP_NAME);
		order.verify(routeService).query(ROUTE_RESOURCE_NAME);
		order.verify(kubernetesClientService).replaceConfigMap(any());
	}

	private void setUpAiRouteService() throws ApiException {
		kubernetesModelConverter = mock(KubernetesModelConverter.class);
		kubernetesClientService = mock(KubernetesClientService.class);
		routeService = mock(RouteService.class);
		llmProviderService = mock(LlmProviderService.class);
		wasmPluginInstanceService = mock(WasmPluginInstanceService.class);

		when(kubernetesClientService.loadFromYaml(anyString(), eq(V1alpha3EnvoyFilter.class)))
				.thenReturn(new V1alpha3EnvoyFilter());
		when(kubernetesModelConverter.aiRouteName2ConfigMapName(ROUTE_NAME)).thenReturn(CONFIG_MAP_NAME);
		when(kubernetesModelConverter.aiRoute2ConfigMap(any())).thenReturn(configMap(CURRENT_VERSION));
		when(llmProviderService.buildUpstreamService(PROVIDER_NAME))
				.thenReturn(UpstreamService.builder().name("llm-provider.internal").build());
		when(wasmPluginInstanceService.createEmptyInstance(anyString())).thenReturn(new WasmPluginInstance());
		when(kubernetesClientService.replaceConfigMap(any())).thenThrow(new ApiException(409, "Conflict"));

		aiRouteService = new AiRouteServiceImpl(kubernetesModelConverter, kubernetesClientService, routeService,
				llmProviderService, wasmPluginInstanceService);
	}

	private static AiRoute aiRoute(String version) {
		AiUpstream upstream = AiUpstream.builder().provider(PROVIDER_NAME).weight(100).build();
		return AiRoute.builder().name(ROUTE_NAME).version(version).upstreams(Collections.singletonList(upstream)).build();
	}

	private static V1ConfigMap configMap(String version) {
		return new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion(version));
	}

}
