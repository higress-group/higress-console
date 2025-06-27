import vscode from '@/assets/mcp/vscode.svg'
import cline from '@/assets/mcp/cline.svg'
import windsurf from '@/assets/mcp/windsurf.svg'
// import cherrystudio from '@/assets/mcp/cherrystudio.svg'
import cursor from '@/assets/mcp/cursor.svg'
import claude from '@/assets/mcp/claude.svg'

export const SERVICE_TYPE = {
  OPENAPI: 'OPEN_API',
  DB: 'DATABASE',
  DIRECT_ROUTE: 'DIRECT_ROUTE',
};

export const SERVICE_TYPES = [SERVICE_TYPE.OPENAPI, SERVICE_TYPE.DB, SERVICE_TYPE.DIRECT_ROUTE];

export function getServiceTypeMap(directRouteText: string) {
  return {
    [SERVICE_TYPE.OPENAPI]: 'OpenAPI',
    [SERVICE_TYPE.DB]: 'DB',
    [SERVICE_TYPE.DIRECT_ROUTE]: directRouteText,
  };
}
// MYSQL/PostgreSQL/Sqlite/Clickhouse
export const DB_TYPE_OPTIONS = [
  { label: 'MySQL', value: 'MYSQL' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'SQLite', value: 'Sqlite' },
  { label: 'ClickHouse', value: 'Clickhouse' },
];

export const DOMAIN_PROTOCOL_MAP = {
  HTTP: 'http',
  HTTPS: 'https',
};

// 数据库连接字符串正则 eg: mysql:user:pass@tcp(127.0.0.1:3306)/testdb?charset=utf8mb4&parseTime=True&loc=Local
export const REG_DSN_STRING = {
  MYSQL: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  POSTGRESQL: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  SQLITE: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  CLICKHOUSE: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  DEFAULT: /^(\w+):([^@]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
};


export const CLIENT_MAP = {
  vscode: 'VS Code',
  cline: 'Cline',
  windsurf: 'Windsurf',
  // cherrystudio: 'Cherry Studio',
  cursor: 'Cursor',
  claude: 'Claude Desktop',
}

export const CLIENT_MAP_ICON = {
  vscode,
  cline,
  windsurf,
  // cherrystudio,
  cursor,
  claude,
}
