export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface McpServerPageQuery {
  pageNum?: number;
  pageSize?: number;
  mcpServerName?: string;
  type?: string;
}

export interface McpServerConsumersPageQuery extends McpServerPageQuery {
  consumerName?: string;
}

export interface McpServer {
  name: string;
  type: string; // OPEN_API/DATABASE/REDIRECT_ROUTE
  description?: string;
  domains?: string[];
  services?: UpstreamService[];
  rawConfigurations?: string;
  dsn?: string;
  dbType?: string; // MYSQL/PostgreSQL/Sqlite/Clickhouse
  upstreamPathPrefix?: string;
  consumerAuthInfo?: ConsumerAuthInfo;
}

export interface McpServerConsumers {
  routeName: string;
  consumers: string[];
}

export interface McpServerConsumerDetail {
  mcpServerName: string;
  consumerName: string;
  type: string;
}

interface UpstreamService {
  // 根据实际服务结构补充
  name: string;
  port: number;
  version: string;
  weight: number;
}

interface ConsumerAuthInfo {
  // 根据实际认证结构补充
  type: string;
  enable: boolean;
  allowedConsumers: string[];
}
