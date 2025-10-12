package com.alibaba.higress.sdk.model.route;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 请求重写配置类
 * 用于配置请求路径和主机名的重写规则
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request Rewrite Config")
public class RewriteConfig {

    /**
     * 重写功能启用状态
     * 指示是否启用请求重写功能
     */
    @Schema(description = "Enable or disable the rewrite")
    private Boolean enabled;

    /**
     * 重写后的路径
     * 请求将被重写到的新路径
     */
    @Schema(description = "Rewritten path")
    private String path;

    /**
     * 重写后的主机名
     * 请求将被重写到的新主机名
     */
    @Schema(description = "Rewritten host")
    private String host;
}
