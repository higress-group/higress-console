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
 * Spec defines the desired state of HTTPRoute.
 */
@Data
public class V1HTTPRouteSpec {
    public static final String SERIALIZED_NAME_HOSTNAMES = "hostnames";
    public static final String SERIALIZED_NAME_PARENT_REFS = "parentRefs";
    public static final String SERIALIZED_NAME_RULES = "rules";
    @SerializedName(SERIALIZED_NAME_HOSTNAMES)
    private List<String> hostnames = null;
    @SerializedName(SERIALIZED_NAME_PARENT_REFS)
    private List<V1HTTPRouteSpecParentRefs> parentRefs = null;
    @SerializedName(SERIALIZED_NAME_RULES)
    private List<V1HTTPRouteSpecRules> rules = null;

    public V1HTTPRouteSpec addHostnamesItem(String hostnamesItem) {
        if (this.hostnames == null) {
            this.hostnames = new ArrayList<>();
        }
        this.hostnames.add(hostnamesItem);
        return this;
    }

    public V1HTTPRouteSpec addParentRefsItem(V1HTTPRouteSpecParentRefs parentRefsItem) {
        if (this.parentRefs == null) {
            this.parentRefs = new ArrayList<>();
        }
        this.parentRefs.add(parentRefsItem);
        return this;
    }

    public V1HTTPRouteSpec addRulesItem(V1HTTPRouteSpecRules rulesItem) {
        if (this.rules == null) {
            this.rules = new ArrayList<>();
        }
        this.rules.add(rulesItem);
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
        V1HTTPRouteSpec v1HttpRouteSpec = (V1HTTPRouteSpec) o;
        return Objects.equals(this.hostnames, v1HttpRouteSpec.hostnames) &&
                Objects.equals(this.parentRefs, v1HttpRouteSpec.parentRefs) &&
                Objects.equals(this.rules, v1HttpRouteSpec.rules);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hostnames, parentRefs, rules);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpec {\n" +
                "    hostnames: " + toIndentedString(hostnames) + "\n" +
                "    parentRefs: " + toIndentedString(parentRefs) + "\n" +
                "    rules: " + toIndentedString(rules) + "\n" +
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

