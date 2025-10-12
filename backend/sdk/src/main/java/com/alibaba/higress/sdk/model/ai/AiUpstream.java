package com.alibaba.higress.sdk.model.ai;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI路由上游服务配置模型类
 * 用于定义AI路由的目标上游服务配置，包括LLM提供者、权重和模型映射等信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI Route Upstream")
public class AiUpstream {

    /**
     * LLM提供者名称
     * 指定上游服务使用的LLM提供者，如阿里云百炼、通义千问等
     */
    @Schema(description = "LLM provider name")
    private String provider;
    
    /**
     * 上游服务权重
     * 用于负载均衡，定义该上游服务在所有上游服务中的权重比例
     */
    @Schema(description = "Weight of the upstream")
    private Integer weight;
    
    /**
     * 模型映射配置
     * 定义模型名称的映射关系，用于在不同上游服务间转换模型名称
     */
    @Schema(description = "Model mapping")
    private Map<String, String> modelMapping;

    /**
     * 验证上游服务配置的有效性
     * 检查必需字段是否已正确配置
     *
     * @throws ValidationException 当提供者名称为空时抛出验证异常
     */
    public void validate() {
        if (StringUtils.isEmpty(provider)) {
            throw new ValidationException("provider cannot be null or empty.");
        }
    }
}
