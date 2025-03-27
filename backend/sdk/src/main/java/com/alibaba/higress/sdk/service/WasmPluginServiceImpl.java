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
package com.alibaba.higress.sdk.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.lang.reflect.Method;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.NotFoundException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginConfig;
import com.alibaba.higress.sdk.model.WasmPluginPageQuery;
import com.alibaba.higress.sdk.model.wasmplugin.Language;
import com.alibaba.higress.sdk.model.wasmplugin.Plugin;
import com.alibaba.higress.sdk.model.wasmplugin.PluginCategory;
import com.alibaba.higress.sdk.model.wasmplugin.PluginInfo;
import com.alibaba.higress.sdk.model.wasmplugin.PluginSpec;
import com.alibaba.higress.sdk.service.kubernetes.ImageUrl;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPlugin;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.V1alpha1WasmPluginSpec;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.annotations.VisibleForTesting;

import io.kubernetes.client.openapi.ApiException;
import io.swagger.v3.core.util.Json;
import io.swagger.v3.core.util.Yaml;
import io.swagger.v3.oas.models.media.Schema;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * @author CH3CHO
 */
@Slf4j
class WasmPluginServiceImpl implements WasmPluginService {

    private static final String PLUGINS_RESOURCE_FOLDER = "plugins/";
    private static final String PLUGINS_PROPERTIES_FILE = PLUGINS_RESOURCE_FOLDER + "plugins.properties";
    private static final String SPEC_FILE = "spec.yaml";
    private static final String README_FILE = "README.md";
    private static final String README_CN_FILE = "README_CN.md";
    private static final String README_EN_FILE = "README_EN.md";
    private static final String ICON_FILE = "icon.png";
    private static final String ICON_DATA_PREFIX = "data:image/png;base64,";
    private static final Charset CHARSET = StandardCharsets.UTF_8;
    private static final Pattern I18N_EXTENSION_KEY_PATTERN = Pattern.compile("^x-(.+)-i18n$");
    private static final String DEFAULT_PLUGIN_VERSION = "1.0.0";

    private static final String EXAMPLE_RAW_PROPERTY_NAME = "x-example-raw";

    private static final Pattern YAML_CONTENT_PATTERN = Pattern.compile("^(\\s*)(\\S.*)\\s*$");
    private static final String CONFIG_SCHEMA_PROPERTY_KEY = "configSchema:";
    private static final String OPEN_API_V3_SCHEMA_PROPERTY_KEY = "openAPIV3Schema:";
    private static final String YAML_EXAMPLE_PROPERTY_KEY = "example:";

    private static final String NAME_PLACEHOLDER = "${name}";
    private static final String VERSION_PLACEHOLDER = "${version}";

    private static final String CUSTOM_IMAGE_URL_PATTERN_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_CUSTOM_IMAGE_URL_PATTERN";
    private static final String CUSTOM_IMAGE_URL_PATTERN_PROPERTY = "higress-admin.wasmplugin.custom-image-url-pattern";
    private static final String CUSTOM_IMAGE_PULL_SECRET_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_SECRET";
    private static final String CUSTOM_IMAGE_PULL_POLICY_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_POLICY";
    private static final String CUSTOM_IMAGE_PULL_SECRET_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-sercret";
    private static final String CUSTOM_IMAGE_PULL_POLICY_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-policy";

    private volatile List<PluginCacheItem> builtInPlugins = Collections.emptyList();

    private final KubernetesClientService kubernetesClientService;

    private final KubernetesModelConverter kubernetesModelConverter;

