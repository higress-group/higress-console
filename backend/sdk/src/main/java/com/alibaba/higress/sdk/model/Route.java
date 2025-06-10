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

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.CorsConfig;
import com.alibaba.higress.sdk.model.route.HeaderControlConfig;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.MockConfig;
import com.alibaba.higress.sdk.model.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.sdk.model.route.RateLimitConfig;
import com.alibaba.higress.sdk.model.route.RedirectConfig;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.UpstreamService;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Gateway Route")
public class Route implements VersionedDto {

    @Schema(description = "Route name")
    private String name;

    @Schema(description = "Route version. Required when updating.")
    private String version;

    @Schema(description = "Domains that the route applies to. If empty, the route applies to all domains.")
    private List<String> domains;

    @Schema(description = "Path predicate")
    private RoutePredicate path;

    @Schema(description = "Methods that the route applies to. If empty, the route applies to all methods.")
    private List<String> methods;

    @Schema(description = "Header predicates")
    private List<KeyedRoutePredicate> headers;

    @Schema(description = "URL parameter predicates")
    private List<KeyedRoutePredicate> urlParams;

    @Schema(description = "Route upstream services")
    private List<UpstreamService> services;

    // TODO: Not supported yet.
    @Schema(hidden = true)
    private MockConfig mock;

    // TODO: Not supported yet.
    @Schema(hidden = true)
    private RedirectConfig redirect;

    // TODO: Not supported yet.
    @Schema(hidden = true)
    private RateLimitConfig rateLimit;

    @Schema(description = "Request rewrite configuration")
    private RewriteConfig rewrite;

    // TODO: Not supported yet.
    @Schema(hidden = true)
    private String timeout;

    @Schema(description = "Proxy next upstream configuration")
    private ProxyNextUpstreamConfig proxyNextUpstream;

    @Schema(description = "CORS configuration")
    private CorsConfig cors;

    @Schema(description = "Header control configuration")
    private HeaderControlConfig headerControl;

    @Schema(description = "Route auth configuration")
    private RouteAuthConfig authConfig;

    @Schema(description = "Custom configurations, e.g., custom annotations")
    private Map<String, String> customConfigs;

    @Schema(description = "Custom labels")
    private Map<String, String> customLabels;

    @Schema(hidden = true)
    private Boolean readonly;

    public void validate() {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }
        if (CollectionUtils.isEmpty(services)) {
            throw new ValidationException("services cannot be empty.");
        }
        if (path != null) {
            path.validate();
        }
        if (CollectionUtils.isNotEmpty(headers)) {
            headers.forEach(KeyedRoutePredicate::validate);
        }
        if (CollectionUtils.isNotEmpty(urlParams)) {
            urlParams.forEach(KeyedRoutePredicate::validate);
        }
        services.forEach(UpstreamService::validate);
        if (authConfig != null) {
            authConfig.validate();
        }
    }
}
