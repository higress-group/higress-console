package com.alibaba.higress.sdk.model;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "路由认证配置类，用于管理路由的认证信息。")
public class RouteAuthConfig {

    @Schema(description = "是否启用认证")
    private Boolean enabled;
    @Schema(description = "允许的凭证类型")
    private List<String> allowedCredentialTypes;
    @Schema(description = "允许的消费者名称")
    private List<String> allowedConsumers;

    public void validate() {
    }
}
