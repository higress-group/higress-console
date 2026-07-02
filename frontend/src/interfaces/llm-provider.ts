export interface LlmProvider {
  key?: string;
  name: string;
  type: string;
  protocol?: string;
  proxyName?: string;
  tokens: string[];
  tokenFailoverConfig?: TokeFailoverConfig;
  retryOnFailureConfig?: RetryOnFailureConfig;
}

export interface TokeFailoverConfig {
  enabled?: boolean;
  failureThreshold?: number;
  successThreshold?: number;
  healthCheckInterval?: number;
  healthCheckTimeout?: number;
  healthCheckModel?: string;
  failoverOnStatus?: number[];
}

export interface RetryOnFailureConfig {
  enabled?: boolean;
}

export enum LlmProviderProtocol {
  OPENAI_V1 = 'openai/v1',
  ORIGINAL = 'original',
}
