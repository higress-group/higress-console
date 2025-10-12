package com.alibaba.higress.sdk.model.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.Getter;

/**
 * 插件规范类
 * 用于定义插件的执行规范和配置模式
 */
@Data
public class PluginSpec {

    /**
     * 插件执行阶段
     * 定义插件在请求处理流程中的执行阶段
     */
    private String phase;

    /**
     * 插件优先级
     * 用于确定插件的执行顺序
     */
    private Integer priority;

    /**
     * 插件配置模式
     * 定义插件配置的结构和验证规则
     */
    private PluginConfigSchema configSchema;

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
