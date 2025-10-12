/**
 * LLM 提供商相关接口定义文件
 * 定义了大语言模型（LLM）提供商相关的数据结构
 * LLM 提供商用于配置 AI 路由的上游服务，如 OpenAI、Azure、Claude 等
 */

/**
 * LLM 提供商接口
 * 定义了 LLM 提供商的基本信息数据结构
 */
export interface LlmProvider {
  key?: string;                        // 提供商唯一标识符（可选）
  name: string;                        // 提供商名称，用于显示和标识
  type: string;                        // 提供商类型，如 openai、azure、claude 等
  protocol?: string;                   // 通信协议（可选）
  proxyName?: string;                  // 代理名称（可选）
  tokens: string[];                   // API 令牌列表，用于认证和访问控制
  tokenFailoverConfig?: TokeFailoverConfig; // 令牌故障转移配置（可选）
}

/**
 * 令牌故障转移配置接口
 * 定义了当主令牌失效时的故障转移策略
 */
export interface TokeFailoverConfig {
  enabled?: boolean;              // 是否启用故障转移（可选）
  failureThreshold?: number;      // 失败阈值，达到多少次失败后触发转移（可选）
  successThreshold?: number;      // 成功阈值，达到多少次成功后恢复（可选）
  healthCheckInterval?: number;   // 健康检查间隔时间（秒）（可选）
  healthCheckTimeout?: number;   // 健康检查超时时间（秒）（可选）
  healthCheckModel?: string;     // 健康检查使用的模型（可选）
}

/**
 * LLM 提供商协议枚举
 * 定义了支持的 LLM 通信协议类型
 */
export enum LlmProviderProtocol {
  OPENAI_V1 = 'openai/v1',  // OpenAI API v1 协议
}
