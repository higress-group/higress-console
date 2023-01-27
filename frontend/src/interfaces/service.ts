export interface ServiceItem {
  id?: string,
  key?: string
  name: string,
  namespace: string,
  endPoints: string[],
}

export interface ServiceFactor {
  pageNum?: number,
  pageSize?: number,
  name?: string,
  namespace?: string,
}

export interface OptionItem {
  label: string,
  value: string,
}