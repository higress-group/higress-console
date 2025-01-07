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

package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * ResponseHeaderModifier defines a schema for a filter that modifies response headers.   Support: Extended
 */
@Data
public class V1HTTPRouteSpecResponseHeaderModifier {
    public static final String SERIALIZED_NAME_ADD = "add";
    public static final String SERIALIZED_NAME_REMOVE = "remove";
    public static final String SERIALIZED_NAME_SET = "set";
    @SerializedName(SERIALIZED_NAME_ADD)
    private List<V1HTTPRouteSpecRequestHeaderModifierAdd> add = null;
    @SerializedName(SERIALIZED_NAME_REMOVE)
    private List<String> remove = null;
    @SerializedName(SERIALIZED_NAME_SET)
    private List<V1HTTPRouteSpecRequestHeaderModifierAdd> set = null;

    public V1HTTPRouteSpecResponseHeaderModifier addAddItem(V1HTTPRouteSpecRequestHeaderModifierAdd addItem) {
        if (this.add == null) {
            this.add = new ArrayList<>();
        }
        this.add.add(addItem);
        return this;
    }

    public V1HTTPRouteSpecResponseHeaderModifier addRemoveItem(String removeItem) {
        if (this.remove == null) {
            this.remove = new ArrayList<>();
        }
        this.remove.add(removeItem);
        return this;
    }

    public V1HTTPRouteSpecResponseHeaderModifier addSetItem(V1HTTPRouteSpecRequestHeaderModifierAdd setItem) {
        if (this.set == null) {
            this.set = new ArrayList<>();
        }
        this.set.add(setItem);
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
        V1HTTPRouteSpecResponseHeaderModifier v1HttpRouteSpecResponseHeaderModifier = (V1HTTPRouteSpecResponseHeaderModifier) o;
        return Objects.equals(this.add, v1HttpRouteSpecResponseHeaderModifier.add) &&
                Objects.equals(this.remove, v1HttpRouteSpecResponseHeaderModifier.remove) &&
                Objects.equals(this.set, v1HttpRouteSpecResponseHeaderModifier.set);
    }

    @Override
    public int hashCode() {
        return Objects.hash(add, remove, set);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecResponseHeaderModifier {\n" +
                "    add: " + toIndentedString(add) + "\n" +
                "    remove: " + toIndentedString(remove) + "\n" +
                "    set: " + toIndentedString(set) + "\n" +
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

