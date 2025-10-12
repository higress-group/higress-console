package com.alibaba.higress.console.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.PostConstruct;

import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * 着陆页控制器，用于提供Higress控制台的默认首页
 */
@Slf4j
@RestController
@RequestMapping("/landing")
public class LandingController {

    // 内置着陆页资源路径
    private static final String BUILTIN_LANDING_PAGE = "landing/index.html";

    // 默认着陆页HTML内容，当无法加载内置页面时使用
    private static final String DEFAULT_LANDING_PAGE_HTML = "<h1>Thanks for using Higress.</h1>";

    // 存储实际使用的着陆页HTML内容
    private String landingPageHtml;

    /**
     * 初始化方法，在Bean创建完成后执行
     * 负责加载内置的着陆页HTML文件内容到内存中
     */
    @PostConstruct
    public void initialize() {
        String landingPageHtml;
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(BUILTIN_LANDING_PAGE)) {
            // 从classpath中读取内置着陆页文件并转换为字符串
            landingPageHtml = StreamUtils.copyToString(stream, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            // 如果加载失败，记录错误日志并使用默认HTML内容
            log.error("Error occurs when loading the built-in landing page.", ex);
            landingPageHtml = DEFAULT_LANDING_PAGE_HTML;
        }
        // 将加载的HTML内容保存到实例变量中
        this.landingPageHtml = landingPageHtml;
    }

    /**
     * 处理根路径请求，返回着陆页HTML内容
     *
     * @return 着陆页的HTML内容
     */
    @RequestMapping(produces = "text/html")
    public String index() {
        return landingPageHtml;
    }
}
