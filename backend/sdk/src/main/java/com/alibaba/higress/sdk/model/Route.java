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

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway Route")
public class Route implements VersionedDto {

    private String name;

    private Boolean isIngressMode;

    private String version;

    private List<String> domains;

    private RoutePredicate path;

    private List<String> methods;

    private List<KeyedRoutePredicate> headers;

    private List<KeyedRoutePredicate> urlParams;

    private List<UpstreamService> services;

    // TODO: Not supported yet.
    private MockConfig mock;

    // TODO: Not supported yet.
    private RedirectConfig redirect;

    // TODO: Not supported yet.
    private RateLimitConfig rateLimit;

    private RewriteConfig rewrite;

    // TODO: Not supported yet.
    private String timeout;

    private ProxyNextUpstreamConfig proxyNextUpstream;

    private CorsConfig cors;

    private HeaderControlConfig headerControl;

    private Map<String, String> customConfigs;
}
