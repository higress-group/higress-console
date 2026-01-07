import request from './request';

export interface ApiKeyInfo {
  customerId: number;
  customerName: string;
  customerKey: string;
  groupNames: string[];
}

export interface ApiKeyGroup {
  id: number;
  name: string;
  key: string;
}

export interface MappingRequest {
  groupId: number;
  customerId: number;
}

export const getApiKeyList = (): Promise<ApiKeyInfo[]> => {
  return request.get<any, ApiKeyInfo[]>('/v1/api-keys/list');
};

export const getCustomerGroups = (customerKey: string): Promise<ApiKeyGroup[]> => {
  return request.get<any, ApiKeyGroup[]>('/v1/api-keys/groupInfo', {
    params: { customerName: customerKey },
  });
};

export const upsertGroup = (group: ApiKeyGroup): Promise<any> => {
  return request.post<any, any>('/v1/api-keys/group/upinsert', group);
};

export const removeGroup = (name: string): Promise<any> => {
  return request.post<any, any>('/v1/api-keys/group/remove', { name });
};

export const getGroupList = (name?: string): Promise<ApiKeyGroup[]> => {
  return request.get<any, ApiKeyGroup[]>('/v1/api-keys/group/list', {
    params: name ? { name } : {},
  });
};

export const addMapping = (data: MappingRequest): Promise<any> => {
  return request.post<any, any>('/v1/api-keys/group/mapping/add', data);
};

export const removeMapping = (data: MappingRequest): Promise<any> => {
  return request.post<any, any>('/v1/api-keys/group/mapping/del', data);
};
