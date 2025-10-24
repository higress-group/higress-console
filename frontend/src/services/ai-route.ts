// import request from './request';
import { AiRoute } from '@/interfaces/ai-route';
import bffRequest from './bffRequest';

export const getAiRoutes = (): Promise<AiRoute[]> => {
  // return request.get<any, AiRoute[]>('/v1/ai/routes');
  return bffRequest.get<any, AiRoute[]>('/bff/v1/ai/routes');
};

export const addAiRoute = (payload: AiRoute): Promise<any> => {
  // return request.post<any, any>('/v1/ai/routes', payload);
  return bffRequest.post<any, any>('/bff/v1/ai/routes', payload);
};

export const deleteAiRoute = (name: string): Promise<any> => {
  // return request.delete<any, any>(`/v1/ai/routes/${name}`);
  return bffRequest.delete<any, any>(`/bff/v1/ai/routes/${name}`);
};

export const updateAiRoute = (payload: AiRoute): Promise<any> => {
  // return request.put<any, any>(`/v1/ai/routes/${payload.name}`, payload);
  return bffRequest.put<any, any>(`/bff/v1/ai/routes/${payload.name}`, payload);
};
