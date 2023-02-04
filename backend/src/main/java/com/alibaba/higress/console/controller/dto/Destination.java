package com.alibaba.higress.console.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Destination {

    private String version;

    private Integer percent;

    private Integer servicePort;

    private String name;

}
