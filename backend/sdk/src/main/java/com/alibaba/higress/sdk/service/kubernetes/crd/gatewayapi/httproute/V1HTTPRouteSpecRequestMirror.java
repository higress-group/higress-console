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
 * RequestMirror defines a schema for a filter that mirrors requests. Requests are sent to the specified destination, but responses from that destination are ignored.   This filter can be used multiple times within the same rule. Note that not all implementations will be able to support mirroring to multiple backends.   Support: Extended
 */
@Data
public class V1HTTPRouteSpecRequestMirror {
    public static final String SERIALIZED_NAME_BACKEND_REF = "backendRef";
    @SerializedName(SERIALIZED_NAME_BACKEND_REF)
    private V1HTTPRouteSpecRequestMirrorBackendRef backendRef;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecRequestMirror v1HttpRouteSpecRequestMirror = (V1HTTPRouteSpecRequestMirror) o;
        return Objects.equals(this.backendRef, v1HttpRouteSpecRequestMirror.backendRef);
    }

    @Override
    public int hashCode() {
        return Objects.hash(backendRef);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecRequestMirror {\n" +
                "    backendRef: " + toIndentedString(backendRef) + "\n" +
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

