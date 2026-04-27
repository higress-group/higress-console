import { WasmPluginData } from "@/interfaces/wasm-plugin";
import { BUILTIN_ROUTE_PLUGIN_LIST } from "@/pages/plugin/components/PluginList/constant";
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
  // 0-100, sum of all services' weights in a route must equal 100
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
  authConfig?: AuthConfig;
  [propName: string]: any;
}

export interface AuthConfig {
  enabled: boolean;
  allowedConsumers?: string[];
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

/**
 * Sanitizes a service name to prevent XSS attacks.
 * Removes potentially dangerous characters while preserving valid service name characters.
 */
function sanitizeServiceName(name: string): string {
  // Allow alphanumeric, dots, hyphens, and underscores (common in service names)
  // Remove HTML tags and other potentially dangerous characters
  return name
    .replace(/[<>"'&]/g, '') // Remove HTML special characters
    .trim();
}

export function stringToUpstreamService(serviceStr: string, weight: number = 0): UpstreamService {
  if (!serviceStr || serviceStr === '-') {
    return { name: '-', weight };
  }

  // Sanitize input to prevent XSS
  const sanitizedInput = sanitizeServiceName(serviceStr);

  const parts = sanitizedInput.split(':');
  if (parts.length >= 2) {
    const port = parseInt(parts[1], 10);
    if (!isNaN(port) && port > 0 && port <= 65535) {
      return {
        name: parts[0] || '-',
        port,
        weight: Math.max(0, Math.min(100, weight)),
      };
    }
  }
  return { name: sanitizedInput || '-', weight: Math.max(0, Math.min(100, weight)) };
}

export function distributeWeightsEqually(serviceCount: number): number[] {
  if (serviceCount <= 0) return [];
  if (serviceCount === 1) return [100];

  const baseWeight = Math.floor(100 / serviceCount);
  const remainder = 100 - (baseWeight * serviceCount);

  // Distribute remainder evenly among first 'remainder' services
  const weights: number[] = [];
  for (let i = 0; i < serviceCount; i++) {
    weights.push(baseWeight + (i < remainder ? 1 : 0));
  }
  return weights;
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

export enum MatchType {
  EQUAL = "EQUAL", // 精确匹配
  PRE = "PRE", // 前缀匹配
  REGULAR = "REGULAR", // 正则匹配
}
