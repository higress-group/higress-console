/**
 * 用户相关接口定义文件
 * 定义了用户信息、登录参数、密码修改等相关的数据结构
 * 这些接口用于描述用户管理相关的数据模型
 */

/**
 * 用户信息接口
 * 定义了用户的基本信息数据结构
 */
export interface UserInfo {
  username: string;              // 用户名，用户的唯一标识
  displayName: string;           // 显示名称，用于界面展示的用户名称
  type?: 'user' | 'admin' | 'guest'; // 用户类型：普通用户、管理员、访客（可选）
  avatarUrl?: string;            // 用户头像 URL 地址（可选）
}

/**
 * 登录参数接口
 * 定义了用户登录时所需的参数数据结构
 */
export interface LoginParams {
  username: string;  // 用户名
  password: string;  // 密码
}

/**
 * 密码修改参数接口
 * 定义了用户修改密码时所需的参数数据结构
 */
export interface ChangePasswordParams {
  oldPassword: string; // 旧密码，用于验证用户身份
  newPassword: string; // 新密码，用户想要设置的新密码
}
