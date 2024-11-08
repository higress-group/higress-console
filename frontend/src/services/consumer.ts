import request from './request';
import { Consumer } from '@/interfaces/consumer';

export const getConsumers = (): Promise<Consumer[]> => {
  return request.get<any, Consumer[]>('/v1/consumers');
};

export const addConsumer = (payload: Consumer): Promise<any> => {
  return request.post<any, any>('/v1/consumers', payload);
};

export const deleteConsumer = (name: string): Promise<any> => {
  return request.delete<any, any>(`/v1/consumers/${name}`);
};

export const updateConsumer = (payload: Consumer): Promise<any> => {
  return request.put<any, any>(`/v1/consumers/${payload.name}`, payload);
};
