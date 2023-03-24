export interface Service {
  name: string;
  namespace: string;
  port?: number;
  endpoints: string[];
  [propName: string]: any;
}

export interface ServiceResponse {
  data: Service[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export function serviceToString(service: Service): string {
  if (!service) {
    return '-';
  }
  const name = service.name || '-';
  return service.port != null ? `${name}:${service.port}` : name;
}
