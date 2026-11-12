/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
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

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.webjars.WebJarAssetLocator;

/**
 * Guards the swagger-ui webjar pin that fixes empty Request Body panels in Console Swagger UI
 * (higress-group/higress#3207).
 *
 * <p>
 * springdoc-openapi-ui 1.8.0 depends on swagger-ui 5.10.3. That build cannot render requestBody
 * schemas. swagger-ui 5.11.10 is the first release that does; the parent POM pins a later 5.18.x
 * webjar and {@code webjars-locator-core} must resolve it at runtime.
 */
class SwaggerUiWebjarVersionTest {

    /**
     * First swagger-ui release that renders requestBody schemas (see swagger-ui v5.11.10 notes).
     */
    static final String MIN_FIXED_VERSION = "5.11.10";

    /**
     * Default transitive version pulled by springdoc-openapi-ui 1.8.0. Serving this webjar is the
     * regression we must never return to.
     */
    static final String SPRINGDOC_180_DEFAULT = "5.10.3";

    private static final Pattern WEBJAR_VERSION = Pattern.compile("webjars/swagger-ui/([^/]+)/");

    @Test
    void mavenPomProperties_isAtLeastTheRequestBodyFix() throws IOException {
        URL resource = Thread.currentThread().getContextClassLoader()
            .getResource("META-INF/maven/org.webjars/swagger-ui/pom.properties");
        assertNotNull(resource, "swagger-ui webjar must be on the console classpath");

        Properties properties = new Properties();
        InputStream in = resource.openStream();
        try {
            properties.load(in);
        } finally {
            in.close();
        }

        String version = properties.getProperty("version");
        assertNotNull(version, "webjar pom.properties must declare version");
        assertTrue(compareVersions(version, MIN_FIXED_VERSION) >= 0,
            "swagger-ui webjar is " + version + ", need >=" + MIN_FIXED_VERSION
                + " so Request Body schemas render");
        assertTrue(compareVersions(version, SPRINGDOC_180_DEFAULT) > 0,
            "swagger-ui webjar must override springdoc 1.8.0's default " + SPRINGDOC_180_DEFAULT
                + ", got " + version);
    }

    @Test
    void webJarAssetLocator_resolvesPinnedSwaggerUi() {
        WebJarAssetLocator locator = new WebJarAssetLocator();
        String fullPath = locator.getFullPath("swagger-ui", "swagger-ui.css");
        assertNotNull(fullPath, "webjars-locator-core must find swagger-ui.css");
        assertFalse(fullPath.contains("/" + SPRINGDOC_180_DEFAULT + "/"),
            "locator must not serve springdoc's broken 5.10.3 webjar, path=" + fullPath);

        Matcher matcher = WEBJAR_VERSION.matcher(fullPath);
        assertTrue(matcher.find(), "unexpected webjar path: " + fullPath);
        String version = matcher.group(1);
        assertTrue(compareVersions(version, MIN_FIXED_VERSION) >= 0,
            "locator resolved swagger-ui " + version + ", need >=" + MIN_FIXED_VERSION);
    }

    @Test
    void compareVersions_coversBoundaryCases() {
        assertTrue(compareVersions("5.11.10", "5.11.10") == 0);
        assertTrue(compareVersions("5.11.10", "5.10.3") > 0);
        assertTrue(compareVersions("5.10.3", "5.11.10") < 0);
        assertTrue(compareVersions("5.18.2", "5.11.10") > 0);
        assertTrue(compareVersions("5.18", "5.18.0") == 0);
        assertTrue(compareVersions("5.18.2", "5.18") > 0);
        assertTrue(compareVersions("5", "5.0.0") == 0);
    }

    /**
     * Numeric dotted-version compare. Missing trailing segments are treated as 0.
     */
    static int compareVersions(String left, String right) {
        if (left == null || right == null) {
            fail("version must not be null");
        }
        String[] leftParts = left.split("\\.");
        String[] rightParts = right.split("\\.");
        int length = Math.max(leftParts.length, rightParts.length);
        for (int i = 0; i < length; i++) {
            int leftValue = i < leftParts.length ? parseSegment(leftParts[i]) : 0;
            int rightValue = i < rightParts.length ? parseSegment(rightParts[i]) : 0;
            if (leftValue != rightValue) {
                return Integer.compare(leftValue, rightValue);
            }
        }
        return 0;
    }

    private static int parseSegment(String segment) {
        String digits = segment.replaceAll("[^0-9].*$", "");
        if (digits.isEmpty()) {
            return 0;
        }
        return Integer.parseInt(digits);
    }
}
