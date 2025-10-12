package com.alibaba.higress.sdk.model.authorization;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import lombok.Getter;

/**
 * 凭据类型枚举类
 * 定义了系统支持的凭据类型及其别名
 */
@Getter
public enum CredentialTypeEnum {
    /**
     * Key-Auth凭据类型
     * 基于API密钥的认证方式
     */
    KEY_AUTH("key-auth", "API_KEY");

    /**
     * 凭据类型名称
     */
    private final String type;
    
    /**
     * 凭据类型的别名列表
     * 用于匹配不同形式的凭据类型名称，忽略大小写
     */
    private final List<String> typeAliases;

    /**
     * 构造函数
     * 初始化凭据类型枚举值
     *
     * @param type 凭据类型名称
     * @param aliases 凭据类型的别名
     */
    CredentialTypeEnum(String type, String... aliases) {
        this.type = type;
        this.typeAliases = Arrays.asList(aliases);
    }

    /**
     * 凭据类型缓存
     * 用于快速查找凭据类型枚举值
     */
    private static final Map<String, CredentialTypeEnum> CACHE = new HashMap<>();
    
    static {
        // 初始化凭据类型缓存
        for (CredentialTypeEnum value : CredentialTypeEnum.values()) {
            CACHE.put(value.getType().toUpperCase(), value);

            List<String> typeAliases = value.getTypeAliases();
            if (CollectionUtils.isEmpty(typeAliases)) {
                continue;
            }
            for (String typeAlias : typeAliases) {
                CACHE.put(typeAlias.toUpperCase(), value);
            }
        }
    }

    /**
     * 根据类型名称获取凭据类型枚举
     *
     * @param type 凭据类型名称
     * @return 对应的凭据类型枚举
     * @throws IllegalArgumentException 当类型名称为空或未知时抛出非法参数异常
     */
    public static CredentialTypeEnum fromType(String type) {
        if (StringUtils.isBlank(type)) {
            throw new IllegalArgumentException("type cannot be blank.");
        }
        CredentialTypeEnum result = CACHE.get(type.toUpperCase());
        if (Objects.isNull(result)) {
            throw new IllegalArgumentException("Unknown credential type: " + type);
        }
        return result;
    }
}
