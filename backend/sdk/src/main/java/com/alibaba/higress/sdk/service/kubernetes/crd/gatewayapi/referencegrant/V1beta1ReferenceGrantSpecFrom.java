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

import java.util.Objects;

/**
 * ReferenceGrantFrom describes trusted namespaces and kinds.
 */
@Data
public class V1beta1ReferenceGrantSpecFrom {
    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    @SerializedName(SERIALIZED_NAME_GROUP)
    private String group;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_NAMESPACE)
    private String namespace;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1beta1ReferenceGrantSpecFrom v1beta1ReferenceGrantSpecFrom = (V1beta1ReferenceGrantSpecFrom) o;
        return Objects.equals(this.group, v1beta1ReferenceGrantSpecFrom.group) &&
                Objects.equals(this.kind, v1beta1ReferenceGrantSpecFrom.kind) &&
                Objects.equals(this.namespace, v1beta1ReferenceGrantSpecFrom.namespace);
    }

    @Override
    public int hashCode() {
        return Objects.hash(group, kind, namespace);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1ReferenceGrantSpecFrom {\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    namespace: " + toIndentedString(namespace) + "\n" +
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

