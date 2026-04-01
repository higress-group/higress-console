import { AiRoute } from '@/interfaces/ai-route';
import request from './request';

export const getAiRoutes = (): Promise<AiRoute[]> => {
  return request.get<any, AiRoute[]>('/v1/ai/routes');
};

export const getAiRoute = (name): Promise<AiRoute> => {
  return request.get<any, AiRoute>(`/v1/ai/routes/${name}`);
};

export const addAiRoute = (payload: AiRoute): Promise<any> => {
  return request.post<any, any>('/v1/ai/routes', payload);
};

export const deleteAiRoute = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/ai/routes/${name}`);
};

export const updateAiRoute = (payload: AiRoute): Promise<any> => {
  return request.put<any, any>(`/v1/ai/routes/${payload.name}`, payload);
};
