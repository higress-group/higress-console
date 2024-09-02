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
 * RequestRedirect defines a schema for a filter that responds to the request with an HTTP redirection.   Support: Core
 */
@Data
public class V1HTTPRouteSpecRequestRedirect {
    public static final String SERIALIZED_NAME_HOSTNAME = "hostname";
    public static final String SERIALIZED_NAME_PATH = "path";
    public static final String SERIALIZED_NAME_PORT = "port";
    public static final String SERIALIZED_NAME_SCHEME = "scheme";
    public static final String SERIALIZED_NAME_STATUS_CODE = "statusCode";
    @SerializedName(SERIALIZED_NAME_HOSTNAME)
    private String hostname;
    @SerializedName(SERIALIZED_NAME_PATH)
    private V1HTTPRouteSpecRequestRedirectPath path;
    @SerializedName(SERIALIZED_NAME_PORT)
    private Integer port;
    @SerializedName(SERIALIZED_NAME_SCHEME)
    private SchemeEnum scheme;
    @SerializedName(SERIALIZED_NAME_STATUS_CODE)
    private Integer statusCode;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecRequestRedirect v1HttpRouteSpecRequestRedirect = (V1HTTPRouteSpecRequestRedirect) o;
        return Objects.equals(this.hostname, v1HttpRouteSpecRequestRedirect.hostname) &&
                Objects.equals(this.path, v1HttpRouteSpecRequestRedirect.path) &&
                Objects.equals(this.port, v1HttpRouteSpecRequestRedirect.port) &&
                Objects.equals(this.scheme, v1HttpRouteSpecRequestRedirect.scheme) &&
                Objects.equals(this.statusCode, v1HttpRouteSpecRequestRedirect.statusCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hostname, path, port, scheme, statusCode);
    }

    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecRequestRedirect {\n" +
                "    hostname: " + toIndentedString(hostname) + "\n" +
                "    path: " + toIndentedString(path) + "\n" +
                "    port: " + toIndentedString(port) + "\n" +
                "    scheme: " + toIndentedString(scheme) + "\n" +
                "    statusCode: " + toIndentedString(statusCode) + "\n" +
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
     * Scheme is the scheme to be used in the value of the &#x60;Location&#x60; header in the response. When empty, the scheme of the request is used.   Scheme redirects can affect the port of the redirect, for more information, refer to the documentation for the port field of this filter.   Note that values may be added to this enum, implementations must ensure that unknown values will not cause a crash.   Unknown values here must result in the implementation setting the Accepted Condition for the Route to &#x60;status: False&#x60;, with a Reason of &#x60;UnsupportedValue&#x60;.   Support: Extended
     */
    @JsonAdapter(SchemeEnum.Adapter.class)
    public enum SchemeEnum {
        /**
         * HTTP is used to specify that the scheme in the `Location` header should be "http".
         * This is commonly used for non-secure redirects.
         */
        HTTP("http"),

        /**
         * HTTPS is used to specify that the scheme in the `Location` header should be "https".
         * This is commonly used for secure redirects.
         */
        HTTPS("https");

        private final String value;

        SchemeEnum(String value) {
            this.value = value;
        }

        public static SchemeEnum fromValue(String value) {
            for (SchemeEnum b : SchemeEnum.values()) {
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

        public static class Adapter extends TypeAdapter<SchemeEnum> {
            @Override
            public void write(final JsonWriter jsonWriter, final SchemeEnum enumeration) throws IOException {
                jsonWriter.value(enumeration.getValue());
            }

            @Override
            public SchemeEnum read(final JsonReader jsonReader) throws IOException {
                String value = jsonReader.nextString();
                return SchemeEnum.fromValue(value);
            }
        }
    }

}

