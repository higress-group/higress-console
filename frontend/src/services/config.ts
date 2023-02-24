import request from './request';

export async function getConfigs(): Promise<any> {
  return await request.get('/config');
}
