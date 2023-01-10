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
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableOpenApi
public class SwaggerConfig {

    @Value("${swagger.enabled}")
    Boolean swaggerEnabled;

    @Bean
    public Docket petApi() {
        ApiInfo apiInfo = new ApiInfoBuilder().title("Higress Console")
                .contact(new Contact("Rick", "https://github.com/alibaba/higress", "xxiuhui@qq.com"))
                .description("Higress is a next-generation cloud-native gateway based on Alibaba's internal gateway practices.")
                .license("test")
                .licenseUrl("test")
                .version("1.0")
                .termsOfServiceUrl("URL")
                .build();
        return new Docket(DocumentationType.OAS_30).apiInfo(apiInfo)
                .enable(true)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.alibaba.higress.console.controller"))
                .paths(PathSelectors.any())
                .build()
                .pathMapping("/");
    }

}
