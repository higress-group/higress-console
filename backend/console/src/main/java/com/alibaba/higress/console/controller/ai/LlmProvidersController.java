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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * LLM Providers管理控制器，提供对大语言模型提供商的CRUD操作接口
 */
@RestController("LlmProvidersController")
@RequestMapping("/v1/ai/providers")
@Validated
@Tag(name = "LLM Provider APIs")
public class LlmProvidersController {

    /**
     * LLM Provider服务接口实例，用于处理业务逻辑
     */
    private LlmProviderService llmProviderService;

    /**
     * 注入LlmProviderService依赖
     *
     * @param llmProviderService LLM Provider服务实例
     */
    @Resource
    public void setLlmProviderService(LlmProviderService llmProviderService) {
        this.llmProviderService = llmProviderService;
    }

    /**
     * 获取LLM Providers列表
     *
     * @param query 分页查询参数
     * @return 包含LLM Providers分页结果的响应实体
     */
    @GetMapping
    @Operation(summary = "List LLM providers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Providers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<LlmProvider>> list(@RequestParam(required = false) CommonPageQuery query) {
        // 调用服务层获取LLM Providers列表
        PaginatedResult<LlmProvider> providers = llmProviderService.list(query);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(providers);
    }

    /**
     * 添加新的LLM Provider
     *
     * @param provider 待添加的LLM Provider对象
     * @return 添加成功的LLM Provider响应实体
     */
    @PostMapping
    @Operation(summary = "Add a new route")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Route added successfully"),
        @ApiResponse(responseCode = "400", description = "Route data is not valid"),
        @ApiResponse(responseCode = "409", description = "Route already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<LlmProvider>> add(@RequestBody LlmProvider provider) {
        // 调用服务层添加或更新LLM Provider
        LlmProvider newProvider = llmProviderService.addOrUpdate(provider);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(newProvider);
    }

    /**
     * 根据名称查询LLM Provider
     *
     * @param name LLM Provider名称
     * @return 查询到的LLM Provider响应实体
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get LLM provider by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Provider found"),
        @ApiResponse(responseCode = "404", description = "Provider not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<LlmProvider>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务层根据名称查询LLM Provider
        LlmProvider provider = llmProviderService.query(name);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(provider);
    }

    /**
     * 更新已存在的LLM Provider
     *
     * @param name LLM Provider名称（来自URL路径）
     * @param provider 待更新的LLM Provider对象
     * @return 更新后的LLM Provider响应实体
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed provider")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Provider updated successfully"),
        @ApiResponse(responseCode = "400", description = "Provider data is not valid or provider name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<LlmProvider>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody LlmProvider provider) {
        // 验证URL中的名称与请求体中的名称是否一致
        if (StringUtils.isNotEmpty(provider.getName())) {
            provider.setName(name);
        } else if (!StringUtils.equals(name, provider.getName())) {
            throw new ValidationException("Provider name in the URL doesn't match the one in the body.");
        }
        // 调用服务层添加或更新LLM Provider
        LlmProvider updatedProvider = llmProviderService.addOrUpdate(provider);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(updatedProvider);
    }

    /**
     * 删除指定名称的LLM Provider
     *
     * @param name 待删除的LLM Provider名称
     * @return 删除成功的响应实体
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete an LLM provider")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Provider deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<LlmProvider>> delete(@PathVariable("name") @NotBlank String name) {
        // 调用服务层删除指定名称的LLM Provider
        llmProviderService.delete(name);
        // 返回无内容的成功响应
        return ResponseEntity.noContent().build();
    }
}
