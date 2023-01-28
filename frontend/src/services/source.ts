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
  return request.post<any, SourceResponse>("/v1/service-sources/list", payload);
};

/**
 * Add Service Source
 * @param payload SourceItem
 * @returns
 */
export const addServiceSources = (
  payload: SourceItem
) : Promise<any> => {
  return request.post<any, any>("/v1/service-sources/add", payload);
};

/**
 * Delete Service Source
 * @param payload
 * @returns
 */
export const deleteServiceSources = (
  payload: { name: string | undefined }
) : Promise<any> => {
  return request.get<any, any>("/v1/service-sources/delete", {
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
  return request.post<any, any>("/v1/service-sources/update", payload);
};
