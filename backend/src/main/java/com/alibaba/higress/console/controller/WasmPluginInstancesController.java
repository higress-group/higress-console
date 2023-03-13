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

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.WasmPlugin;
import com.alibaba.higress.console.controller.dto.WasmPluginConfig;
import com.alibaba.higress.console.controller.dto.WasmPluginInstance;
import com.alibaba.higress.console.controller.dto.WasmPluginInstanceScope;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.DomainService;
import com.alibaba.higress.console.service.RouteService;
import com.alibaba.higress.console.service.WasmPluginInstanceService;
import com.alibaba.higress.console.service.WasmPluginService;

/**
 * @author CH3CHO
 */
@RestController("WasmPluginInstancesController ")
@RequestMapping("/v1")
@Validated
public class WasmPluginInstancesController {

    private WasmPluginService wasmPluginService;
    private WasmPluginInstanceService wasmPluginInstanceService;
    private DomainService domainService;
    private RouteService routeService;

    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    @Resource
    public void setWasmPluginInstanceService(WasmPluginInstanceService wasmPluginInstanceService) {
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Resource
    public void setDomainService(DomainService domainService) {
        this.domainService = domainService;
    }

    @Resource
    public void setRouteService(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping(value = "/global/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>> listGlobalInstances() {
        return listInstances(WasmPluginInstanceScope.GLOBAL, null);
    }

    @GetMapping(value = "/global/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>>
        queryGlobalInstance(@PathVariable("name") @NotBlank String pluginName) {
        return queryInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName);
    }

    @PutMapping(value = "/global/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateGlobalInstance(
        @PathVariable("name") @NotBlank String pluginName, @RequestBody WasmPluginInstance instance) {
        return addOrUpdateInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName, instance);
    }

    @DeleteMapping(value = "/global/plugin-instances/{name}")
    public void deleteGlobalInstance(@PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName);
    }

    @GetMapping(value = "/domain/{domainName}/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listDomainInstances(@PathVariable("domainName") @NotBlank String domainName) {
        validateDomainName(domainName);
        return listInstances(WasmPluginInstanceScope.DOMAIN, domainName);
    }

    @GetMapping(value = "/domain/{domainName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> queryDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName) {
        validateDomainName(domainName);
        return queryInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    @PutMapping(value = "/domain/{domainName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateDomainName(domainName);
        return addOrUpdateInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName, instance);
    }

    @DeleteMapping(value = "/domain/{domainName}/plugin-instances/{name}")
    public void deleteDomainInstance(@PathVariable("domainName") @NotBlank String domainName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    @GetMapping(value = "/route/{routeName}/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listRouteInstances(@PathVariable("routeName") @NotBlank String routeName) {
        validateRouteName(routeName);
        return listInstances(WasmPluginInstanceScope.ROUTE, routeName);
    }

    @GetMapping(value = "/route/{routeName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> queryRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName) {
        validateRouteName(routeName);
        return queryInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    @PutMapping(value = "/route/{routeName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateRouteName(routeName);
        return addOrUpdateInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName, instance);
    }

    @DeleteMapping(value = "/route/{routeName}/plugin-instances/{name}")
    public void deleteRouteInstance(@PathVariable("routeName") @NotBlank String routeName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    private ResponseEntity<PaginatedResponse<WasmPluginInstance>> listInstances(WasmPluginInstanceScope scope,
        String target) {
        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(scope, target);
        return ControllerUtil.buildResponseEntity(PaginatedResult.createFromFullList(instances, null));
    }

    private ResponseEntity<Response<WasmPluginInstance>> queryInstance(WasmPluginInstanceScope scope, String target,
        String name) {
        WasmPluginInstance instance = wasmPluginInstanceService.query(scope, target, name);
        return ControllerUtil.buildResponseEntity(instance);
    }

    private ResponseEntity<Response<WasmPluginInstance>> addOrUpdateInstance(WasmPluginInstanceScope scope,
        String target, String name, WasmPluginInstance instance) {
        if (StringUtils.isEmpty(instance.getName())) {
            instance.setName(name);
        } else if (!StringUtils.equals(name, instance.getName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        WasmPlugin plugin = wasmPluginService.query(name, null);
        if (plugin == null) {
            throw new ValidationException("Unsupported plugin: " + name);
        }
        WasmPluginConfig pluginConfig = wasmPluginService.queryConfig(name, null);
        assert pluginConfig != null;
        Map<String, Object> cleanedConfigurations = pluginConfig.validateAndCleanUp(instance.getConfigurations());
        instance.setConfigurations(cleanedConfigurations);
        instance.setScope(scope);
        instance.setTarget(target);
        instance = wasmPluginInstanceService.addOrUpdate(instance);
        return ControllerUtil.buildResponseEntity(instance);
    }

    private void deleteInstance(WasmPluginInstanceScope scope, String target, String name) {
        wasmPluginInstanceService.delete(scope, target, name);
    }

    private void validateDomainName(String domainName) {
        if (domainService.query(domainName) == null) {
            throw new ValidationException("Unknown domain: " + domainName);
        }
    }

    private void validateRouteName(String routeName) {
        if (routeService.query(routeName) == null) {
            throw new ValidationException("Unknown route: " + routeName);
        }
    }
}
