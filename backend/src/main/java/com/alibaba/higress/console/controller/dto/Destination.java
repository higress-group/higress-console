package com.alibaba.higress.console.controller.dto;

import lombok.Data;

@Data
public class Destination {
    
    private String version;
    
    private Integer percent;
    
    private Integer servicePort;
    
    private String agreementType;
    
    private String name;
    
    private String namespace;
    
    
}
