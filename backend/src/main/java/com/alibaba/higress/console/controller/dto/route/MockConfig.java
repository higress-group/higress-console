package com.alibaba.higress.console.controller.dto.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MockConfig {

    public static final int DEFAULT_STATUS = 200;

    private Integer status;

    private String content;
}
