/**
 * AI 路由相关接口定义文件
 * 定义了 AI 路由配置、回退配置和上游服务配置的数据结构
 * 这些接口用于描述 AI 路由的各种配置选项和数据模型
 */

// 导入路由相关的通用接口定义
import { AuthConfig, KeyedRoutePredicate, RoutePredicate } from "./route";

/**
 * AI 路由配置接口
 * 定义了 AI 路由的完整配置信息，包括匹配规则、上游服务、认证配置等
 */
export interface AiRoute {
  key?: string;                          // 路由的唯一标识符（可选）
  name: string;                         // 路由名称，用于标识和引用该路由
  version?: string;                      // 路由配置的版本号（可选）
  domains: string[];                     // 域名列表，指定该路由适用的域名
  pathPredicate: RoutePredicate;         // 路径匹配规则，定义 URL 路径的匹配条件
  headerPredicates?: KeyedRoutePredicate[]; // 请求头匹配规则列表（可选）
  urlParamPredicates?: KeyedRoutePredicate[]; // URL 参数匹配规则列表（可选）
  modelPredicates?: RoutePredicate[];    // 模型匹配规则列表（可选），用于 AI 模型选择
  upstreams: AiUpstream[];               // 上游服务列表，定义请求转发的目标服务
  authConfig?: AuthConfig;               // 认证配置（可选），定义访问控制规则
  fallbackConfig: AiRouteFallbackConfig; // 回退配置，定义当主服务不可用时的备用方案
}

/**
 * AI 路由回退配置接口
 * 定义了当主上游服务不可用时使用的回退策略和备用服务
 */
export interface AiRouteFallbackConfig {
  enabled: boolean;                      // 是否启用回退功能
  upstreams: AiUpstream[];               // 回退上游服务列表
  fallbackStrategy?: string;             // 回退策略（可选），如轮询、权重等
}

/**
 * AI 上游服务配置接口
 * 定义了上游 AI 服务的配置信息，包括服务提供商、权重、模型映射等
 */
export interface AiUpstream {
  provider: string;                      // 服务提供商名称，如 OpenAI、Azure 等
  weight?: number;                       // 权重（可选），用于负载均衡时的流量分配
  modelMapping?: Record<string, string>; // 模型映射（可选），定义请求模型到服务模型的映射关系
}
