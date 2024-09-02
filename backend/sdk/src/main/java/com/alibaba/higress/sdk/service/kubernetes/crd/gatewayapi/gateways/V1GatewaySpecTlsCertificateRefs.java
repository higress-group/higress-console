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
 * SecretObjectReference identifies an API object including its namespace, defaulting to Secret.   The API object must be valid in the cluster; the Group and Kind must be registered in the cluster for this reference to be valid.   References to objects with invalid Group and Kind are not valid, and must be rejected by the implementation, with appropriate Conditions set on the containing object.
 */
@Data
public class V1GatewaySpecTlsCertificateRefs {

    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    @SerializedName(SERIALIZED_NAME_GROUP)
    private String group;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;
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
        V1GatewaySpecTlsCertificateRefs v1GatewaySpecTlsCertificateRefs = (V1GatewaySpecTlsCertificateRefs) o;
        return Objects.equals(this.group, v1GatewaySpecTlsCertificateRefs.group) &&
                Objects.equals(this.kind, v1GatewaySpecTlsCertificateRefs.kind) &&
                Objects.equals(this.name, v1GatewaySpecTlsCertificateRefs.name) &&
                Objects.equals(this.namespace, v1GatewaySpecTlsCertificateRefs.namespace);
    }

    @Override
    public int hashCode() {
        return Objects.hash(group, kind, name, namespace);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecTlsCertificateRefs {\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
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

