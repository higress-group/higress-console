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

import com.alibaba.higress.sdk.service.HigressConfigService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController("HigressController")
@RequestMapping("/v1/workmode")
@Validated
public class HigressConfigController {
    @Resource
    HigressConfigService higressConfigService;

    @GetMapping
    public Boolean getWorkMode() {
        return higressConfigService.getWorkMode();
    }

    @PutMapping
    public Boolean updateWorkMode(@RequestParam Boolean mode) {
        return higressConfigService.putWorkMode(mode);
    }

}
