package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.lang3.StringUtils;
import org.springdoc.api.annotations.ParameterObject;
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
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.DomainService;
import com.alibaba.higress.sdk.service.RouteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 域名管理控制器
 * 提供对域名资源的CRUD操作接口，包括创建、查询、更新、删除域名以及查询绑定到域名的路由
 */
@RestController("DomainsController")
@RequestMapping("/v1/domains")
@Validated
@Tag(name = "Domain APIs")
public class DomainsController {

    /**
     * 域名服务实例
     * 用于处理域名相关的业务逻辑
     */
    @Resource
    private DomainService domainService;

    /**
     * 路由服务实例
     * 用于处理与域名关联的路由相关业务逻辑
     */
    @Resource
    private RouteService routeService;

    /**
     * 获取域名列表
     * 支持分页查询所有域名信息
     *
     * @param query 分页查询参数
     * @return 包含域名分页结果的响应实体
     */
    @GetMapping
    @Operation(summary = "List domains")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Domains listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Domain>> list(@ParameterObject CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(domainService.list(query));
    }

    /**
     * 添加新的域名
     * 创建一个新的域名资源并保存到系统中
     *
     * @param domain 待添加的域名对象
     * @return 添加成功的域名响应实体
     */
    @PostMapping
    @Operation(summary = "Add a new domain")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Domain added successfully"),
        @ApiResponse(responseCode = "400", description = "Domain data is not valid"),
        @ApiResponse(responseCode = "409", description = "Domain already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Domain>> add(@RequestBody Domain domain) {
        return ControllerUtil.buildResponseEntity(domainService.add(domain));
    }

    /**
     * 根据名称查询域名
     * 获取指定名称的域名详细信息
     *
     * @param name 域名名称
     * @return 查询到的域名响应实体
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get domain by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Domain found"),
        @ApiResponse(responseCode = "404", description = "Domain not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Domain>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(domainService.query(name));
    }

    /**
     * 更新已存在的域名
     * 修改指定名称的域名信息
     *
     * @param domainName 域名名称（来自URL路径）
     * @param domain 待更新的域名对象
     * @return 更新后的域名响应实体
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed domain")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Domain updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "Domain data is not valid or domain name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "Domain already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Domain>> put(@PathVariable("name") @NotBlank String domainName,
        @RequestBody Domain domain) {
        // 验证URL中的域名名称与请求体中的域名名称是否一致
        if (StringUtils.isEmpty(domain.getName())) {
            domain.setName(domainName);
        } else if (!StringUtils.equals(domainName, domain.getName())) {
            throw new ValidationException("Domain name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(domainService.put(domain));
    }

    /**
     * 删除指定名称的域名
     * 从系统中移除指定的域名资源
     *
     * @param name 待删除的域名名称
     * @return 删除成功的响应实体
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a domain")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Domain deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Domain>> delete(@PathVariable("name") @NotBlank String name) {
        domainService.delete(name);
        return ResponseEntity.noContent().build();
    }

    /**
     * 查询绑定到指定域名的路由列表
     * 获取与特定域名关联的所有路由信息
     *
     * @param name 域名名称
     * @param commonPageQuery 通用分页查询参数
     * @return 包含路由分页结果的响应实体
     */
    @GetMapping(value = "/{name}/routes")
    @Operation(summary = "List routes bound with a domain")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Routes listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Route>> queryRoutes(@PathVariable("name") @NotBlank String name,
        CommonPageQuery commonPageQuery) {
        // 构建路由分页查询对象，设置域名名称作为查询条件
        RoutePageQuery routePageQuery = new RoutePageQuery();
        routePageQuery.setDomainName(name);
        // 复制分页参数
        if (commonPageQuery != null) {
            routePageQuery.setPageSize(commonPageQuery.getPageSize());
            routePageQuery.setPageNum(commonPageQuery.getPageNum());
        }
        // 调用路由服务获取绑定到该域名的路由列表
        return ControllerUtil.buildResponseEntity(routeService.list(routePageQuery));
    }
}
