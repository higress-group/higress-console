package com.alibaba.higress.sdk.model.ai;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.RouteAuthConfig;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI路由配置模型类
 * 用于定义AI服务的路由规则，包括路径匹配、头部匹配、参数匹配、上游服务等配置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "AI Route")
public class AiRoute {

    /**
     * 路由名称
     * 用于唯一标识一个AI路由配置
     */
    @Schema(description = "Route name")
    private String name;

    /**
     * 路由版本
     * 更新路由时必需，用于乐观锁控制
     */
    @Schema(description = "Route version. Required when updating.")
    private String version;

    /**
     * 路由适用的域名列表
     * 如果为空，则路由适用于所有域名
     */
    @Schema(description = "Domains that the route applies to. If empty, the route applies to all domains.")
    private List<String> domains;

    /**
     * 路径匹配谓词
     * 定义请求路径的匹配规则
     */
    @Schema(description = "Path predicate")
    private RoutePredicate pathPredicate;

    /**
     * 头部匹配谓词列表
     * 定义HTTP头部的匹配规则
     */
    @Schema(description = "Header predicates")
    private List<KeyedRoutePredicate> headerPredicates;

    /**
     * URL参数匹配谓词列表
     * 定义URL查询参数的匹配规则
     */
    @Schema(description = "URL parameter predicates")
    private List<KeyedRoutePredicate> urlParamPredicates;

    /**
     * 路由上游服务列表
     * 定义路由的目标上游服务配置
     */
    @Schema(description = "Route upstreams")
    private List<AiUpstream> upstreams;

    /**
     * 模型匹配谓词列表
     * 定义AI模型的匹配规则
     */
    @Schema(description = "Model predicates")
    private List<AiModelPredicate> modelPredicates;

    /**
     * 路由认证配置
     * 定义路由的认证和授权规则
     */
    @Schema(description = "Route auth configuration")
    private RouteAuthConfig authConfig;

    /**
     * 路由回退配置
     * 定义路由失败时的回退策略
     */
    @Schema(description = "Route fallback configuration")
    private AiRouteFallbackConfig fallbackConfig;

    /**
     * 验证AI路由配置的有效性
     *
     * @throws ValidationException 当配置不合法时抛出验证异常
     */
    public void validate() {
        // 验证路由名称不能为空
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }

        // 验证上游服务列表不能为空
        if (CollectionUtils.isEmpty(upstreams)) {
            throw new ValidationException("upstreams cannot be empty.");
        }

        // 验证路径谓词（如果存在）
        if (pathPredicate != null) {
            pathPredicate.validate();
            // 路径谓词必须是前缀匹配类型
            if (pathPredicate.getPredicateType() != RoutePredicateTypeEnum.PRE) {
                throw new ValidationException("pathPredicate must be of type PRE.");
            }
        }

        // 验证头部谓词列表（如果存在）
        if (CollectionUtils.isNotEmpty(headerPredicates)) {
            headerPredicates.forEach(KeyedRoutePredicate::validate);
            // 头部谓词不能包含模型路由专用头部
            if (headerPredicates.stream()
                .anyMatch(p -> HigressConstants.MODEL_ROUTING_HEADER.equalsIgnoreCase(p.getKey()))) {
                throw new ValidationException("headerPredicates cannot contain the model routing header.");
            }
        }

        // 验证URL参数谓词列表（如果存在）
        if (CollectionUtils.isNotEmpty(urlParamPredicates)) {
            urlParamPredicates.forEach(KeyedRoutePredicate::validate);
        }

        // 验证所有上游服务配置
        upstreams.forEach(AiUpstream::validate);

        // 验证上游服务权重总和必须为100
        int weightSum = upstreams.stream().mapToInt(AiUpstream::getWeight).sum();
        if (weightSum != 100) {
            throw new ValidationException("The sum of upstream weights must be 100.");
        }

        // 验证认证配置（如果存在）
        if (authConfig != null) {
            authConfig.validate();
        }

        // 验证回退配置（如果存在）
        if (fallbackConfig != null) {
            fallbackConfig.validate();
        }

        // 验证模型谓词列表（如果存在）
        if (CollectionUtils.isNotEmpty(modelPredicates)) {
            modelPredicates.forEach(AiModelPredicate::validate);
        }
    }
}
