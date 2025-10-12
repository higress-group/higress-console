package com.alibaba.higress.sdk.model;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.util.MapUtil;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WASM插件实例配置模型类
 * 用于管理网关的WASM插件实例信息，包括插件配置、作用域、目标等信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "WASM 插件实例配置类，用于管理网关的 WASM 插件实例信息。")
public class WasmPluginInstance implements VersionedDto {

    /**
     * 插件实例版本
     * 更新插件实例时必需，用于乐观锁控制
     */
    @Schema(description = "插件实例版本。更新时必需。")
    private String version;

    /**
     * 插件实例作用域（已弃用）
     * 旧版本的作用域定义，已被 targets 字段替代
     */
    @Deprecated
    @Schema(deprecated = true, description = "插件实例作用域。已弃用。")
    private WasmPluginInstanceScope scope;

    /**
     * 插件实例目标（已弃用）
     * 旧版本的目标定义，已被 targets 字段替代
     */
    @Deprecated
    @Schema(deprecated = true, description = "插件实例目标。已弃用。")
    private String target;

    /**
     * 插件实例目标映射
     * 定义插件实例在不同作用域下的目标对象映射关系
     */
    @Schema(description = "插件实例目标映射")
    private Map<WasmPluginInstanceScope, String> targets;

    /**
     * 插件名称
     * 标识该插件实例关联的插件名称
     */
    @Schema(description = "插件名称")
    private String pluginName;

    /**
     * 插件版本
     * 固定为 1.0.0，表示插件的版本号
     */
    @Schema(description = "插件版本。固定为 1.0.0")
    private String pluginVersion;

    /**
     * 是否为内部插件实例
     * 标识该插件实例是否为控制台自身管理的内部插件
     */
    @Schema(description = "是否为控制台自身管理的内部插件实例")
    private Boolean internal;

    /**
     * 插件实例是否已启用
     * 控制该插件实例是否生效
     */
    @Schema(description = "此插件实例是否已启用")
    private Boolean enabled;

    /**
     * YAML格式的原始配置
     * 插件实例的原始配置内容，以YAML格式存储
     */
    @Schema(description = "YAML 格式的原始配置")
    private String rawConfigurations;

    /**
     * 配置映射
     * 插件实例的配置参数映射，以键值对形式存储
     */
    @Schema(description = "配置映射")
    private Map<String, Object> configurations;

    /**
     * 判断是否为内部插件实例
     *
     * @return 如果是内部插件实例返回true，否则返回false
     */
    public boolean isInternal() {
        return Boolean.TRUE.equals(internal);
    }

    /**
     * 同步已弃用的字段
     * 保持新旧字段之间的数据一致性
     */
    public void syncDeprecatedFields() {
        // 如果新旧字段都为空，则无需同步
        if (scope == null && MapUtils.isEmpty(targets)) {
            return;
        }
        // 如果旧字段不为空，则同步到新字段
        if (scope != null) {
            targets = MapUtil.of(scope, target);
        } else if (targets.size() == 1) {
            // 如果新字段只有一个条目，则同步到旧字段
            Map.Entry<WasmPluginInstanceScope, String> entry = targets.entrySet().iterator().next();
            scope = entry.getKey();
            target = entry.getValue();
        } else {
            // 如果新字段有多个条目，无法确定同步哪一个，跳过同步
        }
    }

    /**
     * 判断是否包含指定作用域的目标
     *
     * @param scope 作用域
     * @return 如果包含指定作用域的目标返回true，否则返回false
     */
    public boolean hasScopedTarget(WasmPluginInstanceScope scope) {
        return targets != null && targets.containsKey(scope);
    }

    /**
     * 设置全局作用域目标
     */
    public void setGlobalTarget() {
        setTarget(WasmPluginInstanceScope.GLOBAL, null);
    }

    /**
     * 设置指定作用域和目标
     *
     * @param scope 作用域
     * @param target 目标对象
     */
    public void setTarget(WasmPluginInstanceScope scope, String target) {
        // 初始化targets映射
        if (targets == null) {
            targets = new HashMap<>();
        } else {
            // 清空现有目标
            targets.clear();
        }
        // 设置新的目标
        targets.put(scope, target);
        // 同步到已弃用字段
        syncDeprecatedFields();
    }

    /**
     * 添加指定作用域和目标
     *
     * @param scope 作用域
     * @param target 目标对象
     */
    public void putTarget(WasmPluginInstanceScope scope, String target) {
        // 初始化targets映射
        if (targets == null) {
            targets = new HashMap<>();
        }
        // 添加新的目标
        targets.put(scope, target);
        // 同步到已弃用字段
        syncDeprecatedFields();
    }

    /**
     * 验证插件实例配置的有效性
     *
     * @throws IllegalArgumentException 当配置不合法时抛出异常
     */
    public void validate() {
        // 验证targets不能为空
        if (MapUtils.isEmpty(targets)) {
            throw new IllegalArgumentException("instance.targets cannot be empty.");
        }
        // 验证全局作用域的配置
        if (targets.containsKey(WasmPluginInstanceScope.GLOBAL)) {
            // 全局作用域不能与其他作用域同时存在
            if (targets.size() > 1) {
                throw new IllegalArgumentException(
                        "instance.targets cannot contain GLOBAL and other scopes at the same time.");
            }
            // 全局作用域的目标必须为空
            String target = targets.get(WasmPluginInstanceScope.GLOBAL);
            if (target != null) {
                throw new IllegalArgumentException("instance.target must be empty when scope is GLOBAL.");
            }
        } else {
            // 验证非全局作用域的目标不能为空
            for (Map.Entry<WasmPluginInstanceScope, String> entry : targets.entrySet()) {
                if (StringUtils.isEmpty(entry.getValue())) {
                    throw new IllegalArgumentException(
                            "instance.target must not be null or empty when scope is not GLOBAL.");
                }
            }
        }
    }
}
