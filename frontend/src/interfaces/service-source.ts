/**
 * Service Source Registry Type
 */
export interface ServiceSource {
  name: string,
  version?: string,
  type: string,
  domain: string,
  port: number,
  properties: ServiceSourceProperties,
}

export interface ServiceSourceProperties {
  nacosNamespaceId?: string,
  nacosGroups?: string[],
  zkServicesPath?: string[],
  consulNamespace?: string,
}

/**
 * Service Source Form Props Type
 */
export interface ServiceSourceFormProps {
  name: string,
  type: string,
  domain: string,
  port: number,
  consulNamespace?: string,
  zkServicesPath?: string[],
  nacosNamespaceId?: string,
  nacosGroups?: string[],
}

/**
 * Service Source Get List Request Response
 */
export interface ServiceSourceResponse {
  data: ServiceSource[],
  pageNum: number,
  pageSize: number,
  total: number,
}
