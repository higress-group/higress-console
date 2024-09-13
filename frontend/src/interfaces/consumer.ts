export interface Consumer {
  name: boolean;
  credentials: Credential[];
}

export interface Credential {
  type: string;
  [propName: string]: any;
}

export enum CredentialType {
  KEY_AUTH = 'key-auth',
}

export interface KeyAuthCredential extends Credential {
  source: string;
  key?: string;
  value: string;
}

export enum KeyAuthCredentialSource {
  BEARER = 'BEARER',
  HEADER = 'HEADER',
  QUERY = 'QUERY',
}
