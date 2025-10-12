/**
 * 路由相关接口定义文件
 * 定义了网关路由的各种配置接口，包括路由匹配、上游服务、插件配置、跨域配置等
 * 这些接口用于描述 HTTP 路由的完整配置信息
 */

// 导入内置路由插件列表常量
import { BUILTIN_ROUTE_PLUGIN_LIST } from "@/pages/plugin/components/PluginList/constant";

// 导入路由插件实例服务
import { getRoutePluginInstances } from "@/services";

// 导入消息提示组件
import { message } from "antd";

// 导入 WASM 插件数据接口
import { WasmPluginData } from "@/interfaces/wasm-plugin";

/**
 * 跨域资源共享（CORS）配置接口
 * 定义了路由的跨域访问控制配置
 */
export interface CorsConfig {
  allowOrigins: string[];        // 允许的源域名列表
  allowMethods: string[];        // 允许的 HTTP 方法列表
  allowHeaders: string[];        // 允许的请求头列表
  exposeHeader: string[];        // 暴露的响应头列表
  maxAgent?: number;             // 预检请求缓存时间（秒）
  allowCredentials?: boolean;    // 是否允许携带认证信息
  enabled: boolean;              // 是否启用 CORS 配置
}

/**
 * HTTP 头信息接口
 * 定义了 HTTP 请求或响应的头信息键值对
 */
export interface Header {
  key: string;    // 头信息名称
  value: string;   // 头信息值
}

/**
 * 头信息修改配置接口
 * 定义了在请求和响应阶段对头信息的修改操作
 */
export interface HeaderModifyConfig {
  request: HeaderModifyStageConfig;   // 请求阶段头信息修改配置
  response: HeaderModifyStageConfig;  // 响应阶段头信息修改配置
  enabled: boolean;                   // 是否启用头信息修改
}

/**
 * 头信息修改阶段配置接口
 * 定义了在特定阶段（请求或响应）对头信息的增删改操作
 */
export interface HeaderModifyStageConfig {
  add: Header[];     // 要添加的头信息列表
  set: Header[];     // 要设置的头信息列表（存在则修改，不存在则添加）
  delete: string[];  // 要删除的头信息名称列表
}

/**
 * Mock 配置接口
 * 定义了路由的 Mock 响应配置，用于返回模拟数据
 */
export interface MockConfig {
  status: number;    // Mock 响应的 HTTP 状态码
  url: string;       // Mock 响应的 URL 地址
  enabled: boolean;  // 是否启用 Mock 配置
}

/**
 * 限流配置接口
 * 定义了路由的速率限制配置
 */
export interface RateLimitConfig {
  qps: number;      // 每秒最大请求数（Queries Per Second）
  enabled: boolean; // 是否启用限流配置
}

/**
 * 重定向配置接口
 * 定义了路由的重定向行为配置
 */
export interface RedirectConfig {
  status: number;   // 重定向的 HTTP 状态码（如 301、302）
  url: string;      // 重定向的目标 URL 地址
  enabled: boolean; // 是否启用重定向配置
}

/**
 * 重试配置接口
 * 定义了路由请求失败时的重试策略
 */
export interface RetryConfig {
  attempt: number;  // 最大重试次数
  retryOn: string;  // 触发重试的条件（如特定状态码）
  enabled: boolean; // 是否启用重试配置
}

/**
 * 重写配置接口
 * 定义了路由的路径和主机重写规则
 */
export interface RewriteConfig {
  path?: string;    // 重写后的路径
  host?: string;    // 重写后的主机名
  enabled: boolean; // 是否启用重写配置
}

/**
 * 路由谓词接口
 * 定义了路由匹配的基本条件，如路径、方法等
 */
export interface RoutePredicate {
  matchType: string;        // 匹配类型（如精确匹配、前缀匹配、正则匹配）
  matchValue: string;       // 匹配的值
  caseSensitive?: boolean;  // 是否大小写敏感（可选）
  [propName: string]: any;  // 支持额外的自定义属性
}

/**
 * 键控路由谓词接口
 * 扩展了基本的路由谓词，增加了键名，用于头部信息、URL 参数等匹配
 */
export interface KeyedRoutePredicate extends RoutePredicate {
  key: string;  // 要匹配的键名（如头部名称、URL 参数名）
}

/**
 * 上游服务接口
 * 定义了路由转发到的后端服务信息
 */
export interface UpstreamService {
  name: string;    // 服务名称
  version?: string; // 服务版本（可选）
  weight?: number;  // 权重，用于负载均衡（可选）
  port?: number;    // 服务端口号（可选）
}

/**
 * 路由配置接口
 * 定义了完整的网关路由配置信息，包含匹配条件、上游服务、插件配置等
 */
