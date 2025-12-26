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
// MYSQL/PostgreSQL/Clickhouse
export const DB_TYPE_OPTIONS = [
  { label: 'MySQL', value: 'MYSQL' },
  { label: 'PostgreSQL', value: 'POSTGRESQL' },
  { label: 'ClickHouse', value: 'CLICKHOUSE' },
];

export const DOMAIN_PROTOCOL_MAP = {
  HTTP: 'http',
  HTTPS: 'https',
};

// 数据库连接字符串正则 eg: mysql:user:pass@tcp(host:port)/database?charset=utf8mb4&parseTime=True&loc=Local
export const REG_DSN_STRING = {
  // username:password@tcp(host:port)/dbname?param1=value1&param2=value2
  MYSQL: /^(\w+):([^:]+)@tcp\(([^:]+):(\d+)\)\/([^?]+)\?(.+)$/,
  // postgres://username:password@host:port/dbname
  POSTGRESQL: /^postgres:\/\/([^:]+):([^:]+)@([^:]+):(\d+)\/([^?]+)$/,
  // tcp://localhost:9000?database=default&username=default&password=
  CLICKHOUSE: /^tcp:\/\/([^:]+):(\d+)\?database=([^&]+)&username=([^&]*)&password=([^&]*)/,
};


export const CLIENT_MAP = {
  vscode: 'VS Code',
  cline: 'Cline',
  windsurf: 'Windsurf',
  cursor: 'Cursor',
  claude: 'Claude Desktop',
}
