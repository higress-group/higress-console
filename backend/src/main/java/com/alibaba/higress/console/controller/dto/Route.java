package com.alibaba.higress.console.controller.dto;

import com.alibaba.higress.console.controller.dto.route.*;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway Route")
public class Route {

    private String name;

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

    // TODO: Not supported yet.
    private RewriteConfig rewrite;

    // TODO: Not supported yet.
    private String timeout;

    // TODO: Not supported yet.
    private RetryConfig retries;

    // TODO: Not supported yet.
    private CorsConfig cors;

    // TODO: Not supported yet.
    private HeaderModifyConfig headerModify;
}
