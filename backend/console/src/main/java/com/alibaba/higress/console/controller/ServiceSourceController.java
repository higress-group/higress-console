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

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.ResponseEntity;
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
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.service.ServiceSourceService;

@RestController("ServiceSourceController")
@RequestMapping("/v1/service-sources")
public class ServiceSourceController {

    @Resource
    private ServiceSourceService serviceSourceService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<ServiceSource>>
        list(@RequestParam(required = false) @RequestBody CommonPageQuery query) {
        PaginatedResult<ServiceSource> result = serviceSourceService.list(query);
        if (CollectionUtils.isNotEmpty(result.getData())) {
            result.getData().forEach(this::stripSensitiveInfo);
        }
        return ControllerUtil.buildResponseEntity(result);
    }

    @PostMapping()
    public ResponseEntity<Response<ServiceSource>> add(@RequestBody ServiceSource serviceSource) {
        if (!serviceSource.isValid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        if (serviceSource.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)){
            throw new ValidationException("Adding an internal service source is not allowed.");
        }
        ServiceSource finalServiceSource = serviceSourceService.add(serviceSource);
        stripSensitiveInfo(finalServiceSource);
        return ControllerUtil.buildResponseEntity(finalServiceSource);
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<ServiceSource>> addOrUpdate(@PathVariable("name") @NotBlank String name,
        @RequestBody ServiceSource serviceSource) {
        serviceSource.setName(name);
        if (!serviceSource.isValid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        if (serviceSource.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)){
            throw new ValidationException("Updating an internal service source is not allowed.");
        }
        ServiceSource finalServiceSource = serviceSourceService.addOrUpdate(serviceSource);
        stripSensitiveInfo(finalServiceSource);
        return ControllerUtil.buildResponseEntity(finalServiceSource);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<ServiceSource>> delete(@PathVariable("name") @NotBlank String name) {
        if (name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)){
            throw new ValidationException("Deleting an internal service source is not allowed.");
        }
        serviceSourceService.delete(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{name}")
    public ResponseEntity<Response<ServiceSource>> query(@PathVariable("name") @NotBlank String name) {
        ServiceSource source = serviceSourceService.query(name);
        stripSensitiveInfo(source);
        return ControllerUtil.buildResponseEntity(source);
    }

    private void stripSensitiveInfo(ServiceSource source) {
        if (source == null || source.getAuthN() == null) {
            return;
        }
        source.getAuthN().setProperties(null);
    }
}
