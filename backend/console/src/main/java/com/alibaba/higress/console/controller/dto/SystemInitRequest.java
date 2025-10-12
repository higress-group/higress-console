package com.alibaba.higress.console.controller.dto;

import java.util.Map;

import com.alibaba.higress.console.model.User;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 系统初始化请求数据传输对象
 * 用于封装系统首次初始化时所需的配置信息和管理员用户信息
 *
 * @author CH3CHO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "System Init Request")
public class SystemInitRequest {

    /**
     * 管理员用户信息
     * 系统初始化时创建的第一个管理员账户
     */
    @Schema(description = "The new admin user")
    private User adminUser;

    /**
     * 系统配置键值对集合
     * 包含系统初始化所需的各种配置参数，以键值对形式存储
     */
    @Schema(description = "System configuration key-value pairs")
    private Map<String, Object> configs;
}
