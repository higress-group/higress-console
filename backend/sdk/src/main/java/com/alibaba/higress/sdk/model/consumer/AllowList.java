package com.alibaba.higress.sdk.model.consumer;

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.util.MapUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 允许列表配置类
 * 用于定义允许访问特定目标的消费者和凭据类型
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowList {

    /**
     * 目标映射
     * 定义了插件实例作用域与其对应的目标值之间的映射关系
     */
    private Map<WasmPluginInstanceScope, String> targets;
    
    /**
     * 认证启用状态
     * 指示是否启用了身份验证
     */
    private Boolean authEnabled;
    
    /**
     * 凭据类型列表
     * 定义了允许使用的凭据类型
     */
    private List<String> credentialTypes;
    
    /**
     * 消费者名称列表
     * 定义了允许访问的消费者名称
     */
    private List<String> consumerNames;

    /**
     * 创建指定目标的允许列表构建器
     *
     * @param scope  插件实例作用域
     * @param target 目标值
     * @return AllowListBuilder 允许列表构建器
     */
    public static AllowListBuilder forTarget(WasmPluginInstanceScope scope, String target) {
        return new AllowListBuilder().targets(MapUtil.of(scope, target));
    }
}
