import { AuthConfig, KeyedRoutePredicate, RoutePredicate } from "./route";

export interface AiRoute {
  key?: string;
  name: string;
  version?: string;
  domains: string[];
  pathPredicate: RoutePredicate;
  headerPredicates?: KeyedRoutePredicate[];
  urlParamPredicates?: KeyedRoutePredicate[];
  modelPredicates?: RoutePredicate[];
  upstreams: AiUpstream[];
  authConfig?: AuthConfig;
  fallbackConfig: AiRouteFallbackConfig;
}

export interface AiRouteFallbackConfig {
  enabled: boolean;
  upstreams: AiUpstream[];
  fallbackStrategy?: string;
}

export interface AiUpstream {
  provider: string;
  weight?: number;
  modelMapping?: Record<string, string>;
}
