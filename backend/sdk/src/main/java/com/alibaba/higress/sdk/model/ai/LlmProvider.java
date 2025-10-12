package com.alibaba.higress.sdk.model.ai;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LLM服务提供者配置模型类
 * 用于定义LLM服务提供者的配置信息，包括名称、类型、协议、代理服务器、访问令牌等
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "LLM Service Provider")
public class LlmProvider {

    /**
     * 提供者名称
     * 用于唯一标识一个LLM服务提供者
     */
    @Schema(description = "Provider name")
    private String name;
    
    /**
     * 提供者类型
     * 指定LLM提供者的类型，参考 LlmProviderType 中定义的类型
     */
    @Schema(description = "Provider type", ref = "LlmProviderType")
    private String type;
    
    /**
     * 提供者协议
     * 指定与LLM提供者通信的协议，参考 LlmProviderProtocol 中定义的协议
     */
    @Schema(description = "Provider protocol", ref = "LlmProviderProtocol")
    private String protocol;
    
    /**
     * 代理服务器名称
     * 指定用于访问该LLM提供者的代理服务器
     */
    @Schema(description = "Proxy server name")
    private String proxyName;
    
    /**
     * 访问令牌列表
     * 用于请求该LLM提供者的访问令牌列表
     */
    @Schema(description = "Tokens used to request the provider")
    private List<String> tokens;
    
    /**
     * 令牌故障转移配置
     * 定义访问令牌的故障转移策略和配置
     */
    @Schema(description = "Token fail-over configuration")
    private TokenFailoverConfig tokenFailoverConfig;
    
    /**
     * 原始配置键值对
     * 由ai-proxy插件使用的原始配置键值对
     */
    @Schema(description = "Raw configuration key-value pairs used by ai-proxy plugin")
    private Map<String, Object> rawConfigs;

    /**
     * 验证LLM提供者配置的有效性
     * 检查必需字段是否已正确配置，并设置默认协议
     *
     * @param forUpdate 是否为更新操作
     * @throws IllegalArgumentException 当名称或类型为空，或协议未知时抛出非法参数异常
     */
    public void validate(boolean forUpdate) {
        if (StringUtils.isBlank(name)) {
            throw new IllegalArgumentException("name cannot be blank.");
        }
        if (StringUtils.isBlank(type)) {
            throw new IllegalArgumentException("type cannot be blank.");
        }
        if (StringUtils.isBlank(protocol)) {
            protocol = LlmProviderProtocol.DEFAULT.getValue();
        } else if (null == LlmProviderProtocol.fromValue(protocol)) {
            throw new IllegalArgumentException("Unknown protocol: " + protocol);
        }
    }
}
