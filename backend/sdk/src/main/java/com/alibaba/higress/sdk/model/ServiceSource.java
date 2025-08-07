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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Gateway Service Source")
public class ServiceSource implements VersionedDto {

    private static final Map<String, ServiceSourceValidator> VALIDATORS = new HashMap<>();

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

    @Schema(description = "Service source name")
    private String name;

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
        if (StringUtils.isAnyBlank(this.name, this.type, this.getDomain())) {
            return false;
        }

        if (!ValidateUtil.checkServiceName(this.name)) {
            return false;
        }

        if (this.getPort() == null || !ValidateUtil.checkPort(this.getPort())) {
            return false;
        }

        if (!validateMcpConfigs()) {
            return false;
        }

        ServiceSourceValidator validator = VALIDATORS.get(this.getType());
        if (validator != null && !validator.validate(this)) {
            return false;
        }

        if (StringUtils.isNotEmpty(proxyName) && !PROXY_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            return false;
        }

        return true;
    }

    private boolean validateMcpConfigs() {
        if (!V1McpBridge.MCP_SUPPORTED_REGISTRY_TYPES.contains(this.getType())) {
            return true;
        }
        if (MapUtils.isEmpty(properties)) {
            return true;
        }

        Object enabled = properties.get(V1McpBridge.ENABLE_MCP_SERVER);
        if (enabled == null) {
            // Not configured. We don't need to validate.
            return true;
        }
        if (!(enabled instanceof Boolean)) {
            return false;
        }
        if (!Boolean.TRUE.equals(enabled)) {
            // Not enabled. We don't need to validate.
            return true;
        }

        Object rawExportDomains = properties.get(V1McpBridge.MCP_SERVER_EXPORT_DOMAINS);
        if (rawExportDomains != null) {
            if (!(rawExportDomains instanceof List)) {
                return false;
            }
            List<?> exportDomains = (List<?>)rawExportDomains;
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

    private interface ServiceSourceValidator {

        default boolean validate(ServiceSource source) {
            return true;
        }
    }

    private static class NacosServiceSourceValidator implements ServiceSourceValidator {

        @Override
        @SuppressWarnings("unchecked")
        public boolean validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            if (MapUtils.isEmpty(properties)) {
                return false;
            }
            if (!V1McpBridge.REGISTRY_TYPE_NACOS3.equals(source.getType())
                || !Boolean.TRUE.equals(properties.get(V1McpBridge.ENABLE_MCP_SERVER))) {
                // No group configuration is needed for nacos3 when MCP is enabled.
                Object groups = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_GROUPS);
                if (!(groups instanceof List) || CollectionUtils.isEmpty((List<String>)groups)) {
                    return false;
                }
            }
            return true;
        }
    }

    private static class ConsulServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            Map<String, Object> properties = source.getProperties();
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            Object dataCenter = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_DATA_CENTER);
            if (!(dataCenter instanceof String) || StringUtils.isBlank((String)dataCenter)) {
                return false;
            }

            Object rawRefreshInterval = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL);
            if (rawRefreshInterval != null) {
                if (!(rawRefreshInterval instanceof Integer)) {
                    return false;
                }
                int refreshInterval = (Integer)rawRefreshInterval;
                if (refreshInterval < V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MIN
                    || refreshInterval > V1McpBridge.REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MAX) {
                    return false;
                }
            }

            return true;
        }
    }

    private static class StaticServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            if (StringUtils.isBlank(source.getDomain())) {
                return false;
            }

            List<String> addresses = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(addresses)) {
                return false;
            }

            for (String address : addresses) {
                String[] segments = address.split(Separators.COLON);
                if (segments.length != 2) {
                    return false;
                }
                if (!ValidateUtil.checkIpAddress(segments[0])) {
                    return false;
                }
                int port;
                try {
                    port = Integer.parseInt(segments[1]);
                } catch (NumberFormatException nfe) {
                    return false;
                }
                if (!ValidateUtil.checkPort(port)) {
                    return false;
                }
            }

            return true;
        }
    }

    private static class DnsServiceSourceValidator implements ServiceSourceValidator {

        @Override
        public boolean validate(ServiceSource source) {
            if (StringUtils.isBlank(source.getDomain())) {
                return false;
            }

            List<String> domains = Splitter.on(V1McpBridge.REGISTRY_TYPE_STATIC_DNS_SEPARATOR).trimResults()
                .omitEmptyStrings().splitToList(source.getDomain());
            if (CollectionUtils.isEmpty(domains)) {
                return false;
            }

            if (!domains.stream().allMatch(ValidateUtil::checkDomain)) {
                return false;
            }

            return true;
        }
    }
}
