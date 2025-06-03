import { request } from './index';
import {
  IMCPConfig,
  IMCPListResponse,
  IMCPRequestParams
} from '../interfaces/mcp';
import { message } from 'antd';

const BASE_URL = '/api/v1/mcp';

/**
 * Get MCP configurations
 */
export const getMCPConfigs = async (params: IMCPRequestParams) => {
  try {
    const response = await request.get<IMCPListResponse>(BASE_URL, { params });
    return response;
  } catch (error) {
    message.error('Failed to fetch MCP configurations');
    throw error;
  }
};

/**
 * Get a single MCP configuration
 */
export const getMCPConfig = async (id: string) => {
  try {
    const response = await request.get<IMCPConfig>(`${BASE_URL}/${id}`);
    return response;
  } catch (error) {
    message.error(`Failed to fetch MCP configuration ${id}`);
    throw error;
  }
};

/**
 * Create a new MCP configuration
 */
export const createMCPConfig = async (data: IMCPConfig) => {
  try {
    const response = await request.post<IMCPConfig>(BASE_URL, data);
    message.success('Configuration created successfully');
    return response;
  } catch (error) {
    message.error('Failed to create MCP configuration');
    throw error;
  }
};

/**
 * Update an existing MCP configuration
 */
export const updateMCPConfig = async (id: string, data: IMCPConfig) => {
  try {
    const response = await request.put<IMCPConfig>(`${BASE_URL}/${id}`, data);
    message.success('Configuration updated successfully');
    return response;
  } catch (error) {
    message.error(`Failed to update MCP configuration ${id}`);
    throw error;
  }
};

/**
 * Delete an MCP configuration
 */
export const deleteMCPConfig = async (id: string) => {
  try {
    const response = await request.delete(`${BASE_URL}/${id}`);
    message.success('Configuration deleted successfully');
    return response;
  } catch (error) {
    message.error(`Failed to delete MCP configuration ${id}`);
    throw error;
  }
};

/**
 * Enable an MCP configuration
 */
export const enableMCPConfig = async (id: string) => {
  try {
    const response = await request.post(`${BASE_URL}/${id}/enable`);
    message.success('Configuration enabled successfully');
    return response;
  } catch (error) {
    message.error(`Failed to enable MCP configuration ${id}`);
    throw error;
  }
};

/**
 * Disable an MCP configuration
 */
export const disableMCPConfig = async (id: string) => {
  try {
    const response = await request.post(`${BASE_URL}/${id}/disable`);
    message.success('Configuration disabled successfully');
    return response;
  } catch (error) {
    message.error(`Failed to disable MCP configuration ${id}`);
    throw error;
  }
};