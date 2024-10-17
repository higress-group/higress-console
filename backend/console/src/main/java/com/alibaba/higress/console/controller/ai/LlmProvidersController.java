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
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;

@RestController("LlmProvidersController")
@RequestMapping("/v1/ai/providers")
@Validated
public class LlmProvidersController {

    private LlmProviderService llmProviderService;

    @Resource
    public void setLlmProviderService(LlmProviderService llmProviderService) {
        this.llmProviderService = llmProviderService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<LlmProvider>> list(CommonPageQuery query) {
        PaginatedResult<LlmProvider> providers = llmProviderService.list(query);
        return ControllerUtil.buildResponseEntity(providers);
    }

    @PostMapping
    public ResponseEntity<Response<LlmProvider>> add(@RequestBody LlmProvider certificate) {
        LlmProvider newProvider = llmProviderService.addOrUpdate(certificate);
        return ControllerUtil.buildResponseEntity(newProvider);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<LlmProvider>> query(@PathVariable("name") @NotBlank String name) {
        LlmProvider provider = llmProviderService.query(name);
        return ControllerUtil.buildResponseEntity(provider);
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<LlmProvider>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody LlmProvider provider) {
        if (StringUtils.isNotEmpty(provider.getName())) {
            provider.setName(name);
        } else if (!StringUtils.equals(name, provider.getName())) {
            throw new ValidationException("Provider name in the URL doesn't match the one in the body.");
        }
        LlmProvider updatedProvider = llmProviderService.addOrUpdate(provider);
        return ControllerUtil.buildResponseEntity(updatedProvider);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<LlmProvider>> delete(@PathVariable("name") @NotBlank String name) {
        llmProviderService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
