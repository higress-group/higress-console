package com.alibaba.higress.sdk.model.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.models.media.Schema;
import lombok.Data;
import lombok.Getter;

/**
 * 插件配置模式类
 * 用于定义插件配置的结构和验证规则
 */
@Data
public class PluginConfigSchema {

    /**
     * OpenAPI V3 模式定义
     * 描述插件配置的结构和验证规则
     */
    @JsonProperty("openAPIV3Schema")
    private Schema openApiV3Schema;

    /**
     * 扩展属性映射
     * 用于存储额外的配置属性
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
