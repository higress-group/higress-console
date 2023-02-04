package com.alibaba.higress.console.controller.dto;

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
    
    private Long id;
    
    private String name;
    
    private List<String> domainList;
    
    private RoutePredicates routePredicates;
    
    private DestinationTypeEnum destinationType;
    
    private List<Destination> services;
    
}