    public WasmPluginServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @PostConstruct
    public void initialize() {
        Properties properties = new Properties();
        try (InputStream stream = getResourceAsStream(PLUGINS_PROPERTIES_FILE)) {
            properties.load(stream);
        } catch (IOException ex) {
            throw new IllegalStateException("Error occurs when loading built-in plugin list.", ex);
        }

        final List<PluginCacheItem> plugins = new ArrayList<>(properties.size());

        final String customImageUrlPattern = loadCustomConf(CUSTOM_IMAGE_URL_PATTERN_PROPERTY,CUSTOM_IMAGE_URL_PATTERN_ENV);

        for (Object key : properties.keySet()) {
            String pluginName = (String)key;
            String imageUrl = properties.getProperty(pluginName);
            if (StringUtils.isEmpty(imageUrl)) {
                continue;
            }

            PluginCacheItem cacheItem = new PluginCacheItem(pluginName);

            final String pluginFolder = PLUGINS_RESOURCE_FOLDER + pluginName + "/";
            try (InputStream stream = getResourceAsStream(pluginFolder + SPEC_FILE)) {
                if (stream == null) {
                    // No spec. Ignore it.
                    continue;
                }
                String content = IOUtils.toString(stream, CHARSET);
                Plugin plugin = Yaml.mapper().readValue(content, Plugin.class);
                fillPluginConfigExample(plugin, content);
                cacheItem.plugin = plugin;
            } catch (IOException ex) {
                throw new IllegalStateException("Error occurs when loading spec file of plugin " + pluginName + ".",
                    ex);
            }

            cacheItem.imageUrl = StringUtils.isBlank(customImageUrlPattern) ? imageUrl
                : formatImageUrl(customImageUrlPattern, cacheItem.plugin.getInfo());

            cacheItem.imagePullSecret = loadCustomConf(CUSTOM_IMAGE_PULL_SECRET_PROPERTY,CUSTOM_IMAGE_PULL_SECRET_ENV);
            cacheItem.imagePullPolicy = loadCustomConf(CUSTOM_IMAGE_PULL_POLICY_PROPERTY,CUSTOM_IMAGE_PULL_POLICY_ENV);

            cacheItem.setDefaultReadme(loadPluginReadme(pluginName, README_FILE));
            cacheItem.setReadme(Language.ZH_CN.getCode(), loadPluginReadme(pluginName, README_CN_FILE));
            cacheItem.setReadme(Language.EN_US.getCode(), loadPluginReadme(pluginName, README_EN_FILE));

            try (InputStream stream = getResourceAsStream(pluginFolder + ICON_FILE)) {
                if (stream != null) {
                    byte[] rawIconData = IOUtils.toByteArray(stream);
                    cacheItem.iconData = ICON_DATA_PREFIX + Base64.getEncoder().encodeToString(rawIconData);
                }
            } catch (IOException ex) {
                log.warn("Error occurs when loading spec file of plugin {}.", pluginName, ex);
            }

            plugins.add(cacheItem);
        }

        plugins.sort(Comparator.comparing(PluginCacheItem::getName));
        this.builtInPlugins = plugins;
    }
    
    static String loadCustomConf(String propertyConf, String env) {
        String value = System.getProperty(propertyConf);
        if (StringUtils.isEmpty(value)) {
            value = System.getenv(env);
        }
        return value;
    }

    @VisibleForTesting
    static String formatImageUrl(String pattern, PluginInfo pluginInfo) {
        if (StringUtils.isEmpty(pattern)) {
            return pattern;
        }
        return pattern.replace(NAME_PLACEHOLDER, pluginInfo.getName()).replace(VERSION_PLACEHOLDER,
            pluginInfo.getVersion());
    }

    private void fillPluginConfigExample(Plugin plugin, String content) {
        String example;
        try {
            example = extractConfigExample(content);
        } catch (IOException e) {
            log.warn("Error occurs when extracting config example for plugin " + plugin.getInfo().getName(), e);
            return;
        }
        if (StringUtils.isEmpty(content)) {
            return;
        }
        if (plugin.getSpec() == null || plugin.getSpec().getConfigSchema() == null
            || plugin.getSpec().getConfigSchema().getOpenApiV3Schema() == null) {
            return;
        }
        Schema<?> schema = plugin.getSpec().getConfigSchema().getOpenApiV3Schema();
        schema.addExtension(EXAMPLE_RAW_PROPERTY_NAME, example);
    }

