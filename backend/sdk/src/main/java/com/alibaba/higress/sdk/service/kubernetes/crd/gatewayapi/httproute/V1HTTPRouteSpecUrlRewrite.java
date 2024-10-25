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
 * URLRewrite defines a schema for a filter that modifies a request during forwarding.   Support: Extended
 */
@Data
public class V1HTTPRouteSpecUrlRewrite {
    public static final String SERIALIZED_NAME_HOSTNAME = "hostname";
    public static final String SERIALIZED_NAME_PATH = "path";
    @SerializedName(SERIALIZED_NAME_HOSTNAME)
    private String hostname;
    @SerializedName(SERIALIZED_NAME_PATH)
    private V1HTTPRouteSpecUrlRewritePath path;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecUrlRewrite v1HttpRouteSpecUrlRewrite = (V1HTTPRouteSpecUrlRewrite) o;
        return Objects.equals(this.hostname, v1HttpRouteSpecUrlRewrite.hostname) &&
                Objects.equals(this.path, v1HttpRouteSpecUrlRewrite.path);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hostname, path);
    }


    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecUrlRewrite {\n" +
                "    hostname: " + toIndentedString(hostname) + "\n" +
                "    path: " + toIndentedString(path) + "\n" +
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

