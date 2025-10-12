package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.LoginRequest;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.exception.AuthException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.model.User;
import com.alibaba.higress.console.service.SessionService;
import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * 会话控制器，用于处理用户登录和登出操作
 * 提供用户身份验证和会话管理功能
 */
@RestController("SessionController")
@RequestMapping("/session")
@Tag(name = "Session APIs")
public class SessionController {

    /**
     * 会话服务类，用于处理具体的登录登出业务逻辑
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
     * 用户登录接口
     * @param request 登录请求参数，包含用户名和密码
     * @param response HTTP响应对象，用于设置会话cookie
     * @return 登录成功后的用户信息响应
     */
    @PostMapping("/login")
    @Operation(summary = "Login")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Logged in successfully."),
        @ApiResponse(responseCode = "400", description = "Missing user name or password."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<User>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        // 验证用户名和密码是否为空
        if (StringUtils.isEmpty(request.getUsername()) || StringUtils.isEmpty(request.getPassword())) {
            throw new ValidationException("Missing user name or password.");
        }

        // 调用会话服务进行用户认证
        User user = sessionService.login(request.getUsername(), request.getPassword());
        // 认证失败则抛出认证异常
        if (user == null) {
            throw new AuthException("Incorrect username or password");
        }
        // 保存会话信息到响应中
        sessionService.saveSession(response, user, Boolean.TRUE.equals(request.getAutoLogin()));
        // 构建并返回成功响应
        return ControllerUtil.buildResponseEntity(user);
    }

    /**
     * 用户登出接口
     * @param response HTTP响应对象，用于清除会话cookie
     * @return 登出成功响应
     */
    @GetMapping("/logout")
    @Operation(summary = "Logout")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Logged out successfully."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // 清除会话信息
        sessionService.clearSession(response);
        // 构建并返回成功响应
        return ControllerUtil.buildSuccessResponseEntity();
    }
}
