package com.alibaba.higress.sdk.model.consumer;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.google.common.collect.Sets;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Key-Auth凭据类
 * 实现了基于API密钥的认证凭据
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "KeyAuth Credential")
public class KeyAuthCredential extends Credential {

    /**
     * 有效凭据来源集合
     * 定义了系统支持的凭据来源类型
     */
    private static final Set<String> VALID_SOURCES = Sets.newHashSet(KeyAuthCredentialSource.BEARER.name(),
        KeyAuthCredentialSource.HEADER.name(), KeyAuthCredentialSource.QUERY.name());

    /**
     * 凭据来源
     */
    @Schema(description = "Credential source", ref = "KeyAuthCredentialSource")
    private String source;
    
    /**
     * 凭据键
     * 当来源为HEADER或QUERY时为必填项
     */
    @Schema(description = "Credential Key. Required when source is HEADER or QUERY")
    private String key;
    
    /**
     * 凭据值列表
     */
    @Schema(description = "Credential Values")
    private List<String> values;

    /**
     * 构造函数
     * 初始化Key-Auth凭据
     *
     * @param type   凭据类型
     * @param source 凭据来源
     * @param key    凭据键
     * @param values 凭据值列表
     */
    public KeyAuthCredential(String type, String source, String key, List<String> values) {
        super(type);
        this.source = source;
        this.key = key;
        this.values = values != null ? new ArrayList<>(values) : null;
    }

    /**
     * 获取凭据类型
     *
     * @return 凭据类型，固定为KEY_AUTH
     */
    @Override
    public String getType() {
        return CredentialType.KEY_AUTH;
    }

    /**
     * 设置凭据类型
     * 由于Key-Auth凭据类型固定，此方法会验证传入的类型是否正确
     *
     * @param type 凭据类型
     * @throws IllegalArgumentException 当传入的类型不是KEY_AUTH时抛出异常
     */
    @Override
    public void setType(String type) {
        if (!CredentialType.KEY_AUTH.equals(type)) {
            throw new IllegalArgumentException("KeyAuthCredential type is fixed");
        }
    }

    /**
     * 验证凭据信息
     * 检查凭据来源、键和值是否有效
     *
     * @param forUpdate 是否为更新操作
     * @throws ValidationException 当验证失败时抛出异常
     */
    @Override
    public void validate(boolean forUpdate) {
        super.validate(forUpdate);
        if (StringUtils.isBlank(source)) {
            throw new ValidationException("source cannot be blank.");
        }

        KeyAuthCredentialSource sourceEnum = KeyAuthCredentialSource.parse(source);
        if (sourceEnum == null) {
            throw new ValidationException("unknown source value: " + source);
        }

        if (sourceEnum.isKeyRequired() && StringUtils.isBlank(key)) {
            throw new ValidationException("key cannot be blank.");
        }

        if (!forUpdate && CollectionUtils.isEmpty(values)) {
            throw new ValidationException("value cannot be blank.");
        }
    }
}
