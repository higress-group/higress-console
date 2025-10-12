package com.alibaba.higress.sdk.model.ai;

import java.net.URI;
import java.util.Locale;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ValidateUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LLM提供者端点配置模型类
 * 用于定义LLM提供者的网络端点信息，包括协议、地址、端口和上下文路径
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LlmProviderEndpoint {

    /**
     * 端点协议
     * 指定与LLM提供者通信的协议，如HTTP或HTTPS
     */
    private String protocol;
    
    /**
     * 端点地址
     * 指定LLM提供者的主机地址或域名
     */
    private String address;
    
    /**
     * 端点端口
     * 指定LLM提供者的端口号
     */
    private Integer port;
    
    /**
     * 上下文路径
     * 指定LLM提供者的上下文路径或API基础路径
     */
    private String contextPath;

    /**
     * 验证端点配置的有效性
     * 检查必需字段是否已正确配置
     *
     * @throws IllegalArgumentException 当协议或地址为空，或端口无效时抛出非法参数异常
     */
    public void validate() {
        if (protocol == null || protocol.isEmpty()) {
            throw new IllegalArgumentException("Protocol cannot be null or empty.");
        }
        if (address == null || address.isEmpty()) {
            throw new IllegalArgumentException("Address cannot be null or empty.");
        }
        if (!ValidateUtil.checkPort(port)) {
            throw new IllegalArgumentException("Port must be a positive integer.");
        }
    }

    /**
     * 从URI创建LLM提供者端点对象
     * 解析URI并提取协议、地址、端口和上下文路径信息
     *
     * @param uri 统一资源标识符
     * @return LLM提供者端点对象
     * @throws IllegalArgumentException 当URI为空或不是绝对URI时抛出非法参数异常
     */
    public static LlmProviderEndpoint fromUri(URI uri) {
        if (uri == null) {
            throw new IllegalArgumentException("URI cannot be null.");
        }
        if (!uri.isAbsolute()) {
            throw new IllegalArgumentException("URI must be absolute: " + uri);
        }
        return LlmProviderEndpoint.builder().protocol(getServiceProtocol(uri)).address(getServiceDomain(uri))
            .port(getServicePort(uri)).contextPath(getServiceContextPath(uri)).build();
    }

    /**
     * 获取服务域名
     * 从URI中提取主机名
     *
     * @param uri 统一资源标识符
     * @return 服务域名
     */
    private static String getServiceDomain(URI uri) {
        return uri.getHost();
    }

    /**
     * 获取服务端口
     * 从URI中提取端口号，如果没有指定则根据协议返回默认端口
     *
     * @param uri 统一资源标识符
     * @return 服务端口
     */
    private static int getServicePort(URI uri) {
        if (uri.getPort() != -1) {
            return uri.getPort();
        }
        String protocol = getServiceProtocol(uri);
        switch (protocol) {
            case V1McpBridge.PROTOCOL_HTTP:
                return 80;
            case V1McpBridge.PROTOCOL_HTTPS:
                return 443;
            default:
                return 80;
        }
    }

    /**
     * 获取服务协议
     * 从URI中提取协议信息，并转换为标准协议名称
     *
     * @param uri 统一资源标识符
     * @return 服务协议
     */
    private static String getServiceProtocol(URI uri) {
        String scheme = uri.getScheme();
        if (scheme == null) {
            return V1McpBridge.PROTOCOL_HTTP;
        }
        switch (scheme.toLowerCase(Locale.ROOT)) {
            case V1McpBridge.PROTOCOL_HTTP:
            case V1McpBridge.PROTOCOL_HTTPS:
                return scheme;
            default:
                return V1McpBridge.PROTOCOL_HTTP;
        }
    }

    /**
     * 获取服务上下文路径
     * 从URI中提取路径信息，如果没有指定则返回根路径
     *
     * @param uri 统一资源标识符
     * @return 服务上下文路径
     */
    private static String getServiceContextPath(URI uri) {
        String path = uri.getPath();
        return StringUtils.firstNonEmpty(path, "/");
    }
}
