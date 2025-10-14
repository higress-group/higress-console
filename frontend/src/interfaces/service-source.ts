/**
 * Service Source Registry Type
 */
export interface ServiceSource {
  name: string;
  version?: string;
  type: string;
  builtIn?: boolean;
  domain?: string;
  port?: number;
  vport?: {
    defaultValue?: number;
    vportServices?: Array<{ name: string; value: number }>;
  };
  properties?: ServiceSourceProperties;
  [propName: string]: any;
}

export interface ServiceSourceProperties {
  nacosNamespaceId?: string;
  nacosGroups?: string[];
  zkServicesPath?: string[];
}

/**
 * Service Source Form Props Type
 */
export interface ServiceSourceFormProps {
  name: string;
  type: string;
  domain: string;
  port: number;
  vport?: {
    defaultValue?: number;
    vportServices?: Array<{ name: string; value: number }>;
  };
  [propName: string]: any;
}

/**
 * Service Source Get List Request Response
 */
export interface ServiceSourceResponse {
  data: ServiceSource[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface ServiceSourceTypeConfig {
  key: string;
  name: string;
  enabled?: boolean;
  i18n?: boolean;
  mcpSupported?: boolean;
  customVportSupported?: boolean;
}

export const ServiceSourceTypes = {
  nacos3: { key: 'nacos3', name: 'Nacos 3.x', enabled: true, mcpSupported: true, customVportSupported: true },
  nacos2: { key: 'nacos2', name: 'Nacos 2.x', enabled: true, customVportSupported: true },
  nacos: { key: 'nacos', name: 'Nacos 1.x', enabled: true, customVportSupported: true },
  zookeeper: { key: 'zookeeper', name: 'Zookeeper', enabled: true },
  consul: { key: 'consul', name: 'Consul', enabled: true },
  eureka: { key: 'eureka', name: 'Eureka', enabled: true, customVportSupported: true },
  static: { key: 'static', name: 'serviceSource.types.static.name', i18n: true, enabled: true },
  dns: { key: 'dns', name: 'serviceSource.types.dns.name', i18n: true, enabled: true },
};

export const ServiceProtocols = {
  unspecified: { key: '', name: 'serviceSource.protocols.unspecified', i18n: true, tlsEnabled: false },
  http: { key: 'http', name: 'HTTP', tlsEnabled: false },
  https: { key: 'https', name: 'HTTPS', tlsEnabled: true },
  grpc: { key: 'grpc', name: 'gRPC', tlsEnabled: false },
  grpcs: { key: 'grpcs', name: 'gRPCS', tlsEnabled: true },
};

interface ListEntry {
  provider: string;
  width: number;
}

export interface CustomComponentHandles {
  addItem: (any) => void;
  getList: () => ListEntry[];
}

export function isNacosType(type: string): boolean {
  switch (type) {
    case ServiceSourceTypes.nacos.key:
    case ServiceSourceTypes.nacos2.key:
    case ServiceSourceTypes.nacos3.key:
      return true;
    default:
      return false;
  }
}

export function getServiceSourceTypeConfig(key: string): ServiceSourceTypeConfig | null {
  return ServiceSourceTypes[key] || null;
}
