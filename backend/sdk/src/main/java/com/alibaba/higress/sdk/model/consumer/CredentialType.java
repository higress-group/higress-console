package com.alibaba.higress.sdk.model.consumer;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 凭据类型常量类
 * 定义了系统支持的凭据类型常量
 */
@Schema(description = "Credential Type", type = "string", allowableValues = {"key-auth"})
public final class CredentialType {

    /**
     * 私有构造函数
     * 防止实例化该类
     */
    private CredentialType() {}

    /**
     * Key-Auth凭据类型
     * 基于API密钥的认证方式
     */
    public static final String KEY_AUTH = "key-auth";
}
