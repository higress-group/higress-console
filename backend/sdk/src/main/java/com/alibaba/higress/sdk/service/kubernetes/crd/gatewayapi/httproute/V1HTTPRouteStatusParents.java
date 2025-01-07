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
 * RouteParentStatus describes the status of a route with respect to an associated Parent.
 */
@Data
public class V1HTTPRouteStatusParents {
    public static final String SERIALIZED_NAME_CONDITIONS = "conditions";
    public static final String SERIALIZED_NAME_CONTROLLER_NAME = "controllerName";
    public static final String SERIALIZED_NAME_PARENT_REF = "parentRef";
    @SerializedName(SERIALIZED_NAME_CONDITIONS)
    private List<V1HTTPRouteStatusConditions> conditions = null;
    @SerializedName(SERIALIZED_NAME_CONTROLLER_NAME)
    private String controllerName;
    @SerializedName(SERIALIZED_NAME_PARENT_REF)
    private V1HTTPRouteStatusParentRef parentRef;

    public V1HTTPRouteStatusParents addConditionsItem(V1HTTPRouteStatusConditions conditionsItem) {
        if (this.conditions == null) {
            this.conditions = new ArrayList<>();
        }
        this.conditions.add(conditionsItem);
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
        V1HTTPRouteStatusParents v1HttpRouteStatusParents = (V1HTTPRouteStatusParents) o;
        return Objects.equals(this.conditions, v1HttpRouteStatusParents.conditions) &&
                Objects.equals(this.controllerName, v1HttpRouteStatusParents.controllerName) &&
                Objects.equals(this.parentRef, v1HttpRouteStatusParents.parentRef);
    }

    @Override
    public int hashCode() {
        return Objects.hash(conditions, controllerName, parentRef);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteStatusParents {\n" +
                "    conditions: " + toIndentedString(conditions) + "\n" +
                "    controllerName: " + toIndentedString(controllerName) + "\n" +
                "    parentRef: " + toIndentedString(parentRef) + "\n" +
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

