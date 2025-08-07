import { ProxyServer } from '@/interfaces/proxy-server';
import request from './request';

/**
 * Get Proxy Server List
 * @param payload
 * @returns
 */
export const getProxyServers = (): Promise<ProxyServer[]> => {
  return request.get<any, ProxyServer[]>('/v1/proxy-servers');
};

/**
 * Add Proxy Server
 * @param payload
 * @returns
 */
export const addProxyServer = (payload: ProxyServer): Promise<any> => {
  return request.post<any, any>(`/v1/proxy-servers`, payload);
};

/**
 * Delete Proxy Server
 * @param payload
 * @returns
 */
export const deleteProxyServer = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/proxy-servers/${name}`);
};

/**
 * Update Proxy Server
 * @param payload
 * @returns
 */
export const updateProxyServer = (payload: ProxyServer): Promise<any> => {
  return request.put<any, any>(`/v1/proxy-servers/${payload.name}`, payload);
};
