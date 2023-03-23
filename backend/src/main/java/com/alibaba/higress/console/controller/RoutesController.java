/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.RoutePageQuery;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.RouteService;

@RestController("RoutesController")
@RequestMapping("/v1/routes")
@Validated
public class RoutesController {

    @Resource
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Route>> list(RoutePageQuery query) {
        return ControllerUtil.buildResponseEntity(routeService.list(query));
    }

    @GetMapping("/{name}")
    public ResponseEntity<Response<Route>> query(@PathVariable("name") @NotBlank String routeName) {
        return ControllerUtil.buildResponseEntity(routeService.query(routeName));
    }

    @PostMapping
    public ResponseEntity<Response<Route>> add(@RequestBody Route route) {
        return ControllerUtil.buildResponseEntity(routeService.add(route));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<Route>> update(@PathVariable("name") @NotBlank String routeName,
        @RequestBody Route route) {
        if (StringUtils.isEmpty(route.getName())) {
            route.setName(routeName);
        } else if (!StringUtils.equals(routeName, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(routeService.update(route));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<Route>> delete(@PathVariable("name") @NotBlank String name) {
        routeService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
