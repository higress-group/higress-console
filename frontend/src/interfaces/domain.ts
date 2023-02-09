export interface Domain {
  name: string,
  version?: string,
  certIdentifier?: string,
  enableHttps?: string,
  [propName: string]: any,
}

export const Protocol = {
  http: "HTTP",
  https: "HTTPS",
};

export enum EnableHttpsValue {
  on = 'on',
  off = 'off',
  force = 'force',
}

export interface DomainResponse {
  data: Domain[],
  pageNum: number,
  pageSize: number,
  total: number,
}