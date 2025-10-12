package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.collections4.CollectionUtils;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
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
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ServiceSource;
import com.alibaba.higress.sdk.service.ServiceSourceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 服务来源控制器，用于管理服务来源（Service Source）的CRUD操作
 * 提供服务来源的增删改查接口
 */
@RestController("ServiceSourceController")
@RequestMapping("/v1/service-sources")
@Tag(name = "Service Source APIs")
public class ServiceSourceController {

    /**
     * 服务来源服务类，用于处理业务逻辑
     */
    @Resource
     ServiceSourceService serviceSourceService;

    /**
     * 获取服务来源列表
     * @param query 分页查询参数
     * @return 分页的服务来源列表响应
     */
    @GetMapping
    @Operation(summary = "List service sources")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Service sources listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<ServiceSource>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务获取服务来源列表
        PaginatedResult<ServiceSource> result = serviceSourceService.list(query);
        // 清除敏感信息
        if (CollectionUtils.isNotEmpty(result.getData())) {
            result.getData().forEach(this::stripSensitiveInfo);
        }
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(result);
    }

    /**
     * 添加新的服务来源
     * @param serviceSource 服务来源对象
     * @return 添加后的服务来源响应
     */
    @PostMapping
    @Operation(summary = "Add a new service source")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Service source added successfully"),
        @ApiResponse(responseCode = "400", description = "Service source data is not valid"),
        @ApiResponse(responseCode = "409", description = "Service source already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<ServiceSource>> add(@RequestBody ServiceSource serviceSource) {
        // 验证服务来源数据有效性
        if (!serviceSource.isValid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        // 禁止添加内部服务来源
        if (serviceSource.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Adding an internal service source is not allowed.");
        }
        // 调用服务添加服务来源
        ServiceSource finalServiceSource = serviceSourceService.add(serviceSource);
        // 清除敏感信息
        stripSensitiveInfo(finalServiceSource);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(finalServiceSource);
    }

    /**
     * 更新已存在的服务来源
     * @param name 服务来源名称
     * @param serviceSource 服务来源对象
     * @return 更新后的服务来源响应
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed service source")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Service source updated successfully"),
        @ApiResponse(responseCode = "400", description = "Service source data is not valid"),
        @ApiResponse(responseCode = "409", description = "Service source trying to add already existed"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<ServiceSource>> addOrUpdate(@PathVariable("name") @NotBlank String name,
        @RequestBody ServiceSource serviceSource) {
        // 设置服务来源名称
        serviceSource.setName(name);
        // 验证服务来源数据有效性
        if (!serviceSource.isValid()) {
            throw new ValidationException("serviceSource body is not valid.");
        }
        // 禁止更新内部服务来源
        if (serviceSource.getName().endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Updating an internal service source is not allowed.");
        }
        // 调用服务更新服务来源
        ServiceSource finalServiceSource = serviceSourceService.addOrUpdate(serviceSource);
        // 清除敏感信息
        stripSensitiveInfo(finalServiceSource);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(finalServiceSource);
    }

    /**
     * 删除服务来源
     * @param name 服务来源名称
     * @return 删除响应
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a service source")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "Service source deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Deleting an internal service source is not allowed."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<ServiceSource>> delete(@PathVariable("name") @NotBlank String name) {
        // 禁止删除内部服务来源
        if (name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            throw new ValidationException("Deleting an internal service source is not allowed.");
        }
        // 调用服务删除服务来源
        serviceSourceService.delete(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }

    /**
     * 根据名称查询服务来源
     * @param name 服务来源名称
     * @return 服务来源响应
     */
    @GetMapping("/{name}")
    @Operation(summary = "Get service source by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Service source found"),
        @ApiResponse(responseCode = "404", description = "Service source not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<ServiceSource>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务查询服务来源
        ServiceSource source = serviceSourceService.query(name);
        // 清除敏感信息
        stripSensitiveInfo(source);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(source);
    }

    /**
     * 清除服务来源中的敏感信息
     * @param source 服务来源对象
     */
    private void stripSensitiveInfo(ServiceSource source) {
        // 如果服务来源或认证信息为空，则直接返回
        if (source == null || source.getAuthN() == null) {
            return;
        }
        // 清除认证属性中的敏感信息
        source.getAuthN().setProperties(null);
    }
}
