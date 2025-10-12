package com.alibaba.higress.sdk.model;

import java.beans.Transient;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.util.ValidateUtil;
import com.google.common.base.Splitter;
import com.google.common.collect.ImmutableSet;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 网关服务源配置类，用于管理网关的服务源信息。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 * 实现 VersionedDto 接口，支持版本控制。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "网关服务源配置类，用于管理网关的服务源信息。")
public class ServiceSource implements VersionedDto {

    /**
     * 服务源验证器映射表。
     * 根据不同的注册中心类型，使用相应的验证器来验证服务源配置的有效性。
     */
    private static final Map<String, ServiceSourceValidator> VALIDATORS = new HashMap<>();

    /**
     * 支持代理的服务源类型集合。
     * 只有在这个集合中的服务源类型才支持设置代理服务器。
     */
    private static final Set<String> PROXY_SUPPORTED_REGISTRY_TYPES =
        ImmutableSet.of(V1McpBridge.REGISTRY_TYPE_STATIC, V1McpBridge.REGISTRY_TYPE_DNS);

    static {
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS2, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS3, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_CONSUL, new ConsulServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_STATIC, new StaticServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_DNS, new DnsServiceSourceValidator());
    }

    /**
     * 服务源名称。
     * 用于唯一标识一个服务源。
     */
    @Schema(description = "服务源名称")
    private String name;

    /**
     * 服务源版本。
     * 更新时必需，用于实现乐观锁机制。
     */
    @Schema(description = "服务源版本。更新时必需。")
    private String version;

    /**
     * 服务源类型。
     * 可选值包括：nacos, nacos2, nacos3, zookeeper, consul, eureka, static, dns。
     */
    @Schema(description = "服务源类型",
        allowableValues = {V1McpBridge.REGISTRY_TYPE_NACOS, V1McpBridge.REGISTRY_TYPE_NACOS2,
            V1McpBridge.REGISTRY_TYPE_NACOS3, V1McpBridge.REGISTRY_TYPE_ZK, V1McpBridge.REGISTRY_TYPE_CONSUL,
            V1McpBridge.REGISTRY_TYPE_EUREKA, V1McpBridge.REGISTRY_TYPE_STATIC, V1McpBridge.REGISTRY_TYPE_DNS})
    private String type;

    /**
     * 服务源域名。
     * 对于静态类型，使用 ip:port 格式。
     * 对于 DNS 类型，使用域名列表。
     */
    @Schema(
        description = "服务源域名。对于静态类型，使用 ip:port 格式。对于 DNS 类型，使用域名列表。")
    private String domain;

    /**
     * 服务源端口。
     * 对于静态类型，始终使用 80。
     */
    @Schema(description = "服务源端口。对于静态类型，始终使用 80。")
    private Integer port;

    /**
     * 服务源协议。
     * 用于静态和 DNS 类型。
     * 可选值包括：HTTP, HTTPS, gRPC, gRPCS。
     */
    @Schema(description = "服务源协议。用于静态和 DNS 类型。", allowableValues = {
        V1McpBridge.PROTOCOL_HTTP, V1McpBridge.PROTOCOL_HTTPS, V1McpBridge.PROTOCOL_GRPC, V1McpBridge.PROTOCOL_GRPCS})
    private String protocol;

    /**
     * 服务源 SNI。
     * 在启用 TLS 时用于静态和 DNS 类型。
     */
    @Schema(description = "服务源 SNI。在启用 TLS 时用于静态和 DNS 类型。")
    private String sni;

    /**
     * 代理服务器名称。
     * 仅在静态和 DNS 类型中支持。
     */
    @Schema(description = "代理服务器名称。仅在静态和 DNS 类型中支持。")
    private String proxyName;

    /**
     * 服务源额外属性，根据类型而定。
     * 对于 nacos/nacos2/nacos3: nacosGroups, nacosNamespaceId
     * 对于 MCP 支持的类型 (例如 nacos3): enableMCPServer, mcpServerBaseUrl, mcpServerExportDomains
     * 对于 consul: consulDatacenter, consulServiceTag, consulRefreshInterval
     * 对于 zookeeper: zkServicesPath
     */
    @Schema(description = "服务源额外属性，根据类型而定。\n"
        + "对于 nacos/nacos2/nacos3: nacosGroups, nacosNamespaceId\n"
        + "对于 MCP 支持的类型 (例如 nacos3): enableMCPServer, mcpServerBaseUrl, mcpServerExportDomains\n"
        + "对于 consul: consulDatacenter, consulServiceTag, consulRefreshInterval\n" + "对于 zookeeper: zkServicesPath")
    private Map<String, Object> properties;

    /**
     * 服务源认证配置。
     * 用于配置服务源的认证信息。
     */
    @Schema(description = "服务源认证配置")
    private ServiceSourceAuthN authN;

    /**
     * 检查服务源配置是否有效。
     * @return 如果配置有效返回 true，否则返回 false。
     */
    @Transient
    public boolean isValid() {
        // 检查必要字段是否为空
        if (StringUtils.isAnyBlank(this.name, this.type, this.getDomain())) {
            return false;
        }

        // 验证服务名称格式
        if (!ValidateUtil.checkServiceName(this.name)) {
            return false;
        }

        // 验证端口有效性
        if (this.getPort() == null || !ValidateUtil.checkPort(this.getPort())) {
            return false;
        }

        // 验证 MCP 配置
        if (!validateMcpConfigs()) {
            return false;
        }

        // 根据服务源类型进行特定验证
        ServiceSourceValidator validator = VALIDATORS.get(this.getType());
        if (validator != null && !validator.validate(this)) {
            return false;
        }

        // 检查代理服务器配置是否适用于当前服务源类型
        if (StringUtils.isNotEmpty(proxyName) && !PROXY_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            return false;
        }

        return true;
    }

    /**
     * 验证 MCP 相关配置的有效性。
     * @return 如果 MCP 配置有效返回 true，否则返回 false。
     */
    private boolean validateMcpConfigs() {
        // 如果不是 MCP 支持的注册中心类型，则无需验证
        if (!V1McpBridge.MCP_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            return true;
        }
        // 如果没有配置属性，则无需验证
        if (MapUtils.isEmpty(properties)) {
            return true;
        }

        Object enabled = properties.get(V1McpBridge.ENABLE_MCP_SERVER);
        if (enabled == null) {
            // 未配置，无需验证
            return true;
        }
        // 检查 enableMcpServer 是否为布尔类型
        if (!(enabled instanceof Boolean)) {
            return false;
        }
        // 如果未启用 MCP 服务器，则无需验证
        if (!Boolean.TRUE.equals(enabled)) {
            return true;
        }

        // 验证导出域名列表
        Object rawExportDomains = properties.get(V1McpBridge.MCP_SERVER_EXPORT_DOMAINS);
        if (rawExportDomains != null) {
            // 检查是否为列表类型
            if (!(rawExportDomains instanceof List)) {
                return false;
            }
            List<?> exportDomains = (List<?>)rawExportDomains;
            // 验证每个域名的有效性
            for (Object rawExportDomain : exportDomains) {
                if (!(rawExportDomain instanceof String)) {
                    return false;
                }
                String exportDomain = (String)rawExportDomain;
                if (!ValidateUtil.checkDomain(exportDomain)) {
                    return false;
                }
            }
        }

        // 验证 MCP 服务器基础 URL
        Object rawServerBaseUrl = properties.get(V1McpBridge.MCP_SERVER_BASE_URL);
        if (!(rawServerBaseUrl instanceof String)) {
            return false;
        }
        String serverBaseUrl = (String)rawServerBaseUrl;
        if (!ValidateUtil.checkUrlPath(serverBaseUrl)) {
            return false;
        }

        return true;
    }

    /**
     * 服务源验证器接口。
     * 定义了服务源验证的方法。
     */
    private interface ServiceSourceValidator {

        /**
         * 验证服务源配置的有效性。
         * @param source 服务源对象
         * @return 如果配置有效返回 true，否则返回 false
         */
        default boolean validate(ServiceSource source) {
            return true;
        }
    }

    /**
     * Nacos 服务源验证器。
     * 用于验证 Nacos 类型服务源的配置。
     */
    private static class NacosServiceSourceValidator implements ServiceSourceValidator {

        @Override
        @SuppressWarnings("unchecked")
        public boolean validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            // 检查属性是否为空
            if (MapUtils.isEmpty(properties)) {
                return false;
            }
            // 如果是 nacos3 且启用了 MCP，则不需要检查组配置
            if (!V1McpBridge.REGISTRY_TYPE_NACOS3.equals(source.getType())
                || !Boolean.TRUE.equals(properties.get(V1McpBridge.ENABLE_MCP_SERVER))) {
                // 检查组配置
                Object groups = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS);
                if (!(groups instanceof List) || CollectionUtils.isEmpty((List<String>)groups)) {
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Consul 服务源验证器。
     * 用于验证 Consul 类型服务源的配置。
     */
    private static class ConsulServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            // 检查属性是否为空
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            // 检查数据中心配置
            Object dataCenter = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER);
            if (!(dataCenter instanceof String) || StringUtils.isBlank((String)dataCenter)) {
                return false;
            }

            // 检查刷新间隔配置
            Object rawRefreshInterval = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL);
            if (rawRefreshInterval != null) {
                // 检查是否为整数类型
                if (!(rawRefreshInterval instanceof Integer)) {
                    return false;
                }
                int refreshInterval = (Integer)rawRefreshInterval;
                // 检查刷新间隔是否在有效范围内
                if (refreshInterval < V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MIN
                    || refreshInterval > V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MAX) {
                    return false;
                }
            }

            return true;
        }
    }

    /**
     * 静态服务源验证器。
     * 用于验证静态类型服务源的配置。
     */
    private static class StaticServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            // 检查域名是否为空
            if (StringUtils.isBlank(source.getDomain())) {
                return false;
            }

            // 分割并验证 IP 地址和端口
            List<String> addresses = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(addresses)) {
                return false;
            }

            for (String address : addresses) {
                String[] segments = address.split(Separators.COLON);
                // 检查地址格式是否正确 (ip:port)
                if (segments.length != 2) {
                    return false;
                }
                // 验证 IP 地址有效性
                if (!ValidateUtil.checkIpAddress(segments[0])) {
                    return false;
                }
                int port;
                try {
                    // 解析端口号
                    port = Integer.parseInt(segments[1]);
                } catch (NumberFormatException nfe) {
                    return false;
                }
                // 验证端口有效性
                if (!ValidateUtil.checkPort(port)) {
                    return false;
                }
            }

            return true;
        }
    }

    /**
     * DNS 服务源验证器。
     * 用于验证 DNS 类型服务源的配置。
     */
    private static class DnsServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            // 检查域名是否为空
            if (StringUtils.isBlank(source.getDomain())) {
                return false;
            }

            // 分割并验证域名列表
            List<String> domains = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(domains)) {
                return false;
            }

            // 验证所有域名的有效性
            if (!domains.stream().allMatch(ValidateUtil::checkDomain)) {
                return false;
            }

            return true;
        }
    }
}
