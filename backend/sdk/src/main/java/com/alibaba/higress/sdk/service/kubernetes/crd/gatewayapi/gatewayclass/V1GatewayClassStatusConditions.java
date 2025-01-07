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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass;

import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import lombok.Data;

import java.io.IOException;
import java.time.OffsetDateTime;

/**
 * Condition contains details for one aspect of the current state of this API Resource. --- This struct is intended for direct use as an array at the field path .status.conditions.  For example,    type FooStatus struct{      // Represents the observations of a foo&#39;s current state.      // Known .status.conditions.type are: \&quot;Available\&quot;, \&quot;Progressing\&quot;, and \&quot;Degraded\&quot;      // +patchMergeKey&#x3D;type      // +patchStrategy&#x3D;merge      // +listType&#x3D;map      // +listMapKey&#x3D;type      Conditions []metav1.Condition &#x60;json:\&quot;conditions,omitempty\&quot; patchStrategy:\&quot;merge\&quot; patchMergeKey:\&quot;type\&quot; protobuf:\&quot;bytes,1,rep,name&#x3D;conditions\&quot;&#x60;        // other fields  }
 */
@Data
public class V1GatewayClassStatusConditions {

    public static final String SERIALIZED_NAME_LAST_TRANSITION_TIME = "lastTransitionTime";
    public static final String SERIALIZED_NAME_MESSAGE = "message";
    public static final String SERIALIZED_NAME_OBSERVED_GENERATION = "observedGeneration";
    public static final String SERIALIZED_NAME_REASON = "reason";
    public static final String SERIALIZED_NAME_STATUS = "status";
    public static final String SERIALIZED_NAME_TYPE = "type";
    @SerializedName(SERIALIZED_NAME_LAST_TRANSITION_TIME)
    private OffsetDateTime lastTransitionTime;
    @SerializedName(SERIALIZED_NAME_MESSAGE)
    private String message;
    @SerializedName(SERIALIZED_NAME_OBSERVED_GENERATION)
    private Long observedGeneration;
    @SerializedName(SERIALIZED_NAME_REASON)
    private String reason;
    @SerializedName(SERIALIZED_NAME_STATUS)
    private StatusEnum status;
    @SerializedName(SERIALIZED_NAME_TYPE)
    private String type;
    /**
     * status of the condition, one of True, False, Unknown.
     */
    @JsonAdapter(StatusEnum.Adapter.class)
    public enum StatusEnum {
        /**
         * Represents the state where the condition is true.
         */
        TRUE("True"),

        /**
         * Represents the state where the condition is false.
         */
        FALSE("False"),

        /**
         * Represents an unknown state.
         */
        UNKNOWN("Unknown");

        private final String value;

        StatusEnum(String value) {
            this.value = value;
        }

        public static StatusEnum fromValue(String value) {
            for (StatusEnum b : StatusEnum.values()) {
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

        public static class Adapter extends TypeAdapter<StatusEnum> {
            @Override
            public void write(final JsonWriter jsonWriter, final StatusEnum enumeration) throws IOException {
                jsonWriter.value(enumeration.getValue());
            }

            @Override
            public StatusEnum read(final JsonReader jsonReader) throws IOException {
                String value = jsonReader.nextString();
                return StatusEnum.fromValue(value);
            }
        }
    }
}

