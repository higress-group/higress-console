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

import java.util.Objects;

/**
 * ExtensionRef is an optional, implementation-specific extension to the \&quot;filter\&quot; behavior.  For example, resource \&quot;myroutefilter\&quot; in group \&quot;networking.example.net\&quot;). ExtensionRef MUST NOT be used for core and extended filters.   This filter can be used multiple times within the same rule.   Support: Implementation-specific
 */
@Data
public class V1HTTPRouteSpecExtensionRef {
    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    @SerializedName(SERIALIZED_NAME_GROUP)
    private String group;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecExtensionRef v1HttpRouteSpecExtensionRef = (V1HTTPRouteSpecExtensionRef) o;
        return Objects.equals(this.group, v1HttpRouteSpecExtensionRef.group) &&
                Objects.equals(this.kind, v1HttpRouteSpecExtensionRef.kind) &&
                Objects.equals(this.name, v1HttpRouteSpecExtensionRef.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(group, kind, name);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecExtensionRef {\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
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

