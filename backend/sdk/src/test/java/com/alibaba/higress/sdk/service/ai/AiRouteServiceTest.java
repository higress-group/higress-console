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

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

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
	public void validateResourceVersionShouldAllowCurrentVersion() throws ApiException {
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		when(kubernetesClientService.readConfigMap("ai-route-test"))
				.thenReturn(new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2")));

		AiRouteServiceImpl aiRouteService = createAiRouteService(kubernetesClientService);
		AiRoute route = AiRoute.builder().name("test").version("2").build();

		Assertions.assertDoesNotThrow(() -> aiRouteService.validateResourceVersion(route));
	}

	@Test
	public void validateResourceVersionShouldRejectStaleVersion() throws ApiException {
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		when(kubernetesClientService.readConfigMap("ai-route-test"))
				.thenReturn(new V1ConfigMap().metadata(new V1ObjectMeta().resourceVersion("2")));

		AiRouteServiceImpl aiRouteService = createAiRouteService(kubernetesClientService);
		AiRoute route = AiRoute.builder().name("test").version("1").build();

		Assertions.assertThrows(ResourceConflictException.class,
				() -> aiRouteService.validateResourceVersion(route));
	}

	@Test
	public void validateResourceVersionShouldFailWhenConfigMapReadFails() throws ApiException {
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		ApiException apiException = new ApiException(500, "Failed to read ConfigMap");
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenThrow(apiException);

		AiRouteServiceImpl aiRouteService = createAiRouteService(kubernetesClientService);
		AiRoute route = AiRoute.builder().name("test").version("1").build();

		BusinessException exception = Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.validateResourceVersion(route));
		Assertions.assertSame(apiException, exception.getCause());
	}

	@Test
	public void validateResourceVersionShouldFailWhenConfigMapIsMissing() throws ApiException {
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(null);

		AiRouteServiceImpl aiRouteService = createAiRouteService(kubernetesClientService);
		AiRoute route = AiRoute.builder().name("test").version("1").build();

		Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.validateResourceVersion(route));
	}

	@Test
	public void validateResourceVersionShouldFailWhenMetadataIsMissing() throws ApiException {
		KubernetesClientService kubernetesClientService = mock(KubernetesClientService.class);
		when(kubernetesClientService.readConfigMap("ai-route-test")).thenReturn(new V1ConfigMap());

		AiRouteServiceImpl aiRouteService = createAiRouteService(kubernetesClientService);
		AiRoute route = AiRoute.builder().name("test").version("1").build();

		Assertions.assertThrows(BusinessException.class,
				() -> aiRouteService.validateResourceVersion(route));
	}

	private static AiRouteServiceImpl createAiRouteService(KubernetesClientService kubernetesClientService)
			throws ApiException {
		when(kubernetesClientService.loadFromYaml(anyString(), eq(V1alpha3EnvoyFilter.class)))
				.thenReturn(new V1alpha3EnvoyFilter());
		return new AiRouteServiceImpl(new KubernetesModelConverter(kubernetesClientService),
				kubernetesClientService, null, null, null);
	}

}
