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

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "TLS Certificate")
public class TlsCertificate implements VersionedDto {

    @Schema(description = "Certificate name")
    private String name;

    @Schema(description = "Certificate version. Required when updating.")
    private String version;

    @Schema(description = "Certificate content in PEM format")
    private String cert;

    @Schema(description = "Private key content in PEM format")
    private String key;

    @Schema(description = "Domains (SAN inluded) that the certificate applies to")
    private List<String> domains;

    @Schema(description = "Validity start time")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss'Z'")
    private LocalDateTime validityStart;

    @Schema(description = "Validity end time")
    @JsonFormat(pattern = "yyyy/MM/dd HH:mm:ss'Z'")
    private LocalDateTime validityEnd;
}
