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

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Gateway Service Source Authentication Config")
public class ServiceSourceAuthN {

    private static final Map<String, AuthNValidator> VALIDATORS = new HashMap<>();

    static {
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS2, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS3, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_CONSUL, new ConsulAuthValidator());
    }

    @Schema(description = "Enable authentication when accessing the service source")
    private Boolean enabled;

    @Schema(description = "Authentication properties, depending on the type.\n"
        + "For nacos/nacos2: nacosUsername, nacosPassword\n" + "For consul: consulToken\n")
    private Map<String, String> properties;

    public boolean validate(String registryType) {
        if (enabled == null || !enabled) {
            return true;
        }
        if (MapUtils.isEmpty(properties)) {
            return false;
        }
        AuthNValidator validator = VALIDATORS.get(registryType);
        return validator == null || validator.validate(this);
    }

    private interface AuthNValidator {

        default boolean validate(ServiceSourceAuthN authN) {
            return true;
        }
    }

    private static class NacosAuthNValidator implements AuthNValidator {

        @Override
        public boolean validate(ServiceSourceAuthN authN) {
            Map<String, String> properties = authN.getProperties();
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            String username = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_USERNAME);
            if (StringUtils.isBlank(username)) {
                return false;
            }
            String password = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_PASSWORD);
            if (StringUtils.isBlank(password)) {
                return false;
            }

            return true;
        }
    }

    private static class ConsulAuthValidator implements AuthNValidator {

        @Override
        public boolean validate(ServiceSourceAuthN authN) {
            Map<String, String> properties = authN.getProperties();
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            String token = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_TOKEN);
            if (StringUtils.isBlank(token)) {
                return false;
            }

            return true;
        }
    }
}
