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

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.io.StringWriter;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.constant.plugin.config.ModelMapperConfig;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.ai.AiUpstream;
import com.alibaba.higress.sdk.model.route.UpstreamService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;
import com.alibaba.higress.sdk.util.MapUtil;

public class AiRouteServiceTest {

	private VelocityEngine velocityEngine;

	private Template routeFallbackEnvoyFilterConfigTemplate;

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
	public void modelMappingsAreMergedByServiceWithHigherWeightPrecedence() throws Exception {
		KubernetesModelConverter kubernetesModelConverter = mock(KubernetesModelConverter.class);
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		RouteService routeService = mock(RouteService.class);
		LlmProviderService llmProviderService = mock(LlmProviderService.class);
		WasmPluginInstanceService wasmPluginInstanceService = mock(WasmPluginInstanceService.class);

		when(kubernetesClientService.loadFromYaml(anyString(), eq(V1alpha3EnvoyFilter.class)))
				.thenReturn(new V1alpha3EnvoyFilter());
		when(llmProviderService.buildUpstreamService("shared-provider"))
				.thenReturn(UpstreamService.builder().name("shared-provider.dns").build());
		when(wasmPluginInstanceService.createEmptyInstance(BuiltInPluginName.MODEL_MAPPER))
				.thenReturn(WasmPluginInstance.builder().build());

		AiRouteServiceImpl service = new AiRouteServiceImpl(kubernetesModelConverter, kubernetesClientService,
				routeService, llmProviderService, wasmPluginInstanceService);
		List<AiUpstream> upstreams = Arrays.asList(
				AiUpstream.builder().provider("shared-provider").weight(100)
						.modelMapping(MapUtil.of("*", "high-weight-model")).build(),
				AiUpstream.builder().provider("shared-provider").weight(0)
						.modelMapping(MapUtil.of("*", "low-weight-model", "glm", "glm-model")).build(),
				AiUpstream.builder().provider("shared-provider").weight(200).modelMapping(Collections.emptyMap())
						.build());
		Map<WasmPluginInstanceScope, String> expectedTargets =
				MapUtil.of(WasmPluginInstanceScope.ROUTE, "ai-route-test.internal", WasmPluginInstanceScope.SERVICE,
						"shared-provider.dns");

		Method method = AiRouteServiceImpl.class.getDeclaredMethod("writeModelMappingResources", String.class,
				List.class);
		method.setAccessible(true);
		method.invoke(service, "ai-route-test.internal", upstreams);

		ArgumentCaptor<WasmPluginInstance> instanceCaptor = ArgumentCaptor.forClass(WasmPluginInstance.class);
		verify(wasmPluginInstanceService, times(1)).addOrUpdate(instanceCaptor.capture());
		verify(wasmPluginInstanceService, never()).delete(expectedTargets, BuiltInPluginName.MODEL_MAPPER, true);

		WasmPluginInstance instance = instanceCaptor.getValue();
		Assertions.assertEquals(expectedTargets, instance.getTargets());
		Assertions.assertTrue(instance.getEnabled());
		Assertions.assertTrue(instance.getInternal());
		Assertions.assertEquals(MapUtil.of("*", "high-weight-model", "glm", "glm-model"),
				instance.getConfigurations().get(ModelMapperConfig.MODEL_MAPPING));
	}

}
