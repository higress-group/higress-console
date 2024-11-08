export interface Domain {
  name: string;
  version?: string;
  isIngressMode?: boolean;
  enableHttps?: string;
  portAndCertMap?: Record<number, string>;
  [propName: string]: any;
}

export const Protocol = {
  http: 'HTTP',
  https: 'HTTPS',
  both: 'HTTP',
};

export enum EnableHttpsValue {
  on = 'on',
  off = 'off',
  force = 'force',
}

export interface DomainResponse {
  data: Domain[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export const DEFAULT_DOMAIN = "higress-default-domain";