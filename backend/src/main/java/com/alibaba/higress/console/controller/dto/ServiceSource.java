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

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.console.controller.util.ValidateUtil;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway ServiceSource")
public class ServiceSource {
    private String name;

    private String version;

    /**
     * nacos,nacos2,zookeeper,consul,eureka
     */
    private String type;

    private String domain;

    private Integer port;

    private Map<String, Object> properties;

    @SuppressWarnings("unchecked")
    public boolean valid() {
        if (StringUtils.isAnyBlank(this.name, this.type, this.getDomain())) {
            return false;
        }
        if (null == this.getPort() || null == this.getProperties() || !ValidateUtil.checkPort(this.getPort())) {
            return false;
        }
        if (V1McpBridge.REGISTRY_TYPE_NACOS.equals(this.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(this.getType())) {
            Object groups = this.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSGROUPS);
            if (!(groups instanceof List) || CollectionUtils.isEmpty((List<String>)groups)) {
                return false;
            }
        }

        return true;
    }
}
