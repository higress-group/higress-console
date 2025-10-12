package com.alibaba.higress.sdk.model.consumer;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

/**
 * Key-Auth凭据来源枚举类
 * 定义了Key-Auth凭据的几种来源方式及其特性
 */
@Getter
@Schema(description = "KeyAuth Credential Source", type = "string", allowableValues = {"BEARER", "HEADER", "QUERY"})
public enum KeyAuthCredentialSource {

    /**
     * Bearer令牌方式
     * 使用"Authorization: Bearer token"请求头
     */
    BEARER(false),
    
    /**
     * HTTP请求头方式
     * 使用自定义HTTP请求头
     */
    HEADER(true),
    
    /**
     * 查询参数方式
     * 使用URL查询参数
     */
    QUERY(true);

    /**
     * 是否需要键
     * 指示该凭据来源是否需要指定键名
     */
    private final boolean keyRequired;

    /**
     * 构造函数
     * 初始化凭据来源枚举值
     *
     * @param keyRequired 是否需要键
     */
    KeyAuthCredentialSource(boolean keyRequired) {
        this.keyRequired = keyRequired;
    }

    /**
     * 解析字符串为凭据来源枚举
     *
     * @param str 凭据来源字符串
     * @return 对应的凭据来源枚举值，如果无法解析则返回null
     */
    public static KeyAuthCredentialSource parse(String str) {
        if (StringUtils.isEmpty(str)) {
            return null;
        }
        switch (str) {
            case "BEARER":
                return BEARER;
            case "HEADER":
                return HEADER;
            case "QUERY":
                return QUERY;
            default:
                return null;
        }
    }
}
