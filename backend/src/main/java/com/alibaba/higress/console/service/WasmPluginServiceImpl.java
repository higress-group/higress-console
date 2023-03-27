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
package com.alibaba.higress.console.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.openapi4j.core.util.TreeUtil;
import org.openapi4j.parser.model.v3.Schema;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.Language;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginConfig;
import com.alibaba.higress.console.controller.dto.WasmPluginPageQuery;
import com.alibaba.higress.console.service.wasmplugin.Plugin;
import com.alibaba.higress.console.service.wasmplugin.PluginInfo;
import com.alibaba.higress.console.service.wasmplugin.PluginSpec;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * @author CH3CHO
 */
@Slf4j
@Service
public class WasmPluginServiceImpl implements WasmPluginService {

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

    private volatile List<PluginCacheItem> plugins = Collections.emptyList();

    @PostConstruct
    public void initialize() {
        Properties properties = new Properties();
        try (InputStream stream = getResourceAsStream(PLUGINS_PROPERTIES_FILE)) {
            properties.load(stream);
        } catch (IOException ex) {
            throw new IllegalStateException("Error occurs when loading built-in plugin list.", ex);
        }

        final List<PluginCacheItem> plugins = new ArrayList<>(properties.size());

        for (Object key : properties.keySet()) {
            String pluginName = (String)key;
            String imageRepository = properties.getProperty(pluginName);
            if (StringUtils.isEmpty(imageRepository)) {
                continue;
            }

            PluginCacheItem cacheItem = new PluginCacheItem(pluginName, imageRepository);

            final String pluginFolder = PLUGINS_RESOURCE_FOLDER + pluginName + "/";
            try (InputStream stream = getResourceAsStream(pluginFolder + SPEC_FILE)) {
                if (stream == null) {
                    // No spec. Ignore it.
                    continue;
                }
                cacheItem.plugin = TreeUtil.yaml.readValue(new InputStreamReader(stream, CHARSET), Plugin.class);
            } catch (IOException ex) {
                throw new IllegalStateException("Error occurs when loading spec file of plugin " + pluginName + ".",
                    ex);
            }

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
        this.plugins = plugins;
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
        return PaginatedResult.createFromFullList(plugins, query, p -> p.buildWasmPlugin(lang));
    }

    @Override
    public WasmPlugin query(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        PluginCacheItem item = plugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item == null) {
            return null;
        }
        return item.buildWasmPlugin(language);
    }

    @Override
    public WasmPluginConfig queryConfig(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        PluginCacheItem item = plugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item == null) {
            return null;
        }
        return item.buildWasmPluginConfig(language);
    }

    @Override
    public String queryReadme(String name, String language) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        PluginCacheItem item = plugins.stream().filter(p -> name.equals(p.name)).findFirst().orElse(null);
        if (item == null) {
            return null;
        }
        String content = null;
        if (StringUtils.isNotEmpty(language)) {
            content = item.getReadme(language);
        }
        if (StringUtils.isEmpty(content)) {
            content = item.getDefaultReadme();
        }
        return content;
    }

    private InputStream getResourceAsStream(String name) {
        return getClass().getClassLoader().getResourceAsStream(name);
    }

    @Data
    private static class PluginCacheItem {

        private static final String DEFAULT_README_KEY = "_default_";

        private final String name;
        private final String imageRepository;
        private Plugin plugin;
        private String iconData;

        @Getter(AccessLevel.NONE)
        @Setter(AccessLevel.NONE)
        private final Map<String, String> readmes = new HashMap<>(4);

        public PluginCacheItem(String name, String imageRepository) {
            this.name = name;
            this.imageRepository = imageRepository;
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

        public WasmPlugin buildWasmPlugin(String language) {
            WasmPlugin wasmPlugin = new WasmPlugin();
            wasmPlugin.setName(name);
            wasmPlugin.setImageRepository(imageRepository);

            PluginInfo info = plugin.getInfo();
            if (info != null) {
                wasmPlugin.setCategory(info.getCategory());
                wasmPlugin.setVersion(info.getVersion());
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
                wasmPlugin.setPhase(spec.getPhase());
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

            Schema schema = plugin.getSpec().getConfigSchema().getOpenApiV3Schema().copy();
            applyI18nResources(schema, language);
            return new WasmPluginConfig(schema);
        }

        private void applyI18nResources(Schema schema, String language) {
            applyI18nResources(schema, schema.getExtensions(), language);
            if (MapUtils.isNotEmpty(schema.getProperties())) {
                schema.getProperties().values().forEach(s -> applyI18nResources(s, language));
            }
            if (schema.getItemsSchema() != null) {
                applyI18nResources(schema.getItemsSchema(), language);
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

                String fieldName = i18nKeyMatcher.group(1);
                Object value = ((Map<?, ?>)map).get(language);
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
