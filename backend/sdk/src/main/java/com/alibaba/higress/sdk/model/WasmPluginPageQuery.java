package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * WASM 插件分页查询参数类，用于封装 WASM 插件的分页查询条件。
 * 继承自 CommonPageQuery，复用通用分页查询功能。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "WASM 插件分页查询参数类，用于封装 WASM 插件的分页查询条件。")
public class WasmPluginPageQuery extends CommonPageQuery {

    /**
     * 插件语言，用于过滤不同语言的插件。
     * 例如：zh-CN、en-US 等。
     */
    @Schema(description = "插件语言，用于过滤不同语言的插件。", allowableValues = {"zh-CN", "en-US"})
    private String lang;
}
