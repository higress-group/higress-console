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
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;

import java.util.Objects;

/**
 * ReferenceGrant identifies kinds of resources in other namespaces that are trusted to reference the specified kinds of resources in the same namespace as the policy.   Each ReferenceGrant can be used to represent a unique trust relationship. Additional Reference Grants can be used to add to the set of trusted sources of inbound references for the namespace they are defined within.   All cross-namespace references in Gateway API (with the exception of cross-namespace Gateway-route attachment) require a ReferenceGrant.   ReferenceGrant is a form of runtime verification allowing users to assert which cross-namespace object references are permitted. Implementations that support ReferenceGrant MUST NOT permit cross-namespace references which have no grant, and MUST respond to the removal of a grant by revoking the access that the grant allowed.
 */

@Data
public class V1beta1ReferenceGrant implements io.kubernetes.client.common.KubernetesObject {
    public static final String API_GROUP = "gateway.networking.k8s.io";
    public static final String VERSION = "v1";
    public static final String KIND = "ReferenceGrant";
    public static final String PLURAL = "referencegrants";


    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_METADATA = "metadata";
    public static final String SERIALIZED_NAME_SPEC = "spec";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion = API_GROUP + "/" + VERSION;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind = KIND;
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ObjectMeta metadata = null;
    @SerializedName(SERIALIZED_NAME_SPEC)
    private V1beta1ReferenceGrantSpec spec;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1beta1ReferenceGrant v1beta1ReferenceGrant = (V1beta1ReferenceGrant) o;
        return Objects.equals(this.apiVersion, v1beta1ReferenceGrant.apiVersion) &&
                Objects.equals(this.kind, v1beta1ReferenceGrant.kind) &&
                Objects.equals(this.metadata, v1beta1ReferenceGrant.metadata) &&
                Objects.equals(this.spec, v1beta1ReferenceGrant.spec);
    }

    @Override
    public int hashCode() {
        return Objects.hash(apiVersion, kind, metadata, spec);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1ReferenceGrant {\n" +
                "    apiVersion: " + toIndentedString(apiVersion) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    metadata: " + toIndentedString(metadata) + "\n" +
                "    spec: " + toIndentedString(spec) + "\n" +
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

