package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "网关域名配置类，用于管理网关的域名信息。")
public class Domain implements VersionedDto {

    public static class EnableHttps {
        public static final String OFF = "off";
        public static final String ON = "on";
        public static final String FORCE = "force";
    }

    @Schema(description = "域名名称")
    private String name;

    @Schema(description = "域名版本。更新时必需。")
    private String version;

    @Schema(description = "HTTPS 配置", allowableValues = {EnableHttps.OFF, EnableHttps.ON, EnableHttps.FORCE})
    private String enableHttps;

    @Schema(description = "证书标识符")
    private String certIdentifier;
}
