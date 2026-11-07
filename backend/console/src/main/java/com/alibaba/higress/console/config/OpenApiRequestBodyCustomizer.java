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

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.parameters.RequestBody;

/**
 * Makes requestBody entries renderable in Swagger UI.
 *
 * <p>
 * springdoc may emit a request body whose only media type is the wildcard type when a controller
 * method uses {@code @RequestBody} without an explicit {@code consumes} value. Older Swagger UI
 * builds (and the 5.10.x webjar bundled by springdoc 1.8.0) then show an empty Request Body
 * panel. Copying that media type onto {@code application/json} gives the UI a concrete schema
 * to display, which is what all-in-one users hit in higress-group/higress#3207.
 */
public final class OpenApiRequestBodyCustomizer {

    public static final String APPLICATION_JSON = "application/json";
    public static final String WILDCARD = "*/*";

    private OpenApiRequestBodyCustomizer() {}

    public static void normalize(OpenAPI openApi) {
        if (openApi == null || openApi.getPaths() == null) {
            return;
        }
        for (PathItem pathItem : openApi.getPaths().values()) {
            normalizePathItem(pathItem);
        }
    }

    static void normalizePathItem(PathItem pathItem) {
        if (pathItem == null) {
            return;
        }
        List<Operation> operations = pathItem.readOperations();
        if (operations == null) {
            return;
        }
        for (Operation operation : operations) {
            normalizeOperation(operation);
        }
    }

    static void normalizeOperation(Operation operation) {
        if (operation == null) {
            return;
        }
        RequestBody requestBody = operation.getRequestBody();
        if (requestBody == null) {
            return;
        }
        Content content = requestBody.getContent();
        if (content == null || content.isEmpty()) {
            return;
        }
        if (hasJsonMediaType(content)) {
            return;
        }
        MediaType source = firstRenderableMediaType(content);
        if (source == null) {
            return;
        }
        content.addMediaType(APPLICATION_JSON, source);
    }

    private static boolean hasJsonMediaType(Content content) {
        for (String mediaType : content.keySet()) {
            if (mediaType != null && mediaType.startsWith(APPLICATION_JSON)) {
                return true;
            }
        }
        return false;
    }

    private static MediaType firstRenderableMediaType(Content content) {
        MediaType wildcard = content.get(WILDCARD);
        if (wildcard != null) {
            return wildcard;
        }
        for (Map.Entry<String, MediaType> entry : content.entrySet()) {
            if (entry.getValue() != null) {
                return entry.getValue();
            }
        }
        return null;
    }
}
