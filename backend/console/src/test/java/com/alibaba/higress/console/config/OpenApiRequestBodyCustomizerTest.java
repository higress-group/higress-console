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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.RequestBody;

/**
 * Regression tests for the requestBody media-type rewrite that makes Swagger UI show body fields
 * (higress-group/higress#3207).
 */
class OpenApiRequestBodyCustomizerTest {

    @Test
    void normalize_nullOpenApi_isNoOp() {
        OpenApiRequestBodyCustomizer.normalize(null);
    }

    @Test
    void normalize_emptyPaths_isNoOp() {
        OpenAPI openApi = new OpenAPI();
        OpenApiRequestBodyCustomizer.normalize(openApi);
        assertNull(openApi.getPaths());
    }

    @Test
    void normalize_nullPathItem_isSkipped() {
        OpenAPI openApi = new OpenAPI();
        Paths paths = new Paths();
        paths.put("/v1/routes", null);
        openApi.setPaths(paths);

        OpenApiRequestBodyCustomizer.normalize(openApi);

        assertTrue(openApi.getPaths().containsKey("/v1/routes"));
        assertNull(openApi.getPaths().get("/v1/routes"));
    }

    @Test
    void normalize_operationWithoutRequestBody_isUnchanged() {
        Operation get = new Operation().operationId("listRoutes");
        PathItem pathItem = new PathItem().get(get);
        OpenAPI openApi = openApiWithPath("/v1/routes", pathItem);

        OpenApiRequestBodyCustomizer.normalize(openApi);

        assertNull(get.getRequestBody());
    }

    @Test
    void normalize_requestBodyWithoutContent_isUnchanged() {
        RequestBody requestBody = new RequestBody().required(true);
        Operation post = new Operation().operationId("addRoute").requestBody(requestBody);
        OpenAPI openApi = openApiWithPath("/v1/routes", new PathItem().post(post));

        OpenApiRequestBodyCustomizer.normalize(openApi);

        assertNull(post.getRequestBody().getContent());
    }

    @Test
    void normalize_emptyContent_isUnchanged() {
        RequestBody requestBody = new RequestBody().content(new Content());
        Operation post = new Operation().operationId("addRoute").requestBody(requestBody);
        OpenAPI openApi = openApiWithPath("/v1/routes", new PathItem().post(post));

        OpenApiRequestBodyCustomizer.normalize(openApi);

        assertTrue(post.getRequestBody().getContent().isEmpty());
    }

    @Test
    void normalize_wildcardOnly_copiesSchemaOntoApplicationJson() {
        Schema<?> routeSchema = new ObjectSchema().addProperty("name", new StringSchema())
            .addProperty("path", new ObjectSchema());
        MediaType wildcard = new MediaType().schema(routeSchema);
        Content content = new Content().addMediaType(OpenApiRequestBodyCustomizer.WILDCARD, wildcard);
        Operation post = operationWithContent("addRoute", content);
        OpenAPI openApi = openApiWithPath("/v1/routes", new PathItem().post(post).put(operationWithContent("updateRoute",
            new Content().addMediaType(OpenApiRequestBodyCustomizer.WILDCARD, wildcard))));

        OpenApiRequestBodyCustomizer.normalize(openApi);

        MediaType json = post.getRequestBody().getContent().get(OpenApiRequestBodyCustomizer.APPLICATION_JSON);
        assertNotNull(json, "application/json must be added so Swagger UI can render the body");
        assertSame(routeSchema, json.getSchema());
        assertNotNull(json.getSchema().getProperties());
        assertTrue(json.getSchema().getProperties().containsKey("name"));
        assertTrue(json.getSchema().getProperties().containsKey("path"));

        MediaType putJson = openApi.getPaths().get("/v1/routes").getPut().getRequestBody().getContent()
            .get(OpenApiRequestBodyCustomizer.APPLICATION_JSON);
        assertNotNull(putJson);
        assertSame(routeSchema, putJson.getSchema());
    }

    @Test
    void normalize_existingApplicationJson_isLeftAlone() {
        Schema<?> original = new ObjectSchema().addProperty("name", new StringSchema());
        MediaType json = new MediaType().schema(original);
        Content content = new Content().addMediaType(OpenApiRequestBodyCustomizer.APPLICATION_JSON, json);
        Operation post = operationWithContent("addRoute", content);

        OpenApiRequestBodyCustomizer.normalize(openApiWithPath("/v1/routes", new PathItem().post(post)));

        Content after = post.getRequestBody().getContent();
        assertEquals(1, after.size());
        assertSame(original, after.get(OpenApiRequestBodyCustomizer.APPLICATION_JSON).getSchema());
    }

    @Test
    void normalize_jsonWithCharset_isTreatedAsAlreadyJson() {
        MediaType json = new MediaType().schema(new ObjectSchema().addProperty("name", new StringSchema()));
        Content content = new Content().addMediaType("application/json;charset=UTF-8", json);
        Operation post = operationWithContent("addRoute", content);

        OpenApiRequestBodyCustomizer.normalize(openApiWithPath("/v1/routes", new PathItem().post(post)));

        assertNull(post.getRequestBody().getContent().get(OpenApiRequestBodyCustomizer.APPLICATION_JSON));
        assertNotNull(post.getRequestBody().getContent().get("application/json;charset=UTF-8"));
    }

    @Test
    void normalize_xmlOnly_copiesOntoApplicationJson() {
        Schema<?> schema = new ObjectSchema().addProperty("name", new StringSchema());
        MediaType xml = new MediaType().schema(schema);
        Content content = new Content().addMediaType("application/xml", xml);
        Operation post = operationWithContent("addRoute", content);

        OpenApiRequestBodyCustomizer.normalize(openApiWithPath("/v1/routes", new PathItem().post(post)));

        MediaType json = post.getRequestBody().getContent().get(OpenApiRequestBodyCustomizer.APPLICATION_JSON);
        assertNotNull(json);
        assertSame(schema, json.getSchema());
        assertNotNull(post.getRequestBody().getContent().get("application/xml"));
    }

    @Test
    void normalize_getAndDeleteAreStillVisitedButStayBodyless() {
        PathItem pathItem = new PathItem().get(new Operation().operationId("getRoute"))
            .delete(new Operation().operationId("deleteRoute"));
        OpenAPI openApi = openApiWithPath("/v1/routes/{name}", pathItem);

        OpenApiRequestBodyCustomizer.normalize(openApi);

        assertNull(pathItem.getGet().getRequestBody());
        assertNull(pathItem.getDelete().getRequestBody());
    }

    private static Operation operationWithContent(String operationId, Content content) {
        return new Operation().operationId(operationId).requestBody(new RequestBody().required(true).content(content));
    }

    private static OpenAPI openApiWithPath(String path, PathItem pathItem) {
        OpenAPI openApi = new OpenAPI();
        Paths paths = new Paths();
        paths.addPathItem(path, pathItem);
        openApi.setPaths(paths);
        return openApi;
    }
}
