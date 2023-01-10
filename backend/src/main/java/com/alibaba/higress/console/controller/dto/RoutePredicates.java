package com.alibaba.higress.console.controller.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoutePredicates {

    private PathPredicates pathPredicates;

    private List<String> methodPredicates;

    private List<ParamsPredicates> headerPredicates;

    private List<ParamsPredicates> queryPredicates;

}
