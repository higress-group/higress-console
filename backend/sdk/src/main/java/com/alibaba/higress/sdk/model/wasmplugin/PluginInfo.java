package com.alibaba.higress.sdk.model.wasmplugin;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.models.info.Contact;
import lombok.Data;
import lombok.Getter;

/**
 * 插件信息类
 * 用于存储插件的基本信息
 */
@Data
public class PluginInfo {

    /**
     * 插件分类
     * 插件所属的分类
     */
    private String category;

    /**
     * 插件名称
     * 插件的唯一标识名称
     */
    private String name;

    /**
     * 插件标题
     * 插件的显示标题
     */
    private String title;

    /**
     * 插件标题国际化映射
     * 不同语言下的插件标题
     */
    @JsonProperty("x-title-i18n")
    private Map<String, String> titleI18n;

    /**
     * 插件描述
     * 插件的功能描述
     */
    private String description;

    /**
     * 插件描述国际化映射
     * 不同语言下的插件描述
     */
    @JsonProperty("x-description-i18n")
    private Map<String, String> descriptionI18n;

    /**
     * 图标URL
     * 插件图标的访问地址
     */
    private String iconUrl;

    /**
     * 插件版本
     * 插件的版本号
     */
    private String version;

    /**
     * 联系人信息
     * 插件维护者的联系信息
     */
    private Contact contact;

    /**
     * 扩展属性映射
     * 用于存储插件的额外信息
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
