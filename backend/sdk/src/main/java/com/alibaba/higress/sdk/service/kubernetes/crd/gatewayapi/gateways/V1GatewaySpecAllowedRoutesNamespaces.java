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

import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import lombok.Data;

import java.io.IOException;
import java.util.Objects;

/**
 * Namespaces indicates namespaces from which Routes may be attached to this Listener. This is restricted to the namespace of this Gateway by default.   Support: Core
 */
@Data
public class V1GatewaySpecAllowedRoutesNamespaces {
    public static final String SERIALIZED_NAME_FROM = "from";
    public static final String SERIALIZED_NAME_SELECTOR = "selector";
    @SerializedName(SERIALIZED_NAME_FROM)
    private FromEnum from;
    @SerializedName(SERIALIZED_NAME_SELECTOR)
    private V1GatewaySpecAllowedRoutesNamespacesSelector selector;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1GatewaySpecAllowedRoutesNamespaces v1GatewaySpecAllowedRoutesNamespaces = (V1GatewaySpecAllowedRoutesNamespaces) o;
        return Objects.equals(this.from, v1GatewaySpecAllowedRoutesNamespaces.from) &&
                Objects.equals(this.selector, v1GatewaySpecAllowedRoutesNamespaces.selector);
    }

    @Override
    public int hashCode() {
        return Objects.hash(from, selector);
    }

    @Override
    public String toString() {
        String sb = "class V1beta1GatewaySpecAllowedRoutesNamespaces {\n" +
                "    from: " + toIndentedString(from) + "\n" +
                "    selector: " + toIndentedString(selector) + "\n" +
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

    /**
     * From indicates where Routes will be selected for this Gateway. Possible values are:   * All: Routes in all namespaces may be used by this Gateway. * Selector: Routes in namespaces selected by the selector may be used by   this Gateway. * Same: Only Routes in the same namespace may be used by this Gateway.   Support: Core
     */
    @JsonAdapter(FromEnum.Adapter.class)
    public enum FromEnum {
        /**
         * Routes in all namespaces may be used by this Gateway.
         */
        ALL("All"),
        /**
         * Routes in namespaces selected by the selector may be used by this Gateway.
         */
        SELECTOR("Selector"),
        /**
         * only Routes in the same namespace may be used by this Gateway.
         */
        SAME("Same");
        private final String value;

        FromEnum(String value) {
            this.value = value;
        }

        public static FromEnum fromValue(String value) {
            for (FromEnum b : FromEnum.values()) {
                if (b.value.equals(value)) {
                    return b;
                }
            }
            throw new IllegalArgumentException("Unexpected value '" + value + "'");
        }

        public String getValue() {
            return value;
        }

        @Override
        public String toString() {
            return String.valueOf(value);
        }

        public static class Adapter extends TypeAdapter<FromEnum> {
            @Override
            public void write(final JsonWriter jsonWriter, final FromEnum enumeration) throws IOException {
                jsonWriter.value(enumeration.getValue());
            }

            @Override
            public FromEnum read(final JsonReader jsonReader) throws IOException {
                String value = jsonReader.nextString();
                return FromEnum.fromValue(value);
            }
        }
    }

}

