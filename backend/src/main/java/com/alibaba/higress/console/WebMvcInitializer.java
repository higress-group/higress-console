package com.alibaba.higress.console;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Configuration
@EnableWebMvc
public class WebMvcInitializer implements WebMvcConfigurer {

    private static final String HOMEPAGE_PATH = "/index.html";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/*")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource resolveResourceInternal(HttpServletRequest request, @NonNull String requestPath,
                                                               @NonNull List<? extends Resource> locations,
                                                               @NonNull ResourceResolverChain chain) {
                        Resource resource = super.resolveResourceInternal(request, requestPath, locations, chain);
                        if (resource == null) {
                            // Resource not found. Fallback to the homepage.
                            resource = super.resolveResourceInternal(request, HOMEPAGE_PATH, locations, chain);
                        }
                        return resource;
                    }
                });
    }
}