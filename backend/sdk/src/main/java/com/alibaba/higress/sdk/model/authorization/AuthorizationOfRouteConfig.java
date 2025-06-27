/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.model.authorization;

import java.util.Collection;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;

import com.google.common.collect.Sets;

import lombok.Data;

/**
 * @author lvshui
 */
@Data
public class AuthorizationOfRouteConfig {
    /**
     * authorization consumer list
     */
    private Set<String> allow;

    public void addAllow(String consumer) {
        if (CollectionUtils.isEmpty(allow)) {
            allow = Sets.newTreeSet();
        }
        allow.add(consumer);
    }

    public void addAllAllow(Collection<String> collection) {
        if (CollectionUtils.isEmpty(allow)) {
            allow = Sets.newTreeSet();
        }
        allow.addAll(collection);
    }
}
