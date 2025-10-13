/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.kubernetes.crd.mcp;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

@Data
public class VPort {
    public static final String SERIALIZED_NAME_DEFAULT_VALUE_NAME = "default";
    @SerializedName(SERIALIZED_NAME_DEFAULT_VALUE_NAME)
    private Integer defaultValue;

    public static final String SERIALIZED_NAME_SERVICES = "services";
    @SerializedName(SERIALIZED_NAME_SERVICES)
    private List<ServiceVport> servicesVport;

    @Data
    public static class ServiceVport {
        public static final String SERIALIZED_NAME_SERVICE_NAME = "name";
        @SerializedName(SERIALIZED_NAME_SERVICE_NAME)
        private String name;

        public static final String SERIALIZED_NAME_SERVICE_VPORT_VALUE = "value";
        @SerializedName(SERIALIZED_NAME_SERVICE_VPORT_VALUE)
        private Integer value;
    }
}
