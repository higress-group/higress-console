/**
 * 用户管理服务模块
 * 提供用户相关的 API 接口，包括用户登录、退出、信息获取、密码修改等功能
 * 基于 HTTP 请求服务封装，提供类型安全的用户管理操作
 */

// 导入用户相关的类型定义
import type { ChangePasswordParams, LoginParams, UserInfo } from '@/interfaces/user';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 用户登录
 * 使用用户名和密码进行用户认证
 * 
 * @param data - 登录参数，包含用户名和密码
 * @returns 返回用户信息，包含用户的基本信息和认证令牌
 */
export async function login(data: LoginParams): Promise<UserInfo> {
  return await request.post('/session/login', data);
}

/**
 * 用户退出登录
 * 清除用户的登录状态和会话信息
 * 
 * @returns 返回退出登录的操作结果
 */
export async function logout() {
  return await request.get('/session/logout');
}

/**
 * 获取当前用户信息
 * 从服务器获取当前登录用户的详细信息
 * 
 * @returns 返回当前用户的信息对象
 */
export async function fetchUserInfo(): Promise<UserInfo> {
  return await request.get('/user/info');
}

/**
 * 修改用户密码
 * 更新当前用户的登录密码
 * 
 * @param data - 密码修改参数，包含旧密码和新密码
 * @returns 返回密码修改的操作结果
 */
export async function changePassword(data: ChangePasswordParams): Promise<any> {
  return await request.post('/user/changePassword', data);
}
