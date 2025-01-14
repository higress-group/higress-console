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
package com.alibaba.higress.console;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

@Disabled
public class FrontEndI18nResourceChecker {

    private static final String FRONTEND_PROJECT_PATH = "";
    private static final String I18N_RESOURCE_PATH = "src/locales";
    private static final String I18N_RESOURCE_FILE_NAME = "translation.json";
    private static final List<String> TS_FILE_EXTENSIONS = Arrays.asList(".ts", ".tsx");

    private static final Set<String> IMPLICITLY_USED_RESOURCE_KEYS = Set.of("init.title", "login.title", "aiRoute.edit",
        "tlsCertificate.editTlsCertificate", "serviceSource.editServiceSource", "llmProvider.edit",
        "plugins.editPlugin", "route.editRoute", "domain.editDomain", "consumer.edit");
    private static final List<String> IMPLICITLY_USED_RESOURCE_KEY_PREFIXES =
        Arrays.asList("menu.", "request.error.", "serviceSource.types.", "llmProvider.providerTypes.",
            "route.factorGroup.required.", "route.keyValueGroup.required.", "plugins.configForm.", "plugins.subTitle.");

    private static final String LANG_CN = "zh-CN";
    private static final String LANG_EN = "en-US";

    private static final List<Pattern> RESOURCE_USAGE_PATTERNS = Arrays.asList(Pattern.compile("\\bt\\('([^']+)'\\)"),
        Pattern.compile("t\\(\"([^\"]+)\"\\)"), Pattern.compile("\\bi18nKey=\"([^\"]+)\""));
    private static final Pattern BAD_RESOURCE_CONTENT = Pattern.compile("^[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)+$");

    @Test
    public void checkI18nResourceUsages() throws IOException {
        Map<String, String> cnResources = loadI18nResources(LANG_CN);
        Set<String> usedResources = new TreeSet<>();
        Set<String> badResources = new TreeSet<>();
        Set<String> unknownResources = new TreeSet<>();
        try (Stream<Path> stream = Files.walk(Paths.get(FRONTEND_PROJECT_PATH))) {
            stream.filter(p -> {
                String s = p.toString();
                return !s.contains("node_modules") && TS_FILE_EXTENSIONS.stream().anyMatch(s::endsWith);
            }).forEach(p -> {
                String content;
                try {
                    content = Files.readString(p, StandardCharsets.UTF_8);
                } catch (IOException e) {
                    System.out.println("Failed to read file: " + p);
                    return;
                }
                Set<String> referredResources = getReferredResources(content);
                usedResources.addAll(referredResources);
                referredResources.forEach(k -> {
                    if (!cnResources.containsKey(k)) {
                        unknownResources.add(k);
                    }
                });
            });
        }
        System.out.println("Unused resources:");
        for (String key : cnResources.keySet()) {
            if (IMPLICITLY_USED_RESOURCE_KEYS.contains(key)) {
                continue;
            }
            if (IMPLICITLY_USED_RESOURCE_KEY_PREFIXES.stream().anyMatch(key::startsWith)) {
                continue;
            }
            if (!usedResources.contains(key)) {
                System.out.println(key);
            }
            String value = cnResources.get(key);
            if (BAD_RESOURCE_CONTENT.matcher(value).matches()) {
                badResources.add(key);
            }
        }
        System.out.println("-------------------------------------");
        System.out.println("Bad resources:");
        for (String key : badResources) {
            System.out.printf("\"%s\": \"%s\",\n", key, cnResources.get(key));
        }
        System.out.println("-------------------------------------");
        System.out.println("Unknown resources:");
        for (String key : unknownResources) {
            String lastSegment = key.substring(key.lastIndexOf('.') + 1);
            System.out.printf("\"%s\": \"%s\",\n", lastSegment, key);
        }
    }

    @Test
    public void checkI18nResourcesAlignment() throws IOException {
        Map<String, String> cnResources = loadI18nResources(LANG_CN);
        Map<String, String> enResources = loadI18nResources(LANG_EN);
        Set<String> commonKeys = new HashSet<>(cnResources.keySet());
        commonKeys.retainAll(enResources.keySet());
        commonKeys.forEach(k -> {
            cnResources.remove(k);
            enResources.remove(k);
        });
        System.out.println("Chinese resources without English translation:");
        for (String key : cnResources.keySet()) {
            System.out.println(key);
        }
        System.out.println();
        System.out.println("English resources without Chinese translation:");
        for (String key : enResources.keySet()) {
            System.out.println(key);
        }
    }

    @Test
    public void checkUntranslatedEnglishResources() throws IOException {
        Map<String, String> enResources = loadI18nResources(LANG_EN);
        for (Map.Entry<String, String> entry : enResources.entrySet()) {
            if (hasChinese(entry.getValue())) {
                System.out.println(entry.getKey());
            }
        }
    }

    private boolean hasChinese(String str) {
        for (int i = 0, len = str.length(); i < len; ++i) {
            char ch = str.charAt(i);
            if (Character.UnicodeScript.of(ch) == Character.UnicodeScript.HAN) {
                return true;
            }
        }
        return false;
    }

    private static Set<String> getReferredResources(String content) {
        Set<String> result = new HashSet<>();
        for (Pattern pattern : RESOURCE_USAGE_PATTERNS) {
            Matcher matcher = pattern.matcher(content);
            while (matcher.find()) {
                String key = matcher.group(1);
                result.add(key);
            }
        }
        return result;
    }

    private static Map<String, String> loadI18nResources(String language) throws IOException {
        Path resourceFilePath = Paths.get(FRONTEND_PROJECT_PATH, I18N_RESOURCE_PATH, language, I18N_RESOURCE_FILE_NAME);
        String json = Files.readString(resourceFilePath, StandardCharsets.UTF_8);
        JSONObject obj = JSON.parseObject(json);
        Map<String, String> resources = new LinkedHashMap<>();
        addI18nResources(resources, obj, "");
        return resources;
    }

    private static void addI18nResources(Map<String, String> resources, JSONObject obj, String prefix) {
        for (Map.Entry<String, Object> entry : obj.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof JSONObject) {
                addI18nResources(resources, (JSONObject)value, prefix + key + ".");
            } else {
                resources.put(prefix + key, value.toString());
            }
        }
    }
}
