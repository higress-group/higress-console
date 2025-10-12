package com.alibaba.higress.console.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户数据模型
 * 用于封装用户的基本信息和认证数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * 用户名
     * 用户登录系统的唯一标识符
     */
    private String name;

    /**
     * 用户密码
     * 用户登录系统的凭证信息
     */
    private String password;

    /**
     * 用户显示名称
     * 在界面中显示给其他用户的名称
     */
    private String displayName;

    /**
     * 用户头像URL
     * 指向用户头像图片的URL地址
     */
    private String avatarUrl;
}
