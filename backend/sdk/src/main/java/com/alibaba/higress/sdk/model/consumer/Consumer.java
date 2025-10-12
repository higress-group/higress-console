package com.alibaba.higress.sdk.model.consumer;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 服务消费者模型类
 * 用于表示一个服务消费者及其凭据信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Service Consumer")
public class Consumer {

    /**
     * 消费者名称
     */
    @Schema(description = "Consumer name")
    private String name;
    
    /**
     * 消费者凭据列表
     */
    @Schema(description = "Consumer credentials")
    private List<Credential> credentials;

    /**
     * 验证消费者信息
     * 检查消费者名称和凭据是否有效
     *
     * @param forUpdate 是否为更新操作
     * @throws ValidationException 当验证失败时抛出异常
     */
    public void validate(boolean forUpdate) {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }
        if (CollectionUtils.isEmpty(credentials)) {
            throw new ValidationException("credentials cannot be empty.");
        }
        credentials.forEach(c -> c.validate(forUpdate));
    }
}
