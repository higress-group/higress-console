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
 * BackendRef references a resource where mirrored requests are sent.   Mirrored requests must be sent only to a single destination endpoint within this BackendRef, irrespective of how many endpoints are present within this BackendRef.   If the referent cannot be found, this BackendRef is invalid and must be dropped from the Gateway. The controller must ensure the \&quot;ResolvedRefs\&quot; condition on the Route status is set to &#x60;status: False&#x60; and not configure this backend in the underlying implementation.   If there is a cross-namespace reference to an *existing* object that is not allowed by a ReferenceGrant, the controller must ensure the \&quot;ResolvedRefs\&quot;  condition on the Route is set to &#x60;status: False&#x60;, with the \&quot;RefNotPermitted\&quot; reason and not configure this backend in the underlying implementation.   In either error case, the Message of the &#x60;ResolvedRefs&#x60; Condition should be used to provide more detail about the problem.   Support: Extended for Kubernetes Service   Support: Implementation-specific for any other resource
 */
@Data
public class V1HTTPRouteSpecRequestMirrorBackendRef {
    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    public static final String SERIALIZED_NAME_PORT = "port";
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


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecRequestMirrorBackendRef v1HttpRouteSpecRequestMirrorBackendRef = (V1HTTPRouteSpecRequestMirrorBackendRef) o;
        return Objects.equals(this.group, v1HttpRouteSpecRequestMirrorBackendRef.group) &&
                Objects.equals(this.kind, v1HttpRouteSpecRequestMirrorBackendRef.kind) &&
                Objects.equals(this.name, v1HttpRouteSpecRequestMirrorBackendRef.name) &&
                Objects.equals(this.namespace, v1HttpRouteSpecRequestMirrorBackendRef.namespace) &&
                Objects.equals(this.port, v1HttpRouteSpecRequestMirrorBackendRef.port);
    }

    @Override
    public int hashCode() {
        return Objects.hash(group, kind, name, namespace, port);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecRequestMirrorBackendRef {\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
                "    namespace: " + toIndentedString(namespace) + "\n" +
                "    port: " + toIndentedString(port) + "\n" +
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

