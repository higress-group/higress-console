package com.alibaba.higress.sdk.model.ai;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * AI路由回退策略常量类
 * 定义了AI路由回退机制可用的策略类型
 */
@Schema(description = "AI Route fallback strategy", type = "string", allowableValues = {"RAND", "SEQ"})
public final class AiRouteFallbackStrategy {

    /**
     * 私有构造函数
     * 防止实例化该常量类
     */
    private AiRouteFallbackStrategy() {}

    /**
     * 随机回退策略
     * 当主路由失败时，从可用的回退上游服务中随机选择一个进行重试
     */
    public static final String RANDOM = "RAND";

    /**
     * 顺序回退策略
     * 当主路由失败时，按照配置顺序依次尝试回退上游服务
     */
    public static final String SEQUENCE = "SEQ";
}
