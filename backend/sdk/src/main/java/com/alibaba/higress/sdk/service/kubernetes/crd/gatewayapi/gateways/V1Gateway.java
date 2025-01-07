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
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;

import java.util.Objects;

/**
 * Gateway represents an instance of a service-traffic handling infrastructure by binding Listeners to a set of IP addresses.
 */
@Data
public class V1Gateway implements io.kubernetes.client.common.KubernetesObject {
    public static final String API_GROUP = "gateway.networking.k8s.io";
    public static final String VERSION = "v1";
    public static final String KIND = "Gateway";
    public static final String PLURAL = "gateways";

    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_METADATA = "metadata";
    public static final String SERIALIZED_NAME_SPEC = "spec";
    public static final String SERIALIZED_NAME_STATUS = "status";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion = API_GROUP + "/" + VERSION;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind = KIND;
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ObjectMeta metadata = null;
    @SerializedName(SERIALIZED_NAME_SPEC)
    private V1GatewaySpec spec;
    @SerializedName(SERIALIZED_NAME_STATUS)
    private V1GatewayStatus status;


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1Gateway v1Gateway = (V1Gateway) o;
        return Objects.equals(this.apiVersion, v1Gateway.apiVersion) &&
                Objects.equals(this.kind, v1Gateway.kind) &&
                Objects.equals(this.metadata, v1Gateway.metadata) &&
                Objects.equals(this.spec, v1Gateway.spec) &&
                Objects.equals(this.status, v1Gateway.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(apiVersion, kind, metadata, spec, status);
    }


    @Override
    public String toString() {
        String sb = "class V1beta1Gateway {\n" +
                "    apiVersion: " + toIndentedString(apiVersion) + "\n" +
                "    kind: " + toIndentedString(kind) + "\n" +
                "    metadata: " + toIndentedString(metadata) + "\n" +
                "    spec: " + toIndentedString(spec) + "\n" +
                "    status: " + toIndentedString(status) + "\n" +
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

