/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.console.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.PostConstruct;

import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.aop.AllowAnonymous;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/landing")
@AllowAnonymous
public class LandingController {

    private static final String BUILTIN_LANDING_PAGE = "landing/index.html";
    private static final String DEFAULT_LANDING_PAGE_HTML = "<h1>Thanks for using Higress.</h1>";

    private String landingPageHtml;

    @PostConstruct
    public void initialize() {
        String landingPageHtml;
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(BUILTIN_LANDING_PAGE)) {
            landingPageHtml = StreamUtils.copyToString(stream, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            log.error("Error occurs when loading the built-in landing page.", ex);
            landingPageHtml = DEFAULT_LANDING_PAGE_HTML;
        }
        this.landingPageHtml = landingPageHtml;
    }

    @RequestMapping(produces = "text/html")
    public String index() {
        return landingPageHtml;
    }
}
