package com.alibaba.higress.console.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Service {
    
    private String name;
    
    private String namespace;

    private List<String> endpoints;
}
