package com.alibaba.higress.sdk.model;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WASM插件配置模型类
 * 用于管理网关的WASM插件配置信息，包括配置模式定义和配置数据验证
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "WASM 插件配置类，用于管理网关的 WASM 插件配置信息。")
public class WasmPluginConfig {

    /**
     * WASM插件配置模式
     * 定义了插件配置的数据结构和验证规则，基于OpenAPI Schema规范
     */
    @Schema(description = "WASM 插件配置模式")
    private io.swagger.v3.oas.models.media.Schema<?> schema;

    /**
     * 验证并清理配置数据
     * 根据插件配置模式验证输入的配置数据，并清理无效或不必要的配置项
     *
     * @param configurations 待验证和清理的配置数据映射
     * @return 验证和清理后的配置数据映射
     */
    public Map<String, Object> validateAndCleanUp(Map<String, Object> configurations) {
        // TODO: 实现配置数据的验证和清理逻辑
        // 需要根据 schema 定义的规则验证 configurations 中的每个配置项
        // 移除不符合规范或不必要的配置项
        // 对缺失的可选配置项设置默认值
        return configurations;
    }
}
