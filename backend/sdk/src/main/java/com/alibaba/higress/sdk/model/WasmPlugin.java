package com.alibaba.higress.sdk.model;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.ImagePullPolicy;
import com.alibaba.higress.sdk.service.kubernetes.crd.wasm.PluginPhase;
import com.alibaba.higress.sdk.util.ValidateUtil;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "WASM 插件配置类，用于管理网关的 WASM 插件信息。")
public class WasmPlugin implements VersionedDto {

    @Schema(description = "插件名称")
    private String name;

    @Schema(description = "插件版本。固定为 1.0.0")
    private String pluginVersion;

    @Schema(description = "插件资源版本。更新时必需。")
    private String version;

    @Schema(description = "插件类别")
    private String category;

    @Schema(description = "插件显示标题")
    private String title;

    @Schema(description = "插件显示描述")
    private String description;

    @Schema(description = "插件是否为内置插件")
    private Boolean builtIn;

    @Schema(description = "插件图标 URL")
    private String icon;

    @Schema(description = "插件镜像仓库")
    private String imageRepository;

    @Schema(description = "插件镜像标签")
    private String imageVersion;

    @Schema(description = "插件镜像拉取策略")
    private String imagePullPolicy;

    @Schema(description = "插件镜像拉取密钥")
    private String imagePullSecret;

    @Schema(description = "插件执行阶段", ref = "PluginPhase")
    private String phase;

    @Schema(description = "插件在给定阶段的执行优先级", minimum = "0", maximum = "1000")
    private Integer priority;

    public void validate() {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }

        if (!ValidateUtil.checkServiceName(name)) {
            throw new ValidationException("Invalid name format.");
        }

        if (StringUtils.isBlank(title)) {
            throw new ValidationException("title cannot be blank.");
        }

        if (StringUtils.isBlank(category)) {
            throw new ValidationException("category cannot be blank.");
        }

        if (StringUtils.isBlank(imageRepository)) {
            throw new ValidationException("imageRepository cannot be blank.");
        }

        ImagePullPolicy pullPolicy = ImagePullPolicy.fromName(imagePullPolicy);
        if (pullPolicy == null) {
            throw new ValidationException("Invalid imagePullPolicy: " + imagePullPolicy);
        }

        PluginPhase pluginPhase = PluginPhase.fromName(phase);
        if (pluginPhase == null) {
            throw new ValidationException("Invalid phase: " + phase);
        }
    }
}
