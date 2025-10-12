package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
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
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 消费者管理控制器
 * 提供对API消费者的CRUD操作接口，包括创建、查询、更新和删除消费者
 */
@RestController("ConsumersController")
@RequestMapping("/v1/consumers")
@Validated
@Tag(name = "Consumer APIs")
public class ConsumersController {

    /**
     * 消费者服务实例
     * 用于处理消费者相关的业务逻辑
     */
    private ConsumerService consumerService;

    /**
     * 注入消费者服务依赖
     *
     * @param consumerService 消费者服务实例
     */
    @Resource
    public void setConsumerService(ConsumerService consumerService) {
        this.consumerService = consumerService;
    }

    /**
     * 获取消费者列表
     * 支持分页查询所有消费者信息
     *
     * @param query 分页查询参数
     * @return 包含消费者分页结果的响应实体
     */
    @GetMapping
    @Operation(summary = "List consumers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Consumers listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<PaginatedResponse<Consumer>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务层获取消费者列表
        PaginatedResult<Consumer> consumers = consumerService.list(query);
        // 构建并返回分页响应实体
        return ControllerUtil.buildResponseEntity(consumers);
    }

    /**
     * 添加新的消费者
     * 创建一个新的API消费者并保存到系统中
     *
     * @param consumer 待添加的消费者对象
     * @return 添加成功的消费者响应实体
     */
    @PostMapping
    @Operation(summary = "Add a consumer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Consumer added successfully"),
        @ApiResponse(responseCode = "400", description = "Consumer data is not valid"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Consumer>> add(@RequestBody Consumer consumer) {
        // 验证消费者数据的有效性
        consumer.validate(false);
        // 调用服务层添加或更新消费者
        Consumer newConsumer = consumerService.addOrUpdate(consumer);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(newConsumer);
    }

    /**
     * 根据名称查询消费者
     * 获取指定名称的消费者详细信息
     *
     * @param name 消费者名称
     * @return 查询到的消费者响应实体
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get consumer by name")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Consumer found"),
        @ApiResponse(responseCode = "404", description = "Consumer not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Consumer>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务层根据名称查询消费者
        Consumer consumer = consumerService.query(name);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(consumer);
    }

    /**
     * 更新已存在的消费者
     * 修改指定名称的消费者信息
     *
     * @param name 消费者名称（来自URL路径）
     * @param consumer 待更新的消费者对象
     * @return 更新后的消费者响应实体
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed consumer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Consumer updated successfully"),
        @ApiResponse(responseCode = "400", description = "Consumer data is not valid"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Consumer>> put(@PathVariable("name") @NotBlank String name,
        @RequestBody Consumer consumer) {
        // 验证URL中的名称与请求体中的名称是否一致
        if (StringUtils.isNotEmpty(consumer.getName())) {
            consumer.setName(name);
        } else if (!StringUtils.equals(name, consumer.getName())) {
            throw new ValidationException("Consumer name in the URL doesn't match the one in the body.");
        }
        // 验证消费者数据的有效性（更新模式）
        consumer.validate(true);
        // 调用服务层添加或更新消费者
        Consumer updatedConsumer = consumerService.addOrUpdate(consumer);
        // 构建并返回响应实体
        return ControllerUtil.buildResponseEntity(updatedConsumer);
    }

    /**
     * 删除指定名称的消费者
     * 从系统中移除指定的消费者
     *
     * @param name 待删除的消费者名称
     * @return 删除成功的响应实体
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a consumer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Consumer deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Response<Consumer>> delete(@PathVariable("name") @NotBlank String name) {
        // 调用服务层删除指定名称的消费者
        consumerService.delete(name);
        // 返回无内容的成功响应
        return ResponseEntity.noContent().build();
    }
}
