package com.alibaba.higress.console.controller.dto;


import lombok.Data;

@Data
public class Domain {

    private Long id;

    private String name;
    
    /**
     * HTTP
     * HTTPS
     */
    private String protocol;

    private Boolean mustHttps;

    private String certIdentifier;

    private String caCertIdentifier;

    private Integer status;

    private String type;
    
    private String http2;

    private String tlsMax;

    private String tlsMin;


}
