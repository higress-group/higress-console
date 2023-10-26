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
package com.alibaba.higress.sdk.service.kubernetes.crd.wasm;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchRule {

    private Boolean configDisable;

    private Map<String, Object> config;

    private List<String> domain;

    private List<String> ingress;

    public static MatchRule forDomain(String domain) {
        return new MatchRule(null, null, Collections.singletonList(domain), null);
    }

    public static MatchRule forIngress(String ingress) {
        return new MatchRule(null, null, null, Collections.singletonList(ingress));
    }

    public boolean keyEquals(MatchRule rule) {
        if ((domain == null) == (rule.domain != null)) {
            return false;
        }
        if ((ingress == null) == (rule.ingress != null)) {
            return false;
        }
        if (domain != null && (domain.size() != rule.domain.size() || !domain.containsAll(rule.domain))) {
            return false;
        }
        if (ingress != null && (ingress.size() != rule.ingress.size() || !ingress.containsAll(rule.ingress))) {
            return false;
        }
        return true;
    }
}
