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

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author CH3CHO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Proxy Next Upstream Configuration")
public class ProxyNextUpstreamConfig {

    @Schema(description = "Whether to enable the proxy next upstream feature.")
    private Boolean enabled;

    @Schema(description = "Specifies the number of attempts to pass a request to the next server.")
    private Integer attempts;

    @Schema(description = "Specifies the timeout for passing a request to the next server.")
    private Integer timeout;

    @Schema(description = "Specifies in which cases a request should be passed to the next server.",
        allowableValues = {"error", "timeout", "invalid_header", "http_500", "http_502", "http_503", "http_504",
            "http_403", "http_404", "http_429", "non_idempotent",})
    private String[] conditions;
}
