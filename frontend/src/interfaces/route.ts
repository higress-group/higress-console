import { getRoutePluginInstances } from "@/services";
import { message } from "antd";

export interface CorsConfig {
  allowOrigins: string[];
  allowMethods: string[];
  allowHeaders: string[];
  exposeHeader: string[];
  maxAgent?: number;
  allowCredentials?: boolean;
  enabled: boolean;
}

export interface Header {
  key: string;
  value: string;
}

export interface HeaderModifyConfig {
  request: HeaderModifyStageConfig;
  response: HeaderModifyStageConfig;
  enabled: boolean;
}

export interface HeaderModifyStageConfig {
  add: Header[];
  set: Header[];
  delete: string[];
}

export interface MockConfig {
  status: number;
  url: string;
  enabled: boolean;
}
export interface RateLimitConfig {
  qps: number;
  enabled: boolean;
}

export interface RedirectConfig {
  status: number;
  url: string;
  enabled: boolean;
}

export interface RetryConfig {
  attempt: number;
  retryOn: string;
  enabled: boolean;
}

export interface RewriteConfig {
  path?: string;
  host?: string;
  enabled: boolean;
}

export interface RoutePredicate {
  matchType: string;
  matchValue: string;
  caseSensitive?: boolean;
  [propName: string]: any;
}

export interface KeyedRoutePredicate extends RoutePredicate {
  key: string;
}

export interface UpstreamService {
  name: string;
  version?: string;
  weight?: number;
  port?: number;
}

export interface Route {
  name: string;
  version?: string;
  domains: string[];
  path: RoutePredicate;
  methods?: string[];
  headers?: KeyedRoutePredicate[];
  urlParams?: KeyedRoutePredicate[];
  services: UpstreamService[];
  mock?: MockConfig;
  redirect?: RedirectConfig;
  rateLimit?: RateLimitConfig;
  rewrite?: RewriteConfig;
  timeout?: string;
  retries?: RetryConfig;
  cors?: CorsConfig;
  headerModify?: HeaderModifyConfig;
  [propName: string]: any;
}

export interface RouteResponse {
  data: Route[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export function upstreamServiceToString(service: UpstreamService): string {
  if (!service) {
    return '-';
  }
  const name = service.name || '-';
  return service.port != null ? `${name}:${service.port}` : name;
}

export interface WasmPluginData {
  id?: string;
  name: string;
  version?: string;
  category?: string;
  title?: string;
  description?: string;
  icon?: string;
  builtIn?: boolean;
  imageRepository?: string;
  imageVersion?: string;
  phase?: string;
  priority?: number;
  customConfigs?: {
    [key: string]: string;
  };
  enabled?: boolean;
  resKey?: string;
  key?: string;
}

export const getRouteBuiltInPlugins = (route: Route): WasmPluginData[] => {
  const plugins: WasmPluginData[] = [];

  // 处理 rewrite 插件
  if (route.rewrite && route.rewrite.enabled) {
    plugins.push({
      name: 'rewrite',
      description: '修改请求的域名（Host）以及请求路径（Path），通常用于后端服务的域名/路由与网关侧域名/路由不一致时的配置',
      builtIn: true,
      enabled: true,
    });
  }

  // 处理 headerModify 插件
  if (route.headerModify && route.headerModify.enabled) {
    plugins.push({
      name: 'headerModify',
      description: '支持增加/删除/修改 HTTP 请求头以及 HTTP 应答头',
      builtIn: true,
      enabled: true,
    });
  }

  if (route.proxyNextUpstream && route.proxyNextUpstream.enabled) {
    plugins.push({
      name: 'retries',
      description: '配置网关向后端服务请求当前路由的响应失败时的重试机制',
      builtIn: true,
      enabled: true,
    });
  }

  // 处理 cors 插件
  if (route.cors && route.cors.enabled) {
    plugins.push({
      name: 'CORS',
      description: '通过配置标示除了当前站点以外的其他源（域名、协议或端口），使得浏览器允许这些源访问加载该路由的响应',
      builtIn: true,
      enabled: true,
    });
  }

  return plugins;
}

export const fetchPluginsByRoute = async (record: Route): Promise<WasmPluginData[]> => {
  const data: Record<string, WasmPluginData[]> = {};
  try {
    const response = await getRoutePluginInstances(record.name);
    const plugins = response.map((plugin: { pluginName: any; description: any; enabled: any }) => {
      return {
        ...plugin,
        name: plugin.pluginName,
        description: plugin.description,
        enabled: plugin.enabled,
      };
    });
    data[record.name] = plugins || [];
  } catch (error) {
    message.error(`Failed to fetch strategies: ${error.message || error}`);
  }

  const builtInPlugins = getRouteBuiltInPlugins(record);
  data[record.name] = data[record.name] ? data[record.name].concat(builtInPlugins) : builtInPlugins;
  return data[record.name] || [];
};
