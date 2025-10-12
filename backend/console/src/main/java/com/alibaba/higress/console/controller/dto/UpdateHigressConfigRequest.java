package com.alibaba.higress.console.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新Higress配置请求数据传输对象
 * 用于封装更新Higress配置时提交的配置内容
 *
 * @author CH3CHO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Update higress-config Request")
public class UpdateHigressConfigRequest {

    /**
     * Higress配置内容
     * 以YAML格式表示的配置数据，用于更新Higress的配置信息
     */
    @Schema(description = "higress-config content in YAML format")
    private String config;
}
