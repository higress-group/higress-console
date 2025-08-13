export interface Consumer {
  name: boolean;
  credentials: Credential[];
}

export interface Credential {
  type: string;
  [propName: string]: any;
}

export const CredentialType = {
  KEY_AUTH: { key: 'key-auth', displayName: 'Key Auth', enabled: true, displayColor: '#4095e5' },
  OAUTH2: { key: 'oauth2', displayName: 'OAuth2', enabled: false, displayColor: '#4095e5' },
  JWT_AUTH: { key: 'jwt-auth', displayName: 'JWT', enabled: false, displayColor: '#4095e5' },
};

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
