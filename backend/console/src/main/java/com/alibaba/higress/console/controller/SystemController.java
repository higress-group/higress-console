package com.alibaba.higress.console.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.constant.UserConfigKey;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.SystemInitRequest;
import com.alibaba.higress.console.controller.dto.UpdateHigressConfigRequest;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.model.SystemInfo;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.service.ConfigService;
import com.alibaba.higress.console.service.SystemService;
import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 系统控制器，用于管理系统初始化、系统信息获取和系统配置管理等操作
 * 提供系统级别的API接口
 */
@RestController("SystemController")
@RequestMapping("/system")
@Validated
@Tag(name = "System APIs")
public class SystemController {

    /**
     * 配置服务类，用于处理系统配置相关业务逻辑
     */
    private ConfigService configService;

    /**
     * 系统服务类，用于处理系统级别业务逻辑
     */
    private SystemService systemService;

    /**
     * 注入配置服务
     * @param configService 配置服务实例
     */
    @Autowired
    public void setConfigService(ConfigService configService) {
        this.configService = configService;
    }

    /**
     * 注入系统服务
     * @param systemService 系统服务实例
     */
    @Autowired
    public void setSystemService(SystemService systemService) {
        this.systemService = systemService;
    }

    /**
     * 系统初始化接口
     * 用于首次部署时初始化系统，包括创建管理员用户和设置初始配置
     * @param request 系统初始化请求参数，包含管理员用户信息和配置信息
     * @return 初始化成功响应
     */
    @PostMapping("/init")
    @Operation(summary = "Initialize")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "System initialized successfully."),
        @ApiResponse(responseCode = "400", description = "Incomplete initialization data."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<?> initialize(@RequestBody SystemInitRequest request) {
        // 获取管理员用户信息
        User adminUser = request.getAdminUser();
        // 验证管理员用户信息是否存在
        if (adminUser == null) {
            throw new ValidationException("Missing adminUser.");
        }
        // 验证管理员用户必要字段是否完整
        if (StringUtils.isAnyEmpty(adminUser.getName(), adminUser.getDisplayName(), adminUser.getPassword())) {
            throw new ValidationException("Incomplete adminUser object.");
        }

        // 调用系统服务执行系统初始化
        systemService.initSystem(adminUser, request.getConfigs());

        // 返回初始化成功响应
        return ControllerUtil.buildSuccessResponseEntity();
    }

    /**
     * 获取系统信息接口
     * 返回系统的基本信息，如版本号、运行状态等
     * @return 系统信息响应
     */
    @GetMapping("/info")
    @Operation(summary = "Get system info")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "System info retrieved successfully."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<SystemInfo> info() {
        // 调用系统服务获取系统信息
        SystemInfo info = systemService.getSystemInfo();
        // 返回系统信息
        return ResponseEntity.ok(info);
    }

    /**
     * 获取系统配置接口
     * 返回所有用户可配置的系统参数及其当前值
     * @return 系统配置映射响应
     */
    @GetMapping("/config")
    @Operation(summary = "Get system configurations")
    @ApiResponses(
        value = {@ApiResponse(responseCode = "200", description = "System configurations retrieved successfully."),
            @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<Map<String, Object>>> getConfigs() {
        // 获取所有配置键列表
        List<String> keys = configService.getConfigKeys();
        Map<String, Object> configs;
        // 如果配置键列表为空，返回空映射
        if (CollectionUtils.isEmpty(keys)) {
            configs = Collections.emptyMap();
        } else {
            // 创建配置映射，根据配置键的类型获取对应的值
            configs = new HashMap<>(keys.size());
            for (String key : keys) {
                // 获取配置键对应的值类型
                Class<?> type = UserConfigKey.getConfigValueType(key);
                if (type == null) {
                    type = String.class;
                }
                Object value;
                // 根据类型获取对应类型的配置值
                if (type == Boolean.class) {
                    value = configService.getBoolean(key);
                } else if (type == Integer.class) {
                    value = configService.getInteger(key);
                } else if (type == Long.class) {
                    value = configService.getLong(key);
                } else {
                    value = configService.getString(key);
                }
                configs.put(key, value);
            }
        }
        // 返回成功响应包含配置映射
        return ResponseEntity.ok(Response.success(configs));
    }

    /**
     * 获取Higress配置接口
     * 返回higress-config ConfigMap的内容
     * @return Higress配置内容响应
     */
    @GetMapping("/higress-config")
    @Operation(summary = "Get the content of higress-config ConfigMap")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "higress-config retrieved successfully."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> getHigressConfig() {
        // 调用系统服务获取Higress配置内容
        return ResponseEntity.ok(Response.success(systemService.getHigressConfig()));
    }

    /**
     * 更新Higress配置接口
     * 用于更新higress-config ConfigMap的内容
     * @param request 更新Higress配置请求参数，包含新的配置内容
     * @return 更新后的Higress配置内容响应
     */
    @PutMapping("/higress-config")
    @Operation(summary = "Update the content of higress-config ConfigMap")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "higress-config updated successfully."),
        @ApiResponse(responseCode = "400", description = "Config data is not valid"),
        @ApiResponse(responseCode = "409", description = "Config data has been updated by someone else."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<String>> updateHigressConfig(@RequestBody UpdateHigressConfigRequest request) {
        // 获取配置内容
        String config = request.getConfig();
        // 验证配置内容是否为空
        if (StringUtils.isEmpty(config)) {
            throw new ValidationException("Missing required parameter: config");
        }
        // 调用系统服务更新Higress配置
        String updatedConfig = systemService.setHigressConfig(config);
        // 返回更新后的配置内容
        return ResponseEntity.ok(Response.success(updatedConfig));
    }
}
