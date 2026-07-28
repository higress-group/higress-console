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

import com.alibaba.higress.sdk.service.kubernetes.crd.istio.V1alpha3EnvoyFilter;

import io.kubernetes.client.util.Yaml;

import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.runtime.RuntimeConstants;
import org.apache.velocity.runtime.resource.loader.ClasspathResourceLoader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;

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
	public void fallbackPolicyAppliesToOriginalAndFallbackRoutesTest() {
		VelocityContext context = new VelocityContext();
		context.put("responseCodes", Arrays.asList("4xx", "5xx"));
		StringWriter writer = new StringWriter();
		routeFallbackEnvoyFilterConfigTemplate.merge(context, writer);
		String config = writer.toString();

		Assertions.assertEquals(2, config.split("applyTo: HTTP_ROUTE", -1).length - 1);
		Assertions.assertEquals(2, config.split("max_internal_redirects: 10", -1).length - 1);
		Assertions.assertTrue(config.contains("name: \"${routeName}\""));
		Assertions.assertTrue(config.contains("name: \"${fallbackRouteName}\""));

		String resolvedConfig = config.replace("${name}", "primary-route")
			.replace("${routeName}", "primary-route")
			.replace("${fallbackRouteName}", "primary-route-fallback")
			.replace("${fallbackHeader}", "x-higress-fallback-from");
		V1alpha3EnvoyFilter envoyFilter =
			Yaml.getSnakeYaml(V1alpha3EnvoyFilter.class).loadAs(resolvedConfig, V1alpha3EnvoyFilter.class);

		Assertions.assertEquals(2, envoyFilter.getSpec().getConfigPatches().size());
		Assertions.assertEquals("primary-route", envoyFilter.getSpec().getConfigPatches().get(0).getMatch()
			.getRouteConfiguration().getVhost().getRoute().getName());
		Assertions.assertEquals("primary-route-fallback", envoyFilter.getSpec().getConfigPatches().get(1).getMatch()
			.getRouteConfiguration().getVhost().getRoute().getName());
	}

}
