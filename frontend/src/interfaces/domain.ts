export interface DomainItem {
  id?: number,
  name: string,
  protocol: string,
  certIdentifier?: string,
  mustHttps?: boolean,
}

export interface DomainResponse {
  list: DomainItem[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
}