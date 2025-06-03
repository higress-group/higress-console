import { request } from '../index';
import {
  IMCPStatusResponse,
  IMCPConfigStatus
} from '../../interfaces/mcp/status';

const BASE_URL = '/api/v1/mcp';

/**
 * Get MCP configurations status
 */
export const getMCPStatus = async (timeRange: string = '24h') => {
  try {
    const response = await request.get<IMCPStatusResponse>(`${BASE_URL}/status`, {
      params: { time_range: timeRange }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get status for a specific configuration
 */
export const getMCPConfigStatus = async (id: string, timeRange: string = '24h') => {
  try {
    const response = await request.get<IMCPConfigStatus>(`${BASE_URL}/${id}/status`, {
      params: { time_range: timeRange }
    });
    return response;
  } catch (error) {
    throw error;
  }
};