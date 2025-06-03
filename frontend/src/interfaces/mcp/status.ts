import { IMCPConfig } from './index';

export interface IMCPConfigStatus extends IMCPConfig {
  status: string;
  lastUsed: string;
  enabled: boolean;
  successRate?: number;
  errorRate?: number;
}

export interface IMCPStatusResponse {
  data: IMCPConfigStatus[];
  success: boolean;
  totalSuccessRate?: number;
  totalErrorRate?: number;
}