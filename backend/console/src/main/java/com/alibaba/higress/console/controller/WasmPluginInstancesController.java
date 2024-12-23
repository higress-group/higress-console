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

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Service;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.ServiceService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.WasmPluginService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesUtil;

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
    private ServiceService serviceService;

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

    @Autowired
    public void setServiceService(ServiceService serviceService) {
        this.serviceService = serviceService;
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

    @GetMapping(value = "/domains/{domainName}/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listDomainInstances(@PathVariable("domainName") @NotBlank String domainName) {
        validateDomainName(domainName);
        return listInstances(WasmPluginInstanceScope.DOMAIN, domainName);
    }

    @GetMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> queryDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName) {
        validateDomainName(domainName);
        return queryInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    @PutMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateDomainName(domainName);
        return addOrUpdateInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName, instance);
    }

    @DeleteMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    public void deleteDomainInstance(@PathVariable("domainName") @NotBlank String domainName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    @GetMapping(value = "/routes/{routeName}/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listRouteInstances(@PathVariable("routeName") @NotBlank String routeName) {
        validateRouteName(routeName);
        return listInstances(WasmPluginInstanceScope.ROUTE, routeName);
    }

    @GetMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> queryRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName) {
        validateRouteName(routeName);
        return queryInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    @PutMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateRouteName(routeName);
        if (routeName.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Changing Wasm plugin configuration of an internal route is not allowed.");
        }
        return addOrUpdateInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName, instance);
    }

    @DeleteMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    public void deleteRouteInstance(@PathVariable("routeName") @NotBlank String routeName,
        @PathVariable("name") @NotBlank String pluginName) {
        if (routeName.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Changing Wasm plugin configuration of an internal route is not allowed.");
        }
        deleteInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    @GetMapping(value = "/services/{serviceName}/plugin-instances")
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listServiceInstances(@PathVariable("serviceName") @NotBlank String serviceName) {
        validateServiceName(serviceName);
        return listInstances(WasmPluginInstanceScope.SERVICE, serviceName);
    }

    @GetMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> queryServiceInstance(
        @PathVariable("serviceName") @NotBlank String serviceName, @PathVariable("name") @NotBlank String pluginName) {
        validateServiceName(serviceName);
        return queryInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName);
    }

    @PutMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateServiceInstance(
        @PathVariable("serviceName") @NotBlank String serviceName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateServiceName(serviceName);
        if (KubernetesUtil.isInternalService(serviceName)) {
            throw new ValidationException("Changing Wasm plugin configuration of an internal service is not allowed.");
        }
        return addOrUpdateInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName, instance);
    }

    @DeleteMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    public void deleteServiceInstance(@PathVariable("serviceName") @NotBlank String serviceName,
        @PathVariable("name") @NotBlank String pluginName) {
        if (serviceName.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Changing Wasm plugin configuration of an internal service is not allowed.");
        }
        deleteInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName);
    }

    private ResponseEntity<PaginatedResponse<WasmPluginInstance>> listInstances(WasmPluginInstanceScope scope,
        String target) {
        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(scope, target);
        instances.removeIf(WasmPluginInstance::isInternal);
        return ControllerUtil.buildResponseEntity(PaginatedResult.createFromFullList(instances, null));
    }

    private ResponseEntity<Response<WasmPluginInstance>> queryInstance(WasmPluginInstanceScope scope, String target,
        String name) {
        WasmPluginInstance instance = wasmPluginInstanceService.query(scope, target, name, false);
        if (instance == null) {
            instance = WasmPluginInstance.builder().pluginName(name).internal(false).enabled(false).build();
            instance.setTarget(scope, target);
        }
        return ControllerUtil.buildResponseEntity(instance);
    }

    private ResponseEntity<Response<WasmPluginInstance>> addOrUpdateInstance(WasmPluginInstanceScope scope,
        String target, String name, WasmPluginInstance instance) {
        if (StringUtils.isEmpty(instance.getPluginName())) {
            instance.setPluginName(name);
        } else if (!StringUtils.equals(name, instance.getPluginName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        if (instance.isInternal()) {
            throw new ValidationException("Updating an internal Wasm plugin instance is not allowed.");
        }
        WasmPlugin plugin = wasmPluginService.query(name, null);
        if (plugin == null) {
            throw new ValidationException("Unsupported plugin: " + name);
        }
        instance.setTarget(scope, target);
        instance = wasmPluginInstanceService.addOrUpdate(instance);
        return ControllerUtil.buildResponseEntity(instance);
    }

    private void deleteInstance(WasmPluginInstanceScope scope, String target, String name) {
        wasmPluginInstanceService.delete(scope, target, name);
    }

    private void validateDomainName(String domainName) {
        if (StringUtils.isEmpty(domainName)) {
            throw new ValidationException("Domain name is required.");
        }
        if (domainService.query(domainName) == null) {
            throw new ValidationException("Unknown domain: " + domainName);
        }
    }

    private void validateRouteName(String routeName) {
        if (StringUtils.isEmpty(routeName)) {
            throw new ValidationException("Route name is required.");
        }
        if (routeService.query(routeName) == null) {
            throw new ValidationException("Unknown route: " + routeName);
        }
    }

    private void validateServiceName(String serviceName) {
        if (StringUtils.isEmpty(serviceName)) {
            throw new ValidationException("Service name is required.");
        }
        PaginatedResult<Service> services = serviceService.list(null);
        if (services.getData() != null && services.getData().stream().noneMatch(s -> serviceName.equals(s.getName()))) {
            throw new ValidationException("Unknown service: " + serviceName);
        }
    }
}
