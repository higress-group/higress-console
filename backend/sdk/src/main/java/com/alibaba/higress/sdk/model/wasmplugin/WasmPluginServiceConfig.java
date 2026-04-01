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
package com.alibaba.higress.sdk.model.wasmplugin;

import com.alibaba.higress.sdk.util.EnvReadUtil;

import lombok.Data;

/**
 * @author lvshui
 */
@Data
public class WasmPluginServiceConfig {
    private static final String CUSTOM_IMAGE_URL_PATTERN_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_CUSTOM_IMAGE_URL_PATTERN";
    private static final String CUSTOM_IMAGE_URL_PATTERN_PROPERTY = "higress-admin.wasmplugin.custom-image-url-pattern";
    private static final String PLUGIN_IMAGE_REGISTRY_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_REGISTRY";
    private static final String PLUGIN_IMAGE_REGISTRY_PROPERTY = "higress-admin.wasmplugin.plugin-image-registry";
    private static final String PLUGIN_IMAGE_NAMESPACE_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_NAMESPACE";
    private static final String PLUGIN_IMAGE_NAMESPACE_PROPERTY = "higress-admin.wasmplugin.plugin-image-namespace";
    private static final String CUSTOM_IMAGE_PULL_SECRET_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_SECRET";
    private static final String CUSTOM_IMAGE_PULL_POLICY_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_POLICY";
    private static final String CUSTOM_IMAGE_PULL_SECRET_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-secret";
    private static final String CUSTOM_IMAGE_PULL_POLICY_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-policy";

    public static WasmPluginServiceConfig buildFromEnv() {
        WasmPluginServiceConfig result = new WasmPluginServiceConfig();
        result.customImageUrlPattern =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_URL_PATTERN_PROPERTY, CUSTOM_IMAGE_URL_PATTERN_ENV);
        result.pluginImageRegistry =
            EnvReadUtil.loadCustomConfFromEnv(PLUGIN_IMAGE_REGISTRY_PROPERTY, PLUGIN_IMAGE_REGISTRY_ENV);
        result.pluginImageNamespace =
            EnvReadUtil.loadCustomConfFromEnv(PLUGIN_IMAGE_NAMESPACE_PROPERTY, PLUGIN_IMAGE_NAMESPACE_ENV);
        result.imagePullSecret =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_PULL_SECRET_PROPERTY, CUSTOM_IMAGE_PULL_SECRET_ENV);
        result.imagePullPolicy =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_PULL_POLICY_PROPERTY, CUSTOM_IMAGE_PULL_POLICY_ENV);
        return result;
    }

    private String customImageUrlPattern;
    private String pluginImageRegistry;
    private String pluginImageNamespace;
    private String imagePullSecret;
    private String imagePullPolicy;
}
