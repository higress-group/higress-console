package com.alibaba.higress.console.controller.mcp;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.ValidationException;
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
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;
import com.alibaba.higress.sdk.model.mcp.SwaggerContent;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.alibaba.higress.sdk.service.mcp.McpServerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * MCP服务器管理控制器
 * 提供对MCP（Multi-Cluster Plane）服务器实例的管理功能，包括增删改查、消费者管理等
 *
 * @author HecarimV
 */
@RestController("McpServerController")
@RequestMapping("/v1/mcpServer")
@Validated
@Tag(name = "Mcp APIs")
public class McpServerController {

    /**
     * MCP服务器服务实例
     * 用于处理MCP服务器的核心业务逻辑
     */
    @Resource
    private McpServerService mcpServerService;

    /**
     * MCP服务器辅助工具实例
     * 提供MCP服务器相关的辅助功能，如Swagger转MCP配置等
     */
    @Resource
    private McpServerHelper mcpServerHelper;

    /**
     * 将Swagger内容转换为MCP配置
     *
     * @param swaggerContent 包含Swagger定义内容的请求对象
     * @return 转换后的MCP配置字符串响应实体
     */
    @PostMapping("/swaggerToMcpConfig")
    @Operation(summary = "swagger to mcp config")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "swagger convert successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<String>> swaggerToMcpConfig(@Valid @RequestBody SwaggerContent swaggerContent) {
        return ResponseEntity.ok(Response.success(mcpServerHelper.swaggerToMcpConfig(swaggerContent.getContent())));
    }

    /**
     * 添加或更新MCP服务器实例
     *
     * @param instance 待添加或更新的MCP服务器实例
     * @return 添加或更新后的MCP服务器实例响应实体
     */
    @PutMapping
    @Operation(summary = "Add or update a mcp server instance")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Instances saved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<McpServer>> addOrUpdateMcpInstance(@RequestBody McpServer instance) {
        instance = mcpServerService.addOrUpdateWithAuthorization(instance);
        return ControllerUtil.buildResponseEntity(instance);
    }

    /**
     * 列出所有MCP服务器实例
     *
     * @param query MCP服务器分页查询参数
     * @return 包含MCP服务器实例分页结果的响应实体
     */
    @GetMapping
    @Operation(summary = "List mcp server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "McpServers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<McpServer>> list(@ParameterObject McpServerPageQuery query) {
        return ControllerUtil.buildResponseEntity(mcpServerService.list(query));
    }

    /**
     * 根据名称查询MCP服务器实例详情
     *
     * @param name MCP服务器实例名称
     * @return 指定MCP服务器实例的详细信息响应实体
     */
    @GetMapping("/{name}")
    @Operation(summary = "Get detail for mcp server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "McpServer detail query successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<McpServer>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(mcpServerService.query(name));
    }

    /**
     * 删除指定名称的MCP服务器实例
     *
     * @param name 待删除的MCP服务器实例名称
     * @return 删除成功的响应实体
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a mcp server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Route deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> delete(@PathVariable("name") @NotBlank String name) {
        mcpServerService.delete(name);
        return ResponseEntity.noContent().build();
    }

    /**
     * 为MCP服务器添加允许的消费者
     *
     * @param consumers 包含MCP服务器和消费者信息的对象
     * @return 添加成功的响应实体
     */
    @PutMapping("/consumers")
    @Operation(summary = "Add mcp server allow consumers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Add mcp server allow consumers successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> addAllowConsumers(@RequestBody McpServerConsumers consumers) {
        mcpServerService.addAllowConsumers(consumers);
        return ResponseEntity.noContent().build();
    }

    /**
     * 删除MCP服务器允许的消费者
     *
     * @param consumers 包含MCP服务器和消费者信息的对象
     * @return 删除成功的响应实体
     */
    @DeleteMapping("/consumers")
    @Operation(summary = "Delete mcp server allow consumers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Delete mcp server allow consumers successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteAllowConsumers(@RequestBody McpServerConsumers consumers) {
        mcpServerService.deleteAllowConsumers(consumers);
        return ResponseEntity.noContent().build();
    }

    /**
     * 列出MCP服务器允许的消费者列表
     *
     * @param query MCP服务器消费者分页查询参数
     * @return 包含消费者详情分页结果的响应实体
     */
    @GetMapping("/consumers")
    @Operation(summary = "List mcp server allow consumers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List mcp server allow consumers successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<McpServerConsumerDetail>> listAllowConsumers(
            @ParameterObject McpServerConsumersPageQuery query) {
        // 验证MCP服务器名称不能为空
        if (StringUtils.isEmpty(query.getMcpServerName())){
            throw new ValidationException("mcpServerName is empty");
        }
        return ControllerUtil.buildResponseEntity(mcpServerService.listAllowConsumers(query));
    }
}
