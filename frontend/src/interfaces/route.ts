export interface Service {
  name: string,
  namespace: string,
  percent: number,
  servicePort: number,
  agreementType: string,
  [propName: string]: any,
}

export interface Predicates {
  headerPredicates: Array<any>,
  methodPredicates: Array<string>,
  pathPredicates: Array<any>,
  queryPredicates: Array<any>,
}

export interface RouteItem {
  id: number,
  name: string,
  destinationType: string,
  routePredicates: Predicates,
  services: Service[],
}

export interface RouteResponse {
  list: RouteItem[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
}
