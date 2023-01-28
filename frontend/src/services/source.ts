import request from './request';
import { SourceItem, SourceResponse } from '@/interfaces/source';

/**
 * @TODO
 * API not found!
 */

/**
 * Get Service Source List
 * @param payload
 * @returns
 */
export const getServiceSources = (
  payload: any = { }
) : Promise<SourceResponse> => {
  return request.get<any, SourceResponse>("/v1/service-sources", payload);
};

/**
 * Add Service Source
 * @param payload SourceItem
 * @returns
 */
export const addServiceSources = (
  payload: SourceItem
) : Promise<any> => {
  return request.post<any, any>(`/v1/service-sources/${payload.name}`, payload);
};

/**
 * Delete Service Source
 * @param payload
 * @returns
 */
export const deleteServiceSources = (
  payload: { name: string | undefined }
) : Promise<any> => {
  return request.delete<any, any>(`/v1/service-sources/${payload.name}`, {
    params: payload
  });
};

/**
 * Update Service Source
 * @param payload
 * @returns
 */
export const updateServiceSources = (
  payload: SourceItem
) : Promise<any> => {
  return request.post<any, any>(`/v1/service-sources/${payload.name}`, payload);
};
