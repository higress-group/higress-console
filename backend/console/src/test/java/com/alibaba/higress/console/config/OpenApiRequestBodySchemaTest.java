/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.TlsCertificate;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.SwaggerContent;

import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.media.Schema;

/**
 * Ensures Console request DTOs still produce a non-empty OpenAPI schema.
 *
 * <p>
 * Swagger UI can only paint Request Body fields when the generated schema has properties (or a
 * usable $ref). An empty object schema reproduces the blank Request Body panel reported in
 * higress-group/higress#3207, even with a fixed swagger-ui webjar.
 */
class OpenApiRequestBodySchemaTest {

    private static final String CONTROLLER_PACKAGE = "com.alibaba.higress.console.controller";

    private static final List<Class<?>> SAMPLE_BODY_TYPES = Arrays.asList(Route.class, Domain.class,
        ServiceSource.class, TlsCertificate.class, WasmPlugin.class, WasmPluginInstance.class, AiRoute.class,
        LlmProvider.class, Consumer.class, McpServer.class, SwaggerContent.class);

    @Test
    void sampleRequestDtos_exposeNamedProperties() {
        for (Class<?> type : SAMPLE_BODY_TYPES) {
            Schema<?> schema = resolveSchema(type);
            assertNotNull(schema, type.getName() + " must resolve to an OpenAPI schema");
            assertFalse(isEmptyObjectSchema(schema),
                type.getName() + " resolved to an empty object schema; Swagger UI would hide Request Body fields");
        }
    }

    @Test
    void routeSchema_containsTheFieldsShownInSwagger() {
        Schema<?> schema = resolveSchema(Route.class);
        Map<String, Schema> properties = schema.getProperties();
        assertNotNull(properties);
        assertTrue(properties.containsKey("name"), "Route.name");
        assertTrue(properties.containsKey("path"), "Route.path");
        assertTrue(properties.containsKey("domains"), "Route.domains");
        assertTrue(properties.containsKey("services"), "Route.services");
        assertTrue(properties.containsKey("methods"), "Route.methods");
    }

    @Test
    void llmProviderSchema_containsTheFieldsShownInSwagger() {
        Schema<?> schema = resolveSchema(LlmProvider.class);
        Map<String, Schema> properties = schema.getProperties();
        assertNotNull(properties);
        assertTrue(properties.containsKey("name"), "LlmProvider.name");
        assertTrue(properties.containsKey("type"), "LlmProvider.type");
    }

    @Test
    void everyControllerRequestBody_hasARenderableSchema() throws ClassNotFoundException {
        ClassPathScanningCandidateComponentProvider scanner =
            new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(RestController.class));
        Set<BeanDefinition> controllers = scanner.findCandidateComponents(CONTROLLER_PACKAGE);
        assertFalse(controllers.isEmpty(), "expected console REST controllers under " + CONTROLLER_PACKAGE);

        int requestBodyCount = 0;
        Set<String> emptySchemas = new HashSet<String>();
        for (BeanDefinition definition : controllers) {
            Class<?> controller = Class.forName(definition.getBeanClassName());
            for (Method method : controller.getMethods()) {
                for (Parameter parameter : method.getParameters()) {
                    if (!hasRequestBody(parameter)) {
                        continue;
                    }
                    requestBodyCount++;
                    Class<?> bodyType = rawType(parameter.getParameterizedType());
                    if (!isDocumentableBody(bodyType)) {
                        continue;
                    }
                    Schema<?> schema = resolveSchema(bodyType);
                    if (schema == null || isEmptyObjectSchema(schema)) {
                        emptySchemas.add(controller.getSimpleName() + "." + method.getName() + "("
                            + bodyType.getSimpleName() + ")");
                    }
                }
            }
        }

        assertTrue(requestBodyCount >= 20,
            "expected dozens of @RequestBody parameters, found " + requestBodyCount);
        assertTrue(emptySchemas.isEmpty(),
            "these @RequestBody types would render as a blank Request Body in Swagger UI: " + emptySchemas);
    }

    private static Schema<?> resolveSchema(Class<?> type) {
        ResolvedSchema resolved = ModelConverters.getInstance().resolveAsResolvedSchema(new AnnotatedType(type));
        if (resolved == null) {
            return null;
        }
        return resolved.schema;
    }

    private static boolean isEmptyObjectSchema(Schema<?> schema) {
        if (schema == null) {
            return true;
        }
        if (schema.get$ref() != null && !schema.get$ref().isEmpty()) {
            return false;
        }
        if (schema.getProperties() != null && !schema.getProperties().isEmpty()) {
            return false;
        }
        if (schema.getAdditionalProperties() != null) {
            return false;
        }
        if (schema.getAllOf() != null && !schema.getAllOf().isEmpty()) {
            return false;
        }
        if (schema.getOneOf() != null && !schema.getOneOf().isEmpty()) {
            return false;
        }
        if (schema.getAnyOf() != null && !schema.getAnyOf().isEmpty()) {
            return false;
        }
        String schemaType = schema.getType();
        return schemaType == null || "object".equals(schemaType);
    }

    private static boolean hasRequestBody(Parameter parameter) {
        for (Annotation annotation : parameter.getAnnotations()) {
            if (annotation instanceof RequestBody) {
                return true;
            }
        }
        return false;
    }

    private static Class<?> rawType(Type type) {
        if (type instanceof Class) {
            return (Class<?>)type;
        }
        if (type instanceof ParameterizedType) {
            Type raw = ((ParameterizedType)type).getRawType();
            if (raw instanceof Class) {
                return (Class<?>)raw;
            }
        }
        return Object.class;
    }

    private static boolean isDocumentableBody(Class<?> type) {
        if (type == null || type.isPrimitive() || type.isArray() || type.isEnum()) {
            return false;
        }
        Package pkg = type.getPackage();
        if (pkg != null && pkg.getName().startsWith("java.")) {
            return false;
        }
        return true;
    }
}
