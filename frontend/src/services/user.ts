import type { LoginParams, UserInfo } from '@/interfaces/user';
import request from './request';

export async function login(data: LoginParams): Promise<UserInfo> {
  return await request.post('/session/login', data);
}

export async function fetchUserInfo(): Promise<UserInfo> {
  return await request.get('/session/check');
}

export async function logout() {
  return await request.get('/session/logout');
}
