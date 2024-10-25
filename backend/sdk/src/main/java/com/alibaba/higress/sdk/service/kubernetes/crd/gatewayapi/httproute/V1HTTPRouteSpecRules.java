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
 * HTTPRouteRule defines semantics for matching an HTTP request based on conditions (matches), processing it (filters), and forwarding the request to an API object (backendRefs).
 */
@Data
public class V1HTTPRouteSpecRules {
    public static final String SERIALIZED_NAME_BACKEND_REFS = "backendRefs";
    public static final String SERIALIZED_NAME_FILTERS = "filters";
    public static final String SERIALIZED_NAME_MATCHES = "matches";
    @SerializedName(SERIALIZED_NAME_BACKEND_REFS)
    private List<V1HTTPRouteSpecBackendRefs> backendRefs = null;
    @SerializedName(SERIALIZED_NAME_FILTERS)
    private List<V1HTTPRouteSpecFilters> filters = null;
    @SerializedName(SERIALIZED_NAME_MATCHES)
    private List<V1HTTPRouteSpecMatches> matches = null;

    public V1HTTPRouteSpecRules addBackendRefsItem(V1HTTPRouteSpecBackendRefs backendRefsItem) {
        if (this.backendRefs == null) {
            this.backendRefs = new ArrayList<>();
        }
        this.backendRefs.add(backendRefsItem);
        return this;
    }

    public V1HTTPRouteSpecRules addFiltersItem(V1HTTPRouteSpecFilters filtersItem) {
        if (this.filters == null) {
            this.filters = new ArrayList<>();
        }
        this.filters.add(filtersItem);
        return this;
    }


    public V1HTTPRouteSpecRules addMatchesItem(V1HTTPRouteSpecMatches matchesItem) {
        if (this.matches == null) {
            this.matches = new ArrayList<>();
        }
        this.matches.add(matchesItem);
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
        V1HTTPRouteSpecRules v1HttpRouteSpecRules = (V1HTTPRouteSpecRules) o;
        return Objects.equals(this.backendRefs, v1HttpRouteSpecRules.backendRefs) &&
                Objects.equals(this.filters, v1HttpRouteSpecRules.filters) &&
                Objects.equals(this.matches, v1HttpRouteSpecRules.matches);
    }

    @Override
    public int hashCode() {
        return Objects.hash(backendRefs, filters, matches);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecRules {\n" +
                "    backendRefs: " + toIndentedString(backendRefs) + "\n" +
                "    filters: " + toIndentedString(filters) + "\n" +
                "    matches: " + toIndentedString(matches) + "\n" +
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

