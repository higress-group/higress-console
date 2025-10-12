package com.alibaba.higress.console.controller;

import java.util.List;
import java.util.stream.Collectors;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * WASM插件实例控制器，用于管理不同作用域下的WASM插件实例
 * 支持全局、域名、路由和服务四个层级的插件实例管理
 */
@RestController("WasmPluginInstancesController ")
@RequestMapping("/v1")
@Validated
@Tag(name = "Wasm Plugin Instance APIs")
public class WasmPluginInstancesController {

    /**
     * WASM插件服务，用于处理插件相关业务逻辑
     */
    private WasmPluginService wasmPluginService;

    /**
     * WASM插件实例服务，用于处理插件实例相关业务逻辑
     */
    private WasmPluginInstanceService wasmPluginInstanceService;

    /**
     * 域名服务，用于域名相关操作
     */
    private DomainService domainService;

    /**
     * 路由服务，用于路由相关操作
     */
    private RouteService routeService;

    /**
     * 服务服务，用于微服务相关操作
     */
    private ServiceService serviceService;

    /**
     * 注入WASM插件服务
     * @param wasmPluginService WASM插件服务实例
     */
    @Resource
    public void setWasmPluginService(WasmPluginService wasmPluginService) {
        this.wasmPluginService = wasmPluginService;
    }

