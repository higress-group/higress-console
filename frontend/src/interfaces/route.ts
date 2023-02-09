export interface CorsConfig {
  allowOrigins: string[],
  allowMethods: string[],
  allowHeaders: string[],
  exposeHeader: string[],
  maxAgent?: number,
  allowCredentials?: boolean,
}

export interface Header {
  key: string,
  value: string,
}

export interface HeaderModifyConfig {
  request: HeaderModifyStageConfig,
  response: HeaderModifyStageConfig,
}

export interface HeaderModifyStageConfig {
  add: Header[],
  set: Header[],
  delete: string[],
}

export interface MockConfig {
  status: number,
  url: string
}
export interface RateLimitConfig {
  qps: number,
}

export interface RedirectConfig {
  status: number,
  url: string
}

export interface RetryConfig {
  attempt: number,
  retryOn: string
}

export interface RewriteConfig {
  path?: string,
  host?: string,
}

export interface RoutePredicate {
  matchType: string,
  matchValue: string,
  caseSensitive?: boolean,
  [propName: string]: any,
}

export interface KeyedRoutePredicate extends RoutePredicate {
  key: string
}

export interface UpstreamService {
  name: string,
  version?: string,
  weight?: number,
  port?: number,
}

export interface Route {
  name: string,
  version?: string,
  domains: string[],
  path: RoutePredicate,
  methods?: string[],
  headers?: KeyedRoutePredicate[],
  urlParams?: KeyedRoutePredicate[],
  services: UpstreamService[],
  mock?: MockConfig,
  redirect?: RedirectConfig,
  rateLimit?: RateLimitConfig,
  rewrite?: RewriteConfig,
  timeout?: string,
  retries?: RetryConfig,
  cors?: CorsConfig,
  headerModify?: HeaderModifyConfig,
  [propName: string]: any,
}

export interface RouteResponse {
  data: Route[],
  pageNum: number,
  pageSize: number,
  total: number,
}
