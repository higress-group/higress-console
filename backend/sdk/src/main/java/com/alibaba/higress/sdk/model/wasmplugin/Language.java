package com.alibaba.higress.sdk.model.wasmplugin;

import lombok.Getter;

/**
 * 语言枚举类
 * 定义了系统支持的语言类型及其对应的代码
 */

@Getter
public enum Language {

    /**
     * 英语 (美国)
     * 美国英语语言代码
     */
    EN_US("en-US"),
    /**
     * 中文 (简体)
     * 简体中文语言代码
     */
    ZH_CN("zh-CN");

    /**
     * 语言代码
     * ISO语言代码标识符
     */
    private final String code;

    /**
     * 构造函数
     * @param code 语言代码
     */
    Language(String code) {
        this.code = code;
    }
}
