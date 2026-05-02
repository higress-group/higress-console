/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.sdk.model;

import java.beans.Transient;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.VPort;
import com.alibaba.higress.sdk.util.ValidateUtil;
import com.google.common.base.Splitter;
import com.google.common.collect.ImmutableSet;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Gateway Service Source")
public class ServiceSource implements VersionedDto {

    private static final Map<String, ServiceSourceValidator> VALIDATORS = new HashMap<>();

    private static final Set<String> PROXY_SUPPORTED_REGISTRY_TYPES =
        ImmutableSet.of(V1McpBridge.REGISTRY_TYPE_STATIC, V1McpBridge.REGISTRY_TYPE_DNS);

    private static final Set<String> ALLOWABLE_TYPES =
        ImmutableSet.of(V1McpBridge.REGISTRY_TYPE_NACOS, V1McpBridge.REGISTRY_TYPE_NACOS2,
            V1McpBridge.REGISTRY_TYPE_NACOS3, V1McpBridge.REGISTRY_TYPE_ZK, V1McpBridge.REGISTRY_TYPE_CONSUL,
            V1McpBridge.REGISTRY_TYPE_EUREKA, V1McpBridge.REGISTRY_TYPE_STATIC, V1McpBridge.REGISTRY_TYPE_DNS);

