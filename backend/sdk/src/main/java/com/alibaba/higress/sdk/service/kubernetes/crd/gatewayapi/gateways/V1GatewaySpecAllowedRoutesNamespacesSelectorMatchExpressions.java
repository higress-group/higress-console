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
 * A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
 */
@Data
public class V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions {
    public static final String SERIALIZED_NAME_KEY = "key";
    public static final String SERIALIZED_NAME_OPERATOR = "operator";
    public static final String SERIALIZED_NAME_VALUES = "values";
    @SerializedName(SERIALIZED_NAME_KEY)
    private String key;
    @SerializedName(SERIALIZED_NAME_OPERATOR)
    private String operator;
    @SerializedName(SERIALIZED_NAME_VALUES)
    private List<String> values = null;


    public V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions addValuesItem(String valuesItem) {
        if (this.values == null) {
            this.values = new ArrayList<>();
        }
        this.values.add(valuesItem);
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
        V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions v1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions = (V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions) o;
        return Objects.equals(this.key, v1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions.key) &&
                Objects.equals(this.operator, v1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions.operator) &&
                Objects.equals(this.values, v1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions.values);
    }

    @Override
    public int hashCode() {
        return Objects.hash(key, operator, values);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions {\n" +
                "    key: " + toIndentedString(key) + "\n" +
                "    operator: " + toIndentedString(operator) + "\n" +
                "    values: " + toIndentedString(values) + "\n" +
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

