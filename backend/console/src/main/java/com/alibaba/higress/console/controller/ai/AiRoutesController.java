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
import com.alibaba.higress.sdk.model.ai.AiRoute;
import com.alibaba.higress.sdk.service.ai.AiRouteService;

@RestController("AiRoutesController")
@RequestMapping("/v1/ai/routes")
@Validated
public class AiRoutesController {

    private AiRouteService aiRouteService;

    @Resource
    public void setAiRouteService(AiRouteService aiRouteService) {
        this.aiRouteService = aiRouteService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<AiRoute>> list(CommonPageQuery query) {
        PaginatedResult<AiRoute> routes = aiRouteService.list(query);
        return ControllerUtil.buildResponseEntity(routes);
    }

    @PostMapping
    public ResponseEntity<Response<AiRoute>> add(@RequestBody AiRoute route) {
        route.validate();
        AiRoute newRoute = aiRouteService.add(route);
        return ControllerUtil.buildResponseEntity(newRoute);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<AiRoute>> query(@PathVariable("name") @NotBlank String name) {
        AiRoute route = aiRouteService.query(name);
        return ControllerUtil.buildResponseEntity(route);
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<AiRoute>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody AiRoute route) {
        if (StringUtils.isNotEmpty(route.getName())) {
            route.setName(name);
        } else if (!StringUtils.equals(name, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        route.validate();
        AiRoute updatedRoute = aiRouteService.update(route);
        return ControllerUtil.buildResponseEntity(updatedRoute);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<AiRoute>> delete(@PathVariable("name") @NotBlank String name) {
        aiRouteService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