    static {
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS2, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS3, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_CONSUL, new ConsulServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_STATIC, new StaticServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_DNS, new DnsServiceSourceValidator());
    }

    @Schema(description = "Service source name")
    private String name;

    @Schema(description = "Register vport configuration with default and service-specific values. Optional.",
        example = "{\"default\": 8080, \"services\": [{\"name\": \"svc1\", \"value\": 9090}]}")
    private VPort vport;

    @Schema(description = "Service source version. Required when updating.")
    private String version;

    /**
     * nacos,nacos2,nacos3,zookeeper,consul,eureka,static,dns
     */
    @Schema(description = "Service source type",
        allowableValues = {V1McpBridge.REGISTRY_TYPE_NACOS, V1McpBridge.REGISTRY_TYPE_NACOS2,
            V1McpBridge.REGISTRY_TYPE_NACOS3, V1McpBridge.REGISTRY_TYPE_ZK, V1McpBridge.REGISTRY_TYPE_CONSUL,
            V1McpBridge.REGISTRY_TYPE_EUREKA, V1McpBridge.REGISTRY_TYPE_STATIC, V1McpBridge.REGISTRY_TYPE_DNS})
    private String type;

    @Schema(
        description = "Service source domain(s). For static type, use ip:port format. For dns type, use domain list.")
    private String domain;

    @Schema(description = "Service source port. Always use 80 for static type.")
    private Integer port;

    @Schema(description = "Service source protocol. Used in static and dns types.", allowableValues = {
        V1McpBridge.PROTOCOL_HTTP, V1McpBridge.PROTOCOL_HTTPS, V1McpBridge.PROTOCOL_GRPC, V1McpBridge.PROTOCOL_GRPCS})
    private String protocol;

    @Schema(description = "Service source SNI. Used in static and dns types when TLS is enabled.")
    private String sni;

    @Schema(description = "Proxy server name. Only supported in static and dns types.")
    private String proxyName;

    @Schema(description = "Service source extra properties, depending on the type.\n"
        + "For nacos/nacos2/nacos3: nacosGroups, nacosNamespaceId\n"
        + "For MCP supported types (e.g. nacos3): enableMCPServer, mcpServerBaseUrl, mcpServerExportDomains\n"
        + "For consul: consulDatacenter, consulServiceTag, consulRefreshInterval\n" + "For zookeeper: zkServicesPath")
    private Map<String, Object> properties;

    @Schema(description = "Service source authentication config")
    private ServiceSourceAuthN authN;

    @Transient
    public boolean isValid() {
        try {
            validate();
            return true;
        } catch (ValidationException ex) {
            return false;
        }
    }

    @Transient
    public void validate() {
        // Basic field validation
        if (StringUtils.isBlank(this.name)) {
            throw new ValidationException("Service source name is required.");
        }
        if (StringUtils.isBlank(this.type)) {
            throw new ValidationException("Service source type is required.");
        }
        if (StringUtils.isBlank(this.getDomain())) {
            throw new ValidationException("Service source domain/IP is required.");
        }

        // Service name format validation
        if (!ValidateUtil.checkServiceName(this.name)) {
            throw new ValidationException(
                "Invalid service source name format. Name can only contain letters, numbers, and hyphens(-), "
                    + "cannot start or end with a hyphen, and must be 1-63 characters long.");
        }

        // Check if type is within allowable values
        if (!ALLOWABLE_TYPES.contains(this.type)) {
            throw new ValidationException(
                "Unsupported service source type: " + this.type + ". Supported types: " + ALLOWABLE_TYPES);
        }

        // For non-static and non-DNS types, domain must be valid IP or domain
        if (!V1McpBridge.REGISTRY_TYPE_STATIC.equals(this.type) && !V1McpBridge.REGISTRY_TYPE_DNS.equals(this.type)
            && !ValidateUtil.checkIpOrDomain(this.getDomain())) {
            throw new ValidationException("Invalid domain format. For " + this.type
                + " type, domain must be a valid domain name or IP address.");
        }

        // Port validation
        if (this.getPort() == null) {
            throw new ValidationException("Service source port is required.");
        }
        if (!ValidateUtil.checkPort(this.getPort())) {
            throw new ValidationException("Invalid port range. Port must be an integer between 1-65535.");
        }

        // MCP configuration validation
        validateMcpConfigs();

        // Type-specific validator
        ServiceSourceValidator validator = VALIDATORS.get(this.getType());
        if (validator != null) {
            validator.validate(this);
        }

        // Proxy name validation
        if (StringUtils.isNotEmpty(proxyName) && !PROXY_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            throw new ValidationException("Proxy server name is only supported for static and dns types.");
        }

        // VPort validation
        if (this.vport != null) {
            if (this.vport.getDefaultValue() != null && !ValidateUtil.checkPort(this.vport.getDefaultValue())) {
                throw new ValidationException("Invalid VPort default value. Must be an integer between 1-65535.");
            }

            if (this.vport.getServicesVport() != null) {
                Set<String> serviceNames = new HashSet<>();
                for (VPort.ServiceVport serviceVport : this.vport.getServicesVport()) {
                    if (!ValidateUtil.checkPort(serviceVport.getValue())) {
                        throw new ValidationException("Invalid VPort value for service " + serviceVport.getName()
                            + ". Must be an integer between 1-65535.");
                    }
                    if (!serviceNames.add(serviceVport.getName())) {
                        throw new ValidationException(
                            "Duplicate service name in VPort configuration: " + serviceVport.getName());
                    }
                }
            }
        }
    }

    private void validateMcpConfigs() {
        if (!V1McpBridge.MCP_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            return;
        }
        if (MapUtils.isEmpty(properties)) {
            return;
        }

        Object enabled = properties.get(V1McpBridge.ENABLE_MCP_SERVER);
        if (enabled == null) {
            // Not configured. We don't need to validate.
            return;
        }
        if (!(enabled instanceof Boolean)) {
            throw new ValidationException("Invalid type for enableMCPServer. Must be a boolean.");
        }
        if (!Boolean.TRUE.equals(enabled)) {
            // Not enabled. We don't need to validate.
            return;
        }

        Object rawExportDomains = properties.get(V1McpBridge.MCP_SERVER_EXPORT_DOMAINS);
        if (rawExportDomains != null) {
            if (!(rawExportDomains instanceof List)) {
                throw new ValidationException("Invalid type for mcpServerExportDomains. Must be a list of strings.");
            }
            List<?> exportDomains = (List<?>)rawExportDomains;
            for (Object rawExportDomain : exportDomains) {
                if (!(rawExportDomain instanceof String)) {
                    throw new ValidationException(
                        "Invalid domain in mcpServerExportDomains. All entries must be strings.");
                }
                String exportDomain = (String)rawExportDomain;
                if (!ValidateUtil.checkDomain(exportDomain)) {
                    throw new ValidationException("Invalid domain format in mcpServerExportDomains: " + exportDomain);
                }
            }
        }

        Object rawServerBaseUrl = properties.get(V1McpBridge.MCP_SERVER_BASE_URL);
        if (!(rawServerBaseUrl instanceof String)) {
            throw new ValidationException("Invalid type for mcpServerBaseUrl. Must be a string.");
        }
        String serverBaseUrl = (String)rawServerBaseUrl;
        if (!ValidateUtil.checkUrlPath(serverBaseUrl)) {
            throw new ValidationException("Invalid mcpServerBaseUrl format: " + serverBaseUrl
                + ". Must start with '/' and cannot contain '?' characters.");
        }
    }

    private interface ServiceSourceValidator {

        default void validate(ServiceSource source) {
            // Default implementation passes validation
        }
    }

    private static class NacosServiceSourceValidator implements ServiceSourceValidator {

        @Override
        @SuppressWarnings("unchecked")
        public void validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            if (MapUtils.isEmpty(properties)) {
                throw new ValidationException("Nacos service source requires properties configuration.");
            }
            if (!V1McpBridge.REGISTRY_TYPE_NACOS3.equals(source.getType())
                || !Boolean.TRUE.equals(properties.get(V1McpBridge.ENABLE_MCP_SERVER))) {
                // No group configuration is needed for nacos3 when MCP is enabled.
                Object groups = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS);
                if (!(groups instanceof List) || CollectionUtils.isEmpty((List<String>)groups)) {
                    throw new ValidationException("Nacos service source requires at least one group in nacosGroups.");
                }
            }
        }
    }

    private static class ConsulServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public void validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            if (MapUtils.isEmpty(properties)) {
                throw new ValidationException("Consul service source requires properties configuration.");
            }

            Object dataCenter = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER);
            if (!(dataCenter instanceof String) || StringUtils.isBlank((String)dataCenter)) {
                throw new ValidationException("Consul service source requires consulDatacenter configuration.");
            }

            Object rawRefreshInterval = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL);
            if (rawRefreshInterval != null) {
                if (!(rawRefreshInterval instanceof Integer)) {
                    throw new ValidationException("Invalid type for consulRefreshInterval. Must be an integer.");
                }
                int refreshInterval = (Integer)rawRefreshInterval;
                if (refreshInterval < V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MIN
                    || refreshInterval > V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MAX) {
                    throw new ValidationException("Invalid consulRefreshInterval value: " + refreshInterval
                        + ". Must be between " + V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MIN + " and "
                        + V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MAX + " seconds.");
                }
            }
        }
    }

    private static class StaticServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public void validate(ServiceSource source) {
            if (StringUtils.isBlank(source.getDomain())) {
                throw new ValidationException("Static service source requires domain configuration.");
            }

            List<String> addresses = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(addresses)) {
                throw new ValidationException("Static service source domain format is invalid. "
                    + "Must provide a list of IP:Port addresses separated by commas.");
            }

            for (String address : addresses) {
                String[] segments = address.split(Separators.COLON);
                if (segments.length != 2) {
                    throw new ValidationException("Invalid address format: " + address + ". "
                        + "Correct format is IP:Port, e.g., 192.168.1.1:8080");
                }
                if (!ValidateUtil.checkIpAddress(segments[0])) {
                    throw new ValidationException("Invalid IP address format: " + segments[0]);
                }
                int port;
                try {
                    port = Integer.parseInt(segments[1]);
                } catch (NumberFormatException nfe) {
                    throw new ValidationException("Invalid port number: " + segments[1] + ". Port must be an integer.");
                }
                if (!ValidateUtil.checkPort(port)) {
                    throw new ValidationException("Invalid port range: " + port + ". Port must be between 1-65535.");
                }
            }
        }
    }

    private static class DnsServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public void validate(ServiceSource source) {
            if (StringUtils.isBlank(source.getDomain())) {
                throw new ValidationException("DNS service source requires domain configuration.");
            }

            List<String> domains = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(domains)) {
                throw new ValidationException("DNS service source domain format is invalid. "
                    + "Must provide a list of domain names separated by commas.");
            }

            for (String domain : domains) {
                if (!ValidateUtil.checkDomain(domain)) {
                    throw new ValidationException("Invalid domain format: " + domain);
                }
            }
        }
    }
}
