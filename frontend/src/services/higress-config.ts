import request from './request';

export const getIngressWorkMode = (): Promise<boolean> => {
  return request.get<any, boolean>('/v1/workmode');
};

export const setIngressWorkMode = (mode: boolean): Promise<boolean> => {
  return request.put<any, boolean>(`/v1/workmode?mode=${mode}`);
};