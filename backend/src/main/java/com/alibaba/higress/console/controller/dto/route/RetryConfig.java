package com.alibaba.higress.console.controller.dto.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetryConfig {

    private Integer attempt;

    private String retryOn;
}
