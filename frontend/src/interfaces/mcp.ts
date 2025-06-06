export const SERVICE_TYPE = {
  OPENAPI: 'OPEN_API',
  DB: 'DATABASE',
  REDIRECT_ROUTE: 'REDIRECT_ROUTE',
}

export const SERVICE_TYPE_MAP = {
  [SERVICE_TYPE.OPENAPI]: 'OpenAPI',
  [SERVICE_TYPE.DB]: 'DB',
  [SERVICE_TYPE.REDIRECT_ROUTE]: '直接路由',
}
// MYSQL/PostgreSQL/Sqlite/Clickhouse
export const DB_TYPE_OPTIONS = [
  { label: 'MySQL', value: 'MYSQL' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'Sqlite', value: 'Sqlite' },
  { label: 'Clickhouse', value: 'Clickhouse' },
]

export const DOMAIN_PROTOCOL_MAP = {
  HTTP: 'http',
  HTTPS: 'https',
}

// 数据库连接字符串正则 eg: mysql:user:pass@tcp(127.0.0.1:3306)/testdb?charset=utf8mb4&parseTime=True&loc=Local
export const REG_DSN_STRING = {
  MYSQL: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  POSTGRESQL: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  SQLITE: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  CLICKHOUSE: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  DEFAULT: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface McpServerPageQuery {
  pageNum?: number;
  pageSize?: number;
  serverName?: string;
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
