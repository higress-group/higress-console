import { TlsCertificate, TlsCertificateResponse } from '@/interfaces/tls-certificate';
// import request from './request';
import bffRequest from './bffRequest';

/**
 * Get TLS Certificate List
 * @param payload
 * @returns
 */
export const getTlsCertificates = (): Promise<TlsCertificateResponse> => {
  // return request.get<any, TlsCertificateResponse>('/v1/tls-certificates');
  return bffRequest.get<any, TlsCertificateResponse>('/bff/v1/tls-certificates');
};

/**
 * Add TLS Certificate
 * @param payload
 * @returns
 */
export const addTlsCertificate = (payload: TlsCertificate): Promise<any> => {
  // return request.post<any, any>(`/v1/tls-certificates`, payload);
  return bffRequest.post<any, any>(`/bff/v1/tls-certificates`, payload);
};

/**
 * Delete TLS Certificate
 * @param payload
 * @returns
 */
export const deleteTlsCertificate = (name: string): Promise<any> => {
  // return request.delete<any, any>(`/v1/tls-certificates/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/tls-certificates/${name}`);
};

/**
 * Update TLS Certificate
 * @param payload
 * @returns
 */
export const updateTlsCertificate = (payload: TlsCertificate): Promise<any> => {
  // return request.put<any, any>(`/v1/tls-certificates/${payload.name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/tls-certificates/${payload.name}`, payload);
};
