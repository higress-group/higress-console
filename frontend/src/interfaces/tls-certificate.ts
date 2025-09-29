export interface TlsCertificate {
  name: string;
  version: string;
  cert: string;
  key: string;
  domains: string[];
  validityStart: string;
  validityEnd: string;
  [propName: string]: any;
}

export interface TlsCertificateResponse {
  data: TlsCertificate[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface TlsCertificateValidationRequest {
  cert: string;
  key: string;
}

export interface TlsResponse {
  valid: boolean;
  errors: string[];
}
