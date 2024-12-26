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
package com.alibaba.higress.console;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

@Configuration
@EnableWebMvc
public class WebMvcInitializer implements WebMvcConfigurer {

    private static final List<String> API_PATH_PREFIXES = Arrays.asList("/v1/");

    private static final String HOMEPAGE_PATH = "/index.html";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/*").addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.noCache().mustRevalidate()).setUseLastModified(true).resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource resolveResourceInternal(HttpServletRequest request, @NonNull String requestPath,
                    @NonNull List<? extends Resource> locations, @NonNull ResourceResolverChain chain) {
                    Resource resource = super.resolveResourceInternal(request, requestPath, locations, chain);
                    if (resource == null && API_PATH_PREFIXES.stream().noneMatch(requestPath::startsWith)) {
                        // Resource not found. Fallback to the homepage.
                        resource = super.resolveResourceInternal(request, HOMEPAGE_PATH, locations, chain);
                    }
                    return resource;
                }
            });
    }
}