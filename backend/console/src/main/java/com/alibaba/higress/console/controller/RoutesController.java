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
import org.springdoc.api.annotations.ParameterObject;
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
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.RouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController("RoutesController")
@RequestMapping("/v1/routes")
@Validated
@Tag(name = "Route APIs")
public class RoutesController {

    @Resource
    private RouteService routeService;

    @GetMapping
    @Operation(summary = "List routes")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Routes listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<Route>> list(@ParameterObject RoutePageQuery query) {
        return ControllerUtil.buildResponseEntity(routeService.list(query));
    }

    @GetMapping("/{name}")
    @Operation(summary = "Get route by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route found"),
        @ApiResponse(responseCode = "404", description = "Route not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Route>> query(@PathVariable("name") @NotBlank String routeName) {
        return ControllerUtil.buildResponseEntity(routeService.query(routeName));
    }

    @PostMapping
    @Operation(summary = "Add a new route")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Route data is not valid"),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Route>> add(@RequestBody Route route) {
        if (StringUtils.isEmpty(route.getName())) {
            throw new ValidationException("Route name is required.");
        }
        if (route.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Adding an internal route is not allowed.");
        }
        route.validate();
        return ControllerUtil.buildResponseEntity(routeService.add(route));
    }

    @PutMapping("/{name}")
    @Operation(summary = "Update an existed route")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Route data is not valid or route name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Route>> update(@PathVariable("name") @NotBlank String routeName,
        @RequestBody Route route) {
        if (StringUtils.isEmpty(route.getName())) {
            route.setName(routeName);
        } else if (!StringUtils.equals(routeName, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        if (route.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Updating an internal route is not allowed.");
        }
        route.validate();
        return ControllerUtil.buildResponseEntity(routeService.update(route));
    }

    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a route")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Route deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Deleting an internal route is not allowed."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Route>> delete(@PathVariable("name") @NotBlank String name) {
        if (name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Deleting an internal route is not allowed.");
        }
        routeService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
