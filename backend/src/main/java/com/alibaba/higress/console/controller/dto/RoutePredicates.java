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
public class RoutePredicates {

    private PathPredicates pathPredicates;

    private List<String> methodPredicates;

    private List<ParamsPredicates> headerPredicates;

    private List<ParamsPredicates> queryPredicates;

}
