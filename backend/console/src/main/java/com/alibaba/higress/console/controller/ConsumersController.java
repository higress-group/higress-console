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
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;

@RestController("ConsumersController")
@RequestMapping("/v1/consumers")
@Validated
public class ConsumersController {

    private ConsumerService consumerService;

    @Resource
    public void setConsumerService(ConsumerService consumerService) {
        this.consumerService = consumerService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<Consumer>> list(CommonPageQuery query) {
        PaginatedResult<Consumer> consumers = consumerService.list(query);
        return ControllerUtil.buildResponseEntity(consumers);
    }

    @PostMapping
    public ResponseEntity<Response<Consumer>> add(@RequestBody Consumer consumer) {
        consumer.validate(false);
        Consumer newConsumer = consumerService.addOrUpdate(consumer);
        return ControllerUtil.buildResponseEntity(newConsumer);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<Consumer>> query(@PathVariable("name") @NotBlank String name) {
        Consumer consumer = consumerService.query(name);
        return ControllerUtil.buildResponseEntity(consumer);
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<Consumer>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody Consumer consumer) {
        if (StringUtils.isNotEmpty(consumer.getName())) {
            consumer.setName(name);
        } else if (!StringUtils.equals(name, consumer.getName())) {
            throw new ValidationException("Consumer name in the URL doesn't match the one in the body.");
        }
        consumer.validate(true);
        Consumer updatedConsumer = consumerService.addOrUpdate(consumer);
        return ControllerUtil.buildResponseEntity(updatedConsumer);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<Consumer>> delete(@PathVariable("name") @NotBlank String name) {
        consumerService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
