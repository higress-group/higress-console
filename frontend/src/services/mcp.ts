import request from '@/services/request';
import {
  McpServer,
  McpServerPageQuery,
  McpServerConsumers,
  McpServerConsumerDetail,
} from '@/interfaces/mcp';
import bffRequest from './bffRequest';
const BASE_URL = '/v1/mcpServer';
const BFF_BASE_URL = '/bff/v1/mcpServer';

export const listMcpServers = (query: McpServerPageQuery): Promise<McpServer[]> => {
  // return request.get<any, McpServer[]>(BASE_URL, { params: query });
  return bffRequest.get<any, McpServer[]>(`${BFF_BASE_URL}`, { params: query });
};

export const getMcpServer = (name: string): Promise<McpServer> => {
  // return request.get<any, McpServer>(`${BASE_URL}/${name}`);
  return bffRequest.get<any, McpServer>(`${BFF_BASE_URL}/${name}`);
};

export const createOrUpdateMcpServer = (payload: McpServer): Promise<McpServer> => {
  return payload.name ?
    // request.put<any, McpServer>(BASE_URL, payload) :
    // request.post<any, McpServer>(BASE_URL, payload);
    bffRequest.put<any, McpServer>(`${BFF_BASE_URL}`, payload) :
    bffRequest.post<any, McpServer>(`${BFF_BASE_URL}`, payload);
};

export const deleteMcpServer = (name: string): Promise<any> => {
  // return request.delete<any, any>(`${BASE_URL}/${name}`);
  return bffRequest.delete<any, any>(`${BFF_BASE_URL}/${name}`);
};

export const addMcpConsumers = (payload: { consumers: undefined[]; mcpServerName: string }): Promise<any> => {
  // return request.put<any, any>(`${BASE_URL}/consumers`, payload);
  return bffRequest.put<any, any>(`${BFF_BASE_URL}/consumers`, payload);
};

export const removeMcpConsumers = (payload: McpServerConsumers): Promise<any> => {
  return request.delete<any, any>(`${BASE_URL}/consumers`, { data: payload });
  // 不太清楚报错原因，暂时注释掉
  // return bffRequest.delete<any, any>(`${BFF_BASE_URL}/consumers`, { data: payload });
};

export const listMcpConsumers = (
  query: any,
): Promise<McpServerConsumerDetail[]> => {
  return request.get<any, McpServerConsumerDetail[]>(`${BASE_URL}/consumers`, {
    params: query,
  });
  // 不太清楚报错原因，暂时注释掉
  // return bffRequest.get<any, McpServerConsumerDetail[]>('/bff/v1/mcpServer/consumers', {
  //   params: query,
  // });
};

export const swaggerToMcpConfig = (payload: { content: string }): Promise<any> => {
  // return request.post<any, any>(`${BASE_URL}/swaggerToMcpConfig`, payload);
  return bffRequest.post<any, any>(`${BFF_BASE_URL}/swaggerToMcpConfig`, payload);
};
