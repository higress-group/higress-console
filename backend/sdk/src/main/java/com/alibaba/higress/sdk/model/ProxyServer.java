package com.alibaba.higress.sdk.model;

import java.beans.Transient;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
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
@Schema(description = "代理服务器配置类，用于管理代理服务器的信息。")
public class ProxyServer {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-z][a-z0-9-_.]{0,62}$");

    @Schema(description = "代理服务器类型", allowableValues = {V1McpBridge.PROXY_TYPE_HTTP})
    private String type;

    @Schema(description = "代理服务器名称")
    private String name;

    @Schema(description = "代理服务器版本。更新时必需。")
    private String version;

    @Schema(description = "代理服务器地址，可以是IP或域名")
    private String serverAddress;

    @Schema(description = "代理服务器端口")
    private Integer serverPort;

    @Schema(description = "代理服务器连接超时时间（毫秒），默认为1200")
    private Integer connectTimeout;

    @Transient
    public boolean isValid() {
        if (StringUtils.isBlank(name) || !NAME_PATTERN.matcher(name).matches()) {
            return false;
        }
        if (StringUtils.isBlank(type)) {
            return false;
        }
        if (StringUtils.isBlank(serverAddress)
            || !ValidateUtil.checkIpAddress(serverAddress) && !ValidateUtil.checkDomain(serverAddress)) {
            return false;
        }
        if (!ValidateUtil.checkPort(serverPort)) {
            return false;
        }
        if (connectTimeout != null && connectTimeout < 0) {
            return false;
        }
        return true;
    }
}
