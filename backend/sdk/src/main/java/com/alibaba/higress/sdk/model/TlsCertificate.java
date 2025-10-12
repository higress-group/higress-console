package com.alibaba.higress.sdk.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TLS 证书配置类，用于管理网关的 TLS 证书信息。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 * 实现 VersionedDto 接口，支持版本控制。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "TLS 证书配置类，用于管理网关的 TLS 证书信息。")
public class TlsCertificate implements VersionedDto {

    /**
     * 证书名称。
     * 用于唯一标识一个证书。
     */
    @Schema(description = "证书名称")
    private String name;

    /**
     * 证书版本。
     * 更新时必需，用于实现乐观锁机制。
     */
    @Schema(description = "证书版本。更新时必需。")
    private String version;

    /**
     * PEM 格式的证书内容。
     * 包含证书的公钥信息。
     */
    @Schema(description = "PEM 格式的证书内容")
    private String cert;

    /**
     * PEM 格式的私钥内容。
     * 包含证书的私钥信息。
     */
    @Schema(description = "PEM 格式的私钥内容")
    private String key;

    /**
     * 证书适用的域名（包括 SAN）。
     * 列出该证书可以用于哪些域名。
     */
    @Schema(description = "证书适用的域名（包括 SAN）")
    private List<String> domains;

    /**
     * 证书有效期开始时间。
     * 证书从该时间开始生效。
     */
    @Schema(description = "有效期开始时间")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss'Z'")
    private LocalDateTime validityStart;

    /**
     * 证书有效期结束时间。
     * 证书在该时间之后失效。
     */
    @Schema(description = "有效期结束时间")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss'Z'")
    private LocalDateTime validityEnd;
}
