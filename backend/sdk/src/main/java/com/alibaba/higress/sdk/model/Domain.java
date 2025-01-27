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
package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Gateway Domain")
public class Domain implements VersionedDto {

    public static class EnableHttps {
        public static final String OFF = "off";
        public static final String ON = "on";
        public static final String FORCE = "force";
    }

    @Schema(description = "Domain name")
    private String name;

    @Schema(description = "Domain version. Required when updating.")
    private String version;

    @Schema(description = "HTTPS configuration", allowableValues = {EnableHttps.OFF, EnableHttps.ON, EnableHttps.FORCE})
    private String enableHttps;

    @Schema(description = "Certificate name")
    private String certIdentifier;
}
