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
package com.alibaba.higress.console.controller.dto;

import java.util.List;
import java.util.Objects;

import com.alibaba.higress.console.controller.dto.route.CorsConfig;
import com.alibaba.higress.console.controller.dto.route.HeaderControlConfig;
import com.alibaba.higress.console.controller.dto.route.KeyedRoutePredicate;
import com.alibaba.higress.console.controller.dto.route.MockConfig;
import com.alibaba.higress.console.controller.dto.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.console.controller.dto.route.RateLimitConfig;
import com.alibaba.higress.console.controller.dto.route.RedirectConfig;
import com.alibaba.higress.console.controller.dto.route.RoutePredicate;
import com.alibaba.higress.console.controller.dto.route.UpstreamService;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway Route")
public class Route {
    private String name;

    private String version;

    private List<String> domains;

    private RoutePredicate path;

    // TODO: Not supported yet.
    private List<String> methods;

    // TODO: Not supported yet.
    private List<KeyedRoutePredicate> headers;

    // TODO: Not supported yet.
    private List<KeyedRoutePredicate> urlParams;

    private List<UpstreamService> services;

    // TODO: Not supported yet.
    private MockConfig mock;

    // TODO: Not supported yet.
    private RedirectConfig redirect;

    // TODO: Not supported yet.
    private RateLimitConfig rateLimit;

    private String rewriteTarget;

    private String upstreamVhost;

    // TODO: Not supported yet.
    private String timeout;

    private ProxyNextUpstreamConfig proxyNextUpstream;

    // TODO: Not supported yet.
    private CorsConfig cors;

    private HeaderControlConfig requestHeaderControl;

    private HeaderControlConfig responseHeaderControl;

    public String valid() {
        if (StringUtils.isAnyBlank(name, version)) {
            return "name, version must be not empty";
        }
        if (CollectionUtils.isEmpty(domains)) {
            return "domains must be not empty";
        }
        if (Objects.isNull(path)) {
            return "path must be not null";
        }
        if (StringUtils.isAnyEmpty(path.getMatchType(), path.getMatchValue())) {
            return "path matchType, matchValue must be not empty";
        }
        return "";
    }
}
