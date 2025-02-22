import { getRoutePluginInstances } from "@/services";
import { BUILTIN_ROUTE_PLUGIN_LIST } from "@/pages/plugin/components/PluginList/constant";
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
  name?: string;
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
  internal?: boolean;
  resKey?: string;
  key?: string;
}

export const getRouteBuiltInPlugins = (route: Route): WasmPluginData[] => {
  const PLUGIN_KEY_TO_PROPERTY: Record<string, string> = {
    retries: 'proxyNextUpstream',
    headerModify: 'headerControl',
  };

  return BUILTIN_ROUTE_PLUGIN_LIST.filter(pluginConfig => {
    const routeProperty = PLUGIN_KEY_TO_PROPERTY[pluginConfig.key] || pluginConfig.key;
    return route[routeProperty]?.enabled;
  }).map(pluginConfig => ({
    name: pluginConfig.key,
    title: pluginConfig.title,
    description: pluginConfig.description,
    internal: true,
    builtIn: true,
    enabled: true,
  }));
}

export const fetchPluginsByRoute = async (record: Route): Promise<WasmPluginData[]> => {
  const data: Record<string, WasmPluginData[]> = {};
  try {
    const response = await getRoutePluginInstances(record.name);
    const plugins = response.map((plugin: { pluginName: any; description: any; enabled: any; internal: any }) => {
      return {
        ...plugin,
        name: plugin.pluginName,
        enabled: plugin.enabled,
        internal: plugin.internal,
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
