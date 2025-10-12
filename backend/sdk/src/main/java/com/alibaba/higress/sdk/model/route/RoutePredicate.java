package com.alibaba.higress.sdk.model.route;

import java.beans.Transient;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 路由谓词类
 * 用于定义路由匹配的条件，包括匹配类型、匹配值和大小写敏感性设置
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Route Predicate")
public class RoutePredicate {

    /**
     * 匹配类型
     * 指定用于匹配请求的谓词类型
     * @see RoutePredicateTypeEnum
     */
    @Schema(description = "Match type", ref = "RoutePredicateTypeEnum")
    private String matchType;

    /**
     * 匹配值
     * 用于与请求进行匹配的具体值
     */
    @Schema(description = "The value to match against")
    private String matchValue;

    /**
     * 大小写敏感性
     * 指示匹配过程是否区分大小写
     */
    @Schema(description = "Whether to match the value case-sensitively")
    private Boolean caseSensitive;

    /**
     * 获取谓词类型枚举
     * 根据匹配类型名称获取对应的枚举值
     * @return 路由谓词类型枚举
     */
    @Transient
    public RoutePredicateTypeEnum getPredicateType() {
        return RoutePredicateTypeEnum.fromName(this.getMatchType());
    }

    /**
     * 验证路由谓词配置
     * 检查必需字段是否已设置，并验证匹配类型的合法性
     */
    public void validate() {
        if (this.getMatchType() == null) {
            throw new ValidationException("matchType is required");
        }
        RoutePredicateTypeEnum predicateType = getPredicateType();
        if (predicateType == null) {
            throw new ValidationException("Unknown matchType: " + this.getMatchType());
        }
        if (this.getMatchValue() == null) {
            throw new ValidationException("matchValue is required");
        }
    }
}
