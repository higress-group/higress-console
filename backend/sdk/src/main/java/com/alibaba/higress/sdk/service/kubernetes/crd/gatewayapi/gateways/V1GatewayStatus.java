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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gateways;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Status defines the current state of Gateway.
 */
@Data
public class V1GatewayStatus {
    public static final String SERIALIZED_NAME_ADDRESSES = "addresses";
    public static final String SERIALIZED_NAME_CONDITIONS = "conditions";
    public static final String SERIALIZED_NAME_LISTENERS = "listeners";
    @SerializedName(SERIALIZED_NAME_ADDRESSES)
    private List<V1GatewayStatusAddresses> addresses = null;
    @SerializedName(SERIALIZED_NAME_CONDITIONS)
    private List<V1GatewayStatusConditions> conditions = null;
    @SerializedName(SERIALIZED_NAME_LISTENERS)
    private List<V1GatewayStatusListeners> listeners = null;

    public V1GatewayStatus addAddressesItem(V1GatewayStatusAddresses addressesItem) {
        if (this.addresses == null) {
            this.addresses = new ArrayList<>();
        }
        this.addresses.add(addressesItem);
        return this;
    }

    public V1GatewayStatus addConditionsItem(V1GatewayStatusConditions conditionsItem) {
        if (this.conditions == null) {
            this.conditions = new ArrayList<>();
        }
        this.conditions.add(conditionsItem);
        return this;
    }

    public V1GatewayStatus addListenersItem(V1GatewayStatusListeners listenersItem) {
        if (this.listeners == null) {
            this.listeners = new ArrayList<>();
        }
        this.listeners.add(listenersItem);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1GatewayStatus v1GatewayStatus = (V1GatewayStatus) o;
        return Objects.equals(this.addresses, v1GatewayStatus.addresses) &&
                Objects.equals(this.conditions, v1GatewayStatus.conditions) &&
                Objects.equals(this.listeners, v1GatewayStatus.listeners);
    }

    @Override
    public int hashCode() {
        return Objects.hash(addresses, conditions, listeners);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewayStatus {\n" +
                "    addresses: " + toIndentedString(addresses) + "\n" +
                "    conditions: " + toIndentedString(conditions) + "\n" +
                "    listeners: " + toIndentedString(listeners) + "\n" +
                "}";
        return sb;
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces
     * (except the first line).
     */
    private String toIndentedString(Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }

}

