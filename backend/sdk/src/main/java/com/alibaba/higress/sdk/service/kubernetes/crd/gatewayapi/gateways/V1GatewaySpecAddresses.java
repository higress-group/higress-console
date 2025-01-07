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

import java.util.Objects;

/**
 * GatewayAddress describes an address that can be bound to a Gateway.
 */
@Data
public class V1GatewaySpecAddresses {
    public static final String SERIALIZED_NAME_TYPE = "type";
    public static final String SERIALIZED_NAME_VALUE = "value";
    @SerializedName(SERIALIZED_NAME_TYPE)
    private String type;
    @SerializedName(SERIALIZED_NAME_VALUE)
    private String value;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1GatewaySpecAddresses v1GatewaySpecAddresses = (V1GatewaySpecAddresses) o;
        return Objects.equals(this.type, v1GatewaySpecAddresses.type) &&
                Objects.equals(this.value, v1GatewaySpecAddresses.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, value);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecAddresses {\n" +
                "    type: " + toIndentedString(type) + "\n" +
                "    value: " + toIndentedString(value) + "\n" +
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

