export interface ProxyServer {
  type: string;
  name: string;
  version?: string;
  serverAddress: string;
  serverPort: number;
  connectTimeout?: number;
  [propName: string]: any;
}

export interface ServiceSourceFormProps {
  name: string;
  type: string;
  [propName: string]: any;
}

export interface ProxyServerResponse {
  data: ProxyServer[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export const ProxyServerTypes = {
  http: { key: 'HTTP', name: 'HTTP', enabled: true },
};

export const DEFAULT_CONNECT_TIMEOUT = 5000; // Default connection timeout in milliseconds