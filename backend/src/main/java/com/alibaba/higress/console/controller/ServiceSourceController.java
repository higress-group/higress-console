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

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.ServiceSource;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.ServiceSourceService;

@RestController("ServiceSourceController")
@RequestMapping("/service-sources")
public class ServiceSourceController {

    @Resource
    private ServiceSourceService serviceSourceService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<ServiceSource>>
        list(@RequestParam(required = false) @RequestBody CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(serviceSourceService.list(query));
    }

    @PostMapping()
    public ResponseEntity<Response<ServiceSource>> add(@RequestBody ServiceSource serviceSource) {
        if (!serviceSource.valid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        return ControllerUtil.buildResponseEntity(serviceSourceService.add(serviceSource));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<ServiceSource>> addOrUpdate(@PathVariable("name") @NotBlank String name,
        @RequestBody ServiceSource serviceSource) {
        serviceSource.setName(name);
        if (!serviceSource.valid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        return ControllerUtil.buildResponseEntity(serviceSourceService.addOrUpdate(serviceSource));
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable("name") @NotBlank String name) {
        serviceSourceService.delete(name);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Response<ServiceSource>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(serviceSourceService.query(name));
    }
}
