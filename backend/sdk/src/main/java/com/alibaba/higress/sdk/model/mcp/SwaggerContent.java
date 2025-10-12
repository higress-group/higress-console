package com.alibaba.higress.sdk.model.mcp;

import javax.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Swagger内容类
 * 用于表示Swagger文档的内容
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Swagger内容")
public class SwaggerContent {

    /**
     * 内容
     * Swagger文档的内容，不能为空
     */
    @NotBlank(message = "内容不能为空")
    @Schema(description = "Swagger文档内容")
    private String content;

}
