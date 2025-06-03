export interface IMCPConfig {
  id: string;
  name: string;
  description: string;
  sourceType: 'REST' | 'DB' | 'INTERNAL';
  config: RESTMCPConfig | DBMCPConfig | InternalMCPConfig;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  status?: string;
  lastUsed?: string;
  successRate?: number;
  errorRate?: number;
  // Advanced settings
  successRateThreshold?: number;
  alertRecipients?: string[];
  retryPolicy?: 'none' | 'linear' | 'exponential';
  maxRetries?: number;
  timeout?: number;
  enableCaching?: boolean;
  cacheDuration?: number;
  cacheKeyTemplate?: string;
}

export interface RESTMCPConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  bodyTemplate: string;
  responseTemplate: string;
}

export interface DBMCPConfig {
  connection: {
    type: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  query: string;
  parameters: Record<string, string>;
  resultMapping: Record<string, string>;
}

export interface InternalMCPConfig {
  serviceName: string;
  authConfig: {
    type: 'API_KEY' | 'OAUTH2' | 'JWT';
    value: string;
  };
  allowedTools: string[];
}

export interface IMCPListResponse {
  items: IMCPConfig[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IMCPRequestParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface IMCPStatusResponse {
  data: IMCPConfigStatus[];
  success: boolean;
}

export interface IMCPConfigStatus {
  id: string;
  status: string;
  lastUsed: string;
  enabled: boolean;
  successRate?: number;
  errorRate?: number;
}