    private String extractConfigExample(String content) throws IOException {
        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new StringReader(content))) {
            boolean foundConfigSchema = false, foundOpenApiV3Schema = false, foundExample = false;
            String schemaOuterIndentation = null, exampleOuterIndentation = null, exampleInnerIndentation = null;
            String line;
            while ((line = reader.readLine()) != null) {
                Matcher yamlContentMatcher = YAML_CONTENT_PATTERN.matcher(line);

                if (!yamlContentMatcher.find()) {
                    // A blank line, obviously.
                    continue;
                }

                String indentation = yamlContentMatcher.group(1);
                String unindentedContent = yamlContentMatcher.group(2);

                if (!foundOpenApiV3Schema) {
                    if (!foundConfigSchema) {
                        if (unindentedContent.startsWith(CONFIG_SCHEMA_PROPERTY_KEY)) {
                            foundConfigSchema = true;
                        }
                        continue;
                    }
                    // We only care about finding the openAPIV3Schema property now.
                    if (unindentedContent.startsWith(OPEN_API_V3_SCHEMA_PROPERTY_KEY)) {
                        foundOpenApiV3Schema = true;
                        schemaOuterIndentation = indentation;
                    }
                    continue;
                }

                if (!foundExample) {
                    if (indentation.length() <= schemaOuterIndentation.length()) {
                        // This line is not a child of the previously found openAPIV3Schema property,
                        // which means no example property exists as a child of openAPIV3Schema.
                        break;
                    }
                    // We've found the first and direct child of openAPIV3Schema property.
                    // The example property we are looking for must share the same indentation.
                    if (exampleOuterIndentation == null) {
                        exampleOuterIndentation = indentation;
                    }
                    if (indentation.equals(exampleOuterIndentation)
                        && unindentedContent.startsWith(YAML_EXAMPLE_PROPERTY_KEY)) {
                        foundExample = true;
                    }
                    continue;
                }

                if (indentation.length() <= exampleOuterIndentation.length()) {
                    // Found a sibling of the example property or its parent.
                    // So much for the example content.
                    break;
                }

                if (exampleInnerIndentation == null) {
                    exampleInnerIndentation = indentation;
                }
                if (!builder.isEmpty()) {
                    builder.append("\n");
                }
                builder.append(line.substring(exampleInnerIndentation.length()));
            }
        }
        return builder.toString();
    }

    private String loadPluginReadme(String pluginId, String fileName) {
        String resource = PLUGINS_RESOURCE_FOLDER + pluginId + "/" + fileName;
        try (InputStream stream = getResourceAsStream(resource)) {
            if (stream != null) {
                return IOUtils.toString(stream, CHARSET);
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Error occurs when loading readme data from resource " + resource, ex);
        }
        return null;
    }

    @Override
    public PaginatedResult<WasmPlugin> list(WasmPluginPageQuery query) {
        String lang = query != null ? query.getLang() : null;
        List<WasmPlugin> plugins = new ArrayList<>();
        for (PluginCacheItem item : builtInPlugins) {
            plugins.add(item.buildWasmPlugin(lang));
        }
        try {
            List<V1alpha1WasmPlugin> crs = kubernetesClientService.listWasmPlugin();
            for (V1alpha1WasmPlugin cr : crs) {
                WasmPlugin plugin = kubernetesModelConverter.wasmPluginFromCr(cr);
                if (plugin.getBuiltIn()) {
                    WasmPlugin builtInPlugin =
                        plugins.stream().filter(p -> p.getName().equals(plugin.getName())).findFirst().orElse(null);
                    if (builtInPlugin != null) {
                        builtInPlugin.setImageRepository(plugin.getImageRepository());
                        builtInPlugin.setImageVersion(plugin.getImageVersion());
                        builtInPlugin.setImagePullPolicy(plugin.getImagePullPolicy());
                        builtInPlugin.setImagePullSecret(plugin.getImagePullSecret());
                        continue;
                    }
                }
                plugins.add(plugin);
            }
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when listing custom Wasm plugins", e);
        }
        return PaginatedResult.createFromFullList(plugins, query);
    }

    @Override
    public WasmPlugin query(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }

        // Built-in plugin
        PluginCacheItem item = builtInPlugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item != null) {
            return item.buildWasmPlugin(language);
        }

        // Custom plugin
        List<V1alpha1WasmPlugin> crs;
        try {
            crs = kubernetesClientService.listWasmPlugin(name, null, false);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when checking existed Wasm plugins with name " + name, e);
        }

        if (CollectionUtils.isNotEmpty(crs)) {
            V1alpha1WasmPlugin topPriorityCr = crs.stream()
                .max(Comparator.comparing(
                    cr -> cr.getSpec() != null && cr.getSpec().getPriority() != null ? cr.getSpec().getPriority() : 0))
                .orElse(null);
            assert topPriorityCr != null;
            return kubernetesModelConverter.wasmPluginFromCr(topPriorityCr);
        }

        return null;
    }

    @Override
    public WasmPluginConfig queryConfig(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }

        PluginCacheItem item = builtInPlugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item != null) {
            return item.buildWasmPluginConfig(language);
        }

        List<V1alpha1WasmPlugin> crs;
        try {
            crs = kubernetesClientService.listWasmPlugin(name, null, false);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when checking existed Wasm plugins with name " + name, e);
        }
        if (CollectionUtils.isNotEmpty(crs)) {
            // TODO: Config of a custom plugin is not supported yet. Return an empty schema instead.
            WasmPluginConfig config = new WasmPluginConfig();
            Schema<?> schema = new Schema<>();
            schema.setType("object");
            config.setSchema(schema);
            return config;
        }

        return null;
    }

    @Override
    public String queryReadme(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }

        PluginCacheItem item = builtInPlugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item != null) {
            String content = null;
            if (StringUtils.isNotEmpty(language)) {
                content = item.getReadme(language);
            }
            if (StringUtils.isEmpty(content)) {
                content = item.getDefaultReadme();
            }
            return content;
        }

        List<V1alpha1WasmPlugin> crs;
        try {
            crs = kubernetesClientService.listWasmPlugin(name, null, false);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when checking existed Wasm plugins with name " + name, e);
        }
        if (CollectionUtils.isNotEmpty(crs)) {
            // TODO: Readme of a custom plugin is not supported yet.
            return "";
        }

        return null;
    }

    @Override
    public WasmPlugin updateBuiltIn(WasmPlugin plugin) {
        final String name = plugin.getName();

        PluginCacheItem cachedBuiltInPlugin =
            builtInPlugins.stream().filter(p -> p.getName().equals(name)).findFirst().orElse(null);
        if (cachedBuiltInPlugin == null) {
            throw new ResourceConflictException("No built-in plugin is found with the given name: " + name);
        }

        List<V1alpha1WasmPlugin> existedCrs;
        try {
            final String pluginVersion = cachedBuiltInPlugin.getPlugin().getInfo().getVersion();
            existedCrs = kubernetesClientService.listWasmPlugin(name, pluginVersion, true);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when checking existed Wasm plugins with name " + name, e);
        }

        V1alpha1WasmPlugin updatedCr = null;

        if (existedCrs.stream().allMatch(KubernetesUtil::isInternalResource)) {
            WasmPlugin builtInPlugin = cachedBuiltInPlugin.buildWasmPlugin();
            builtInPlugin.setImageRepository(plugin.getImageRepository());
            builtInPlugin.setImageVersion(plugin.getImageVersion());
            V1alpha1WasmPlugin cr = kubernetesModelConverter.wasmPluginToCr(builtInPlugin);
            // Make sure it is disabled by default.
            cr.getSpec().setDefaultConfigDisable(true);
            try {
                updatedCr = kubernetesClientService.createWasmPlugin(cr);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                    "Error occurs when adding a new Wasm plugin with name: " + cr.getMetadata().getName(), e);
            }
        }

        for (V1alpha1WasmPlugin existedCr : existedCrs) {
            V1alpha1WasmPluginSpec spec = existedCr.getSpec();
            if (spec == null) {
                continue;
            }
            ImageUrl imageUrl = new ImageUrl(plugin.getImageRepository(), plugin.getImageVersion());
            spec.setUrl(imageUrl.toUrlString());
            try {
                updatedCr = kubernetesClientService.replaceWasmPlugin(existedCr);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                    "Error occurs when updating the Wasm plugin wth name " + existedCr.getMetadata().getName(), e);
            }
        }

        assert updatedCr != null;

        return kubernetesModelConverter.wasmPluginFromCr(updatedCr);
    }

    @Override
    public WasmPlugin addCustom(WasmPlugin plugin) {
        if (Boolean.TRUE.equals(plugin.getBuiltIn())) {
            throw new ResourceConflictException("Adding a built-in plugin is not allowed.");
        }

        if (builtInPlugins.stream().anyMatch(p -> p.getName().equals(plugin.getName()))) {
            throw new ResourceConflictException("Name conflicted with a built-in plugin.");
        }

        if (StringUtils.isEmpty(plugin.getPluginVersion())) {
            plugin.setPluginVersion(DEFAULT_PLUGIN_VERSION);
        }
        plugin.setBuiltIn(false);
        plugin.setCategory(PluginCategory.CUSTOM);

        V1alpha1WasmPlugin cr = kubernetesModelConverter.wasmPluginToCr(plugin);
        // Make sure it is disabled by default.
        cr.getSpec().setDefaultConfigDisable(true);
        V1alpha1WasmPlugin addedCr;
        try {
            addedCr = kubernetesClientService.createWasmPlugin(cr);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding a new Wasm plugin.", e);
        }
        return kubernetesModelConverter.wasmPluginFromCr(addedCr);
    }

    @Override
    public WasmPlugin updateCustom(WasmPlugin plugin) {
        String name = plugin.getName();

        if (Boolean.TRUE.equals(plugin.getBuiltIn())) {
            throw new ResourceConflictException("Updating a built-in plugin is not allowed.");
        }
        if (builtInPlugins.stream().anyMatch(p -> p.getName().equals(name))) {
            throw new ResourceConflictException("Updating a built-in plugin is not allowed.");
        }

        if (StringUtils.isEmpty(plugin.getPluginVersion())) {
            plugin.setPluginVersion(DEFAULT_PLUGIN_VERSION);
        }
        plugin.setBuiltIn(false);
        plugin.setCategory(PluginCategory.CUSTOM);

        V1alpha1WasmPlugin cr = kubernetesModelConverter.wasmPluginToCr(plugin);
        List<V1alpha1WasmPlugin> existedCrs;
        try {
            existedCrs = kubernetesClientService.listWasmPlugin(name, null, false);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when checking existed Wasm plugins with name " + name, e);
        }

        if (CollectionUtils.isEmpty(existedCrs)) {
            throw new NotFoundException("No Wasm plugin with name \"" + name + "\" is found.");
        }

        String crName = cr.getMetadata().getName();
        V1alpha1WasmPlugin existedCr = existedCrs.stream()
            .filter(ecr -> ecr.getMetadata() != null && Objects.equals(crName, ecr.getMetadata().getName())).findFirst()
            .orElse(null);
        if (existedCr != null) {
            kubernetesModelConverter.mergeWasmPluginSpec(existedCr, cr);

            String resourceVersion = plugin.getVersion();
            if (StringUtils.isEmpty(resourceVersion)) {
                resourceVersion = existedCr.getMetadata().getResourceVersion();
            }
            cr.getMetadata().setResourceVersion(resourceVersion);

            V1alpha1WasmPlugin updatedCr;
            try {
                updatedCr = kubernetesClientService.replaceWasmPlugin(cr);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException("Error occurs when updating the Wasm plugin wth name " + crName, e);
            }
            return kubernetesModelConverter.wasmPluginFromCr(updatedCr);
        }

        existedCrs.sort(Comparator.comparing(ecr -> ecr.getSpec().getPriority()));
        for (V1alpha1WasmPlugin ecr : existedCrs) {
            kubernetesModelConverter.mergeWasmPluginSpec(ecr, cr);
        }

        V1alpha1WasmPlugin updatedCr;
        try {
            updatedCr = kubernetesClientService.createWasmPlugin(cr);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding the Wasm plugin CR wth name " + crName, e);
        }

        for (V1alpha1WasmPlugin ecr : existedCrs) {
            String ecrName = ecr.getMetadata().getName();
            if (Objects.equals(crName, ecrName)) {
                continue;
            }
            try {
                kubernetesClientService.deleteWasmPlugin(ecrName);
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when deleting the Wasm plugin CR wth name " + ecrName, e);
            }
        }

        return kubernetesModelConverter.wasmPluginFromCr(updatedCr);
    }

    @Override
    public void deleteCustom(String name) {
        if (builtInPlugins.stream().anyMatch(p -> p.getName().equals(name))) {
            throw new ResourceConflictException("Deleting a built-in plugin is not allowed.");
        }

        List<V1alpha1WasmPlugin> crs;
        try {
            crs = kubernetesClientService.listWasmPlugin(name, null, false);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when loading Wasm plugins with name " + name, e);
        }

        if (CollectionUtils.isEmpty(crs)) {
            return;
        }

        for (V1alpha1WasmPlugin cr : crs) {
            String crName = cr.getMetadata().getName();
            try {
                kubernetesClientService.deleteWasmPlugin(crName);
            } catch (ApiException e) {
                throw new BusinessException("Error occurs when deleting the Wasm plugin CR wth name " + crName, e);
            }
        }
    }

    private InputStream getResourceAsStream(String name) {
        return getClass().getClassLoader().getResourceAsStream(name);
    }

    @Data
    private static class PluginCacheItem {

        private static final String DEFAULT_README_KEY = "_default_";

        private final String name;
        private String imageUrl;
        private String imagePullPolicy;
        private String imagePullSecret;
        private Plugin plugin;
        private String iconData;

        @Getter(AccessLevel.NONE)
        @Setter(AccessLevel.NONE)
        private final Map<String, String> readmes = new HashMap<>(4);

        public PluginCacheItem(String name) {
            this.name = name;
        }

        public String getDefaultReadme() {
            return readmes.get(DEFAULT_README_KEY);
        }

        public void setDefaultReadme(String content) {
            readmes.put(DEFAULT_README_KEY, content);
        }

        public String getReadme(String language) {
            return readmes.get(language);
        }

        public void setReadme(String language, String content) {
            if (StringUtils.isNotEmpty(content)) {
                readmes.put(language, content);
            }
        }

        public WasmPlugin buildWasmPlugin() {
            return buildWasmPlugin(null);
        }

        public WasmPlugin buildWasmPlugin(String language) {
            WasmPlugin wasmPlugin = new WasmPlugin();
            wasmPlugin.setName(name);
            ImageUrl imageUrlObj = ImageUrl.parse(imageUrl);
            wasmPlugin.setImageRepository(imageUrlObj.getRepository());
            wasmPlugin.setImageVersion(imageUrlObj.getTag());
            wasmPlugin.setImagePullSecret(imagePullSecret);
            wasmPlugin.setImagePullPolicy(imagePullPolicy);
            wasmPlugin.setBuiltIn(true);

            PluginInfo info = plugin.getInfo();
            if (info != null) {
                wasmPlugin.setCategory(info.getCategory());
                wasmPlugin.setPluginVersion(info.getVersion());
                wasmPlugin.setIcon(info.getIconUrl());

                if (StringUtils.isEmpty(language)) {
                    wasmPlugin.setTitle(info.getTitle());
                    wasmPlugin.setDescription(info.getDescription());
                } else {
                    String title = MapUtils.getString(info.getTitleI18n(), language, info.getTitle());
                    wasmPlugin.setTitle(title);
                    String description = MapUtils.getString(info.getDescriptionI18n(), language, info.getDescription());
                    wasmPlugin.setDescription(description);
                }
            }

            PluginSpec spec = plugin.getSpec();
            if (spec != null) {
                wasmPlugin
                    .setPhase("default".equals(spec.getPhase()) ? PluginPhase.UNSPECIFIED.getName() : spec.getPhase());
                wasmPlugin.setPriority(spec.getPriority());
            }

            if (StringUtils.isNotEmpty(iconData)) {
                wasmPlugin.setIcon(iconData);
            }

            return wasmPlugin;
        }

        public WasmPluginConfig buildWasmPluginConfig(String language) {
            if (plugin.getSpec() == null || plugin.getSpec().getConfigSchema() == null
                || plugin.getSpec().getConfigSchema().getOpenApiV3Schema() == null) {
                return new WasmPluginConfig();
            }
            Schema<?> schema;
            try {
                schema = Json.mapper().readValue(
                    Json.mapper().writeValueAsString(plugin.getSpec().getConfigSchema().getOpenApiV3Schema()),
                    Schema.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            applyI18nResources(schema, language);
            return new WasmPluginConfig(schema);
        }

        private void applyI18nResources(Schema<?> schema, String language) {
            applyI18nResources(schema, schema.getExtensions(), language);
            if (MapUtils.isNotEmpty(schema.getProperties())) {
                schema.getProperties().values().forEach(s -> applyI18nResources(s, language));
            }
            if (schema.getItems() != null) {
                applyI18nResources(schema.getItems(), language);
            }
        }

        private void applyI18nResources(Object obj, Map<String, Object> extensions, String language) {
            if (MapUtils.isEmpty(extensions)) {
                return;
            }
            for (Iterator<Map.Entry<String, Object>> it = extensions.entrySet().iterator(); it.hasNext();) {
                Map.Entry<String, Object> entry = it.next();
                Matcher i18nKeyMatcher = I18N_EXTENSION_KEY_PATTERN.matcher(entry.getKey());
                if (!i18nKeyMatcher.matches()) {
                    continue;
                }

                it.remove();

                Object map = entry.getValue();
                if (!(map instanceof Map<?, ?>)) {
                    continue;
                }

                Object value = ((Map<?, ?>)map).get(language);
                if (value == null) {
                    continue;
                }

                String fieldName = i18nKeyMatcher.group(1);
                try {
                    String setterName = "set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
                    Method setter = obj.getClass().getMethod(setterName, value.getClass());
                    setter.invoke(obj, value);
                } catch (Exception ex) {
                    log.warn(
                        String.format("Error occurs when applying i18n resource. ObjectClass=%s FieldName=%s Value=%s",
                            obj.getClass().getName(), fieldName, value),
                        ex);
                }
            }
        }
    }
}
