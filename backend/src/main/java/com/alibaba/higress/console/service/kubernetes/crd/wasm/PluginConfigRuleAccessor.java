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
package com.alibaba.higress.console.service.kubernetes.crd.wasm;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class PluginConfigRuleAccessor {

    private static final String MATCH_ROUTE_PROPERTY_NAME = "_match_route_";
    private static final String MATCH_DOMAIN_PROPERTY_NAME = "_match_domain_";
    private static final List<String> KNOWN_PROPERTIES = List.of(MATCH_ROUTE_PROPERTY_NAME, MATCH_DOMAIN_PROPERTY_NAME);

    private final Map<String, Object> properties;

    public PluginConfigRuleAccessor() {
        this(new HashMap<>());
    }

    public PluginConfigRuleAccessor(Map<String, Object> properties) {
        this.properties = properties;
    }

    @SuppressWarnings("unchecked")
    public List<String> getMatchDomains() {
        return (List<String>)properties.get(MATCH_DOMAIN_PROPERTY_NAME);
    }

    public void setMatchDomains(List<String> domains) {
        properties.put(MATCH_DOMAIN_PROPERTY_NAME, domains);
    }

    @SuppressWarnings("unchecked")
    public List<String> getMatchRoutes() {
        return (List<String>)properties.get(MATCH_ROUTE_PROPERTY_NAME);
    }

    public void setMatchRoutes(List<String> routes) {
        properties.put(MATCH_ROUTE_PROPERTY_NAME, routes);
    }

    public Map<String, Object> getConfigurations() {
        Map<String, Object> configurations = new HashMap<>(this.properties);
        KNOWN_PROPERTIES.forEach(configurations::remove);
        return configurations;
    }

    public void setConfigurations(Map<String, Object> configurations) {
        for (Iterator<Map.Entry<String, Object>> it = properties.entrySet().iterator(); it.hasNext();) {
            Map.Entry<String, Object> entry = it.next();
            if (!KNOWN_PROPERTIES.contains(entry.getKey())) {
                it.remove();
            }
        }
        if (configurations != null) {
            properties.putAll(configurations);
        }
    }

    public Map<String, Object> toMap() {
        return new HashMap<>(properties);
    }
}
