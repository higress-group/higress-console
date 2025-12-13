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
package com.alibaba.higress.console.controller.ai;

import javax.annotation.Resource;
import javax.validation.ValidationException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController("LlmProvidersController")
@RequestMapping("/v1/ai/providers")
@Validated
@Tag(name = "LLM Provider APIs")
public class LlmProvidersController {

    private LlmProviderService llmProviderService;

    @Resource
    public void setLlmProviderService(LlmProviderService llmProviderService) {
        this.llmProviderService = llmProviderService;
    }

    @GetMapping
    @Operation(summary = "List LLM providers")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Providers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<LlmProvider>> list(@RequestParam(required = false) CommonPageQuery query) {
        PaginatedResult<LlmProvider> providers = llmProviderService.list(query);
        return ControllerUtil.buildResponseEntity(providers);
    }

    @PostMapping
    @Operation(summary = "Add a new LLM provider")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Route data is not valid"),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<LlmProvider>> add(@RequestBody LlmProvider provider) {
        provider.validate(false);
        LlmProvider newProvider = llmProviderService.addOrUpdate(provider);
        return ControllerUtil.buildResponseEntity(newProvider);
    }

    @GetMapping(value = "/{name}")
    @Operation(summary = "Get LLM provider by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Provider found"),
        @ApiResponse(responseCode = "404", description = "Provider not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<LlmProvider>> query(@PathVariable("name") @NotBlank String name) {
        LlmProvider provider = llmProviderService.query(name);
        return ControllerUtil.buildResponseEntity(provider);
    }

    @PutMapping("/{name}")
    @Operation(summary = "Update an existed provider")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Provider updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Provider data is not valid or provider name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<LlmProvider>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody LlmProvider provider) {
        if (StringUtils.isNotEmpty(provider.getName())) {
            provider.setName(name);
        } else if (!StringUtils.equals(name, provider.getName())) {
            throw new ValidationException("Provider name in the URL doesn't match the one in the body.");
        }
        provider.validate(false);
        LlmProvider updatedProvider = llmProviderService.addOrUpdate(provider);
        return ControllerUtil.buildResponseEntity(updatedProvider);
    }

    @DeleteMapping("/{name}")
    @Operation(summary = "Delete an LLM provider")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Provider deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<LlmProvider>> delete(@PathVariable("name") @NotBlank String name) {
        llmProviderService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
