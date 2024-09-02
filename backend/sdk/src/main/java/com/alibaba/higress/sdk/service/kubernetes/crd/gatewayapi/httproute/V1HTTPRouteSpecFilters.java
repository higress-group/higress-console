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
 * HTTPRouteFilter defines processing steps that must be completed during the request or response lifecycle. HTTPRouteFilters are meant as an extension point to express processing that may be done in Gateway implementations. Some examples include request or response modification, implementing authentication strategies, rate-limiting, and traffic shaping. API guarantee/conformance is defined based on the type of the filter.
 */
@Data
public class V1HTTPRouteSpecFilters {
    public static final String SERIALIZED_NAME_EXTENSION_REF = "extensionRef";
    public static final String SERIALIZED_NAME_REQUEST_HEADER_MODIFIER = "requestHeaderModifier";
    public static final String SERIALIZED_NAME_REQUEST_MIRROR = "requestMirror";
    public static final String SERIALIZED_NAME_REQUEST_REDIRECT = "requestRedirect";
    public static final String SERIALIZED_NAME_RESPONSE_HEADER_MODIFIER = "responseHeaderModifier";
    public static final String SERIALIZED_NAME_TYPE = "type";
    public static final String SERIALIZED_NAME_URL_REWRITE = "urlRewrite";
    @SerializedName(SERIALIZED_NAME_EXTENSION_REF)
    private V1HTTPRouteSpecExtensionRef extensionRef;
    @SerializedName(SERIALIZED_NAME_REQUEST_HEADER_MODIFIER)
    private V1HTTPRouteSpecRequestHeaderModifier requestHeaderModifier;
    @SerializedName(SERIALIZED_NAME_REQUEST_MIRROR)
    private V1HTTPRouteSpecRequestMirror requestMirror;
    @SerializedName(SERIALIZED_NAME_REQUEST_REDIRECT)
    private V1HTTPRouteSpecRequestRedirect requestRedirect;
    @SerializedName(SERIALIZED_NAME_RESPONSE_HEADER_MODIFIER)
    private V1HTTPRouteSpecResponseHeaderModifier responseHeaderModifier;
    @SerializedName(SERIALIZED_NAME_TYPE)
    private TypeEnum type;
    @SerializedName(SERIALIZED_NAME_URL_REWRITE)
    private V1HTTPRouteSpecUrlRewrite urlRewrite;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        V1HTTPRouteSpecFilters v1HttpRouteSpecFilters = (V1HTTPRouteSpecFilters) o;
        return Objects.equals(this.extensionRef, v1HttpRouteSpecFilters.extensionRef) &&
                Objects.equals(this.requestHeaderModifier, v1HttpRouteSpecFilters.requestHeaderModifier) &&
                Objects.equals(this.requestMirror, v1HttpRouteSpecFilters.requestMirror) &&
                Objects.equals(this.requestRedirect, v1HttpRouteSpecFilters.requestRedirect) &&
                Objects.equals(this.responseHeaderModifier, v1HttpRouteSpecFilters.responseHeaderModifier) &&
                Objects.equals(this.type, v1HttpRouteSpecFilters.type) &&
                Objects.equals(this.urlRewrite, v1HttpRouteSpecFilters.urlRewrite);
    }

    @Override
    public int hashCode() {
        return Objects.hash(extensionRef, requestHeaderModifier, requestMirror, requestRedirect, responseHeaderModifier, type, urlRewrite);
    }

    @Override
    public String toString() {
        String sb = "class V1HTTPRouteSpecFilters {\n" +
                "    extensionRef: " + toIndentedString(extensionRef) + "\n" +
                "    requestHeaderModifier: " + toIndentedString(requestHeaderModifier) + "\n" +
                "    requestMirror: " + toIndentedString(requestMirror) + "\n" +
                "    requestRedirect: " + toIndentedString(requestRedirect) + "\n" +
                "    responseHeaderModifier: " + toIndentedString(responseHeaderModifier) + "\n" +
                "    type: " + toIndentedString(type) + "\n" +
                "    urlRewrite: " + toIndentedString(urlRewrite) + "\n" +
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
     * Type identifies the type of filter to apply. As with other API fields, types are classified into three conformance levels:   - Core: Filter types and their corresponding configuration defined by   \&quot;Support: Core\&quot; in this package, e.g. \&quot;RequestHeaderModifier\&quot;. All   implementations must support core filters.   - Extended: Filter types and their corresponding configuration defined by   \&quot;Support: Extended\&quot; in this package, e.g. \&quot;RequestMirror\&quot;. Implementers   are encouraged to support extended filters.   - Implementation-specific: Filters that are defined and supported by   specific vendors.   In the future, filters showing convergence in behavior across multiple   implementations will be considered for inclusion in extended or core   conformance levels. Filter-specific configuration for such filters   is specified using the ExtensionRef field. &#x60;Type&#x60; should be set to   \&quot;ExtensionRef\&quot; for custom filters.   Implementers are encouraged to define custom implementation types to extend the core API with implementation-specific behavior.   If a reference to a custom filter type cannot be resolved, the filter MUST NOT be skipped. Instead, requests that would have been processed by that filter MUST receive a HTTP error response.   Note that values may be added to this enum, implementations must ensure that unknown values will not cause a crash.   Unknown values here must result in the implementation setting the Accepted Condition for the Route to &#x60;status: False&#x60;, with a Reason of &#x60;UnsupportedValue&#x60;.
     */
    @JsonAdapter(TypeEnum.Adapter.class)
    public enum TypeEnum {
        /**
         * RequestHeaderModifier is a core filter type used to modify the headers of incoming HTTP requests.
         * All implementations must support this filter type.
         */
        REQUESTHEADERMODIFIER("RequestHeaderModifier"),

        /**
         * ResponseHeaderModifier is a core filter type used to modify the headers of outgoing HTTP responses.
         * All implementations must support this filter type.
         */
        RESPONSEHEADERMODIFIER("ResponseHeaderModifier"),

        /**
         * RequestMirror is an extended filter type used to mirror HTTP requests to another service or destination.
         * Implementers are encouraged to support this filter type.
         */
        REQUESTMIRROR("RequestMirror"),

        /**
         * RequestRedirect is a core filter type used to redirect HTTP requests to a different URL.
         * All implementations must support this filter type.
         */
        REQUESTREDIRECT("RequestRedirect"),

        /**
         * URLRewrite is a core filter type used to rewrite the URL path or query in an HTTP request.
         * All implementations must support this filter type.
         */
        URLREWRITE("URLRewrite"),

        /**
         * ExtensionRef is an implementation-specific filter type used for custom filters defined by the implementer.
         * This type should be set to "ExtensionRef" for custom filters, and the specific configuration is specified using the ExtensionRef field.
         * If a reference to a custom filter type cannot be resolved, the filter MUST NOT be skipped, and the request must receive an HTTP error response.
         */
        EXTENSIONREF("ExtensionRef");

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