    /**
     * 注入WASM插件实例服务
     * @param wasmPluginInstanceService WASM插件实例服务实例
     */
    @Resource
    public void setWasmPluginInstanceService(WasmPluginInstanceService wasmPluginInstanceService) {
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    /**
     * 注入域名服务
     * @param domainService 域名服务实例
     */
    @Resource
    public void setDomainService(DomainService domainService) {
        this.domainService = domainService;
    }

    /**
     * 注入路由服务
     * @param routeService 路由服务实例
     */
    @Resource
    public void setRouteService(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * 注入服务服务
     * @param serviceService 服务服务实例
     */
    @Autowired
    public void setServiceService(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    /**
     * 列出全局范围的插件实例
     * @return 全局插件实例列表响应
     */
    @GetMapping(value = "/global/plugin-instances")
    @Operation(summary = "List global plugin instances")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>> listGlobalInstances() {
        return listInstances(WasmPluginInstanceScope.GLOBAL, null);
    }

    /**
     * 查询特定的全局插件实例
     * @param pluginName 插件名称
     * @return 插件实例响应
     */
    @GetMapping(value = "/global/plugin-instances/{name}")
    @Operation(summary = "Get a specific global plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>>
        queryGlobalInstance(@PathVariable("name") @NotBlank String pluginName) {
        return queryInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName);
    }

    /**
     * 添加或更新特定的全局插件实例
     * @param pluginName 插件名称
     * @param instance 插件实例对象
     * @return 更新后的插件实例响应
     */
    @PutMapping(value = "/global/plugin-instances/{name}")
    @Operation(summary = "Add or update a specific global plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateGlobalInstance(
        @PathVariable("name") @NotBlank String pluginName, @RequestBody WasmPluginInstance instance) {
        return addOrUpdateInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName, instance);
    }

    /**
     * 删除全局插件实例
     * @param pluginName 插件名称
     */
    @DeleteMapping(value = "/global/plugin-instances/{name}")
    @Operation(summary = "Delete a global plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Instance deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public void deleteGlobalInstance(@PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.GLOBAL, null, pluginName);
    }

    /**
     * 列出绑定到指定域名的插件实例
     * @param domainName 域名
     * @return 域名绑定的插件实例列表响应
     */
    @GetMapping(value = "/domains/{domainName}/plugin-instances")
    @Operation(summary = "List plugin instances bound to a domain")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listDomainInstances(@PathVariable("domainName") @NotBlank String domainName) {
        validateDomainName(domainName);
        return listInstances(WasmPluginInstanceScope.DOMAIN, domainName);
    }

    /**
     * 查询特定域名绑定的插件实例
     * @param domainName 域名
     * @param pluginName 插件名称
     * @return 插件实例响应
     */
    @GetMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    @Operation(summary = "Get a specific domain-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> queryDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName) {
        validateDomainName(domainName);
        return queryInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    /**
     * 添加或更新特定域名绑定的插件实例
     * @param domainName 域名
     * @param pluginName 插件名称
     * @param instance 插件实例对象
     * @return 更新后的插件实例响应
     */
    @PutMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    @Operation(summary = "Add or update a specific domain-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateDomainInstance(
        @PathVariable("domainName") @NotBlank String domainName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateDomainName(domainName);
        return addOrUpdateInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName, instance);
    }

    /**
     * 删除域名绑定的插件实例
     * @param domainName 域名
     * @param pluginName 插件名称
     */
    @DeleteMapping(value = "/domains/{domainName}/plugin-instances/{name}")
    @Operation(summary = "Delete a domain-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Instance deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public void deleteDomainInstance(@PathVariable("domainName") @NotBlank String domainName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.DOMAIN, domainName, pluginName);
    }

    /**
     * 列出绑定到指定路由的插件实例
     * @param routeName 路由名称
     * @return 路由绑定的插件实例列表响应
     */
    @GetMapping(value = "/routes/{routeName}/plugin-instances")
    @Operation(summary = "List plugin instances bound to a route")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listRouteInstances(@PathVariable("routeName") @NotBlank String routeName) {
        validateRouteName(routeName);
        return listInstances(WasmPluginInstanceScope.ROUTE, routeName);
    }

    /**
     * 查询特定路由绑定的插件实例
     * @param routeName 路由名称
     * @param pluginName 插件名称
     * @return 插件实例响应
     */
    @GetMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    @Operation(summary = "Get a specific route-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> queryRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName) {
        validateRouteName(routeName);
        return queryInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    /**
     * 添加或更新特定路由绑定的插件实例
     * @param routeName 路由名称
     * @param pluginName 插件名称
     * @param instance 插件实例对象
     * @return 更新后的插件实例响应
     */
    @PutMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    @Operation(summary = "Add or update a specific route-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateRouteInstance(
        @PathVariable("routeName") @NotBlank String routeName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateRouteName(routeName);
        return addOrUpdateInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName, instance);
    }

    /**
     * 删除路由绑定的插件实例
     * @param routeName 路由名称
     * @param pluginName 插件名称
     */
    @DeleteMapping(value = "/routes/{routeName}/plugin-instances/{name}")
    @Operation(summary = "Delete a route-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Instance deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public void deleteRouteInstance(@PathVariable("routeName") @NotBlank String routeName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.ROUTE, routeName, pluginName);
    }

    /**
     * 列出绑定到指定服务的插件实例
     * @param serviceName 服务名称
     * @return 服务绑定的插件实例列表响应
     */
    @GetMapping(value = "/services/{serviceName}/plugin-instances")
    @Operation(summary = "List plugin instances bound to a service")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<WasmPluginInstance>>
        listServiceInstances(@PathVariable("serviceName") @NotBlank String serviceName) {
        validateServiceName(serviceName);
        return listInstances(WasmPluginInstanceScope.SERVICE, serviceName);
    }

    /**
     * 查询特定服务绑定的插件实例
     * @param serviceName 服务名称
     * @param pluginName 插件名称
     * @return 插件实例响应
     */
    @GetMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    @Operation(summary = "Get a specific service-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> queryServiceInstance(
        @PathVariable("serviceName") @NotBlank String serviceName, @PathVariable("name") @NotBlank String pluginName) {
        validateServiceName(serviceName);
        return queryInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName);
    }

    /**
     * 添加或更新特定服务绑定的插件实例
     * @param serviceName 服务名称
     * @param pluginName 插件名称
     * @param instance 插件实例对象
     * @return 更新后的插件实例响应
     */
    @PutMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    @Operation(summary = "Add or update a specific service-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Instances retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<WasmPluginInstance>> addOrUpdateServiceInstance(
        @PathVariable("serviceName") @NotBlank String serviceName, @PathVariable("name") @NotBlank String pluginName,
        @RequestBody WasmPluginInstance instance) {
        validateServiceName(serviceName);
        return addOrUpdateInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName, instance);
    }

    /**
     * 删除服务绑定的插件实例
     * @param serviceName 服务名称
     * @param pluginName 插件名称
     */
    @DeleteMapping(value = "/services/{serviceName}/plugin-instances/{name}")
    @Operation(summary = "Delete a service-bound plugin instance")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Instance deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public void deleteServiceInstance(@PathVariable("serviceName") @NotBlank String serviceName,
        @PathVariable("name") @NotBlank String pluginName) {
        deleteInstance(WasmPluginInstanceScope.SERVICE, serviceName, pluginName);
    }

