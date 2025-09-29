import type { ChangePasswordParams, LoginParams, UserInfo } from '@/interfaces/user';
// import request from './request';
import bffRequest from './bffRequest';

export async function login(data: LoginParams): Promise<UserInfo> {
  // return await request.post('/session/login', data);
  return await bffRequest.post('/bff/session/login', data);// 改成bff/session/login
}

export async function logout() {
  // return await request.get('/session/logout');
  return await bffRequest.get('/bff/session/logout');// 改成bff/session/logout
}

export async function fetchUserInfo(): Promise<UserInfo> {
  // return await request.get('/user/info');
  return await bffRequest.get('/bff/user/info');// 改成bff/user/info
}

export async function changePassword(data: ChangePasswordParams): Promise<any> {
  // return await request.post('/user/changePassword', data);
  return await bffRequest.post('/bff/user/changePassword', data);// 改成bff/user/changePassword
}
