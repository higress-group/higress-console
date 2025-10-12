package com.alibaba.higress.sdk.model.consumer;

/**
 * 允许列表操作枚举类
 * 定义了对允许列表进行操作的几种方式
 */
public enum AllowListOperation {

    /**
     * 添加操作
     * 将提供的消费者添加到当前允许列表中
     * 如果认证开关不为空，则更新认证开关状态
     */
    ADD,
    
    /**
     * 移除操作
     * 从当前允许列表中移除提供的消费者
     * 如果认证开关不为空，则更新认证开关状态
     */
    REMOVE,
    
    /**
     * 替换操作
     * 使用提供的消费者替换当前允许列表
     * 如果认证开关不为空，则更新认证开关状态
     */
    REPLACE,
    
    /**
     * 切换操作
     * 仅更新认证开关状态，保持允许列表不变
     */
    TOGGLE_ONLY
}
