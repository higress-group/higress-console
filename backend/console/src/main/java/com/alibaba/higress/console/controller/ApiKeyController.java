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

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import com.alibaba.higress.console.controller.dto.ApiKeyGroup;
import com.alibaba.higress.console.controller.dto.ApiKeyInfo;
import com.alibaba.higress.console.controller.dto.MappingRequest;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.service.ApiKeyService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("ApiKeyController")
@RequestMapping("/v1/api-keys")
@Validated
@Tag(name = "API Key Management APIs")
public class ApiKeyController {

    private ApiKeyService apiKeyService;

    @Resource
    public void setApiKeyService(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping("/list")
    @Operation(summary = "List all API keys with their group information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API keys listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<List<ApiKeyInfo>>> listApiKeys() {
        List<ApiKeyInfo> apiKeys = apiKeyService.listApiKeys();
        return ResponseEntity.ok(Response.success(apiKeys));
    }

    @GetMapping("/groupInfo")
    @Operation(summary = "Get group information for a specific customer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Customer groups retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<List<ApiKeyGroup>>> getCustomerGroups(
            @RequestParam("customerName") @NotBlank String customerName) {
        List<ApiKeyGroup> groups = apiKeyService.getCustomerGroups(customerName);
        return ResponseEntity.ok(Response.success(groups));
    }

    @PostMapping("/group/upinsert")
    @Operation(summary = "Create or update an API key group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Group created or updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Void>> upsertGroup(@Valid @RequestBody ApiKeyGroup group) {
        apiKeyService.upsertGroup(group);
        return ResponseEntity.ok(Response.success(null));
    }

    @PostMapping("/group/remove")
    @Operation(summary = "Remove an API key group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Group removed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Void>> removeGroup(@Valid @RequestBody ApiKeyGroup group) {
        apiKeyService.removeGroup(group.getName());
        return ResponseEntity.ok(Response.success(null));
    }

    @GetMapping("/group/list")
    @Operation(summary = "List all API key groups")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Groups listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<List<ApiKeyGroup>>> listGroups(
            @RequestParam(value = "name", required = false) String groupName) {
        List<ApiKeyGroup> groups = apiKeyService.listGroups(groupName);
        return ResponseEntity.ok(Response.success(groups));
    }

    @PostMapping("/group/mapping/add")
    @Operation(summary = "Add a customer to a group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Customer added to group successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Void>> addMapping(@Valid @RequestBody MappingRequest request) {
        apiKeyService.addMapping(request.getGroupId(), request.getCustomerId());
        return ResponseEntity.ok(Response.success(null));
    }

    @PostMapping("/group/mapping/del")
    @Operation(summary = "Remove a customer from a group")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Customer removed from group successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Void>> removeMapping(@Valid @RequestBody MappingRequest request) {
        apiKeyService.removeMapping(request.getGroupId(), request.getCustomerId());
        return ResponseEntity.ok(Response.success(null));
    }

}
