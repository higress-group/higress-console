package com.alibaba.higress.console;

import java.time.Duration;
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

/**
 * Web MVC配置初始化类，用于配置静态资源处理器和前端路由支持
 * 实现了单页应用(SPA)的路由回退机制，确保前端路由能够正常工作
 */
@Configuration
@EnableWebMvc
public class WebMvcInitializer implements WebMvcConfigurer {

    /**
     * API路径前缀列表，用于区分API请求和静态资源请求
     */
    private static final List<String> API_PATH_PREFIXES = Arrays.asList("/v1/");

    /**
     * 首页路径，用于前端路由回退时返回的默认页面
     */
    private static final String HOMEPAGE_PATH = "/index.html";

    /**
     * 添加资源处理器配置，处理静态资源请求和前端路由回退
     *
     * @param registry 资源处理器注册器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置根路径下的所有请求都映射到classpath:/static/目录
        registry.addResourceHandler("/*").addResourceLocations("classpath:/static/")
            // 设置缓存控制策略：不缓存，必须重新验证
            .setCacheControl(CacheControl.maxAge(Duration.ZERO).mustRevalidate())
            // 启用最后修改时间检查
            .setUseLastModified(true)
            // 启用资源链处理
            .resourceChain(true)
            // 添加自定义路径资源解析器
            .addResolver(new PathResourceResolver() {
                /**
                 * 内部资源解析方法，处理资源查找和前端路由回退逻辑
                 *
                 * @param request HTTP请求对象
                 * @param requestPath 请求路径
                 * @param locations 资源位置列表
                 * @param chain 资源解析链
                 * @return 找到的资源或回退资源
                 */
                @Override
                protected Resource resolveResourceInternal(HttpServletRequest request, @NonNull String requestPath,
                    @NonNull List<? extends Resource> locations, @NonNull ResourceResolverChain chain) {
                    // 调用父类方法尝试查找请求路径对应的资源
                    Resource resource = super.resolveResourceInternal(request, requestPath, locations, chain);
                    // 如果资源未找到且请求路径不是API路径前缀，则回退到首页
                    if (resource == null && API_PATH_PREFIXES.stream().noneMatch(requestPath::startsWith)) {
                        // 资源未找到，且不是API请求，回退到首页处理前端路由
                        resource = super.resolveResourceInternal(request, HOMEPAGE_PATH, locations, chain);
                    }
                    return resource;
                }
            });
    }
}
