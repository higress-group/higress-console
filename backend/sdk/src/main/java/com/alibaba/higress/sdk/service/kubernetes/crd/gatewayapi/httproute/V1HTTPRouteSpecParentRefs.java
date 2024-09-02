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
 * ParentReference identifies an API object (usually a Gateway) that can be considered a parent of this resource (usually a route). There are two kinds of parent resources with \&quot;Core\&quot; support:   * Gateway (Gateway conformance profile) * Service (Mesh conformance profile, ClusterIP Services only)   This API may be extended in the future to support additional kinds of parent resources.   The API object must be valid in the cluster; the Group and Kind must be registered in the cluster for this reference to be valid.
 */
@Data
public class V1HTTPRouteSpecParentRefs {
    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    public static final String SERIALIZED_NAME_PORT = "port";
    public static final String SERIALIZED_NAME_SECTION_NAME = "sectionName";
    @SerializedName(SERIALIZED_NAME_GROUP)
    private String group;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;
    @SerializedName(SERIALIZED_NAME_NAMESPACE)
    private String namespace;
    @SerializedName(SERIALIZED_NAME_PORT)
    private Integer port;
    @SerializedName(SERIALIZED_NAME_SECTION_NAME)
    private String sectionName;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecParentRefs v1HttpRouteSpecParentRefs = (V1HTTPRouteSpecParentRefs) o;
        return Objects.equals(this.group, v1HttpRouteSpecParentRefs.group) &&
                Objects.equals(this.kind, v1HttpRouteSpecParentRefs.kind) &&
                Objects.equals(this.name, v1HttpRouteSpecParentRefs.name) &&
                Objects.equals(this.namespace, v1HttpRouteSpecParentRefs.namespace) &&
                Objects.equals(this.port, v1HttpRouteSpecParentRefs.port) &&
                Objects.equals(this.sectionName, v1HttpRouteSpecParentRefs.sectionName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(group, kind, name, namespace, port, sectionName);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecParentRefs {\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
                "    namespace: " + toIndentedString(namespace) + "\n" +
                "    port: " + toIndentedString(port) + "\n" +
                "    sectionName: " + toIndentedString(sectionName) + "\n" +
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

