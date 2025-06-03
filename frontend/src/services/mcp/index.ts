import { request } from '../index';
import {
  IMCPStatusResponse,
  IMCPConfigStatus,
  IMCPConfig
} from '../../interfaces/mcp';

const BASE_URL = '/api/v1/mcp';

/**
 * Get MCP configurations
 */
export const getMCPConfigs = (params: any) =>
  request.get<IMCPStatusResponse>(BASE_URL, { params });

/**
 * Get MCP configurations status
 */
export const getMCPStatus = async () => {
  try {
    const response = await request.get<IMCPStatusResponse>(`${BASE_URL}/status`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get status for a specific configuration
 */
export const getMCPConfigStatus = async (id: string) => {
  try {
    const response = await request.get<IMCPConfigStatus>(`${BASE_URL}/${id}/status`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new MCP configuration
 */
export const createMCPConfig = async (config: IMCPConfig) => {
  try {
    const response = await request.post<IMCPConfig>(BASE_URL, config);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing MCP configuration
 */
export const updateMCPConfig = async (id: string, config: IMCPConfig) => {
  try {
    const response = await request.put<IMCPConfig>(`${BASE_URL}/${id}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};