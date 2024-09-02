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
 * HTTPBackendRef defines how a HTTPRoute forwards a HTTP request.   Note that when a namespace different than the local namespace is specified, a ReferenceGrant object is required in the referent namespace to allow that namespace&#39;s owner to accept the reference. See the ReferenceGrant documentation for details.   &lt;gateway:experimental:description&gt;   When the BackendRef points to a Kubernetes Service, implementations SHOULD honor the appProtocol field if it is set for the target Service Port.   Implementations supporting appProtocol SHOULD recognize the Kubernetes Standard Application Protocols defined in KEP-3726.   If a Service appProtocol isn&#39;t specified, an implementation MAY infer the backend protocol through its own means. Implementations MAY infer the protocol from the Route type referring to the backend Service.   If a Route is not able to send traffic to the backend using the specified protocol then the backend is considered invalid. Implementations MUST set the \&quot;ResolvedRefs\&quot; condition to \&quot;False\&quot; with the \&quot;UnsupportedProtocol\&quot; reason.   &lt;/gateway:experimental:description&gt;
 */
@Data
public class V1HTTPRouteSpecBackendRefs {
    public static final String SERIALIZED_NAME_FILTERS = "filters";
    public static final String SERIALIZED_NAME_GROUP = "group";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    public static final String SERIALIZED_NAME_PORT = "port";
    public static final String SERIALIZED_NAME_WEIGHT = "weight";
    @SerializedName(SERIALIZED_NAME_FILTERS)
    private List<V1HTTPRouteSpecFilters> filters = null;
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
    @SerializedName(SERIALIZED_NAME_WEIGHT)
    private Integer weight;

    public V1HTTPRouteSpecBackendRefs addFiltersItem(V1HTTPRouteSpecFilters filtersItem) {
        if (this.filters == null) {
            this.filters = new ArrayList<>();
        }
        this.filters.add(filtersItem);
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
        V1HTTPRouteSpecBackendRefs v1HttpRouteSpecBackendRefs = (V1HTTPRouteSpecBackendRefs) o;
        return Objects.equals(this.filters, v1HttpRouteSpecBackendRefs.filters) &&
                Objects.equals(this.group, v1HttpRouteSpecBackendRefs.group) &&
                Objects.equals(this.kind, v1HttpRouteSpecBackendRefs.kind) &&
                Objects.equals(this.name, v1HttpRouteSpecBackendRefs.name) &&
                Objects.equals(this.namespace, v1HttpRouteSpecBackendRefs.namespace) &&
                Objects.equals(this.port, v1HttpRouteSpecBackendRefs.port) &&
                Objects.equals(this.weight, v1HttpRouteSpecBackendRefs.weight);
    }

    @Override
    public int hashCode() {
        return Objects.hash(filters, group, kind, name, namespace, port, weight);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecBackendRefs {\n" +
                "    filters: " + toIndentedString(filters) + "\n" +
                "    group: " + toIndentedString(group) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
                "    namespace: " + toIndentedString(namespace) + "\n" +
                "    port: " + toIndentedString(port) + "\n" +
                "    weight: " + toIndentedString(weight) + "\n" +
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

