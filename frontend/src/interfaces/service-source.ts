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
  properties?: ServiceSourceProperties;
  [propName: string]: any;
}

export interface ServiceSourceProperties {
  nacosNamespaceId?: string;
  nacosGroups?: string[];
  zkServicesPath?: string[];
  consulNamespace?: string;
}

/**
 * Service Source Form Props Type
 */
export interface ServiceSourceFormProps {
  name: string;
  type: string;
  domain: string;
  port: number;
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

export const ServiceSourceTypes = {
  nacos2: { key: 'nacos2', name: 'Nacos 2.x', enabled: true },
  nacos: { key: 'nacos', name: 'Nacos 1.x', enabled: true },
  zookeeper: { key: 'zookeeper', name: 'Zookeeper', enabled: true },
  consul: { key: 'consul', name: 'Consul', enabled: true },
  eureka: { key: 'eureka', name: 'Eureka', enabled: true },
  static: { key: 'static', name: 'serviceSource.types.static.name', i18n: true, enabled: true },
  dns: { key: 'dns', name: 'serviceSource.types.dns.name', i18n: true, enabled: true },
};

interface ListEntry {
  provider: string;
  width: number;
}

export interface CustomComponentHandles {
  addItem: (any) => void;
  getList: () => ListEntry[];
}
