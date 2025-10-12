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

// 包声明，表示该类属于配置包的一部分
package com.alibaba.higress.console.config;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.StringUtils;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// 导入各种模型类，这些类将在 OpenAPI 文档中被注册为模式(Schema)
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

/**
 * Swagger 配置类，用于自定义 OpenAPI 文档的行为和内容
 */
@Configuration // 标记此类为Spring配置类
public class SwaggerConfig {

    /**
     * 创建一个分组的 OpenAPI 实例，用于文档展示
     *
     * @return GroupedOpenApi 实例，代表 Higress 控制台 API 的文档分组
     */
    @Bean
    public GroupedOpenApi openApi() {
        // 构建并返回 GroupedOpenApi 对象
        return GroupedOpenApi.builder()
            .group("Higress")                    // 设置分组名称
            .displayName("Higress Console")      // 显示名称
            .addOpenApiCustomiser(this::openApiCustomizer) // 添加自定义器来修改 OpenAPI 配置
            .packagesToScan("com.alibaba.higress.console.controller") // 指定扫描控制器所在的包路径
            .build();                            // 完成构建
    }

    /**
     * 自定义 OpenAPI 配置的方法，设置基本信息、注册枚举类等
     *
     * @param openApi OpenAPI 实例对象，用于添加自定义配置
     */
    @SuppressWarnings("rawtypes")
    private void openApiCustomizer(OpenAPI openApi) {
        // 创建并设置 API 基本信息
        Info apiInfo = new Info()
            .title("Higress Console")                                         // 文档标题
            .contact(new Contact().name("Higress Authors").url("https://github.com/higress-group/higress-console")) // 联系人信息
            .description("Higress is a next-generation cloud-native gateway based on Alibaba's internal gateway practices.") // 描述信息
            .license(new License().name("Apache 2.0").url("http://www.apache.org/licenses/LICENSE-2.0")); // 许可证信息

        openApi.info(apiInfo); // 将信息应用到 OpenAPI 实例上

        // 注册各个枚举类作为 OpenAPI 中的 Schema
        registerClassSchema(openApi, CapabilityKey.class);
        registerClassSchema(openApi, RoutePredicateTypeEnum.class);
        registerClassSchema(openApi, McpServerTypeEnum.class);
        registerClassSchema(openApi, McpServerDBTypeEnum.class);
        registerClassSchema(openApi, LlmProviderType.class);
        registerClassSchema(openApi, LlmProviderProtocol.class);
        registerClassSchema(openApi, AiRouteFallbackStrategy.class);
        registerClassSchema(openApi, CredentialType.class);
        registerClassSchema(openApi, KeyAuthCredentialSource.class);

        // 获取当前已有的 Schemas，并按照字母顺序排序后重新设置
        Map<String, Schema> schemas = openApi.getComponents().getSchemas();
        openApi.getComponents().setSchemas(new TreeMap<>(schemas));
    }

    /**
     * 注册指定类为 OpenAPI Schema
     *
     * @param openApi OpenAPI 实例
     * @param clazz   要注册的类
     */
    private void registerClassSchema(OpenAPI openApi, Class<?> clazz) {
        // 使用 ModelConverters 解析类为 Schema 结构
        ResolvedSchema resolvedSchema = ModelConverters.getInstance()
            .resolveAsResolvedSchema(new AnnotatedType(clazz));

        Schema<?> schema = resolvedSchema.schema; // 获取解析后的 Schema

        // 如果 Schema 名称为空，则使用类简单名称作为默认值
        if (StringUtils.isEmpty(schema.getName())) {
            schema.setName(clazz.getSimpleName());
        }

        // 将 Schema 添加进 OpenAPI 组件中
        openApi.schema(schema.getName(), schema);
    }
}
