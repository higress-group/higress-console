package com.alibaba.higress.console.controller.dto;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Gateway Domain")
public class Domain {

    private String name;
    
    private String enableHttps;

    private String certIdentifier;
}
