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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Status defines the current state of GatewayClass.   Implementations MUST populate status on all GatewayClass resources which specify their controller name.
 */
@Data
public class V1GatewayClassStatus {
    public static final String SERIALIZED_NAME_CONDITIONS = "conditions";
    @SerializedName(SERIALIZED_NAME_CONDITIONS)
    private List<V1GatewayClassStatusConditions> conditions = null;

    public V1GatewayClassStatus addConditionsItem(V1GatewayClassStatusConditions conditionsItem) {
        if (this.conditions == null) {
            this.conditions = new ArrayList<>();
        }
        this.conditions.add(conditionsItem);
        return this;
    }
}

