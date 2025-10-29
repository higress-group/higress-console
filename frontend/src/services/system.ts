import { InitParams } from '@/interfaces/system';
// import request from './request';
import bffRequest from './bffRequest';

export async function getSystemInfo(): Promise<any> {
  // return await request.get('/system/info');
  return await bffRequest.get('/bff/system/info');// 改成bff/system/info
}

export async function getConfigs(): Promise<any> {
  // return await request.get('/system/config');
  return await bffRequest.get('/bff/system/config');// 改成bff/system/config
}

export async function initialize(payload: InitParams): Promise<any> {
  // 初始化系统
  // return request.post<any, any>('/system/init', payload);
  return bffRequest.post<any, any>('/bff/system/init', payload);
}

export async function getHigressConfig(): Promise<any> {
  // return await request.get('/system/higress-config');
  return await bffRequest.get('/bff/system/higress-config');// 改成bff/system/higress-config
}

export async function updateHigressConfig(config: string): Promise<any> {
  // return request.put<any, any>('/system/higress-config', { config });
  return await bffRequest.put('/bff/system/higress-config', { config });// 改成bff/system/higress-config
}
