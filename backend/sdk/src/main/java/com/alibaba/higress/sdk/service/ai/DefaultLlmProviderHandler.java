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
package com.alibaba.higress.sdk.service.ai;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.ai.LlmProviderEndpoint;

class DefaultLlmProviderHandler extends AbstractLlmProviderHandler {

    private final String type;
    private final String domain;
    private final int port;
    private final String protocol;
    private final String contextPath;

    DefaultLlmProviderHandler(String type, String domain, int port, String protocol) {
        this(type, domain, port, protocol, "/");
    }

    DefaultLlmProviderHandler(String type, String domain, int port, String protocol, String contextPath) {
        this.type = type;
        this.domain = domain;
        this.port = port;
        this.protocol = protocol;
        this.contextPath = contextPath;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    protected List<LlmProviderEndpoint> getProviderEndpoints(Map<String, Object> providerConfig) {
        return Collections.singletonList(new LlmProviderEndpoint(protocol, domain, port, contextPath));
    }
}
