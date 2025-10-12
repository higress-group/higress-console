/**
 * 系统相关接口定义文件
 * 定义了系统初始化、用户信息等相关的数据结构
 * 这些接口用于描述系统管理相关的数据模型
 */

/**
 * 系统用户信息接口
 * 定义了系统初始化时管理员用户的信息结构
 * 注意：此接口与用户模块的 UserInfo 接口类似但用途不同
 */
export interface UserInfo {
  name: string;                  // 用户名，用户的唯一标识
  displayName: string;           // 显示名称，用于界面展示的用户名称
  password?: string;             // 密码（可选），仅在初始化时设置
  type?: 'user' | 'admin' | 'guest'; // 用户类型：普通用户、管理员、访客（可选）
  avatarUrl?: string;            // 用户头像 URL 地址（可选）
}

/**
 * 系统初始化参数接口
 * 定义了系统初始化时所需的参数数据结构
 */
export interface InitParams {
  adminUser: UserInfo;  // 管理员用户信息，系统初始化时必须创建管理员账户
  configs?: object;     // 系统配置（可选），初始化时的额外配置参数
}
