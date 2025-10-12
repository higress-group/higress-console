package com.alibaba.higress.sdk.model.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.Getter;

/**
 * 插件类
 * 用于表示一个WASM插件的完整配置信息
 */
@Data
public class Plugin {

    /**
     * API版本
     * 插件配置的API版本号
     */
    private String apiVersion;

    /**
     * 插件信息
     * 包含插件的基本信息
     */
    private PluginInfo info;

    /**
     * 插件规范
     * 定义插件的具体配置规范
     */
    private PluginSpec spec;

    /**
     * 扩展属性映射
     * 用于存储插件的额外配置属性
     */
    @JsonIgnore
    @Getter(onMethod_ = @JsonAnyGetter)
    private Map<String, Object> extensions;

    /**
     * 设置扩展属性
     * @param name 属性名称
     * @param value 属性值
     */
    @JsonAnySetter
    public void setExtension(String name, Object value) {
        if (this.extensions == null) {
            this.extensions = new HashMap<>(8);
        }
        this.extensions.put(name, value);
    }
}
