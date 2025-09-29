import { ServiceSource, ServiceSourceFormProps } from '@/interfaces/service-source';
// import request from './request';
import bffRequest from './bffRequest';

/**
 * Get Service Source List
 * @param payload
 * @returns
 */
export const getServiceSources = (payload: ServiceSourceFormProps): Promise<ServiceSource[]> => {
  // return request.get<any, ServiceSource[]>('/v1/service-sources');
  return bffRequest.get<any, ServiceSource[]>('/bff/v1/service-sources');
};

/**
 * Add Service Source
 * @param payload
 * @returns
 */
export const addServiceSource = (payload: ServiceSource): Promise<any> => {
  // return request.post<any, any>(`/v1/service-sources`, payload);
  return bffRequest.post<any, any>(`/bff/v1/service-sources`, payload);
};

/**
 * Delete Service Source
 * @param payload
 * @returns
 */
export const deleteServiceSource = (name: string): Promise<any> => {
  // return request.delete<any, any>(`/v1/service-sources/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/service-sources/${name}`);
};

/**
 * Update Service Source
 * @param payload
 * @returns
 */
export const updateServiceSource = (payload: ServiceSource): Promise<any> => {
  // return request.put<any, any>(`/v1/service-sources/${payload.name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/service-sources/${payload.name}`, payload);
};
