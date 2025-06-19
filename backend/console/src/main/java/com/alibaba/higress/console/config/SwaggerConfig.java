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
package com.alibaba.higress.console.config;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.StringUtils;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.higress.console.constant.CapabilityKey;
import com.alibaba.higress.sdk.model.ai.AiRouteFallbackStrategy;
import com.alibaba.higress.sdk.model.ai.LlmProviderProtocol;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredentialSource;
import com.alibaba.higress.sdk.model.mcp.McpServerDBTypeEnum;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;

import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.core.converter.ResolvedSchema;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Schema;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi openApi() {
        return GroupedOpenApi.builder().group("Higress").displayName("Higress Console")
            .addOpenApiCustomiser(this::openApiCustomizer).packagesToScan("com.alibaba.higress.console.controller")
            .build();
    }

    @SuppressWarnings("rawtypes")
    private void openApiCustomizer(OpenAPI openApi) {
        Info apiInfo = new Info().title("Higress Console")
            .contact(new Contact().name("Higress Authors").url("https://github.com/higress-group/higress-console"))
            .description(
                "Higress is a next-generation cloud-native gateway based on Alibaba's internal gateway practices.")
            .license(new License().name("Apache 2.0").url("http://www.apache.org/licenses/LICENSE-2.0"));
        openApi.info(apiInfo);

        registerClassSchema(openApi, CapabilityKey.class);
        registerClassSchema(openApi, RoutePredicateTypeEnum.class);
        registerClassSchema(openApi, McpServerTypeEnum.class);
        registerClassSchema(openApi, McpServerDBTypeEnum.class);
        registerClassSchema(openApi, LlmProviderType.class);
        registerClassSchema(openApi, LlmProviderProtocol.class);
        registerClassSchema(openApi, AiRouteFallbackStrategy.class);
        registerClassSchema(openApi, CredentialType.class);
        registerClassSchema(openApi, KeyAuthCredentialSource.class);

        Map<String, Schema> schemas = openApi.getComponents().getSchemas();
        openApi.getComponents().setSchemas(new TreeMap<>(schemas));
    }

    private void registerClassSchema(OpenAPI openApi, Class<?> clazz) {
        ResolvedSchema resolvedSchema = ModelConverters.getInstance().resolveAsResolvedSchema(new AnnotatedType(clazz));
        Schema<?> schema = resolvedSchema.schema;
        if (StringUtils.isEmpty(schema.getName())) {
            schema.setName(clazz.getSimpleName());
        }
        openApi.schema(schema.getName(), schema);
    }
}
