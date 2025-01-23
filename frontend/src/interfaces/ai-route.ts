export interface AiRoute {
  key?: string;
  name: string;
  version?: string;
  domains: string[];
  upstreams: AiUpstream[];
  authEnabled?: boolean;
  consumers?: string[];
  fallbackUpstream?: AiUpstream;
}

export interface AiUpstream {
  provider: string;
  weight?: number;
}
