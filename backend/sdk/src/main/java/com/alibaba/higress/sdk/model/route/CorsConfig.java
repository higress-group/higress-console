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
package com.alibaba.higress.sdk.model.route;

import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "CORS Configuration")
public class CorsConfig {

    public static final List<String> DEFAULT_ALLOWS = Collections.singletonList("*");

    public static final int DEFAULT_MAX_AGE = 86400;

    @Schema(description = "Whether to enable CORS")
    private Boolean enabled;

    @Schema(description = "Allowed origins, Access-Control-Allow-Origin")
    private List<String> allowOrigins;

    @Schema(description = "Allowed methods, Access-Control-Allow-Methods")
    private List<String> allowMethods;

    @Schema(description = "Allowed headers, Access-Control-Allow-Headers")
    private List<String> allowHeaders;

    @Schema(description = "Exposed headers, Access-Control-Expose-Headers")
    private List<String> exposeHeaders;

    @Schema(description = "Max age, Access-Control-Max-Age")
    private Integer maxAge;

    @Schema(description = "Whether to allow credentials, Access-Control-Allow-Credentials")
    private Boolean allowCredentials;
}
