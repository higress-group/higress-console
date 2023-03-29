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
package com.alibaba.higress.console.controller.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.controller.util.ValidateUtil;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.google.common.base.Splitter;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway Service Source")
public class ServiceSource {

    private static final Pattern NAME_PATTERN = Pattern.compile("^(?!-)[A-Za-z0-9-]{0,62}[A-Za-z0-9]$");
    private static final Map<String, ServiceSourceValidator> VALIDATORS = new HashMap<>();

    static {
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS2, new NacosServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_STATIC, new StaticServiceSourceValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_DNS, new DnsServiceSourceValidator());
    }

    private String name;

    private String version;

    /**
     * nacos,nacos2,zookeeper,consul,eureka,static,dns
     */
    private String type;

    private String domain;

    private Integer port;

    private Map<String, Object> properties;

    public boolean valid() {
        if (StringUtils.isAnyBlank(this.name, this.type, this.getDomain())) {
            return false;
        }

        if (!NAME_PATTERN.matcher(this.name).matches()) {
            return false;
        }

        if (this.getPort() == null || !ValidateUtil.checkPort(this.getPort())) {
            return false;
        }

        ServiceSourceValidator validator = VALIDATORS.get(this.getType());
        if (validator != null && !validator.validate(this)) {
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
            Object groups = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS);
            if (!(groups instanceof List) || CollectionUtils.isEmpty((List<String>)groups)) {
                return false;
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
                String[] segments = address.split(CommonKey.COLON);
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
