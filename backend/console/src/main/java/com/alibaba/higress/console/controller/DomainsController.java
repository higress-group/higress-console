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
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.RouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController("DomainsController")
@RequestMapping("/v1/domains")
@Validated
@Tag(name = "Domain APIs")
public class DomainsController {

    @Resource
    private DomainService domainService;

    @Resource
    private RouteService routeService;

    @GetMapping
    @Operation(summary = "List domains")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Domains listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<Domain>> list(@ParameterObject CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(domainService.list(query));
    }

    @PostMapping
    @Operation(summary = "Add a new domain")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Domain added successfully"),
        @ApiResponse(responseCode = "400", description = "Domain data is not valid"),
        @ApiResponse(responseCode = "409", description = "Domain already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Domain>> add(@RequestBody Domain domain) {
        return ControllerUtil.buildResponseEntity(domainService.add(domain));
    }

    @GetMapping(value = "/{name}")
    @Operation(summary = "Get domain by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Domain found"),
        @ApiResponse(responseCode = "404", description = "Domain not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Domain>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(domainService.query(name));
    }

    @PutMapping("/{name}")
    @Operation(summary = "Update an existed domain")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Domain updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Domain data is not valid or domain name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Domain already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Domain>> put(@PathVariable("name") @NotBlank String domainName,
        @RequestBody Domain domain) {
        if (StringUtils.isEmpty(domain.getName())) {
            domain.setName(domainName);
        } else if (!StringUtils.equals(domainName, domain.getName())) {
            throw new ValidationException("Domain name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(domainService.put(domain));
    }

    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a domain")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Domain deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Domain>> delete(@PathVariable("name") @NotBlank String name) {
        domainService.delete(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{name}/routes")
    @Operation(summary = "List routes bound with a domain")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Routes listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<Route>> queryRoutes(@PathVariable("name") @NotBlank String name,
        CommonPageQuery commonPageQuery) {
        RoutePageQuery routePageQuery = new RoutePageQuery();
        routePageQuery.setDomainName(name);
        if (commonPageQuery != null) {
            routePageQuery.setPageSize(commonPageQuery.getPageSize());
            routePageQuery.setPageNum(commonPageQuery.getPageNum());
        }
        return ControllerUtil.buildResponseEntity(routeService.list(routePageQuery));
    }
}