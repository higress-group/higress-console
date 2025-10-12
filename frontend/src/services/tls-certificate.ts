/**
 * TLS 证书管理服务模块
 * 提供 TLS 证书相关的 API 接口，包括证书的 CRUD 操作等功能
 * TLS 证书用于 HTTPS 加密通信，确保数据传输安全
 * 基于 HTTP 请求服务封装，提供类型安全的证书管理操作
 */

// 导入 TLS 证书相关的类型定义
import { TlsCertificate, TlsCertificateResponse } from '@/interfaces/tls-certificate';

// 导入 HTTP 请求服务
import request from './request';

/**
 * 获取 TLS 证书列表
 * 从后端 API 获取系统中配置的所有 TLS 证书信息
 * 
 * @returns 返回 TLS 证书响应对象，包含证书列表和分页信息
 */
export const getTlsCertificates = (): Promise<TlsCertificateResponse> => {
  return request.get<any, TlsCertificateResponse>('/v1/tls-certificates');
};

/**
 * 添加新的 TLS 证书
 * 向系统添加一个新的 TLS 证书配置
 * 证书通常包含证书内容、私钥、域名等信息
 * 
 * @param payload - TLS 证书配置对象，包含证书的所有必要信息
 * @returns 返回操作结果的 Promise，包含后端返回的处理结果
 */
export const addTlsCertificate = (payload: TlsCertificate): Promise<any> => {
  return request.post<any, any>(`/v1/tls-certificates`, payload);
};

/**
 * 删除指定的 TLS 证书
 * 根据证书名称删除对应的 TLS 证书配置
 * 
 * @param name - 要删除的 TLS 证书名称
 * @returns 返回操作结果的 Promise，包含后端返回的删除结果
 */
export const deleteTlsCertificate = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/tls-certificates/${name}`);
};

/**
 * 更新现有的 TLS 证书
 * 更新指定名称的 TLS 证书配置信息
 * 可以更新证书内容、域名绑定等信息
 * 
 * @param payload - 包含更新信息的 TLS 证书对象，name 字段用于指定要更新的证书
 * @returns 返回操作结果的 Promise，包含后端返回的更新结果
 */
export const updateTlsCertificate = (payload: TlsCertificate): Promise<any> => {
  return request.put<any, any>(`/v1/tls-certificates/${payload.name}`, payload);
};
