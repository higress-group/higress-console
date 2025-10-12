package com.alibaba.higress.sdk.model.ai;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.RoutePredicateTypeEnum;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * AI模型谓词类
 * 用于定义AI路由中模型匹配的条件和规则
 */
@Schema(description = "AI Model Predicate")
public class AiModelPredicate extends RoutePredicate {

    /**
     * 验证AI模型谓词的有效性
     * 检查匹配类型是否合法，以及是否支持正则表达式匹配
     *
     * @throws ValidationException 当匹配类型未知或不支持正则表达式时抛出验证异常
     */
    public void validate() {
        // 调用父类的验证方法
        super.validate();

        // 根据匹配类型名称获取对应的枚举值
        RoutePredicateTypeEnum predicateType = RoutePredicateTypeEnum.fromName(this.getMatchType());

        // 检查匹配类型是否存在
        if (predicateType == null) {
            throw new ValidationException("Unknown matchType: " + this.getMatchType());
        }

        // AI模型谓词不支持正则表达式匹配类型
        if (predicateType == RoutePredicateTypeEnum.REGULAR) {
            throw new ValidationException("AiModelPredicate does not support regular expression matchType");
        }
    }
}
