package com.alibaba.higress.sdk.model.wasmplugin;

import com.alibaba.higress.sdk.util.EnvReadUtil;

import lombok.Data;

/**
 * WASM插件服务配置类
 * 用于存储和管理WASM插件服务的相关配置
 */
@Data
public class WasmPluginServiceConfig {
    /**
     * 自定义镜像URL模式环境变量名
     * 用于指定自定义WASM插件镜像的URL模式
     */
    private static final String CUSTOM_IMAGE_URL_PATTERN_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_CUSTOM_IMAGE_URL_PATTERN";
    
    /**
     * 自定义镜像URL模式属性名
     * 用于指定自定义WASM插件镜像的URL模式
     */
    private static final String CUSTOM_IMAGE_URL_PATTERN_PROPERTY = "higress-admin.wasmplugin.custom-image-url-pattern";
    
    /**
     * 自定义镜像拉取密钥环境变量名
     * 用于指定拉取自定义WASM插件镜像所需的密钥
     */
    private static final String CUSTOM_IMAGE_PULL_SECRET_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_SECRET";
    
    /**
     * 自定义镜像拉取策略环境变量名
     * 用于指定拉取自定义WASM插件镜像的策略
     */
    private static final String CUSTOM_IMAGE_PULL_POLICY_ENV = "HIGRESS_ADMIN_WASM_PLUGIN_IMAGE_PULL_POLICY";
    
    /**
     * 自定义镜像拉取密钥属性名
     * 用于指定拉取自定义WASM插件镜像所需的密钥
     */
    private static final String CUSTOM_IMAGE_PULL_SECRET_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-secret";
    
    /**
     * 自定义镜像拉取策略属性名
     * 用于指定拉取自定义WASM插件镜像的策略
     */
    private static final String CUSTOM_IMAGE_PULL_POLICY_PROPERTY = "higress-admin.wasmplugin.custom-image-pull-policy";

    /**
     * 从环境变量构建配置对象
     * @return WasmPluginServiceConfig 配置对象
     */
    public static WasmPluginServiceConfig buildFromEnv() {
        WasmPluginServiceConfig result = new WasmPluginServiceConfig();
        result.customImageUrlPattern =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_URL_PATTERN_PROPERTY, CUSTOM_IMAGE_URL_PATTERN_ENV);
        result.imagePullSecret =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_PULL_SECRET_PROPERTY, CUSTOM_IMAGE_PULL_SECRET_ENV);
        result.imagePullPolicy =
            EnvReadUtil.loadCustomConfFromEnv(CUSTOM_IMAGE_PULL_POLICY_PROPERTY, CUSTOM_IMAGE_PULL_POLICY_ENV);
        return result;
    }

    /**
     * 自定义镜像URL模式
     * 用于指定自定义WASM插件镜像的URL模式
     */
    private String customImageUrlPattern;
    
    /**
     * 镜像拉取密钥
     * 用于指定拉取WASM插件镜像所需的密钥
     */
    private String imagePullSecret;
    
    /**
     * 镜像拉取策略
     * 用于指定拉取WASM插件镜像的策略
     */
    private String imagePullPolicy;
}
