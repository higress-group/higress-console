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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Selector must be specified when From is set to \&quot;Selector\&quot;. In that case, only Routes in Namespaces matching this Selector will be selected by this Gateway. This field is ignored for other values of \&quot;From\&quot;.   Support: Core
 */
@Data
public class V1GatewaySpecAllowedRoutesNamespacesSelector {
    public static final String SERIALIZED_NAME_MATCH_EXPRESSIONS = "matchExpressions";
    public static final String SERIALIZED_NAME_MATCH_LABELS = "matchLabels";
    @SerializedName(SERIALIZED_NAME_MATCH_EXPRESSIONS)
    private List<V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions> matchExpressions = null;
    @SerializedName(SERIALIZED_NAME_MATCH_LABELS)
    private Map<String, String> matchLabels = null;


    public V1GatewaySpecAllowedRoutesNamespacesSelector addMatchExpressionsItem(V1GatewaySpecAllowedRoutesNamespacesSelectorMatchExpressions matchExpressionsItem) {
        if (this.matchExpressions == null) {
            this.matchExpressions = new ArrayList<>();
        }
        this.matchExpressions.add(matchExpressionsItem);
        return this;
    }

    /**
     * matchExpressions is a list of label selector requirements. The requirements are ANDed.
     *
     * @return matchExpressions
     **/

    public V1GatewaySpecAllowedRoutesNamespacesSelector putMatchLabelsItem(String key, String matchLabelsItem) {
        if (this.matchLabels == null) {
            this.matchLabels = new HashMap<>();
        }
        this.matchLabels.put(key, matchLabelsItem);
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
        V1GatewaySpecAllowedRoutesNamespacesSelector v1GatewaySpecAllowedRoutesNamespacesSelector = (V1GatewaySpecAllowedRoutesNamespacesSelector) o;
        return Objects.equals(this.matchExpressions, v1GatewaySpecAllowedRoutesNamespacesSelector.matchExpressions) &&
                Objects.equals(this.matchLabels, v1GatewaySpecAllowedRoutesNamespacesSelector.matchLabels);
    }

    @Override
    public int hashCode() {
        return Objects.hash(matchExpressions, matchLabels);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecAllowedRoutesNamespacesSelector {\n" +
                "    matchExpressions: " + toIndentedString(matchExpressions) + "\n" +
                "    matchLabels: " + toIndentedString(matchLabels) + "\n" +
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

