import request from './request';

export async function getSystemInfo(): Promise<any> {
  return await request.get('/system/info');
}

export async function getConfigs(): Promise<any> {
  return await request.get('/system/config');
}

export async function initialize(payload: any): Promise<any> {
  return request.post<any, any>('/system/init', payload);
}
