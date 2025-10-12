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

/**
 * 代理服务器配置类，用于管理代理服务器的信息。
 * 该类使用 Lombok 注解来自动生成 getter、setter、构造函数等方法，
 * 并使用 Swagger 注解来描述 API 文档。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "代理服务器配置类，用于管理代理服务器的信息。")
public class ProxyServer {

    /**
     * 代理服务器名称的正则表达式模式，
     * 要求以小写字母开头，后面可以跟小写字母、数字、连字符、下划线或点，
     * 总长度不超过63个字符。
     */
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-z][a-z0-9-_.]{0,62}$");

    /**
     * 代理服务器类型，当前只支持 HTTP 类型。
     * 该字段使用 V1McpBridge.PROXY_TYPE_HTTP 常量来限制允许的值。
     */
    @Schema(description = "代理服务器类型", allowableValues = {V1McpBridge.PROXY_TYPE_HTTP})
    private String type;

    /**
     * 代理服务器名称，用于唯一标识一个代理服务器。
     */
    @Schema(description = "代理服务器名称")
    private String name;

    /**
     * 代理服务器版本，用于标识代理服务器配置的版本。
     * 在更新代理服务器配置时，该字段是必需的。
     */
    @Schema(description = "代理服务器版本。更新时必需。")
    private String version;

    /**
     * 代理服务器地址，可以是 IP 地址或域名。
     */
    @Schema(description = "代理服务器地址，可以是IP或域名")
    private String serverAddress;

    /**
     * 代理服务器端口，用于指定代理服务器监听的端口号。
     */
    @Schema(description = "代理服务器端口")
    private Integer serverPort;

    /**
     * 代理服务器连接超时时间（毫秒），默认为1200毫秒。
     * 该字段用于设置连接到代理服务器的超时时间。
     */
    @Schema(description = "代理服务器连接超时时间（毫秒），默认为1200")
    private Integer connectTimeout;

    /**
     * 验证代理服务器配置是否有效。
     * 检查包括名称格式、类型、地址格式、端口范围和超时时间等。
     *
     * @return 如果配置有效返回 true，否则返回 false。
     */
    @Transient
    public boolean isValid() {
        // 检查名称是否为空或不符合命名规范
        if (StringUtils.isBlank(name) || !NAME_PATTERN.matcher(name).matches()) {
            return false;
        }
        // 检查类型是否为空
        if (StringUtils.isBlank(type)) {
            return false;
        }
        // 检查地址是否为空，以及是否为有效的 IP 地址或域名
        if (StringUtils.isBlank(serverAddress)
            || !ValidateUtil.checkIpAddress(serverAddress) && !ValidateUtil.checkDomain(serverAddress)) {
            return false;
        }
        // 检查端口是否有效
        if (!ValidateUtil.checkPort(serverPort)) {
            return false;
        }
        // 检查连接超时时间是否为负数
        if (connectTimeout != null && connectTimeout < 0) {
            return false;
        }
        // 所有检查通过，配置有效
        return true;
    }
}
