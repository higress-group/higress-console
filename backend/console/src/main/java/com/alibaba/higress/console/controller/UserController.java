package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.ChangePasswordRequest;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.SessionService;
import com.alibaba.higress.console.service.SessionUserHelper;

/**
 * 用户控制器，用于处理用户相关信息的API接口
 * 提供获取用户信息和修改密码等用户管理功能
 */
@RestController("UserController")
@RequestMapping("/user")
@Tag(name = "User APIs")
public class UserController {

    /**
     * 会话服务类，用于处理用户会话相关的业务逻辑
     */
    private SessionService sessionService;

    /**
     * 注入会话服务
     * @param sessionService 会话服务实例
     */
    @Resource
    public void setSessionService(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * 获取当前登录用户信息接口
     * 从会话中获取当前用户的详细信息
     * @return 当前用户信息响应
     */
    @GetMapping("/info")
    @Operation(summary = "Get user info")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "User info retrieved successfully."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<User>> getUserInfo() {
        // 从会话中获取当前用户信息
        User user = SessionUserHelper.getCurrentUser();
        // 构建并返回用户信息响应
        return ControllerUtil.buildResponseEntity(user);
    }

    /**
     * 修改用户密码接口
     * 允许用户修改自己的登录密码
     * @param request 修改密码请求参数，包含旧密码和新密码
     * @param response HTTP响应对象，用于清除会话cookie
     * @return 密码修改成功响应
     */
    @PostMapping("/changePassword")
    @Operation(summary = "Change password")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Password changed successfully."),
        @ApiResponse(responseCode = "404", description = "Invalid request data"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<?> logout(@RequestBody ChangePasswordRequest request, HttpServletResponse response) {
        // 验证旧密码是否为空
        if (StringUtils.isEmpty(request.getOldPassword())) {
            throw new ValidationException("Missing old password.");
        }
        // 验证新密码是否为空
        if (StringUtils.isEmpty(request.getNewPassword())) {
            throw new ValidationException("Missing new password.");
        }
        // 获取当前登录用户
        User user = SessionUserHelper.getCurrentUser();
        // 调用会话服务修改用户密码
        sessionService.changePassword(user.getName(), request.getOldPassword(), request.getNewPassword());
        // 清除会话信息，用户需要重新登录
        sessionService.clearSession(response);
        // 构建并返回成功响应
        return ControllerUtil.buildSuccessResponseEntity();
    }
}
