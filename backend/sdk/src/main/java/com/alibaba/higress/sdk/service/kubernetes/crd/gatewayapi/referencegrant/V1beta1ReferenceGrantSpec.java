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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.referencegrant;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Spec defines the desired state of ReferenceGrant.
 */
@Data
public class V1beta1ReferenceGrantSpec {
    public static final String SERIALIZED_NAME_FROM = "from";
    public static final String SERIALIZED_NAME_TO = "to";
    @SerializedName(SERIALIZED_NAME_FROM)
    private List<V1beta1ReferenceGrantSpecFrom> from = new ArrayList<>();
    @SerializedName(SERIALIZED_NAME_TO)
    private List<V1beta1ReferenceGrantSpecTo> to = new ArrayList<>();


    public V1beta1ReferenceGrantSpec addToItem(V1beta1ReferenceGrantSpecTo toItem) {
        this.to.add(toItem);
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
        V1beta1ReferenceGrantSpec v1beta1ReferenceGrantSpec = (V1beta1ReferenceGrantSpec) o;
        return Objects.equals(this.from, v1beta1ReferenceGrantSpec.from) &&
                Objects.equals(this.to, v1beta1ReferenceGrantSpec.to);
    }

    @Override
    public int hashCode() {
        return Objects.hash(from, to);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1ReferenceGrantSpec {\n" +
                "    from: " + toIndentedString(from) + "\n" +
                "    to: " + toIndentedString(to) + "\n" +
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

