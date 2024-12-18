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

import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi openApi() {
        Info apiInfo = new Info().title("Higress Console")
            .contact(new Contact().name("CH3CHO").url("https://github.com/higress-group/higress-console")
                .email("ch3cho@qq.com"))
            .description(
                "Higress is a next-generation cloud-native gateway based on Alibaba's internal gateway practices.")
            .license(new License().name("Apache 2.0").url("http://www.apache.org/licenses/LICENSE-2.0"));
        return GroupedOpenApi.builder().group("Higress").displayName("Higress Console")
            .addOpenApiCustomiser(openApi -> openApi.info(apiInfo))
            .packagesToScan("com.alibaba.higress.console.controller").build();
    }
}
