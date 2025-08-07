export interface LlmProvider {
  key?: string;
  name: string;
  type: string;
  protocol?: string;
  proxyName?: string;
  tokens: string[];
  tokenFailoverConfig?: TokeFailoverConfig;
}

export interface TokeFailoverConfig {
  enabled?: boolean;
  failureThreshold?: number;
  successThreshold?: number;
  healthCheckInterval?: number;
  healthCheckTimeout?: number;
  healthCheckModel?: string;
}

export enum LlmProviderProtocol {
  OPENAI_V1 = 'openai/v1',
}
