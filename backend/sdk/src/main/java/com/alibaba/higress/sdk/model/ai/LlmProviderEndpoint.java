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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LlmProviderEndpoint {

    private String protocol;
    private String address;
    private Integer port;
    private String contextPath;

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

    private static String getServiceDomain(URI uri) {
        return uri.getHost();
    }

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

    private static String getServiceContextPath(URI uri) {
        String path = uri.getPath();
        return StringUtils.firstNonEmpty(path, "/");
    }
}
