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

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.route.UpstreamService;

interface LlmProviderHandler {

    String getType();

    default LlmProvider createProvider() {
        return new LlmProvider();
    }

    boolean loadConfig(LlmProvider provider, Map<String, Object> configurations);

    void saveConfig(LlmProvider provider, Map<String, Object> configurations);

    /**
     * Validate the provider configurations and normalize configuration values based on the provider type.
     * 
     * @param configurations provider configurations
     */
    void normalizeConfigs(Map<String, Object> configurations);

    ServiceSource buildServiceSource(String providerName, Map<String, Object> providerConfig);

    default List<ServiceSource> getExtraServiceSources(String providerName, Map<String, Object> providerConfig,
        boolean forDelete) {
        return null;
    }

    UpstreamService buildUpstreamService(String providerName, Map<String, Object> providerConfig);

    /**
     * For some LLM providers, the upstream service name may change after an update. So we need to sync the
     * configuration of related AI routes after updating a provider.
     * 
     * @return true if a sync is required.
     */
    default boolean needSyncRouteAfterUpdate() {
        return false;
    }
}
