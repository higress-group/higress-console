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
 * Spec defines the desired state of Gateway.
 */
@Data
public class V1GatewaySpec {
    public static final String HIGRESS_GATEWAY_SERVICE = "higress-gateway.higress-system.svc.cluster.local";

    public static final String SERIALIZED_NAME_ADDRESSES = "addresses";
    public static final String SERIALIZED_NAME_GATEWAY_CLASS_NAME = "gatewayClassName";
    public static final String SERIALIZED_NAME_LISTENERS = "listeners";
    @SerializedName(SERIALIZED_NAME_ADDRESSES)
    private List<V1GatewaySpecAddresses> addresses = null;
    @SerializedName(SERIALIZED_NAME_GATEWAY_CLASS_NAME)
    private String gatewayClassName;
    @SerializedName(SERIALIZED_NAME_LISTENERS)
    private List<V1GatewaySpecListeners> listeners = new ArrayList<>();

    public V1GatewaySpec addAddressesItem(V1GatewaySpecAddresses addressesItem) {
        if (this.addresses == null) {
            this.addresses = new ArrayList<>();
        }
        this.addresses.add(addressesItem);
        return this;
    }

    public V1GatewaySpec addDefaultAddress() {
        V1GatewaySpecAddresses addressesItem = new V1GatewaySpecAddresses();
        addressesItem.setType("Hostname");
        addressesItem.setValue(HIGRESS_GATEWAY_SERVICE);
        return addAddressesItem(addressesItem);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1GatewaySpec v1GatewaySpec = (V1GatewaySpec) o;
        return Objects.equals(this.addresses, v1GatewaySpec.addresses) &&
                Objects.equals(this.gatewayClassName, v1GatewaySpec.gatewayClassName) &&
                Objects.equals(this.listeners, v1GatewaySpec.listeners);
    }

    @Override
    public int hashCode() {
        return Objects.hash(addresses, gatewayClassName, listeners);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpec {\n" +
                "    addresses: " + toIndentedString(addresses) + "\n" +
                "    gatewayClassName: " + toIndentedString(gatewayClassName) + "\n" +
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

