import { BUILTIN_ROUTE_PLUGIN_LIST } from "@/pages/plugin/components/PluginList/constant";
import { getRoutePluginInstances } from "@/services";
import { message } from "antd";
import { WasmPluginData } from "@/interfaces/wasm-plugin";

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
  authConfig?: AuthConfig;
  dubboConfig?: DubboConfig;
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

// Dubbo协议转换相关接口
// Dubbo 多参数配置项
export interface DubboParamItem {
  paramKey: string;
  paramSource: string; // QUERY | HEADER | BODY
  paramType: string; // Java 类型，如 java.lang.String
}

export interface DubboMethodConfig {
  httpMethod: string;
  serviceMethod: string;
  httpPath: string;
  // params: 多参数模式；paramFromEntireBody: 整体请求体模式
  paramType: 'params' | 'paramFromEntireBody';
  // 新版：支持多个参数
  params?: DubboParamItem[];
  bodyParamType?: string; // 当 paramType === 'paramFromEntireBody' 时使用
  headersAttach?: string;

  // 兼容旧版（单参数配置），后续可移除
  paramKey?: string;
  paramSource?: string;
  paramTypeValue?: string;
}

export interface DubboConfig {
  enabled: boolean;
  serviceSource: string;
  serviceInterface: string;
  serviceGroup: string;
  methods: DubboMethodConfig[];
}

export interface ServiceSource {
  name: string;
  version?: string;
  type: string;
  builtIn?: boolean;
  domain?: string;
  port?: number;
  properties?: {
    nacosNamespaceId?: string;
    nacosGroups?: string[];
    zkServicesPath?: string[];
  };
  [propName: string]: any;
}
