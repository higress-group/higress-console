/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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
@Schema(description = "Proxy Server")
public class ProxyServer {

    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-z][a-z0-9-_.]{0,62}$");

    @Schema(description = "Proxy server type", allowableValues = {V1McpBridge.PROXY_TYPE_HTTP})
    private String type;

    @Schema(description = "Proxy server name")
    private String name;

    @Schema(description = "Proxy server version. Required when updating.")
    private String version;

    @Schema(description = "Proxy server address, can be IP or domain name")
    private String serverAddress;

    @Schema(description = "Proxy server port")
    private Integer serverPort;

    @Schema(description = "Proxy server connect timeout in milliseconds, default is 1200")
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
