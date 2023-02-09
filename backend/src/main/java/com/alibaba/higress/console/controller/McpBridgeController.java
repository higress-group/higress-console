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

import com.alibaba.higress.console.controller.dto.*;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.McpBridgeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

@RestController("McpBridgeController")
@RequestMapping("/v1/McpBridge")
public class McpBridgeController {

    @Resource
    private McpBridgeService mcpBridgeService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<McpBridge>> list(@RequestParam(required = false)@RequestBody CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(mcpBridgeService.list(query));
    }

    @PostMapping
    public ResponseEntity<Response<McpBridge>> add(@RequestBody McpBridge mcpBridge) {
        return ControllerUtil.buildResponseEntity(mcpBridgeService.add(mcpBridge));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<McpBridge>> update(@PathVariable("name") @NotBlank String mcpName,@RequestBody McpBridge mcpBridge) {
        if (StringUtils.isNotEmpty(mcpBridge.getName())) {
            mcpBridge.setName(mcpName);
        } else if (!StringUtils.equals(mcpName, mcpBridge.getName())) {
            throw new ValidationException("mcpBridge name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(mcpBridgeService.update(mcpBridge));
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable("name") @NotBlank String name) {
         mcpBridgeService.delete(name);
    }
}