    /**
     * 列出指定作用域和目标的插件实例
     * @param scope 插件实例作用域
     * @param target 目标对象（域名、路由或服务名称）
     * @return 插件实例列表响应
     */
    private ResponseEntity<PaginatedResponse<WasmPluginInstance>> listInstances(WasmPluginInstanceScope scope,
        String target) {
        // 获取插件实例列表并过滤掉内部插件实例
        List<WasmPluginInstance> instances = wasmPluginInstanceService.list(scope, target).
                stream().filter(instance -> !instance.isInternal()).collect(Collectors.toList());
        // 构建分页响应实体
        return ControllerUtil.buildResponseEntity(PaginatedResult.createFromFullList(instances, null));
    }

    /**
     * 查询指定作用域、目标和插件名称的插件实例
     * @param scope 插件实例作用域
     * @param target 目标对象
     * @param name 插件名称
     * @return 插件实例响应
     */
    private ResponseEntity<Response<WasmPluginInstance>> queryInstance(WasmPluginInstanceScope scope, String target,
        String name) {
        // 查询插件实例
        WasmPluginInstance instance = wasmPluginInstanceService.query(scope, target, name, false);
        // 如果实例不存在，创建一个默认的禁用实例
        if (instance == null) {
            instance = WasmPluginInstance.builder().pluginName(name).internal(false).enabled(false).build();
            instance.setTarget(scope, target);
        }
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(instance);
    }

    /**
     * 添加或更新插件实例
     * @param scope 插件实例作用域
     * @param target 目标对象
     * @param name 插件名称
     * @param instance 插件实例对象
     * @return 更新后的插件实例响应
     */
    private ResponseEntity<Response<WasmPluginInstance>> addOrUpdateInstance(WasmPluginInstanceScope scope,
        String target, String name, WasmPluginInstance instance) {
        // 设置插件名称
        if (StringUtils.isEmpty(instance.getPluginName())) {
            instance.setPluginName(name);
        } else if (!StringUtils.equals(name, instance.getPluginName())) {
            throw new ValidationException("Plugin name in the URL doesn't match the one in the body.");
        }
        // 禁止更新内部插件实例
        if (instance.isInternal()) {
            throw new ValidationException("Updating an internal Wasm plugin instance is not allowed.");
        }
        // 验证插件是否存在
        WasmPlugin plugin = wasmPluginService.query(name, null);
        if (plugin == null) {
            throw new ValidationException("Unsupported plugin: " + name);
        }
        // 设置目标作用域
        instance.setTarget(scope, target);
        // 调用服务添加或更新插件实例
        instance = wasmPluginInstanceService.addOrUpdate(instance);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(instance);
    }

    /**
     * 删除插件实例
     * @param scope 插件实例作用域
     * @param target 目标对象
     * @param name 插件名称
     */
    private void deleteInstance(WasmPluginInstanceScope scope, String target, String name) {
        // 调用服务删除插件实例
        wasmPluginInstanceService.delete(scope, target, name);
    }

    /**
     * 验证域名名称的有效性
     * @param domainName 域名名称
     */
    private void validateDomainName(String domainName) {
        // 检查域名是否为空
        if (StringUtils.isEmpty(domainName)) {
            throw new ValidationException("Domain name is required.");
        }
        // 检查域名是否存在
        if (domainService.query(domainName) == null) {
            throw new ValidationException("Unknown domain: " + domainName);
        }
    }

    /**
     * 验证路由名称的有效性
     * @param routeName 路由名称
     */
    private void validateRouteName(String routeName) {
        // 检查路由名称是否为空
        if (StringUtils.isEmpty(routeName)) {
            throw new ValidationException("Route name is required.");
        }
        // 检查路由是否存在
        if (routeService.query(routeName) == null) {
            throw new ValidationException("Unknown route: " + routeName);
        }
    }

    /**
     * 验证服务名称的有效性
     * @param serviceName 服务名称
     */
    private void validateServiceName(String serviceName) {
        // 检查服务名称是否为空
        if (StringUtils.isEmpty(serviceName)) {
            throw new ValidationException("Service name is required.");
        }
        // 获取所有服务并检查指定服务是否存在
        PaginatedResult<Service> services = serviceService.list(null);
        if (services.getData() != null && services.getData().stream().noneMatch(s -> serviceName.equals(s.getName()))) {
            throw new ValidationException("Unknown service: " + serviceName);
        }
    }
}
