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
 * RequestHeaderModifier defines a schema for a filter that modifies request headers.   Support: Core
 */
@Data
public class V1HTTPRouteSpecRequestHeaderModifier {
    public static final String SERIALIZED_NAME_ADD = "add";
    public static final String SERIALIZED_NAME_REMOVE = "remove";
    public static final String SERIALIZED_NAME_SET = "set";
    @SerializedName(SERIALIZED_NAME_ADD)
    private List<V1HTTPRouteSpecRequestHeaderModifierAdd> add = null;
    @SerializedName(SERIALIZED_NAME_REMOVE)
    private List<String> remove = null;
    @SerializedName(SERIALIZED_NAME_SET)
    private List<V1HTTPRouteSpecRequestHeaderModifierAdd> set = null;


    public V1HTTPRouteSpecRequestHeaderModifier addAddItem(V1HTTPRouteSpecRequestHeaderModifierAdd addItem) {
        if (this.add == null) {
            this.add = new ArrayList<>();
        }
        this.add.add(addItem);
        return this;
    }

    /**
     * Add adds the given header(s) (name, value) to the request before the action. It appends to any existing values associated with the header name.   Input:   GET /foo HTTP/1.1   my-header: foo   Config:   add:   - name: \&quot;my-header\&quot;     value: \&quot;bar,baz\&quot;   Output:   GET /foo HTTP/1.1   my-header: foo,bar,baz
     *
     * @return add
     **/

    public V1HTTPRouteSpecRequestHeaderModifier addRemoveItem(String removeItem) {
        if (this.remove == null) {
            this.remove = new ArrayList<>();
        }
        this.remove.add(removeItem);
        return this;
    }

    public V1HTTPRouteSpecRequestHeaderModifier addSetItem(V1HTTPRouteSpecRequestHeaderModifierAdd setItem) {
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
        V1HTTPRouteSpecRequestHeaderModifier v1HttpRouteSpecRequestHeaderModifier = (V1HTTPRouteSpecRequestHeaderModifier) o;
        return Objects.equals(this.add, v1HttpRouteSpecRequestHeaderModifier.add) &&
                Objects.equals(this.remove, v1HttpRouteSpecRequestHeaderModifier.remove) &&
                Objects.equals(this.set, v1HttpRouteSpecRequestHeaderModifier.set);
    }

    @Override
    public int hashCode() {
        return Objects.hash(add, remove, set);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecRequestHeaderModifier {\n" +
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

