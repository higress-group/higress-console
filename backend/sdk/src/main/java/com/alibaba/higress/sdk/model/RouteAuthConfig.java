package com.alibaba.higress.sdk.model;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 路由认证配置类，用于定义路由的认证相关配置。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "路由认证配置类，用于管理路由的认证信息。")
public class RouteAuthConfig {

    /**
     * 是否为路由启用认证。
     * 如果设置为 true，则访问该路由需要进行身份验证。
     */
    @Schema(description = "是否启用认证")
    private Boolean enabled;
    
    /**
     * 允许的凭证类型列表。
     * 指定允许用于该路由的认证凭证类型。
     */
    @Schema(description = "允许的凭证类型")
    private List<String> allowedCredentialTypes;
    
    /**
     * 允许的消费者名称列表。
     * 只有在列表中的消费者才能访问该路由。
     */
    @Schema(description = "允许的消费者名称")
    private List<String> allowedConsumers;

    /**
     * 验证路由认证配置的有效性。
     * 目前该方法为空，待实现具体的验证逻辑。
     */
    public void validate() {
    }
}
