export interface Service {
  name: string,
  namespace: string,
  endpoints: string[],
  [propName: string]: any,
}

export interface ServiceResponse {
  data: Service[],
  pageNum: number,
  pageSize: number,
  total: number,
}
