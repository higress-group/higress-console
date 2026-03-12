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
package com.alibaba.higress.sdk.service.kubernetes.model;

import com.alibaba.fastjson.annotation.JSONField;
import org.apache.commons.collections4.CollectionUtils;

import java.util.List;
import java.util.Map;

public class IstioEndpoint {

    @JSONField(name = "Labels")
    private Map<String, String> labels;

    @JSONField(name = "Addresses")
    private List<String> addresses;

    public List<String> getAddresses() {
        return addresses;
    }

    // Compatible with the old caller, return the first address
    public String getAddress() {
        if (CollectionUtils.isEmpty(addresses)) {
            return null;
        }
        return addresses.get(0);
    }

    public Map<String, String> getLabels() {
        return labels;
    }

    public void setLabels(Map<String, String> labels) {
        this.labels = labels;
    }

}
