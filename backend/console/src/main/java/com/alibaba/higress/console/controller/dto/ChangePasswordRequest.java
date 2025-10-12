package com.alibaba.higress.console.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 修改密码请求数据传输对象
 * 用于封装用户修改密码时提交的请求数据
 *
 * @author CH3CHO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Change Password Request")
public class ChangePasswordRequest {

    /**
     * 用户的旧密码
     * 用于验证用户身份，确保是本人操作
     */
    @Schema(description = "Old password")
    private String oldPassword;

    /**
     * 用户的新密码
     * 将替换用户的旧密码
     */
    @Schema(description = "New password")
    private String newPassword;
}
