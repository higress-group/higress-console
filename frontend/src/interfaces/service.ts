/**
 * 服务相关接口定义文件
 * 定义了微服务相关的数据结构，包括服务基本信息、服务响应等
 * 这些接口用于描述服务发现和服务管理相关的数据模型
 */

/**
 * 服务接口
 * 定义了微服务的基本信息数据结构
 */
export interface Service {
  name: string;        // 服务名称，服务的唯一标识
  namespace: string;   // 服务所在的命名空间
  port?: number;       // 服务端口号（可选）
  endpoints: string[]; // 服务实例地址列表，包含所有可用的服务实例
  [propName: string]: any; // 支持额外的自定义属性
}

/**
 * 服务响应接口
 * 定义了服务列表查询的响应数据结构，包含分页信息
 */
export interface ServiceResponse {
  data: Service[];    // 服务配置列表
  pageNum: number;    // 当前页码
  pageSize: number;   // 每页大小
  total: number;      // 总记录数
}

/**
 * 将服务对象转换为字符串表示
 * 用于界面显示和日志记录，格式为 "serviceName:port" 或 "serviceName"
 * 
 * @param service - 服务对象
 * @returns 返回格式化的字符串，如果服务为空返回 "-"
 */
export function serviceToString(service: Service): string {
  if (!service) {
    return '-';
  }
  const name = service.name || '-';
  return service.port != null ? `${name}:${service.port}` : name;
}
