package com.alibaba.higress.console.model;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 系统信息数据模型
 * 用于封装系统的基本信息和功能特性
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "System Information")
public class SystemInfo {

    /**
     * 系统版本号
     * 标识当前系统的版本信息
     */
    @Schema(description = "System version")
    private String version;

    /**
     * 系统功能特性列表
     * 包含系统支持的所有功能特性的键值列表
     */
    @Schema(description = "System capabilities", ref = "CapabilityKey")
    private List<String> capabilities;
}
