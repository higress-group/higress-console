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

import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import lombok.Data;

import java.io.IOException;
import java.util.Objects;

/**
 * Path specifies a HTTP request path matcher. If this field is not specified, a default prefix match on the \&quot;/\&quot; path is provided.
 */
@Data
public class V1HTTPRouteSpecPath {

    public static final String SERIALIZED_NAME_TYPE = "type";
    public static final String SERIALIZED_NAME_VALUE = "value";
    @SerializedName(SERIALIZED_NAME_TYPE)
    private TypeEnum type;
    @SerializedName(SERIALIZED_NAME_VALUE)
    private String value;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecPath v1HttpRouteSpecPath = (V1HTTPRouteSpecPath) o;
        return Objects.equals(this.type, v1HttpRouteSpecPath.type) &&
                Objects.equals(this.value, v1HttpRouteSpecPath.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, value);
    }

    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecPath {\n" +
                "    type: " + toIndentedString(type) + "\n" +
                "    value: " + toIndentedString(value) + "\n" +
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
     * Type specifies how to match against the path Value.   Support: Core (Exact, PathPrefix)   Support: Implementation-specific (RegularExpression)
     */
    @JsonAdapter(TypeEnum.Adapter.class)
    public enum TypeEnum {
        /**
         * EXACT matches the path exactly as specified.
         * This is a core match type and must be supported by all implementations.
         */
        EXACT("Exact"),

        /**
         * PATHPREFIX matches the beginning of the path against the specified value.
         * This is a core match type and must be supported by all implementations.
         */
        PATHPREFIX("PathPrefix"),

        /**
         * REGULAREXPRESSION allows matching the path using a regular expression.
         * This is an implementation-specific match type and may vary depending on the implementation.
         */
        REGULAREXPRESSION("RegularExpression");

        private final String value;

        TypeEnum(String value) {
            this.value = value;
        }

        public static TypeEnum fromValue(String value) {
            for (TypeEnum b : TypeEnum.values()) {
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

        public static class Adapter extends TypeAdapter<TypeEnum> {
            @Override
            public void write(final JsonWriter jsonWriter, final TypeEnum enumeration) throws IOException {
                jsonWriter.value(enumeration.getValue());
            }

            @Override
            public TypeEnum read(final JsonReader jsonReader) throws IOException {
                String value = jsonReader.nextString();
                return TypeEnum.fromValue(value);
            }
        }
    }

}

