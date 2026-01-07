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
import javax.validation.ValidationException;
import javax.validation.constraints.NotBlank;

import com.alibaba.fastjson.JSON;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;
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
import com.alibaba.higress.console.service.ApiKeyService;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController("ConsumersController")
@RequestMapping("/v1/consumers")
@Validated
@Tag(name = "Consumer APIs")
public class ConsumersController {

    private ConsumerService consumerService;
    private ApiKeyService apiKeyService;

    @Resource
    public void setConsumerService(ConsumerService consumerService) {
        this.consumerService = consumerService;
    }

    @Resource
    public void setApiKeyService(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    @GetMapping
    @Operation(summary = "List consumers")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Consumers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<Consumer>> list(@ParameterObject CommonPageQuery query) {
        PaginatedResult<Consumer> consumers = consumerService.list(query);
        return ControllerUtil.buildResponseEntity(consumers);
    }

    @PostMapping
    @Operation(summary = "Add a consumer")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Consumer added successfully"),
        @ApiResponse(responseCode = "400", description = "Consumer data is not valid"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Consumer>> add(@RequestBody Consumer consumer) {
        consumer.validate(false);
        Consumer newConsumer = consumerService.addOrUpdate(consumer);
        // Create a default group for the consumer with the same name as the consumer
        try {
            if (apiKeyService != null) {
                com.alibaba.higress.console.controller.dto.ApiKeyGroup group = new com.alibaba.higress.console.controller.dto.ApiKeyGroup();
                group.setName(newConsumer.getName());
                group.setKey(((KeyAuthCredential)consumer.getCredentials().get(0)).getValues().get(0));;
                apiKeyService.upsertGroup(group);
            }
        } catch (Exception e) {
            // Log error but don't fail the consumer creation
            org.slf4j.LoggerFactory.getLogger(getClass()).error("Failed to create default group for consumer: " + newConsumer.getName(), e);
            throw e;
        }
        return ControllerUtil.buildResponseEntity(newConsumer);
    }

    @GetMapping(value = "/{name}")
    @Operation(summary = "Get consumer by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Consumer found"),
        @ApiResponse(responseCode = "404", description = "Consumer not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Consumer>> query(@PathVariable("name") @NotBlank String name) {
        Consumer consumer = consumerService.query(name);
        return ControllerUtil.buildResponseEntity(consumer);
    }

    @PutMapping("/{name}")
    @Operation(summary = "Update an existed consumer")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Consumer updated successfully"),
        @ApiResponse(responseCode = "400", description = "Consumer data is not valid"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Consumer>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody Consumer consumer) {
        if (StringUtils.isEmpty(consumer.getName())) {
            consumer.setName(name);
        } else if (!StringUtils.equals(name, consumer.getName())) {
            throw new ValidationException("Consumer name in the URL doesn't match the one in the body.");
        }
        consumer.validate(true);
        Consumer updatedConsumer = consumerService.addOrUpdate(consumer);
        // Update the corresponding group
        try {
            if (apiKeyService != null) {
                com.alibaba.higress.console.controller.dto.ApiKeyGroup group = new com.alibaba.higress.console.controller.dto.ApiKeyGroup();
                group.setName(updatedConsumer.getName());
                group.setKey(((KeyAuthCredential)consumer.getCredentials().get(0)).getValues().get(0));;
                apiKeyService.upsertGroup(group);
            }
        } catch (Exception e) {
            // Log error but don't fail the consumer update
            org.slf4j.LoggerFactory.getLogger(getClass()).error("Failed to update group for consumer: " + updatedConsumer.getName(), e);
            throw e;
        }
        return ControllerUtil.buildResponseEntity(updatedConsumer);
    }

    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a consumer")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Consumer deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Consumer>> delete(@PathVariable("name") @NotBlank String name) {
        consumerService.delete(name);
        // Remove the corresponding group
        try {
            if (apiKeyService != null) {
                apiKeyService.removeGroup(name);
            }
        } catch (Exception e) {
            // Log error but don't fail the consumer deletion
            org.slf4j.LoggerFactory.getLogger(getClass()).error("Failed to remove group for consumer: " + name, e);
            throw e;
        }
        return ResponseEntity.noContent().build();
    }
}
