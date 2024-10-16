import request from './request';
import { LlmProvider } from '@/interfaces/llm-provider';

export const getLlmProviders = (): Promise<LlmProvider[]> => {
  return request.get<any, LlmProvider[]>('/v1/ai/providers');
};

export const addLlmProvider = (payload: LlmProvider): Promise<any> => {
  return request.post<any, any>('/v1/ai/providers', payload);
};

export const deleteLlmProvider = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/ai/providers/${name}`);
};

export const updateLlmProvider = (payload: LlmProvider): Promise<any> => {
  return request.put<any, any>(`/v1/ai/providers/${payload.name}`, payload);
};
