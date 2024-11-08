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

import java.util.Map;

import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.route.UpstreamService;

interface LlmProviderHandler {

    String PROVIDER_ID_KEY = "id";
    String PROVIDER_TYPE_KEY = "type";

    String getType();

    default LlmProvider createProvider() {
        return new LlmProvider();
    }

    boolean loadConfig(LlmProvider provider, Map<String, Object> configurations);

    void saveConfig(LlmProvider provider, Map<String, Object> configurations);

    ServiceSource buildServiceSource(String providerName);

    UpstreamService buildUpstreamService(String providerName);
}
