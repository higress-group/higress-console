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
