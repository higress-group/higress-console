package com.alibaba.higress.console.controller.dto;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.util.List;

@Data
@ApiModel("Gateway Route")
public class Route {
    
    private Long id;
    
    private String name;
    
    private RoutePredicates routePredicates;
    
    private DestinationTypeEnum destinationType;
    
    private List<Destination> services;
    
}
