export interface LlmProvider {
  key?: string;
  name: string;
  type: string;
  protocol?: string;
  modelMapping: ModelMapping;
  tokens: string[];
  tokenFailoverConfig?: TokeFailoverConfig;
}

export interface ModelMapping {
  [propName: string]: string;
}

export interface TokeFailoverConfig {
  enabled?: boolean;
  failureThreshold?: number;
  successThreshold?: number;
  healthCheckInterval?: number;
  healthCheckTimeout?: number;
  healthCheckModel?: string;
}

export enum LlmProviderType {
  OPENAI = 'openai',
  QWEN = 'qwen',
}

export enum LlmProviderProtocol {
  OPENAI_V1 = 'openai/v1',
}
