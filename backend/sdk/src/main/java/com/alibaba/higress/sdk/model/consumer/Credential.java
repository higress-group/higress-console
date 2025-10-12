package com.alibaba.higress.sdk.model.consumer;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 消费者凭据基类
 * 定义了消费者凭据的基本结构和通用方法
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Consumer Credential", oneOf = {KeyAuthCredential.class})
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type",
    visible = true, defaultImpl = Credential.class)
@JsonSubTypes({@JsonSubTypes.Type(value = KeyAuthCredential.class, name = CredentialType.KEY_AUTH),})
public class Credential {

    /**
     * 凭据类型
     */
    @Schema(description = "Credential type", ref = "CredentialType")
    private String type;

    /**
     * 凭据属性映射
     * 存储凭据的具体属性值
     */
    @JsonIgnore
    @Getter(onMethod_ = @JsonAnyGetter)
    private Map<String, Object> properties;

    /**
     * 构造函数
     * 初始化凭据类型
     *
     * @param type 凭据类型
     */
    public Credential(String type) {
        this.type = type;
    }

    /**
     * 设置凭据属性
     * 向凭据属性映射中添加或更新属性值
     *
     * @param name  属性名称
     * @param value 属性值
     */
    @JsonAnySetter
    public void setProperty(String name, Object value) {
        if (this.properties == null) {
            this.properties = new HashMap<>(8);
        }
        this.properties.put(name, value);
    }

    /**
     * 验证凭据信息
     * 子类可以重写此方法以实现具体的验证逻辑
     *
     * @param forUpdate 是否为更新操作
     */
    public void validate(boolean forUpdate) {}
}