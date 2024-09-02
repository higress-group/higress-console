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

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * AllowedRoutes defines the types of routes that MAY be attached to a Listener and the trusted namespaces where those Route resources MAY be present.   Although a client request may match multiple route rules, only one rule may ultimately receive the request. Matching precedence MUST be determined in order of the following criteria:   * The most specific match as defined by the Route type. * The oldest Route based on creation timestamp. For example, a Route with   a creation timestamp of \&quot;2020-09-08 01:02:03\&quot; is given precedence over   a Route with a creation timestamp of \&quot;2020-09-08 01:02:04\&quot;. * If everything else is equivalent, the Route appearing first in   alphabetical order (namespace/name) should be given precedence. For   example, foo/bar is given precedence over foo/baz.   All valid rules within a Route attached to this Listener should be implemented. Invalid Route rules can be ignored (sometimes that will mean the full Route). If a Route rule transitions from valid to invalid, support for that Route rule should be dropped to ensure consistency. For example, even if a filter specified by a Route rule is invalid, the rest of the rules within that Route should still be supported.   Support: Core
 */
@Data
public class V1GatewaySpecAllowedRoutes {
    public static final String SERIALIZED_NAME_KINDS = "kinds";
    public static final String SERIALIZED_NAME_NAMESPACES = "namespaces";
    @SerializedName(SERIALIZED_NAME_KINDS)
    private List<V1GatewaySpecAllowedRoutesKinds> kinds = null;
    @SerializedName(SERIALIZED_NAME_NAMESPACES)
    private V1GatewaySpecAllowedRoutesNamespaces namespaces;


    public V1GatewaySpecAllowedRoutes addKindsItem(V1GatewaySpecAllowedRoutesKinds kindsItem) {
        if (this.kinds == null) {
            this.kinds = new ArrayList<>();
        }
        this.kinds.add(kindsItem);
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
        V1GatewaySpecAllowedRoutes v1GatewaySpecAllowedRoutes = (V1GatewaySpecAllowedRoutes) o;
        return Objects.equals(this.kinds, v1GatewaySpecAllowedRoutes.kinds) &&
                Objects.equals(this.namespaces, v1GatewaySpecAllowedRoutes.namespaces);
    }

    @Override
    public int hashCode() {
        return Objects.hash(kinds, namespaces);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecAllowedRoutes {\n" +
                "    kinds: " + toIndentedString(kinds) + "\n" +
                "    namespaces: " + toIndentedString(namespaces) + "\n" +
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

