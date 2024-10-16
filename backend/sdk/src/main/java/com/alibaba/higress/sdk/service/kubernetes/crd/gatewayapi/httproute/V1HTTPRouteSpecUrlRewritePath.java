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
 * Path defines a path rewrite.   Support: Extended
 */
@Data
public class V1HTTPRouteSpecUrlRewritePath {
    public static final String SERIALIZED_NAME_REPLACE_FULL_PATH = "replaceFullPath";
    public static final String SERIALIZED_NAME_REPLACE_PREFIX_MATCH = "replacePrefixMatch";
    public static final String SERIALIZED_NAME_TYPE = "type";
    @SerializedName(SERIALIZED_NAME_REPLACE_FULL_PATH)
    private String replaceFullPath;
    @SerializedName(SERIALIZED_NAME_REPLACE_PREFIX_MATCH)
    private String replacePrefixMatch;
    @SerializedName(SERIALIZED_NAME_TYPE)
    private TypeEnum type;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecUrlRewritePath v1HttpRouteSpecUrlRewritePath = (V1HTTPRouteSpecUrlRewritePath) o;
        return Objects.equals(this.replaceFullPath, v1HttpRouteSpecUrlRewritePath.replaceFullPath) &&
                Objects.equals(this.replacePrefixMatch, v1HttpRouteSpecUrlRewritePath.replacePrefixMatch) &&
                Objects.equals(this.type, v1HttpRouteSpecUrlRewritePath.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(replaceFullPath, replacePrefixMatch, type);
    }

    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecUrlRewritePath {\n" +
                "    replaceFullPath: " + toIndentedString(replaceFullPath) + "\n" +
                "    replacePrefixMatch: " + toIndentedString(replacePrefixMatch) + "\n" +
                "    type: " + toIndentedString(type) + "\n" +
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
     * Type defines the type of path modifier. Additional types may be added in a future release of the API.   Note that values may be added to this enum, implementations must ensure that unknown values will not cause a crash.   Unknown values here must result in the implementation setting the Accepted Condition for the Route to &#x60;status: False&#x60;, with a Reason of &#x60;UnsupportedValue&#x60;.
     */
    @JsonAdapter(TypeEnum.Adapter.class)
    public enum TypeEnum {
        /**
         * REPLACEFULLPATH replaces the entire path of the incoming request with a new specified path.
         * This is useful when you want to completely override the original request path.
         */
        REPLACEFULLPATH("ReplaceFullPath"),

        /**
         * REPLACEPREFIXMATCH replaces the matching prefix of the path in the incoming request with a new prefix.
         * This is commonly used when you need to change the beginning of the path while preserving the rest of the original path.
         */
        REPLACEPREFIXMATCH("ReplacePrefixMatch");

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

