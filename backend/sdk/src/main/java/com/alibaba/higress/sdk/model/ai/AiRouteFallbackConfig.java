package com.alibaba.higress.sdk.model.ai;

import static com.alibaba.higress.sdk.constant.HigressConstants.VALID_FALLBACK_RESPONSE_CODES;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI路由回退配置模型类
 * 用于定义AI路由在主路径失败时的回退策略和配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI Route fallback configuration")
public class AiRouteFallbackConfig {

    /**
     * 是否启用回退功能
     * 控制当主路由失败时是否启用回退机制
     */
    @Schema(description = "Whether fallback is enabled")
    private Boolean enabled;

    /**
     * 回退上游服务列表
     * 当启用回退时，指定可用的备用上游服务
     * 注意：当回退策略为SEQ时，只允许配置一个上游服务
     */
    @Schema(description = "Fallback upstreams. Only one upstream is allowed when fallbackStrategy is SEQ.")
    private List<AiUpstream> upstreams;

    /**
     * 回退策略
     * 定义选择回退上游服务的策略，参考 AiRouteFallbackStrategy 中定义的策略
     */
    @Schema(description = "Fallback strategy", ref = "AiRouteFallbackStrategy")
    private String fallbackStrategy;

    /**
     * 需要触发回退的响应码列表
     * 定义哪些HTTP响应状态码会触发回退机制
     */
    @Schema(description = "response codes that need fallback")
    private List<String> responseCodes;

    /**
     * 验证回退配置的有效性
     *
     * @throws ValidationException 当配置不合法时抛出验证异常
     */
    public void validate() {
        // 如果未启用回退功能，则无需验证其他配置
        if (!Boolean.TRUE.equals(enabled)) {
            return;
        }

        // 验证回退策略是否合法
        if (StringUtils.isNotEmpty(fallbackStrategy)) {
            switch (fallbackStrategy) {
                case AiRouteFallbackStrategy.RANDOM:
                case AiRouteFallbackStrategy.SEQUENCE:
                    // 合法的回退策略，继续执行
                    break;
                default:
                    // 不支持的回退策略
                    throw new ValidationException("unknown fallback strategy: " + fallbackStrategy);
            }
        }

        // 验证回退上游服务列表不能为空
        if (CollectionUtils.isEmpty(upstreams)) {
            throw new ValidationException("upstreams cannot be empty when fallback is enabled.");
        }

        // 验证响应码列表不能为空
        if (CollectionUtils.isEmpty(responseCodes)) {
            throw new ValidationException("response codes cannot be empty when fallback is enabled.");
        } else {
            // 去除重复的响应码
            responseCodes = responseCodes.stream().distinct().collect(Collectors.toList());
            // 验证每个响应码是否合法（目前只支持4xx和5xx）
            for (String code : responseCodes) {
                if (!VALID_FALLBACK_RESPONSE_CODES.contains(code)) {
                    throw new ValidationException("invalid response code:" + code);
                }
            }
        }

        // 验证所有回退上游服务配置
        upstreams.forEach(AiUpstream::validate);
    }
}