export interface Route {
  name: string;                        // 路由名称，唯一标识
  version?: string;                    // 路由配置版本（可选）
  domains: string[];                   // 路由匹配的域名列表
  path: RoutePredicate;                // 路径匹配条件
  methods?: string[];                 // 允许的 HTTP 方法列表（可选）
  headers?: KeyedRoutePredicate[];      // 头部信息匹配条件列表（可选）
  urlParams?: KeyedRoutePredicate[];    // URL 参数匹配条件列表（可选）
  services: UpstreamService[];         // 上游服务列表
  mock?: MockConfig;                    // Mock 配置（可选）
  redirect?: RedirectConfig;            // 重定向配置（可选）
  rateLimit?: RateLimitConfig;          // 限流配置（可选）
  rewrite?: RewriteConfig;              // 重写配置（可选）
  timeout?: string;                     // 超时时间配置（可选）
  retries?: RetryConfig;                // 重试配置（可选）
  cors?: CorsConfig;                    // 跨域配置（可选）
  headerModify?: HeaderModifyConfig;    // 头信息修改配置（可选）
  authConfig?: AuthConfig;              // 认证配置（可选）
  [propName: string]: any;              // 支持额外的自定义属性
}

/**
 * 认证配置接口
 * 定义了路由的访问控制和消费者认证配置
 */
export interface AuthConfig {
  enabled: boolean;           // 是否启用认证
  allowedConsumers?: string[]; // 允许访问的消费者列表（可选）
}

/**
 * 路由响应接口
 * 定义了路由列表查询的响应数据结构，包含分页信息
 */
export interface RouteResponse {
  data: Route[];      // 路由配置列表
  pageNum: number;    // 当前页码
  pageSize: number;   // 每页大小
  total: number;      // 总记录数
}

/**
 * 将上游服务对象转换为字符串表示
 * 用于界面显示和日志记录
 * 
 * @param service - 上游服务对象
 * @returns 返回格式化的字符串，如 "serviceName:port" 或 "serviceName"
 */
export function upstreamServiceToString(service: UpstreamService): string {
  if (!service) {
    return '-';
  }
  const name = service.name || '-';
  return service.port != null ? `${name}:${service.port}` : name;
}

/**
 * 获取路由的内置插件列表
 * 根据路由配置获取启用的内置插件信息
 * 
 * @param route - 路由配置对象
 * @returns 返回启用的内置插件列表
 */
export const getRouteBuiltInPlugins = (route: Route): WasmPluginData[] => {
  // 插件键名到路由属性的映射关系
  const PLUGIN_KEY_TO_PROPERTY: Record<string, string> = {
    retries: 'proxyNextUpstream',      // 重试插件
    headerModify: 'headerControl',     // 头信息修改插件
  };

  // 过滤启用的内置插件
  return BUILTIN_ROUTE_PLUGIN_LIST.filter(pluginConfig => {
    const routeProperty = PLUGIN_KEY_TO_PROPERTY[pluginConfig.key] || pluginConfig.key;
    return route[routeProperty]?.enabled;
  }).map(pluginConfig => ({
    name: pluginConfig.key,
    title: pluginConfig.title,
    description: pluginConfig.description,
    internal: true,    // 标记为内部插件
    builtIn: true,     // 标记为内置插件
    enabled: true,     // 标记为已启用
  }));
}

/**
 * 根据路由获取插件列表
 * 获取路由配置的所有插件，包括内置插件和自定义插件
 * 
 * @param record - 路由配置对象
 * @returns 返回完整的插件列表
 */
export const fetchPluginsByRoute = async (record: Route): Promise<WasmPluginData[]> => {
  const data: Record<string, WasmPluginData[]> = {};
  
  try {
    // 获取路由的插件实例
    const response = await getRoutePluginInstances(record.name);
    const plugins = response.map((plugin: { pluginName: any; description: any; enabled: any; internal: any }) => {
      return {
        ...plugin,
        name: plugin.pluginName,      // 标准化插件名称
        enabled: plugin.enabled,      // 插件启用状态
        internal: plugin.internal,    // 是否为内部插件
      };
    });
    data[record.name] = plugins || [];
  } catch (error) {
    // 错误处理，显示友好的错误消息
    message.error(`Failed to fetch strategies: ${error.message || error}`);
  }

  // 合并内置插件和自定义插件
  const builtInPlugins = getRouteBuiltInPlugins(record);
  data[record.name] = data[record.name] ? data[record.name].concat(builtInPlugins) : builtInPlugins;
  return data[record.name] || [];
};

/**
 * 路由匹配类型枚举
 * 定义了路由匹配的不同方式
 */
export enum MatchType {
  EQUAL = "EQUAL",      // 精确匹配，完全相等
  PRE = "PRE",         // 前缀匹配，以指定值开头
  REGULAR = "REGULAR", // 正则匹配，使用正则表达式匹配
}
