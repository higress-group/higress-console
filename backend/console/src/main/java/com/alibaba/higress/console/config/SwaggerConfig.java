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

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.oas.annotations.EnableOpenApi;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@EnableOpenApi
public class SwaggerConfig {

    @Bean
    public Docket docket() {
        ApiInfo apiInfo = new ApiInfoBuilder().title("Higress Console")
            .contact(new Contact("CH3CHO", "https://github.com/higress-group/higress-console", "ch3cho@qq.com"))
            .description(
                "Higress is a next-generation cloud-native gateway based on Alibaba's internal gateway practices.")
            .license("Apache 2.0").licenseUrl("http://www.apache.org/licenses/LICENSE-2.0").build();
        return new Docket(DocumentationType.OAS_30).apiInfo(apiInfo).enable(true).select()
            .apis(RequestHandlerSelectors.basePackage("com.alibaba.higress.console.controller"))
            .paths(PathSelectors.any()).build().pathMapping("/");
    }
}
