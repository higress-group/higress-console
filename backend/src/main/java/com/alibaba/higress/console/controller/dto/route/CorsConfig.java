package com.alibaba.higress.console.controller.dto.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorsConfig {

    public static final List<String> DEFAULT_ALLOWS = Collections.singletonList("*");

    public static final int DEFAULT_MAX_AGE = 86400;

    private List<String> allowOrigins;

    private List<String> allowMethods;

    private List<String> allowHeaders;

    private List<String> exposeHeaders;

    private Integer maxAge;

    private Boolean allowCredentials;
}
