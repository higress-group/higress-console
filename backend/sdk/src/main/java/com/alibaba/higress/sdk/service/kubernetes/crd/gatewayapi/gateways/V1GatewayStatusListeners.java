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
 * ListenerStatus is the status associated with a Listener.
 */
@Data
public class V1GatewayStatusListeners {
    public static final String SERIALIZED_NAME_ATTACHED_ROUTES = "attachedRoutes";
    public static final String SERIALIZED_NAME_CONDITIONS = "conditions";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_SUPPORTED_KINDS = "supportedKinds";
    @SerializedName(SERIALIZED_NAME_ATTACHED_ROUTES)
    private Integer attachedRoutes;
    @SerializedName(SERIALIZED_NAME_CONDITIONS)
    private List<V1GatewayStatusConditions> conditions = new ArrayList<>();
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;
    @SerializedName(SERIALIZED_NAME_SUPPORTED_KINDS)
    private List<V1GatewaySpecAllowedRoutesKinds> supportedKinds = new ArrayList<>();

    public V1GatewayStatusListeners addConditionsItem(V1GatewayStatusConditions conditionsItem) {
        this.conditions.add(conditionsItem);
        return this;
    }

    public V1GatewayStatusListeners addSupportedKindsItem(V1GatewaySpecAllowedRoutesKinds supportedKindsItem) {
        this.supportedKinds.add(supportedKindsItem);
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
        V1GatewayStatusListeners v1GatewayStatusListeners = (V1GatewayStatusListeners) o;
        return Objects.equals(this.attachedRoutes, v1GatewayStatusListeners.attachedRoutes) &&
                Objects.equals(this.conditions, v1GatewayStatusListeners.conditions) &&
                Objects.equals(this.name, v1GatewayStatusListeners.name) &&
                Objects.equals(this.supportedKinds, v1GatewayStatusListeners.supportedKinds);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attachedRoutes, conditions, name, supportedKinds);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1GatewayStatusListeners {\n" +
                "    attachedRoutes: " + toIndentedString(attachedRoutes) + "\n" +
                "    conditions: " + toIndentedString(conditions) + "\n" +
                "    name: " + toIndentedString(name) + "\n" +
                "    supportedKinds: " + toIndentedString(supportedKinds) + "\n" +
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

