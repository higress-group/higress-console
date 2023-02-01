package com.alibaba.higress.console.controller.dto;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("Gateway Domain")
public class Domain {

    private String domain;

    private String tlsSecret;

    private String enableHttps;

}