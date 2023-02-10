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

import com.alibaba.higress.console.constant.KubernetesConstants;
import com.alibaba.higress.console.controller.util.ValidateUtil;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway ServiceSource")
public class ServiceSource {
    private String name;

    // todo
    private String version;
    /**
     * nacos,nacos2,zookeeper,consul,eureka
     */
    private String type;

    private String domain;

    private Integer port;

    private Map<String, Object> properties;

    public boolean valid() {
        if (StringUtils.isAnyBlank(this.name, this.type, this.getDomain())) {
            return false;
        }
        if (null == this.getPort() || null == this.getProperties() || !ValidateUtil.checkPort(this.getPort())) {
            return false;
        }
        if ((V1McpBridge.REGISTRY_TYPE_NACOS.equals(this.getType())
            || V1McpBridge.REGISTRY_TYPE_NACOS2.equals(this.getType()))
            && (null == this.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSNAMESPACEID) || StringUtils
                .isBlank((String)this.getProperties().get(V1McpBridge.REGISTRY_TYPE_NACOS_NACOSNAMESPACEID)))) {
            return false;
        }

        if (V1McpBridge.REGISTRY_TYPE_ZK.equals(this.getType())
            && null == this.getProperties().get(V1McpBridge.REGISTRY_TYPE_ZK_ZKSERVICESPATH)) {
            return false;
        }
        return true;
    }
}
