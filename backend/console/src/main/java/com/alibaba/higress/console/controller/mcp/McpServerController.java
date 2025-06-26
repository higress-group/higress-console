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
package com.alibaba.higress.console.controller.mcp;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

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
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.SwaggerContent;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author HecarimV
 */
@RestController("McpServerController")
@RequestMapping("/v1/mcpServer")
@Validated
@Tag(name = "Mcp APIs")
public class McpServerController {

    @Resource
    private McpServerService mcpServerService;

    @Resource
    private McpServerHelper mcpServerHelper;

    @PostMapping("/swaggerToMcpConfig")
    @Operation(summary = "swagger to mcp config")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "swagger convert successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> swaggerToMcpConfig(@Valid @RequestBody SwaggerContent swaggerContent) {
        return ResponseEntity.ok(Response.success(mcpServerHelper.swaggerToMcpConfig(swaggerContent.getContent())));
    }

    @PutMapping
    @Operation(summary = "Add or update a mcp server instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances saved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<McpServer>> addOrUpdateMcpInstance(@RequestBody McpServer instance) {
        instance = mcpServerService.addOrUpdate(instance);
        return ControllerUtil.buildResponseEntity(instance);
    }

    @GetMapping
    @Operation(summary = "List mcp server")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "McpServers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<McpServer>> list(@ParameterObject McpServerPageQuery query) {
        return ControllerUtil.buildResponseEntity(mcpServerService.list(query));
    }

    @GetMapping("/{name}")
    @Operation(summary = "Get detail for mcp server")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "McpServer detail query successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<McpServer>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(mcpServerService.query(name));
    }

    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a mcp server")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Route deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Void> delete(@PathVariable("name") @NotBlank String name) {
        mcpServerService.delete(name);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/consumers")
    @Operation(summary = "Add mcp server allow consumers")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "204", description = "Add mcp server allow consumers successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Void> addAllowConsumers(@RequestBody McpServerConsumers consumers) {
        mcpServerService.addAllowConsumers(consumers);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/consumers")
    @Operation(summary = "Delete mcp server allow consumers")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "204", description = "Delete mcp server allow consumers successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Void> deleteAllowConsumers(@RequestBody McpServerConsumers consumers) {
        mcpServerService.deleteAllowConsumers(consumers);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/consumers")
    @Operation(summary = "List mcp server allow consumers")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "200", description = "List mcp server allow consumers successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<McpServerConsumerDetail>>
        listAllowConsumers(@ParameterObject McpServerConsumersPageQuery query) {
        return ControllerUtil.buildResponseEntity(mcpServerService.listAllowConsumers(query));
    }

}
