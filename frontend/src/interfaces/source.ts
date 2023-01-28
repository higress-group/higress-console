/**
 * Service Source Registry Type
 */
export interface SourceItem {
  id?: number,
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
 * Service Source Form Props Type
 */
export interface SourceFormProps {
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
export interface SourceResponse {
  list: SourceItem[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
}

/**
 * Service Source Form Ref Type
 */
export interface SourceFormRef {
  reset: () => void,
  handleSubmit: () => Promise<SourceFormProps>,
}