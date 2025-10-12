package com.alibaba.higress.console.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录请求数据传输对象
 * 用于封装用户登录时提交的请求数据
 *
 * @author CH3CHO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Login Request")
public class LoginRequest {

    /**
     * 用户名
     * 用户登录系统的唯一标识符
     */
    @Schema(description = "Username")
    private String username;

    /**
     * 密码
     * 用户登录系统的凭证
     */
    @Schema(description = "Password")
    private String password;

    /**
     * 自动登录标识
     * 控制用户在打开新浏览器窗口时是否自动登录
     */
    @Schema(description = "Whether to automatically log in when opening a new browser window.")
    private Boolean autoLogin;
}
